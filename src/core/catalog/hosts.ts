import * as path from "path";
import { createPopulatedAdapterRegistry } from "../adapters/index.js";
import type { ToolCommandAdapter } from "../adapters/types.js";
import { directoryExists } from "../utils/file-system.js";
import type { HostDescriptor, HostId } from "./types.js";

export const HOST_DESCRIPTORS: HostDescriptor[] = [
  {
    id: "claude",
    name: "Claude Code",
    homeDir: ".claude",
    projectMarker: ".claude",
  },
  {
    id: "codex",
    name: "OpenAI Codex",
    homeDir: ".codex",
    projectMarker: ".codex",
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    homeDir: ".copilot",
    projectMarker: ".github",
  },
  {
    id: "pi",
    name: "Pi",
    homeDir: ".pi",
    projectMarker: ".pi",
  },
];

const adapterRegistry = createPopulatedAdapterRegistry();

export function getHostDescriptor(hostId: HostId): HostDescriptor {
  const host = HOST_DESCRIPTORS.find((entry) => entry.id === hostId);
  if (!host) {
    throw new Error(`Unknown host: ${hostId}`);
  }
  return host;
}

export function getHostAdapter(hostId: HostId): ToolCommandAdapter {
  return adapterRegistry.get(hostId);
}

export function listKnownHosts(): HostId[] {
  return HOST_DESCRIPTORS.map((host) => host.id);
}

export async function detectInstalledHosts(
  homePath: string,
  projectPath = process.cwd(),
): Promise<HostId[]> {
  const detected: HostId[] = [];
  for (const host of HOST_DESCRIPTORS) {
    const found =
      (await directoryExists(path.join(homePath, host.homeDir))) ||
      (await directoryExists(path.join(projectPath, host.projectMarker)));
    if (found) {
      detected.push(host.id);
    }
  }
  return detected;
}

export function mapProjectPathToHome(hostId: HostId, relativePath: string, homePath: string): string {
  const host = getHostDescriptor(hostId);
  const parts = relativePath.split(/[\\/]+/).filter(Boolean);
  return path.join(homePath, host.homeDir, ...parts.slice(1));
}
