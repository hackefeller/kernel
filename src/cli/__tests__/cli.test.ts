import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import packageJson from "../../../package.json";
import { getBuiltInCatalog } from "../../core/catalog/catalog.js";
import { saveCatalogConfig } from "../../core/catalog/config.js";
import { syncKernelCatalog } from "../../core/catalog/sync.js";


async function mkTmpDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "cli-test-"));
}

describe("kernel sync", () => {
  let homeDir: string;

  beforeEach(async () => {
    homeDir = await mkTmpDir();
    await saveCatalogConfig({ version: "2.0.0", hosts: ["claude", "codex", "copilot", "pi"] }, homeDir);
  });

  afterEach(async () => {
    await fs.rm(homeDir, { recursive: true, force: true });
  });

  it("syncs canonical .agents catalog and enabled hosts", async () => {
    const originalCwd = process.cwd();
    const projectDir = await mkTmpDir();
    process.chdir(projectDir);

    try {
      const staleSkillContents = "stale";
      const skillName = getBuiltInCatalog().skills[0]!.name;

      const canonicalSkillPath = path.join(homeDir, ".agents", "skills", skillName, "SKILL.md");
      const canonicalCommandPath = path.join(homeDir, ".agents", "commands", "kernel-sync.yaml");
      const unrelatedFile = path.join(homeDir, ".claude", "notes.txt");

      await fs.mkdir(path.dirname(canonicalSkillPath), { recursive: true });
      await fs.mkdir(path.dirname(unrelatedFile), { recursive: true });
      await fs.writeFile(canonicalSkillPath, staleSkillContents, "utf-8");
      await fs.writeFile(unrelatedFile, "keep me", "utf-8");

      const result = await syncKernelCatalog(homeDir);

      expect(result.catalogPath).toBe(path.join(homeDir, ".agents"));

      expect((await fs.stat(canonicalSkillPath)).isFile()).toBe(true);
      expect(await fs.readFile(canonicalSkillPath, "utf-8")).not.toBe(staleSkillContents);
      expect((await fs.stat(canonicalCommandPath)).isFile()).toBe(true);
      const claudeKernelCommandPath = path.join(homeDir, ".claude", "commands", "kernel", "kernel-sync.md");
      expect((await fs.stat(claudeKernelCommandPath)).isFile()).toBe(true);
      expect(await fs.readFile(unrelatedFile, "utf-8")).toBe("keep me");

      const claudeSkillLink = path.join(homeDir, ".claude", "skills", skillName);
      const codexSkillLink = path.join(homeDir, ".codex", "skills", skillName);
      const copilotSkillLink = path.join(homeDir, ".copilot", "skills", skillName);
      const piSkillLink = path.join(homeDir, ".pi", "skills", skillName);

      expect((await fs.lstat(claudeSkillLink)).isSymbolicLink()).toBe(true);
      expect(await fs.readlink(claudeSkillLink)).toBe(path.join(homeDir, ".agents", "skills", skillName));
      expect((await fs.lstat(codexSkillLink)).isSymbolicLink()).toBe(true);
      expect((await fs.lstat(copilotSkillLink)).isSymbolicLink()).toBe(true);
      await expect(fs.lstat(piSkillLink)).rejects.toThrow();

      // agents directory is intentionally empty — all former agents are now commands
      const agentsDir = path.join(homeDir, ".agents", "agents");
      const agentEntries = await fs.readdir(agentsDir).catch(() => []);
      expect(agentEntries).toHaveLength(0);
    } finally {
      process.chdir(originalCwd);
      await fs.rm(projectDir, { recursive: true, force: true });
    }
  });

  it("removes stale legacy workflow skills and commands from enabled hosts", async () => {
    const staleSkillDir = path.join(homeDir, ".claude", "skills");
    const staleCommandDir = path.join(homeDir, ".claude", "commands", "kernel");
    await fs.mkdir(staleSkillDir, { recursive: true });
    await fs.mkdir(staleCommandDir, { recursive: true });
    await fs.symlink(
      path.join(homeDir, ".agents", "skills", "kernel-openspec-explore"),
      path.join(staleSkillDir, "kernel-openspec-explore"),
      "dir",
    );
    await fs.writeFile(path.join(staleCommandDir, "kernel-spec-plan.md"), "legacy", "utf-8");

    const result = await syncKernelCatalog(homeDir, { verbose: true });

    await expect(fs.lstat(path.join(staleSkillDir, "kernel-openspec-explore"))).rejects.toThrow();
    await expect(fs.lstat(path.join(staleCommandDir, "kernel-spec-plan.md"))).rejects.toThrow();

    const claudeResult = result.hosts.find((host) => host.host === "claude");
    expect(claudeResult?.removedPaths).toContain(path.join(staleSkillDir, "kernel-openspec-explore"));
    expect(claudeResult?.removedPaths).toContain(path.join(staleCommandDir, "kernel-spec-plan.md"));
  });

  it("preserves codex system skills while removing stale kernel-managed entries", async () => {
    const systemSkillPath = path.join(
      homeDir,
      ".codex",
      "skills",
      ".system",
      "skill-creator",
      "SKILL.md",
    );
    const staleKernelSkillPath = path.join(homeDir, ".codex", "skills", "kernel-obsolete");
    const staleKernelCommandPath = path.join(homeDir, ".codex", "commands", "kernel-obsolete.md");
    const nonKernelCommandPath = path.join(homeDir, ".codex", "commands", "teammate.md");

    await fs.mkdir(path.dirname(systemSkillPath), { recursive: true });
    await fs.mkdir(path.dirname(staleKernelSkillPath), { recursive: true });
    await fs.mkdir(path.dirname(staleKernelCommandPath), { recursive: true });
    await fs.writeFile(systemSkillPath, "system skill", "utf-8");
    await fs.symlink(path.join(homeDir, ".agents", "skills", "kernel-build"), staleKernelSkillPath, "dir");
    await fs.writeFile(staleKernelCommandPath, "stale kernel command", "utf-8");
    await fs.writeFile(nonKernelCommandPath, "keep me", "utf-8");

    const result = await syncKernelCatalog(homeDir, { verbose: true });

    expect(await fs.readFile(systemSkillPath, "utf-8")).toBe("system skill");
    expect(await fs.readFile(nonKernelCommandPath, "utf-8")).toBe("keep me");
    await expect(fs.lstat(staleKernelSkillPath)).rejects.toThrow();
    await expect(fs.lstat(staleKernelCommandPath)).rejects.toThrow();

    const codexResult = result.hosts.find((host) => host.host === "codex");
    expect(codexResult?.removedPaths).toContain(staleKernelSkillPath);
    expect(codexResult?.removedPaths).toContain(staleKernelCommandPath);
    expect(codexResult?.removedPaths).not.toContain(systemSkillPath);
    expect(codexResult?.removedPaths).not.toContain(nonKernelCommandPath);
  });
});

describe("program", () => {
  it("registers the kernel workflow command surface", async () => {
    const { program } = await import("../index.js");
    const commandNames = new Set(program.commands.map((command) => command.name()));

    expect(commandNames.has("sync")).toBe(true);
    expect(commandNames.has("doctor")).toBe(true);
    expect(commandNames.has("host")).toBe(true);
    expect(commandNames.has("goal")).toBe(true);
    expect(commandNames.has("task")).toBe(true);
    expect(commandNames.has("knowledge")).toBe(true);
    expect(program.options.some((option) => option.long === "--json")).toBe(true);
    expect(
      program.commands
        .find((command) => command.name() === "sync")
        ?.options.some((option) => option.long === "--verbose"),
    ).toBe(true);
    expect(program.version()).toBe(packageJson.version);
  });
});
