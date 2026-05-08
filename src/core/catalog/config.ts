import * as os from "os";
import * as path from "path";
import * as yaml from "yaml";
import { z } from "zod";
import { ensureDir, fileExists, readFile, writeFile } from "../utils/file-system.js";
import type { CatalogConfig, HostId } from "./types.js";

const HostIdSchema = z.enum(["claude", "codex", "copilot", "pi"]);

const CatalogConfigSchema = z.object({
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

export function getCatalogHome(homePath = os.homedir()): string {
  return path.join(getKernelHome(homePath), "catalog");
}

export function getAgentsRoot(homePath = os.homedir()): string {
  return path.join(homePath, ".agents");
}

export function getCatalogStateRoot(homePath = os.homedir()): string {
  return path.join(getKernelHome(homePath), "state");
}

export function getCatalogConfigPath(homePath = os.homedir()): string {
  return path.join(getKernelHome(homePath), "config.yaml");
}

export function getSyncManifestPath(homePath = os.homedir()): string {
  return path.join(getCatalogStateRoot(homePath), "sync-manifest.json");
}

function normalizeConfig(
  input: Partial<CatalogConfig> & { tools?: HostId[]; hosts?: HostId[] },
): CatalogConfig {
  return CatalogConfigSchema.parse({
    version: input.version ?? "2.0.0",
    hosts: input.hosts ?? input.tools ?? [],
    packages: input.packages,
  });
}

export async function loadCatalogConfig(homePath = os.homedir()): Promise<CatalogConfig | null> {
  const configPath = getCatalogConfigPath(homePath);
  if (!(await fileExists(configPath))) {
    return null;
  }
  const raw = yaml.parse(await readFile(configPath));
  return normalizeConfig(LEGACY_CONFIG_SCHEMA.parse(raw));
}

export async function saveCatalogConfig(
  config: CatalogConfig,
  homePath = os.homedir(),
): Promise<CatalogConfig> {
  const normalized = normalizeConfig(config);
  const configPath = getCatalogConfigPath(homePath);
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

export async function ensureCatalogConfig(
  homePath = os.homedir(),
  defaults: Partial<CatalogConfig> = {},
): Promise<CatalogConfig> {
  const existing = await loadCatalogConfig(homePath);
  if (existing) {
    return existing;
  }
  return saveCatalogConfig(
    {
      version: "2.0.0",
      hosts: defaults.hosts ?? [],
      packages: defaults.packages,
    },
    homePath,
  );
}
