import { describe, expect, it } from "bun:test";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { loadTemplateRegistry, parseAgentTemplate, parseCommandTemplate, parseSkillTemplate, resetTemplateRegistryCache } from "../index.js";
import { resolveCatalog } from "../resolver.js";

async function mkTmpDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "kernel-registry-test-"));
}

describe("template registry", () => {
  const registry = loadTemplateRegistry();

  it("discovers skills and commands from disk", () => {
    expect(registry.skills.some((template) => template.name === "kernel-review")).toBe(true);
    expect(
      registry.skills.find((template) => template.name === "kernel-project")?.references?.some(
        (reference) => reference.relativePath === "references/scaffold.md",
      ),
    ).toBe(true);
    // kernel-plan is now a command, not an agent
    expect(registry.commands.some((template) => template.name === "kernel-plan")).toBe(true);
    expect(registry.commands.some((template) => template.name === "kernel-task-plan")).toBe(true);
    expect(registry.commands.some((template) => template.name === "kernel-goal-new")).toBe(true);
    expect(registry.agents).toHaveLength(0);
  });

  it("resolves catalog with all templates", () => {
    const catalog = resolveCatalog(registry);
    expect(catalog.skills.length).toBeGreaterThan(0);
    expect(catalog.agents).toHaveLength(0);
    expect(catalog.commands.length).toBeGreaterThan(0);
  });

  it("rejects invalid skill metadata enums", () => {
    const content = `---
name: kernel-bad-skill
description: bad
profile: invalid
---
body`;

    expect(() => parseSkillTemplate("skill.md", content)).toThrow("Invalid profile in skill.md");
  });

  it("rejects invalid agent execution metadata", () => {
    const content = `---
name: kernel-bad-agent
description: bad
permissionMode: nope
handoffs:
  - label: Missing agent
---
body`;

    expect(() => parseAgentTemplate("agent.md", content)).toThrow();
  });

  it("rejects invalid command grouping", () => {
    const content = `---
name: kernel-bad-command
description: bad
group: invalid
---
body`;

    expect(() => parseCommandTemplate("command.md", content)).toThrow("Invalid group in command.md");
  });

  it("loads templates when cwd is outside the repo", async () => {
    const originalCwd = process.cwd();
    const tmpDir = await mkTmpDir();
    process.chdir(tmpDir);
    resetTemplateRegistryCache();

    try {
      const registry = loadTemplateRegistry();
      expect(registry.skills.some((template) => template.name === "kernel-review")).toBe(true);
      expect(
        registry.skills.find((template) => template.name === "kernel-project")?.references?.some(
          (reference) => reference.relativePath === "references/scaffold.md",
        ),
      ).toBe(true);
      expect(registry.agents).toHaveLength(0);
    } finally {
      process.chdir(originalCwd);
      resetTemplateRegistryCache();
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });
});
