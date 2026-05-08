import { afterEach, describe, expect, it } from "bun:test";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import { doctorKernel } from "../doctor.js";
import { initializeKernel } from "../init.js";
import { saveCatalogConfig } from "../config.js";
import { syncKernelCatalog } from "../sync.js";

async function mkTmpDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "catalog-test-"));
}

describe("catalog v2", () => {
  let homeDir = "";

  afterEach(async () => {
    if (homeDir) {
      await fs.rm(homeDir, { recursive: true, force: true });
      homeDir = "";
    }
  });

  it("initializes the local catalog and syncs enabled hosts", async () => {
    homeDir = await mkTmpDir();
    await fs.mkdir(path.join(homeDir, ".codex"), { recursive: true });

    const init = await initializeKernel(homeDir);
    expect(init.enabledHosts).toContain("codex");

    const skillPath = path.join(homeDir, ".agents", "skills", "kernel-build", "SKILL.md");
    expect(await fs.stat(skillPath)).toBeDefined();

    const linkedSkillPath = path.join(homeDir, ".codex", "skills", "kernel-build");
    const linkStats = await fs.lstat(linkedSkillPath);
    expect(linkStats.isSymbolicLink()).toBe(true);

    const sync = await syncKernelCatalog(homeDir);
    expect(sync.hosts.length).toBeGreaterThan(0);
    expect(sync.hosts.some((host) => host.host === "codex")).toBe(true);

    const doctor = await doctorKernel(homeDir);
    expect(doctor.issues.filter((issue) => issue.level === "error")).toHaveLength(0);
  });

  it("syncs the local ~/.kernel/catalog catalog into ~/.agents when present", async () => {
    homeDir = await mkTmpDir();
    await saveCatalogConfig(
      { version: "2.0.0", hosts: ["pi"], packages: ["local-pack"] },
      homeDir,
    );

    const catalogRoot = path.join(homeDir, ".kernel", "catalog");
    await fs.mkdir(path.join(catalogRoot, "skills", "kernel-local-skill", "references"), { recursive: true });
    await fs.mkdir(path.join(catalogRoot, "commands"), { recursive: true });
    await fs.mkdir(path.join(catalogRoot, "packages"), { recursive: true });

    await fs.writeFile(
      path.join(catalogRoot, "skills", "kernel-local-skill", "SKILL.md"),
      `---\nname: kernel-local-skill\ndescription: Local catalog skill\n---\n\nUse the local catalog.\n`,
      "utf-8",
    );
    await fs.writeFile(
      path.join(catalogRoot, "skills", "kernel-local-skill", "references", "checklist.md"),
      "- local reference\n",
      "utf-8",
    );
    await fs.writeFile(
      path.join(catalogRoot, "commands", "kernel-local-command.yaml"),
      "name: kernel-local-command\ndescription: Local command\ntarget: sync\n",
      "utf-8",
    );
    await fs.writeFile(
      path.join(catalogRoot, "packages", "local-pack.yaml"),
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

    const result = await syncKernelCatalog(homeDir);
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

    expect(await fs.readFile(catalogSkillPath, "utf-8")).toContain("Local catalog skill");
    expect(await fs.readFile(catalogReferencePath, "utf-8")).toContain("local reference");
    expect(await fs.readFile(catalogCommandPath, "utf-8")).toContain("kernel-local-command");
    await expect(fs.stat(bundledSkillPath)).rejects.toThrow();

    await expect(fs.stat(path.join(homeDir, ".pi", "skills"))).rejects.toThrow();
    await expect(fs.stat(path.join(homeDir, ".pi", "skills", "kernel-local-skill"))).rejects.toThrow();
    await expect(fs.stat(path.join(homeDir, ".pi", "skills-index.md"))).rejects.toThrow();
    expect(await fs.readFile(path.join(homeDir, ".pi", "agent", "prompts", "kernel-local-command.md"), "utf-8")).toContain(
      "Local command",
    );
    await expect(fs.stat(path.join(homeDir, ".pi", "commands"))).rejects.toThrow();
  });
});
