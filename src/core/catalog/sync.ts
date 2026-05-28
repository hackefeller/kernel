import * as fs from "node:fs/promises";
import path from "node:path";
import * as os from "os";
import { renderHostOutputs } from "../render/index.js";
import { applySyncPlan, planSync } from "../sync/index.js";
import { KERNEL_TEMPLATE_PREFIX } from "../../templates/constants.js";
import { directoryExists, fileExists, writeFile } from "../utils/file-system.js";
import { loadCatalogSource } from "./catalog.js";
import { ensureCatalogConfig, getAgentsRoot, getSyncManifestPath, loadCatalogConfig } from "./config.js";
import { detectInstalledHosts, getHostAdapter, getHostDescriptor, listKnownHosts } from "./hosts.js";
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

async function cleanupCatalogOrphans(
  homePath: string,
  tracked: Set<string>,
  options: { verbose?: boolean } = {},
): Promise<CleanupResult> {
  const roots = [
    path.join(getAgentsRoot(homePath), "skills"),
    path.join(getAgentsRoot(homePath), "agents"),
    path.join(getAgentsRoot(homePath), "commands"),
  ];
  let removed = 0;
  const removedPaths: string[] = [];

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
        if (options.verbose) {
          removedPaths.push(absolutePath);
        }
      }
    }
  }

  for (const root of roots) {
    if (await directoryExists(root)) {
      await walk(root);
    }
  }

  return { removed, removedPaths };
}

interface CleanupResult {
  removed: number;
  removedPaths: string[];
}

function isKernelManagedHostPath(hostId: HostId, homePath: string, entryPath: string): boolean {
  const host = getHostDescriptor(hostId);
  const adapter = getHostAdapter(hostId);
  const hostBase = path.join(homePath, host.homeDir);
  const relativePath = path.relative(hostBase, entryPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return false;
  }

  if (adapter.getManifestPath && relativePath === adapter.getManifestPath()) {
    return true;
  }

  const segments = relativePath.split(path.sep);
  const topLevel = segments[0];
  if (!topLevel) {
    return false;
  }

  if (!["skills", "agents", "commands"].includes(topLevel)) {
    return false;
  }

  if (topLevel === "skills") {
    const skillName = segments[1];
    return typeof skillName === "string" && skillName.startsWith(KERNEL_TEMPLATE_PREFIX);
  }

  return path.parse(path.basename(entryPath)).name.startsWith(KERNEL_TEMPLATE_PREFIX);
}

async function cleanupHostOrphans(
  hostId: HostId,
  homePath: string,
  tracked: Set<string>,
  options: { verbose?: boolean } = {},
): Promise<CleanupResult> {
  const host = getHostDescriptor(hostId);
  const adapter = getHostAdapter(hostId);
  const hostBase = path.join(homePath, host.homeDir);
  let removed = 0;
  const removedPaths: string[] = [];

  if (adapter.mirrorSkills === false && adapter.getManifestPath) {
    const manifestPath = path.join(hostBase, adapter.getManifestPath());
    if (await fileExists(manifestPath)) {
      await fs.rm(manifestPath, { force: true });
      removed += 1;
      if (options.verbose) {
        removedPaths.push(manifestPath);
      }
    }
  }

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
      if (!tracked.has(entryPath) && isKernelManagedHostPath(hostId, homePath, entryPath)) {
        await fs.rm(entryPath, { force: true, recursive: true });
        removed += 1;
        if (options.verbose) {
          removedPaths.push(entryPath);
        }
      }
    }
  }

  for (const relativeDir of ["skills", "agents", "commands"]) {
    const absoluteDir = path.join(hostBase, relativeDir);
    if (await directoryExists(absoluteDir)) {
      await walk(absoluteDir);
      const remaining = await fs.readdir(absoluteDir).catch(() => []);
      if (remaining.length === 0) {
        await fs.rmdir(absoluteDir).catch(() => undefined);
      }
    }
  }

  return { removed, removedPaths };
}

async function syncHost(
  hostId: HostId,
  previous: SyncManifestEntry[],
  homePath: string,
  options: { verbose?: boolean } = {},
): Promise<{ result: SyncHostResult; tracked: SyncManifestEntry[] }> {
  const source = await loadCatalogSource(homePath);
  const outputs = renderHostOutputs(source.catalog, hostId, homePath, "2.0.0");
  const plan = planSync(hostId, outputs, previous);
  const result = await applySyncPlan(plan, options);
  const cleanup = await cleanupHostOrphans(
    hostId,
    homePath,
    new Set(plan.tracked.map((entry) => entry.path)),
    options,
  );
  result.removed += cleanup.removed;
  if (options.verbose && cleanup.removedPaths.length > 0) {
    result.removedPaths = [...(result.removedPaths ?? []), ...cleanup.removedPaths];
  }
  return { result, tracked: plan.tracked };
}

export async function syncKernelCatalog(
  homePath = os.homedir(),
  options: { verbose?: boolean } = {},
): Promise<SyncResult> {
  const existingConfig = await loadCatalogConfig(homePath);

  if (!existingConfig) {
    const detectedHosts = await detectInstalledHosts(homePath);
    const hosts: HostId[] = detectedHosts.length > 0 ? detectedHosts : ["codex"];
    await ensureCatalogConfig(homePath, { hosts });
  }
  const activeConfig = existingConfig ?? (await loadCatalogConfig(homePath));
  if (!activeConfig) {
    throw new Error("Unable to load Kernel configuration.");
  }

  const manifest = await loadSyncManifest(homePath);
  const hosts: SyncHostResult[] = [];
  const nextManifest: SyncManifest = { version: 2, scopes: {} };

  const catalogSync = await syncBuiltInCatalog(homePath, manifest.scopes.catalog ?? [], options);
  nextManifest.scopes.catalog = catalogSync.tracked;
  const catalogCleanup = await cleanupCatalogOrphans(
    homePath,
    new Set(catalogSync.tracked.map((entry) => entry.path)),
    options,
  );
  const catalogResult = {
    ...catalogSync.result,
    removed: catalogSync.result.removed + catalogCleanup.removed,
    removedPaths: options.verbose
      ? [...(catalogSync.result.removedPaths ?? []), ...catalogCleanup.removedPaths]
      : undefined,
  };
  if (catalogResult.created > 0 || catalogResult.updated > 0 || catalogResult.removed > 0) {
    hosts.push(catalogResult);
  }

  for (const hostId of activeConfig.hosts) {
    const { result, tracked } = await syncHost(
      hostId,
      manifest.scopes[hostId] ?? [],
      homePath,
      options,
    );
    hosts.push(result);
    nextManifest.scopes[hostId] = tracked;
  }

  for (const hostId of listKnownHosts()) {
    if (!activeConfig.hosts.includes(hostId)) {
      const cleanup = await cleanupHostOrphans(hostId, homePath, new Set(), options);
      if (cleanup.removed > 0) {
        hosts.push({
          host: hostId,
          created: 0,
          updated: 0,
          removed: cleanup.removed,
          tracked: [],
          removedPaths: options.verbose ? cleanup.removedPaths : undefined,
        });
      }
    }
  }

  await saveSyncManifest(nextManifest, homePath);
  return {
    catalogPath: getAgentsRoot(homePath),
    hosts,
  };
}
