import * as fs from "node:fs/promises";
import path from "node:path";
import * as os from "os";
import { renderHostOutputs } from "../render/index.js";
import { applySyncPlan, planSync } from "../sync/index.js";
import { directoryExists, fileExists, writeFile } from "../utils/file-system.js";
import { loadCatalogSource } from "./catalog.js";
import { ensureBrainConfig, getCatalogRoot, getSyncManifestPath, loadBrainConfig } from "./config.js";
import { detectInstalledHosts, getHostDescriptor, listKnownHosts } from "./hosts.js";
import { syncBuiltInCatalog } from "./storage.js";
import type {
    HostId,
    SyncHostResult,
    SyncManifest,
    SyncManifestEntry,
    SyncResult,
} from "./types.js";

async function loadSyncManifest(homePath = os.homedir()): Promise<SyncManifest> {
  const manifestPath = getSyncManifestPath(homePath);
  if (!(await fileExists(manifestPath))) {
    return { version: 2, scopes: {} };
  }
  const parsed = JSON.parse(await fs.readFile(manifestPath, "utf-8")) as
    | Partial<SyncManifest>
    | null;

  if (!parsed || typeof parsed !== "object") {
    return { version: 2, scopes: {} };
  }

  if (!parsed.scopes || typeof parsed.scopes !== "object") {
    return { version: 2, scopes: {} };
  }

  return { version: 2, scopes: parsed.scopes };
}

async function saveSyncManifest(manifest: SyncManifest, homePath = os.homedir()): Promise<void> {
  await writeFile(getSyncManifestPath(homePath), JSON.stringify(manifest, null, 2));
}

async function cleanupCatalogOrphans(homePath: string, tracked: Set<string>): Promise<number> {
  const roots = [
    path.join(getCatalogRoot(homePath), "skills"),
    path.join(getCatalogRoot(homePath), "agents"),
    path.join(getCatalogRoot(homePath), "commands"),
  ];
  let removed = 0;

  async function walk(currentPath: string): Promise<void> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const absolutePath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        await walk(absolutePath);
        const remaining = await fs.readdir(absolutePath).catch(() => []);
        if (remaining.length === 0) {
          await fs.rmdir(absolutePath).catch(() => undefined);
        }
        continue;
      }
      if (!tracked.has(absolutePath)) {
        await fs.rm(absolutePath, { force: true });
        removed += 1;
      }
    }
  }

  for (const root of roots) {
    if (await directoryExists(root)) {
      await walk(root);
    }
  }

  return removed;
}

async function cleanupHostOrphans(hostId: HostId, homePath: string, tracked: Set<string>): Promise<number> {
  const host = getHostDescriptor(hostId);
  const hostBase = path.join(homePath, host.homeDir);
  let removed = 0;

  async function walk(currentPath: string): Promise<void> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath);
        const remaining = await fs.readdir(entryPath).catch(() => []);
        if (remaining.length === 0 && !tracked.has(entryPath)) {
          await fs.rmdir(entryPath).catch(() => undefined);
        }
        continue;
      }
      if (!tracked.has(entryPath)) {
        await fs.rm(entryPath, { force: true, recursive: true });
        removed += 1;
      }
    }
  }

  for (const relativeDir of ["skills", "agents", "commands"]) {
    const absoluteDir = path.join(hostBase, relativeDir);
    if (await directoryExists(absoluteDir)) {
      await walk(absoluteDir);
    }
  }

  return removed;
}

async function syncHost(
  hostId: HostId,
  previous: SyncManifestEntry[],
  homePath: string,
): Promise<{ result: SyncHostResult; tracked: SyncManifestEntry[] }> {
  const source = await loadCatalogSource(homePath);
  const outputs = renderHostOutputs(source.catalog, hostId, homePath, "2.0.0");
  const plan = planSync(hostId, outputs, previous);
  const result = await applySyncPlan(plan);
  result.removed += await cleanupHostOrphans(hostId, homePath, new Set(plan.tracked.map((entry) => entry.path)));
  return { result, tracked: plan.tracked };
}

export async function syncKernelBrain(homePath = os.homedir()): Promise<SyncResult> {
  const existingConfig = await loadBrainConfig(homePath);

  if (!existingConfig) {
    const detectedHosts = await detectInstalledHosts(homePath);
    const hosts: HostId[] = detectedHosts.length > 0 ? detectedHosts : ["codex"];
    await ensureBrainConfig(homePath, { hosts });
  }
  const activeConfig = existingConfig ?? (await loadBrainConfig(homePath));
  if (!activeConfig) {
    throw new Error("Unable to load Kernel configuration.");
  }

  const manifest = await loadSyncManifest(homePath);
  const hosts: SyncHostResult[] = [];
  const nextManifest: SyncManifest = { version: 2, scopes: {} };

  const catalogSync = await syncBuiltInCatalog(homePath, manifest.scopes.catalog ?? []);
  nextManifest.scopes.catalog = catalogSync.tracked;
  const catalogResultRemoved = await cleanupCatalogOrphans(
    homePath,
    new Set(catalogSync.tracked.map((entry) => entry.path)),
  );
  const catalogResult = {
    ...catalogSync.result,
    removed: catalogSync.result.removed + catalogResultRemoved,
  };
  if (catalogResult.created > 0 || catalogResult.updated > 0 || catalogResult.removed > 0) {
    hosts.push(catalogResult);
  }

  for (const hostId of activeConfig.hosts) {
    const { result, tracked } = await syncHost(
      hostId,
      manifest.scopes[hostId] ?? [],
      homePath,
    );
    hosts.push(result);
    nextManifest.scopes[hostId] = tracked;
  }

  for (const hostId of listKnownHosts()) {
    if (!activeConfig.hosts.includes(hostId)) {
      const removed = await cleanupHostOrphans(hostId, homePath, new Set());
      if (removed > 0) {
        hosts.push({
          host: hostId,
          created: 0,
          updated: 0,
          removed,
          unchanged: 0,
          tracked: [],
        });
      }
    }
  }

  await saveSyncManifest(nextManifest, homePath);
  return {
    catalogPath: getCatalogRoot(homePath),
    importedLegacySkills: [],
    hosts,
  };
}
