import { afterEach, describe, expect, it } from "bun:test";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import { doctorKernel } from "../doctor.js";
import { initializeKernel } from "../init.js";
import { saveBrainConfig } from "../config.js";
import { syncKernelBrain } from "../sync.js";

async function mkTmpDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "brain-test-"));
}

describe("brain v2", () => {
  let homeDir = "";

  afterEach(async () => {
    if (homeDir) {
      await fs.rm(homeDir, { recursive: true, force: true });
      homeDir = "";
    }
  });

  it("initializes the local brain and syncs enabled hosts", async () => {
    homeDir = await mkTmpDir();
    await fs.mkdir(path.join(homeDir, ".codex"), { recursive: true });

    const init = await initializeKernel(homeDir);
    expect(init.enabledHosts).toContain("codex");

    const skillPath = path.join(homeDir, ".agents", "skills", "kernel-build", "SKILL.md");
    expect(await fs.stat(skillPath)).toBeDefined();

    const linkedSkillPath = path.join(homeDir, ".codex", "skills", "kernel-build");
    const linkStats = await fs.lstat(linkedSkillPath);
    expect(linkStats.isSymbolicLink()).toBe(true);

    const sync = await syncKernelBrain(homeDir);
    expect(sync.hosts.length).toBeGreaterThan(0);
    expect(sync.hosts.some((host) => host.host === "codex")).toBe(true);

    const doctor = await doctorKernel(homeDir);
    expect(doctor.issues.filter((issue) => issue.level === "error")).toHaveLength(0);
  });

  it("syncs the local ~/.kernel/brain catalog into ~/.agents when present", async () => {
    homeDir = await mkTmpDir();
    await saveBrainConfig(
      { version: "2.0.0", hosts: ["pi"], packages: ["local-pack"] },
      homeDir,
    );

    const brainRoot = path.join(homeDir, ".kernel", "brain");
    await fs.mkdir(path.join(brainRoot, "skills", "kernel-local-skill", "references"), { recursive: true });
    await fs.mkdir(path.join(brainRoot, "commands"), { recursive: true });
    await fs.mkdir(path.join(brainRoot, "packages"), { recursive: true });

    await fs.writeFile(
      path.join(brainRoot, "skills", "kernel-local-skill", "SKILL.md"),
      `---\nname: kernel-local-skill\ndescription: Local brain skill\n---\n\nUse the local brain.\n`,
      "utf-8",
    );
    await fs.writeFile(
      path.join(brainRoot, "skills", "kernel-local-skill", "references", "checklist.md"),
      "- local reference\n",
      "utf-8",
    );
    await fs.writeFile(
      path.join(brainRoot, "commands", "kernel-local-command.yaml"),
      "name: kernel-local-command\ndescription: Local command\ntarget: sync\n",
      "utf-8",
    );
    await fs.writeFile(
      path.join(brainRoot, "packages", "local-pack.yaml"),
      [
        "id: local-pack",
        "name: Local Pack",
        "skills:",
        "  - kernel-local-skill",
        "commands:",
        "  - kernel-local-command",
      ].join("\n"),
      "utf-8",
    );

    const result = await syncKernelBrain(homeDir);
    expect(result.hosts.some((host) => host.host === "catalog")).toBe(true);

    const catalogSkillPath = path.join(homeDir, ".agents", "skills", "kernel-local-skill", "SKILL.md");
    const catalogReferencePath = path.join(
      homeDir,
      ".agents",
      "skills",
      "kernel-local-skill",
      "references",
      "checklist.md",
    );
    const catalogCommandPath = path.join(homeDir, ".agents", "commands", "kernel-local-command.yaml");
    const bundledSkillPath = path.join(homeDir, ".agents", "skills", "kernel-build", "SKILL.md");

    expect(await fs.readFile(catalogSkillPath, "utf-8")).toContain("Local brain skill");
    expect(await fs.readFile(catalogReferencePath, "utf-8")).toContain("local reference");
    expect(await fs.readFile(catalogCommandPath, "utf-8")).toContain("kernel-local-command");
    await expect(fs.stat(bundledSkillPath)).rejects.toThrow();

    const linkedSkillPath = path.join(homeDir, ".pi", "skills", "kernel-local-skill");
    expect((await fs.lstat(linkedSkillPath)).isSymbolicLink()).toBe(true);
    expect(await fs.readlink(linkedSkillPath)).toBe(path.join(homeDir, ".agents", "skills", "kernel-local-skill"));
    expect(await fs.readFile(path.join(homeDir, ".pi", "commands", "kernel-local-command.md"), "utf-8")).toContain(
      "Local command",
    );
  });
});
