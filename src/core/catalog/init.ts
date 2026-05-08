import * as os from "os";
import { ensureCatalogConfig, getAgentsRoot, getCatalogConfigPath } from "./config.js";
import { detectInstalledHosts } from "./hosts.js";
import { syncBuiltInCatalog } from "./storage.js";
import { syncKernelCatalog } from "./sync.js";
import type { HostId, InitResult } from "./types.js";

export async function initializeKernel(homePath = os.homedir()): Promise<InitResult> {
  const detectedHosts = await detectInstalledHosts(homePath);
  const hosts: HostId[] = detectedHosts.length > 0 ? detectedHosts : ["codex"];
  const config = await ensureCatalogConfig(homePath, { hosts });
  await syncBuiltInCatalog(homePath);
  await syncKernelCatalog(homePath);

  return {
    configPath: getCatalogConfigPath(homePath),
    catalogPath: getAgentsRoot(homePath),
    detectedHosts,
    enabledHosts: config.hosts,
  };
}
