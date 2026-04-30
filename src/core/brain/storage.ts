import * as fs from "node:fs/promises";
import path from "node:path";
import * as os from "os";
import { applySyncPlan, planSync } from "../sync/index.js";
import { ensureDir, listDirs, readFile } from "../utils/file-system.js";
import { loadCatalogSource } from "./catalog.js";
import { getCatalogRoot } from "./config.js";
import type { SyncHostResult, SyncManifestEntry } from "./types.js";

function getSkillsRoot(homePath = os.homedir()): string {
  return path.join(getCatalogRoot(homePath), "skills");
}

function getAgentsRoot(homePath = os.homedir()): string {
  return path.join(getCatalogRoot(homePath), "agents");
}

function getCommandsRoot(homePath = os.homedir()): string {
  return path.join(getCatalogRoot(homePath), "commands");
}

export async function ensureCatalogLayout(homePath = os.homedir()): Promise<void> {
  await ensureDir(getSkillsRoot(homePath));
  await ensureDir(getAgentsRoot(homePath));
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

export async function listCatalogSkillNames(homePath = os.homedir()): Promise<string[]> {
  return (await listDirs(getSkillsRoot(homePath))).sort();
}

export async function listCatalogAgentNames(homePath = os.homedir()): Promise<string[]> {
  return (await listDirs(getAgentsRoot(homePath))).sort();
}

export async function listCatalogCommandNames(homePath = os.homedir()): Promise<string[]> {
  const entries = await fs.readdir(getCommandsRoot(homePath), { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".yaml"))
    .map((entry) => entry.name.replace(/\.yaml$/, ""))
    .sort();
}

export async function loadCatalogSkillContent(
  skillName: string,
  homePath = os.homedir(),
): Promise<string> {
  return readFile(path.join(getSkillsRoot(homePath), skillName, "SKILL.md"));
}

export async function loadCatalogAgentContent(
  agentName: string,
  homePath = os.homedir(),
): Promise<string> {
  return readFile(path.join(getAgentsRoot(homePath), agentName, "AGENT.md"));
}

export function getCatalogSkillDir(skillName: string, homePath = os.homedir()): string {
  return path.join(getSkillsRoot(homePath), skillName);
}

export function getCatalogAgentsRoot(homePath = os.homedir()): string {
  return getAgentsRoot(homePath);
}

export function getCatalogCommandsRoot(homePath = os.homedir()): string {
  return getCommandsRoot(homePath);
}
