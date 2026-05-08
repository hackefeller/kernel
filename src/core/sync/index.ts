import { createHash } from "node:crypto";
import * as fs from "node:fs/promises";
import path from "node:path";
import type { SyncAction, SyncHostResult, SyncManifestEntry } from "../catalog/types.js";
import type { RenderedOutput } from "../render/index.js";
import { ensureDir } from "../utils/file-system.js";

export interface SyncPlan {
  scope: SyncHostResult["host"];
  actions: SyncAction[];
  remove: string[];
  tracked: SyncManifestEntry[];
}

function hashValue(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function toManifestEntry(output: RenderedOutput): SyncManifestEntry {
  const source = output.kind === "file" ? output.content ?? "" : output.target ?? "";
  return {
    path: output.path,
    kind: output.kind,
    hash: hashValue(source),
    templateId: output.templateId,
    adapterVersion: output.adapterVersion,
  };
}

export function planSync(
  scope: SyncHostResult["host"],
  outputs: RenderedOutput[],
  previous: SyncManifestEntry[],
): SyncPlan {
  const tracked = outputs.map(toManifestEntry);
  const actions: SyncAction[] = [];

  for (const output of outputs) {
    const current = toManifestEntry(output);
    actions.push({
      scope,
      path: output.path,
      kind: output.kind,
      content: output.content,
      target: output.target,
      hash: current.hash,
      templateId: output.templateId,
      adapterVersion: output.adapterVersion,
    });
  }

  const desiredPaths = new Set(tracked.map((entry) => entry.path));
  const remove = previous
    .map((entry) => entry.path)
    .filter((entryPath) => !desiredPaths.has(entryPath))
    .sort();

  return { scope, actions, remove, tracked };
}

async function applyAction(action: SyncAction): Promise<"created" | "updated"> {
  const stat = await fs.lstat(action.path).catch(() => null);
  if (action.kind === "symlink") {
    await fs.rm(action.path, { force: true, recursive: true });
    await ensureDir(path.dirname(action.path));
    await fs.symlink(action.target!, action.path, "dir");
    return stat ? "updated" : "created";
  }

  await fs.rm(action.path, { force: true, recursive: true });
  await ensureDir(path.dirname(action.path));
  await fs.writeFile(action.path, action.content ?? "", "utf-8");
  return stat ? "updated" : "created";
}

export async function applySyncPlan(plan: SyncPlan): Promise<SyncHostResult> {
  let removed = 0;
  let created = 0;
  let updated = 0;

  for (const entryPath of plan.remove) {
    await fs.rm(entryPath, { force: true, recursive: true });
    removed += 1;
  }

  for (const action of plan.actions) {
    const result = await applyAction(action);
    if (result === "created") {
      created += 1;
    } else {
      updated += 1;
    }
  }

  return {
    host: plan.scope,
    created,
    updated,
    removed,
    tracked: plan.tracked.map((entry) => entry.path),
  };
}
