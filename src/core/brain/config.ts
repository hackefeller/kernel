import * as os from "os";
import * as path from "path";
import * as yaml from "yaml";
import { z } from "zod";
import { ensureDir, fileExists, readFile, writeFile } from "../utils/file-system.js";
import type { BrainConfig, HostId } from "./types.js";

const HostIdSchema = z.enum(["claude", "codex", "copilot", "pi"]);

const BrainConfigSchema = z.object({
  version: z.string().default("2.0.0"),
  hosts: z.array(HostIdSchema).default([]),
  packages: z.array(z.string()).optional(),
});

const LEGACY_CONFIG_SCHEMA = z
  .object({
    version: z.string().optional(),
    tools: z.array(HostIdSchema).optional(),
    hosts: z.array(HostIdSchema).optional(),
    packages: z.array(z.string()).optional(),
  })
  .passthrough();

export function getKernelHome(homePath = os.homedir()): string {
  return path.join(homePath, ".kernel");
}

export function getBrainRoot(homePath = os.homedir()): string {
  return path.join(getKernelHome(homePath), "brain");
}

export function getCatalogRoot(homePath = os.homedir()): string {
  return path.join(homePath, ".agents");
}

export function getBrainStateRoot(homePath = os.homedir()): string {
  return path.join(getKernelHome(homePath), "state");
}

export function getBrainConfigPath(homePath = os.homedir()): string {
  return path.join(getKernelHome(homePath), "config.yaml");
}

export function getSyncManifestPath(homePath = os.homedir()): string {
  return path.join(getBrainStateRoot(homePath), "sync-manifest.json");
}

function normalizeConfig(
  input: Partial<BrainConfig> & { tools?: HostId[]; hosts?: HostId[] },
): BrainConfig {
  return BrainConfigSchema.parse({
    version: input.version ?? "2.0.0",
    hosts: input.hosts ?? input.tools ?? [],
    packages: input.packages,
  });
}

export async function loadBrainConfig(homePath = os.homedir()): Promise<BrainConfig | null> {
  const configPath = getBrainConfigPath(homePath);
  if (!(await fileExists(configPath))) {
    return null;
  }
  const raw = yaml.parse(await readFile(configPath));
  return normalizeConfig(LEGACY_CONFIG_SCHEMA.parse(raw));
}

export async function saveBrainConfig(
  config: BrainConfig,
  homePath = os.homedir(),
): Promise<BrainConfig> {
  const normalized = normalizeConfig(config);
  const configPath = getBrainConfigPath(homePath);
  await ensureDir(path.dirname(configPath));
  await writeFile(
    configPath,
    yaml.stringify(
      {
        version: normalized.version,
        hosts: normalized.hosts,
        packages: normalized.packages,
      },
      { indent: 2, sortMapEntries: true },
    ),
  );
  return normalized;
}

export async function ensureBrainConfig(
  homePath = os.homedir(),
  defaults: Partial<BrainConfig> = {},
): Promise<BrainConfig> {
  const existing = await loadBrainConfig(homePath);
  if (existing) {
    return existing;
  }
  return saveBrainConfig(
    {
      version: "2.0.0",
      hosts: defaults.hosts ?? [],
      packages: defaults.packages,
    },
    homePath,
  );
}
