import { describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import type { RenderedOutput } from "../../render/index.js";
import type { SyncManifestEntry } from "../../catalog/types.js";
import { applySyncPlan, planSync, toManifestEntry, type SyncPlan } from "../index.js";

function fileOutput(content: string): RenderedOutput {
  return {
    scope: "catalog",
    templateId: "kernel-review",
    kind: "file",
    path: "/tmp/kernel-review.md",
    content,
    adapterVersion: "2.0.0",
  };
}

function linkOutput(target: string): RenderedOutput {
  return {
    scope: "claude",
    templateId: "kernel-review",
    kind: "symlink",
    path: "/tmp/kernel-review",
    target,
    adapterVersion: "2.0.0",
  };
}

describe("sync planner", () => {
  it("plans outputs for rewrite", () => {
    const output = fileOutput("same");
    const plan = planSync("catalog", [output], [toManifestEntry(output)]);

    expect(plan.actions).toHaveLength(1);
    expect(plan.actions[0]?.path).toBe(output.path);
    expect(plan.remove).toEqual([]);
    expect(plan.tracked).toEqual([toManifestEntry(output)]);
  });

  it("rewrites changed outputs and removes orphans", () => {
    const previous: SyncManifestEntry[] = [
      toManifestEntry(fileOutput("before")),
      {
        path: "/tmp/orphan.md",
        kind: "file",
        hash: "deadbeef",
        templateId: "orphan",
        adapterVersion: "2.0.0",
      },
    ];
    const next = fileOutput("after");
    const plan = planSync("catalog", [next], previous);

    expect(plan.actions).toHaveLength(1);
    expect(plan.actions[0]?.path).toBe(next.path);
    expect(plan.actions[0]?.hash).toBe(toManifestEntry(next).hash);
    expect(plan.remove).toEqual(["/tmp/orphan.md"]);
  });

  it("tracks symlink target changes by hash", () => {
    const previous = toManifestEntry(linkOutput("/tmp/catalog-a"));
    const next = linkOutput("/tmp/catalog-b");
    const plan = planSync("claude", [next], [previous]);

    expect(plan.actions).toHaveLength(1);
    expect(plan.actions[0]?.kind).toBe("symlink");
    expect(plan.actions[0]?.target).toBe("/tmp/catalog-b");
    expect(plan.remove).toEqual([]);
  });

  it("replaces existing files and symlinks", async () => {
    const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), "sync-test-"));
    const filePath = path.join(homeDir, "file.md");
    const symlinkPath = path.join(homeDir, "link");
    const linkTarget = path.join(homeDir, "target-a");
    const nextLinkTarget = path.join(homeDir, "target-b");

    await fs.writeFile(filePath, "old file", "utf-8");
    await fs.writeFile(linkTarget, "a", "utf-8");
    await fs.writeFile(nextLinkTarget, "b", "utf-8");
    await fs.symlink(linkTarget, symlinkPath);

    const plan: SyncPlan = {
      scope: "claude",
      actions: [
        {
          scope: "claude",
          path: filePath,
          kind: "file",
          content: "new file",
          hash: "",
          templateId: "file",
          adapterVersion: "2.0.0",
        },
        {
          scope: "claude",
          path: symlinkPath,
          kind: "symlink",
          target: nextLinkTarget,
          hash: "",
          templateId: "link",
          adapterVersion: "2.0.0",
        },
      ],
      remove: [],
      tracked: [],
    };

    const result = await applySyncPlan(plan);

    expect(result.created).toBe(0);
    expect(result.updated).toBe(2);
    expect(await fs.readFile(filePath, "utf-8")).toBe("new file");
    expect(await fs.readlink(symlinkPath)).toBe(nextLinkTarget);

    await fs.rm(homeDir, { recursive: true, force: true });
  });
});
