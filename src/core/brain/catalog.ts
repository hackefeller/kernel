import * as fs from "node:fs/promises";
import path from "node:path";
import * as yaml from "yaml";
import { renderCatalogOutputs, type RenderedOutput } from "../render/index.js";
import { loadTemplateRegistry, parseAgentTemplate, parseSkillTemplate } from "../registry/index.js";
import { resolveCatalog } from "../registry/resolver.js";
import { directoryExists, fileExists, readFile } from "../utils/file-system.js";
import { getBrainRoot, getCatalogRoot, loadBrainConfig } from "./config.js";
import type { BrainConfig, BuiltInCatalog } from "./types.js";

const ADAPTER_VERSION = "2.0.0";

interface BrainPackageDefinition {
  id: string;
  skills: string[];
  agents: string[];
  commands: string[];
}

export interface CatalogSource {
  catalog: BuiltInCatalog;
  outputs: RenderedOutput[];
  source: "bundled" | "local-brain";
}

interface RawTemplateFile {
  name: string;
  content: string;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readYamlRecord(value: unknown): Record<string, unknown> | null {
  return isRecord(value) ? value : null;
}

function readCommandYaml(filePath: string, content: string): BuiltInCatalog["commands"][number] {
  const parsed = yaml.parse(content);
  const record = isRecord(parsed) ? parsed : undefined;
  const name = readString(record?.name);
  const description = readString(record?.description);
  if (!name || !description) {
    throw new Error(`Invalid command template: missing name or description in ${filePath}`);
  }

  const group = readString(record?.group);

  return {
    name,
    kind: "command",
    description,
    instructions: readString(record?.instructions) ?? "",
    argumentsHint: readString(record?.argumentsHint) ?? readString(record?.argumentHint),
    target: readString(record?.target),
    group:
      group === "system" ||
      group === "workflow" ||
      group === "specialist" ||
      group === "development"
        ? group
        : undefined,
    allowedTools: readStringArray(record?.allowedTools),
    backedBySkill: readString(record?.backedBySkill),
    nativeOnly: record?.nativeOnly === true,
  };
}

async function collectFileOutputs(
  sourceRoot: string,
  destinationRoot: string,
  templateId: string,
): Promise<RenderedOutput[]> {
  const outputs: RenderedOutput[] = [];

  async function walk(currentSource: string, currentDestination: string): Promise<void> {
    const entries = await fs.readdir(currentSource, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const sourcePath = path.join(currentSource, entry.name);
      const destinationPath = path.join(currentDestination, entry.name);
      if (entry.isDirectory()) {
        await walk(sourcePath, destinationPath);
        continue;
      }
      if (!entry.isFile()) {
        continue;
      }
      outputs.push({
        scope: "catalog",
        templateId,
        kind: "file",
        path: destinationPath,
        content: await fs.readFile(sourcePath, "utf-8"),
        adapterVersion: ADAPTER_VERSION,
      });
    }
  }

  await walk(sourceRoot, destinationRoot);
  return outputs.sort((left, right) => left.path.localeCompare(right.path));
}

function applyPackageSelection(
  catalog: BuiltInCatalog,
  packages: BrainPackageDefinition[],
  selectedPackageIds: string[],
): BuiltInCatalog {
  if (selectedPackageIds.length === 0 || packages.length === 0) {
    return catalog;
  }

  const selected = packages.filter((pkg) => selectedPackageIds.includes(pkg.id));
  if (selected.length === 0) {
    return catalog;
  }

  const skillNames = new Set(selected.flatMap((pkg) => pkg.skills));
  const agentNames = new Set(selected.flatMap((pkg) => pkg.agents));
  const commandNames = new Set(selected.flatMap((pkg) => pkg.commands));

  return {
    skills: catalog.skills.filter((template) => skillNames.has(template.name)),
    agents: catalog.agents.filter((template) => agentNames.has(template.name)),
    commands: catalog.commands.filter((template) => commandNames.has(template.name)),
  };
}

async function loadBrainPackages(brainRoot: string): Promise<BrainPackageDefinition[]> {
  const packagesRoot = path.join(brainRoot, "packages");
  const entries = await fs.readdir(packagesRoot, { withFileTypes: true }).catch(() => []);
  const packages: BrainPackageDefinition[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".yaml")) {
      continue;
    }

    const filePath = path.join(packagesRoot, entry.name);
    const parsed = readYamlRecord(yaml.parse(await fs.readFile(filePath, "utf-8")));
    const id = readString(parsed?.id) ?? entry.name.replace(/\.yaml$/, "");
    packages.push({
      id,
      skills: readStringArray(parsed?.skills),
      agents: readStringArray(parsed?.agents),
      commands: readStringArray(parsed?.commands),
    });
  }

  return packages;
}

async function loadLocalBrainCatalog(homePath: string, config: BrainConfig | null): Promise<CatalogSource | null> {
  const brainRoot = getBrainRoot(homePath);
  if (!(await directoryExists(brainRoot))) {
    return null;
  }

  const skillsRoot = path.join(brainRoot, "skills");
  const agentsRoot = path.join(brainRoot, "agents");
  const commandsRoot = path.join(brainRoot, "commands");
  const catalogRoot = getCatalogRoot(homePath);

  const skills: BuiltInCatalog["skills"] = [];
  const skillOutputs: RenderedOutput[] = [];
  const skillEntries = await fs.readdir(skillsRoot, { withFileTypes: true }).catch(() => []);
  for (const entry of skillEntries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const skillDir = path.join(skillsRoot, entry.name);
    const skillPath = path.join(skillDir, "SKILL.md");
    if (!(await fileExists(skillPath))) {
      continue;
    }
    const content = await readFile(skillPath);
    const template = parseSkillTemplate(skillPath, content);
    template.name = entry.name;
    skills.push(template);
    skillOutputs.push(
      ...(await collectFileOutputs(skillDir, path.join(catalogRoot, "skills", entry.name), entry.name)),
    );
  }

  const agents: BuiltInCatalog["agents"] = [];
  const agentOutputs: RenderedOutput[] = [];
  const agentEntries = await fs.readdir(agentsRoot, { withFileTypes: true }).catch(() => []);
  for (const entry of agentEntries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const agentDir = path.join(agentsRoot, entry.name);
    const agentPath = path.join(agentDir, "AGENT.md");
    if (!(await fileExists(agentPath))) {
      continue;
    }
    const content = await readFile(agentPath);
    const template = parseAgentTemplate(agentPath, content);
    template.name = entry.name;
    agents.push(template);
    agentOutputs.push(
      ...(await collectFileOutputs(agentDir, path.join(catalogRoot, "agents", entry.name), entry.name)),
    );
  }

  const commands: BuiltInCatalog["commands"] = [];
  const commandOutputs: RenderedOutput[] = [];
  const commandEntries = await fs.readdir(commandsRoot, { withFileTypes: true }).catch(() => []);
  for (const entry of commandEntries) {
    if (!entry.isFile() || !entry.name.endsWith(".yaml")) {
      continue;
    }
    const filePath = path.join(commandsRoot, entry.name);
    const content = await readFile(filePath);
    const template = readCommandYaml(filePath, content);
    commands.push(template);
    commandOutputs.push({
      scope: "catalog",
      templateId: template.name,
      kind: "file",
      path: path.join(catalogRoot, "commands", `${template.name}.yaml`),
      content,
      adapterVersion: ADAPTER_VERSION,
    });
  }

  if (skills.length === 0 && agents.length === 0 && commands.length === 0) {
    return null;
  }

  const selected = applyPackageSelection(
    {
      skills: skills.sort((left, right) => left.name.localeCompare(right.name)),
      agents: agents.sort((left, right) => left.name.localeCompare(right.name)),
      commands: commands.sort((left, right) => left.name.localeCompare(right.name)),
    },
    await loadBrainPackages(brainRoot),
    config?.packages ?? [],
  );

  const selectedSkillNames = new Set(selected.skills.map((template) => template.name));
  const selectedAgentNames = new Set(selected.agents.map((template) => template.name));
  const selectedCommandNames = new Set(selected.commands.map((template) => template.name));

  return {
    catalog: selected,
    outputs: [...skillOutputs, ...agentOutputs, ...commandOutputs]
      .filter((output) => {
        if (output.path.includes(`${path.sep}skills${path.sep}`)) {
          return selectedSkillNames.has(output.templateId);
        }
        if (output.path.includes(`${path.sep}agents${path.sep}`)) {
          return selectedAgentNames.has(output.templateId);
        }
        return selectedCommandNames.has(output.templateId);
      })
      .sort((left, right) => left.path.localeCompare(right.path)),
    source: "local-brain",
  };
}

export function getBuiltInCatalog(): BuiltInCatalog {
  const registry = loadTemplateRegistry();
  const resolved = resolveCatalog(registry);
  return {
    skills: resolved.skills,
    agents: resolved.agents,
    commands: resolved.commands,
  };
}

export async function loadCatalogSource(homePath: string): Promise<CatalogSource> {
  const config = await loadBrainConfig(homePath);
  const local = await loadLocalBrainCatalog(homePath, config);
  if (local) {
    return local;
  }

  const catalog = getBuiltInCatalog();
  return {
    catalog,
    outputs: renderCatalogOutputs(catalog, homePath, ADAPTER_VERSION),
    source: "bundled",
  };
}

export function getBuiltInPackageIds(): string[] {
  return [];
}
