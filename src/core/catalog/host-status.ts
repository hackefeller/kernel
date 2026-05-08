import * as os from "os";
import * as path from "path";
import { loadCatalogConfig } from "./config.js";
import { detectInstalledHosts, getHostDescriptor, listKnownHosts } from "./hosts.js";
import type { HostStatus } from "./types.js";

export async function listHostStatus(homePath = os.homedir()): Promise<{ hosts: HostStatus[] }> {
  const config = await loadCatalogConfig(homePath);
  const detected = new Set(await detectInstalledHosts(homePath));
  return {
    hosts: listKnownHosts().map((hostId) => {
      const descriptor = getHostDescriptor(hostId);
      return {
        id: hostId,
        name: descriptor.name,
        detected: detected.has(hostId),
        enabled: config?.hosts.includes(hostId) ?? false,
        homePath: path.join(homePath, descriptor.homeDir),
      };
    }),
  };
}
