import * as fs from "fs/promises";
import * as os from "os";
import { getAgentsRoot, getCatalogConfigPath, loadCatalogConfig } from "./config.js";
import { loadCatalogSource } from "./catalog.js";
import { renderHostOutputs } from "../render/index.js";
import type { DoctorIssue, DoctorResult } from "./types.js";

export async function doctorKernel(homePath = os.homedir()): Promise<DoctorResult> {
  const issues: DoctorIssue[] = [];
  const config = await loadCatalogConfig(homePath);
  if (!config) {
    return {
      configPath: getCatalogConfigPath(homePath),
      catalogPath: getAgentsRoot(homePath),
      hosts: [],
      issues: [{ level: "error", message: "Kernel is not initialized. Run `kernel sync` first." }],
    };
  }

  const { catalog } = await loadCatalogSource(homePath);

  for (const hostId of config.hosts) {
    const desired = renderHostOutputs(catalog, hostId, homePath, "2.0.0").map((output) => ({
      path: output.path,
      kind: output.kind,
      target: output.target,
    }));
    for (const action of desired) {
      const stat = await fs.lstat(action.path).catch(() => null);
      if (!stat) {
        issues.push({ level: "warning", message: `${hostId}: missing generated path ${action.path}` });
        continue;
      }
      if (action.kind === "symlink") {
        if (!stat.isSymbolicLink()) {
          issues.push({
            level: "error",
            message: `${hostId}: expected symlink at ${action.path}`,
          });
          continue;
        }
        const target = await fs.readlink(action.path).catch(() => "");
        if (target !== action.target) {
          issues.push({
            level: "error",
            message: `${hostId}: broken skill link at ${action.path}`,
          });
        }
      } else if (!stat.isFile()) {
        issues.push({
          level: "error",
          message: `${hostId}: expected file at ${action.path}`,
        });
      }
    }
  }

  return {
    configPath: getCatalogConfigPath(homePath),
    catalogPath: getAgentsRoot(homePath),
    hosts: config.hosts,
    issues,
  };
}
