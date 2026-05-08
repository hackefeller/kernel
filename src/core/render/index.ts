import path from "node:path";
import * as yaml from "yaml";
import type { ToolCommandAdapter } from "../adapters/types.js";
import { getHostAdapter, getHostDescriptor, mapProjectPathToHome } from "../catalog/hosts.js";
import type { HostId } from "../catalog/types.js";
import { getAgentsRoot } from "../catalog/config.js";
import type {
  AgentTemplate,
  CommandTemplate,
  SkillTemplate,
  TemplateReference,
} from "../templates/types.js";

interface CatalogLike {
  skills: SkillTemplate[];
  agents: AgentTemplate[];
  commands: CommandTemplate[];
}

export interface RenderedOutput {
  scope: "catalog" | HostId;
  templateId: string;
  kind: "file" | "symlink";
  path: string;
  content?: string;
  target?: string;
  adapterVersion: string;
}

function prune(value: unknown): unknown {
  if (Array.isArray(value)) {
    const items = value.map((item) => prune(item)).filter((item) => item !== undefined);
    return items.length > 0 ? items : undefined;
  }
  if (value && typeof value === "object") {
    const entries: [string, unknown][] = [];
    for (const [key, entry] of Object.entries(value)) {
      const pruned = prune(entry);
      if (pruned !== undefined) {
        entries.push([key, pruned]);
      }
    }
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }
  if (value === undefined || value === null) {
    return undefined;
  }
  return value;
}

function renderMarkdownTemplate(
  template: SkillTemplate | AgentTemplate | CommandTemplate,
  body: string,
): string {
  const source = prune({
    ...template,
    instructions: undefined,
    references: undefined,
  });
  return `---\n${yaml.stringify(source).trim()}\n---\n\n${body.trim()}\n`;
}

function addReferenceOutputs(
  outputs: RenderedOutput[],
  basePath: string,
  templateId: string,
  references: TemplateReference[] | undefined,
  version: string,
): void {
  for (const reference of references ?? []) {
    outputs.push({
      scope: "catalog",
      templateId,
      kind: "file",
      path: path.join(basePath, reference.relativePath),
      content: reference.content,
      adapterVersion: version,
    });
  }
}

export function renderCatalogOutputs(
  catalog: CatalogLike,
  homePath: string,
  version: string,
): RenderedOutput[] {
  const catalogRoot = getAgentsRoot(homePath);
  const outputs: RenderedOutput[] = [];

  for (const skill of catalog.skills) {
    const skillRoot = path.join(catalogRoot, "skills", skill.name);
    outputs.push({
      scope: "catalog",
      templateId: skill.name,
      kind: "file",
      path: path.join(skillRoot, "SKILL.md"),
      content: renderMarkdownTemplate(skill, skill.instructions),
      adapterVersion: version,
    });
    addReferenceOutputs(outputs, skillRoot, skill.name, skill.references, version);
  }

  for (const agent of catalog.agents) {
    const agentRoot = path.join(catalogRoot, "agents", agent.name);
    outputs.push({
      scope: "catalog",
      templateId: agent.name,
      kind: "file",
      path: path.join(agentRoot, "AGENT.md"),
      content: renderMarkdownTemplate(agent, agent.instructions),
      adapterVersion: version,
    });
    addReferenceOutputs(outputs, agentRoot, agent.name, agent.references, version);
  }

  for (const command of catalog.commands) {
    outputs.push({
      scope: "catalog",
      templateId: command.name,
      kind: "file",
      path: path.join(catalogRoot, "commands", `${command.name}.yaml`),
      content: yaml.stringify(prune(command), { indent: 2, sortMapEntries: true }),
      adapterVersion: version,
    });
  }

  return outputs.sort((left, right) => left.path.localeCompare(right.path));
}

export function renderHostOutputs(
  catalog: CatalogLike,
  hostId: HostId,
  homePath: string,
  version: string,
): RenderedOutput[] {
  const adapter = getHostAdapter(hostId);
  const outputs: RenderedOutput[] = [];
  const catalogRoot = getAgentsRoot(homePath);

  if (adapter.mirrorSkills !== false) {
    for (const skill of catalog.skills) {
      outputs.push({
        scope: hostId,
        templateId: skill.name,
        kind: "symlink",
        path: path.join(homePath, getHostDescriptor(hostId).homeDir, "skills", skill.name),
        target: path.join(catalogRoot, "skills", skill.name),
        adapterVersion: version,
      });
    }
  }

  if (adapter.getAgentPath && adapter.formatAgent) {
    for (const agent of catalog.agents) {
      outputs.push({
        scope: hostId,
        templateId: agent.name,
        kind: "file",
        path: mapProjectPathToHome(hostId, adapter.getAgentPath(agent.name), homePath),
        content: adapter.formatAgent(agent, version),
        adapterVersion: version,
      });
    }
  }

  if (adapter.getCommandPath && adapter.formatCommand) {
    for (const command of catalog.commands) {
      outputs.push({
        scope: hostId,
        templateId: command.name,
        kind: "file",
        path: mapProjectPathToHome(hostId, adapter.getCommandPath(command.name), homePath),
        content: adapter.formatCommand(command, version),
        adapterVersion: version,
      });
    }
  }

  if (adapter.mirrorSkills !== false && adapter.getManifestPath && adapter.formatManifest) {
    outputs.push({
      scope: hostId,
      templateId: `${hostId}-manifest`,
      kind: "file",
      path: mapProjectPathToHome(hostId, adapter.getManifestPath(), homePath),
      content: adapter.formatManifest(catalog.skills, version),
      adapterVersion: version,
    });
  }

  return outputs.sort((left, right) => left.path.localeCompare(right.path));
}
