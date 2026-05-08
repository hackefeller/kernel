import * as fs from "node:fs/promises";
import path from "node:path";
import * as os from "os";
import { applySyncPlan, planSync } from "../sync/index.js";
import { ensureDir } from "../utils/file-system.js";
import { loadCatalogSource } from "./catalog.js";
import { getAgentsRoot } from "./config.js";
import type { SyncHostResult, SyncManifestEntry } from "./types.js";

function getSkillsRoot(homePath = os.homedir()): string {
  return path.join(getAgentsRoot(homePath), "skills");
}

function getAgentsDirectoryRoot(homePath = os.homedir()): string {
  return path.join(getAgentsRoot(homePath), "agents");
}

function getCommandsRoot(homePath = os.homedir()): string {
  return path.join(getAgentsRoot(homePath), "commands");
}

export async function ensureCatalogLayout(homePath = os.homedir()): Promise<void> {
  await ensureDir(getSkillsRoot(homePath));
  await ensureDir(getAgentsDirectoryRoot(homePath));
  await ensureDir(getCommandsRoot(homePath));
}

export async function syncBuiltInCatalog(
  homePath = os.homedir(),
  previous: SyncManifestEntry[] = [],
): Promise<{ tracked: SyncManifestEntry[]; result: SyncHostResult }> {
  await ensureCatalogLayout(homePath);
  const source = await loadCatalogSource(homePath);
  const plan = planSync("catalog", source.outputs, previous);
  const result = await applySyncPlan(plan);
  return { tracked: plan.tracked, result };
}
