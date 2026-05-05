import { describe, expect, it } from "bun:test";
import { AGENT_NAMES, COMMAND_NAMES, SKILL_NAMES } from "../../../templates/constants.js";
import type { AgentTemplate, SkillTemplate } from "../../templates/types.js";
import {
  claudeAdapter,
  codexAdapter,
  githubCopilotAdapter,
  piAdapter,
  type ToolCommandAdapter,
} from "../index.js";

const allAdapters: ToolCommandAdapter[] = [
  claudeAdapter,
  codexAdapter,
  githubCopilotAdapter,
  piAdapter,
];

const testSkillTemplate: SkillTemplate = {
  name: "planner",
  kind: "skill",
  tags: ["workflow", "planning"],
  description: "Planning agent",
  instructions: "You are a planner agent.",
  license: "MIT",
  compatibility: "Works with the CLI",
  metadata: {
    author: "project",
    version: "1.0.0",
    category: "Orchestration",
    tags: ["planning"],
  },
};

const testAgentTemplate: AgentTemplate = {
  name: AGENT_NAMES.PLAN,
  kind: "agent",
  tags: ["workflow", "planning"],
  description: "Pre-implementation planning agent",
  instructions: "You are a planning agent.",
  license: "MIT",
  compatibility: "Works with all workflows",
  metadata: { author: "project", version: "1.0", category: "Orchestration", tags: ["planning"] },
  defaultTools: ["read", "search"],
  availableSkills: [SKILL_NAMES.GIT, SKILL_NAMES.DESIGN],
};

const nativeAgentSupport: Record<string, boolean> = {
  claude: true,
  codex: true,
  copilot: true,
  pi: false,
};

describe("Adapter Registry", () => {
  it("has all 4 adapters", () => {
    expect(allAdapters).toHaveLength(4);
  });

  it("each adapter has unique toolId", () => {
    const toolIds = allAdapters.map((a) => a.toolId);
    const uniqueIds = new Set(toolIds);
    expect(uniqueIds.size).toBe(4);
  });

  it("native agent support is explicit and consistent", () => {
    for (const adapter of allAdapters) {
      const supportsAgents = Boolean(adapter.getAgentPath && adapter.formatAgent);
      expect(supportsAgents).toBe(nativeAgentSupport[adapter.toolId]);
    }
  });

  it("never exposes only one half of native agent support", () => {
    for (const adapter of allAdapters) {
      expect(Boolean(adapter.getAgentPath)).toBe(Boolean(adapter.formatAgent));
    }
  });
});

describe("Pi Adapter", () => {
  it("uses .pi directory", () => {
    expect(piAdapter.skillsDir).toBe(".pi");
  });

  it("generates correct skill path", () => {
    const path = piAdapter.getSkillPath("planner");
    expect(path).toBe(".pi/skills/planner/SKILL.md");
  });

  it("formats skill with frontmatter", () => {
    const result = piAdapter.formatSkill(testSkillTemplate, "1.0.0");
    expect(result).toContain("---");
    expect(result).toContain("name: planner");
    expect(result).toContain("description: Planning agent");
    expect(result).toContain('generatedBy: "1.0.0"');
  });
});

describe("Claude Adapter", () => {
  it("uses .claude directory", () => {
    expect(claudeAdapter.skillsDir).toBe(".claude");
  });

  it("generates correct skill path", () => {
    const path = claudeAdapter.getSkillPath("planner");
    expect(path).toBe(".claude/skills/planner/SKILL.md");
  });
});

describe("GitHub Copilot Adapter", () => {
  it("uses .github directory", () => {
    expect(githubCopilotAdapter.skillsDir).toBe(".github");
  });

  it("generates correct skill path", () => {
    const path = githubCopilotAdapter.getSkillPath("planner");
    expect(path).toBe(".github/skills/planner/SKILL.md");
  });
});

// ============================================================================
// Claude adapter — detailed formatting
// ============================================================================

describe("Claude formatAgent", () => {
  it("includes name, description, and tools fields", () => {
    const result = claudeAdapter.formatAgent!(testAgentTemplate, "1.0.0");
    expect(result).toContain("name:");
    expect(result).toContain("description:");
    expect(result).toContain("tools:");
    // model defaults to inherit — not emitted unless template sets it
    expect(result).not.toContain("model: sonnet");
  });

  it("emits model field only when template specifies one", () => {
    const withModel = claudeAdapter.formatAgent!(
      { ...testAgentTemplate, model: "sonnet" },
      "1.0.0",
    );
    expect(withModel).toContain("model: sonnet");
    const withoutModel = claudeAdapter.formatAgent!(testAgentTemplate, "1.0.0");
    expect(withoutModel).not.toContain("model:");
  });

  it("maps read → Read", () => {
    const result = claudeAdapter.formatAgent!(
      { ...testAgentTemplate, defaultTools: ["read"] },
      "1.0.0",
    );
    expect(result).toContain("Read");
  });

  it("maps search → Grep, Glob", () => {
    const result = claudeAdapter.formatAgent!(
      { ...testAgentTemplate, defaultTools: ["search"] },
      "1.0.0",
    );
    expect(result).toContain("Grep");
    expect(result).toContain("Glob");
  });

  it("maps edit → Edit, Write", () => {
    const result = claudeAdapter.formatAgent!(
      { ...testAgentTemplate, defaultTools: ["edit"] },
      "1.0.0",
    );
    expect(result).toContain("Edit");
    expect(result).toContain("Write");
  });

  it("maps web → WebSearch, WebFetch", () => {
    const result = claudeAdapter.formatAgent!(
      { ...testAgentTemplate, defaultTools: ["web"] },
      "1.0.0",
    );
    expect(result).toContain("WebSearch");
    expect(result).toContain("WebFetch");
  });

  it("maps task → Bash", () => {
    const result = claudeAdapter.formatAgent!(
      { ...testAgentTemplate, defaultTools: ["task"] },
      "1.0.0",
    );
    expect(result).toContain("Bash");
  });

  it("falls back to Read, Grep, Glob when defaultTools is empty", () => {
    const result = claudeAdapter.formatAgent!({ ...testAgentTemplate, defaultTools: [] }, "1.0.0");
    expect(result).toContain("Read, Grep, Glob");
  });

  it("falls back to Read, Grep, Glob when defaultTools is undefined", () => {
    const { defaultTools: _, ...rest } = testAgentTemplate;
    const result = claudeAdapter.formatAgent!(rest, "1.0.0");
    expect(result).toContain("Read, Grep, Glob");
  });

  it("includes instructions in body", () => {
    const result = claudeAdapter.formatAgent!(testAgentTemplate, "1.0.0");
    expect(result).toContain("You are a planning agent.");
  });

  it("maps availableSkills to skills: YAML frontmatter", () => {
    const result = claudeAdapter.formatAgent!(testAgentTemplate, "1.0.0");
    const frontmatter = result.split("---")[1];
    expect(frontmatter).toContain("skills:");
    expect(frontmatter).toContain(SKILL_NAMES.GIT);
    expect(frontmatter).toContain(SKILL_NAMES.DESIGN);
  });

  it("does not add ## Available skills section to agent body", () => {
    // skills are preloaded via skills: frontmatter; a body section is redundant
    const result = claudeAdapter.formatAgent!(testAgentTemplate, "1.0.0");
    const body = result.split("---")[2];
    expect(body).not.toContain("## Available skills");
  });

  it("omits skills: frontmatter when availableSkills is empty", () => {
    const result = claudeAdapter.formatAgent!(
      { ...testAgentTemplate, availableSkills: [] },
      "1.0.0",
    );
    const frontmatter = result.split("---")[1];
    expect(frontmatter).not.toContain("skills:");
  });

  it("emits permissionMode when set", () => {
    const result = claudeAdapter.formatAgent!(
      { ...testAgentTemplate, permissionMode: "acceptEdits" },
      "1.0.0",
    );
    expect(result).toContain("permissionMode: acceptEdits");
  });

  it("emits disallowedTools when set", () => {
    const result = claudeAdapter.formatAgent!(
      { ...testAgentTemplate, disallowedTools: ["Write", "Edit"] },
      "1.0.0",
    );
    expect(result).toContain("disallowedTools: Write, Edit");
  });
});

describe("Claude getAgentPath", () => {
  it("returns .claude/agents/<name>.md", () => {
    expect(claudeAdapter.getAgentPath!(AGENT_NAMES.PLAN)).toBe(".claude/agents/kernel-plan.md");
    expect(claudeAdapter.getAgentPath!(AGENT_NAMES.REVIEW)).toBe(".claude/agents/kernel-review.md");
  });
});

// ============================================================================
// Codex adapter — TOML agent format
// ============================================================================

describe("Codex formatAgent", () => {
  it("uses .codex/agents/<name>.toml path", () => {
    expect(codexAdapter.getAgentPath!(AGENT_NAMES.PLAN)).toBe(".codex/agents/kernel-plan.toml");
    expect(codexAdapter.getAgentPath!(AGENT_NAMES.REVIEW)).toBe(".codex/agents/kernel-review.toml");
  });

  it("generates TOML with name and description", () => {
    const result = codexAdapter.formatAgent!(testAgentTemplate, "1.0.0");
    expect(result).toContain(`name = "${AGENT_NAMES.PLAN}"`);
    expect(result).toContain('description = "Pre-implementation planning agent"');
  });

  it("outputs instructions as TOML developer_instructions multiline string", () => {
    const result = codexAdapter.formatAgent!(testAgentTemplate, "1.0.0");
    // Must be valid TOML — no backtick fences
    expect(result).not.toContain("```");
    expect(result).toContain('developer_instructions = """');
    expect(result).toContain("You are a planning agent.");
  });

  it("maps availableSkills to [[skills.config]] entries", () => {
    const result = codexAdapter.formatAgent!(testAgentTemplate, "1.0.0");
    expect(result).toContain("[[skills.config]]");
    expect(result).toContain(`.codex/skills/${SKILL_NAMES.GIT}/SKILL.md`);
    expect(result).toContain(`.codex/skills/${SKILL_NAMES.DESIGN}/SKILL.md`);
  });

  it("emits model_reasoning_effort when reasoningEffort is set", () => {
    const result = codexAdapter.formatAgent!(
      { ...testAgentTemplate, reasoningEffort: "high" },
      "1.0.0",
    );
    expect(result).toContain('model_reasoning_effort = "high"');
  });

  it("omits model_reasoning_effort when not set", () => {
    const result = codexAdapter.formatAgent!(testAgentTemplate, "1.0.0");
    expect(result).not.toContain("model_reasoning_effort");
  });

  it("omits [[skills.config]] when availableSkills is empty", () => {
    const result = codexAdapter.formatAgent!(
      { ...testAgentTemplate, availableSkills: [] },
      "1.0.0",
    );
    expect(result).not.toContain("[[skills.config]]");
  });
});

describe("Codex formatSkill", () => {
  it("uses .codex/skills/<name>/SKILL.md path", () => {
    expect(codexAdapter.getSkillPath(SKILL_NAMES.GIT)).toBe(
      ".codex/skills/kernel-git/SKILL.md",
    );
  });

  it("includes name and description in frontmatter", () => {
    const result = codexAdapter.formatSkill(testSkillTemplate, "1.0.0");
    expect(result).toContain("name: planner");
    expect(result).toContain("description: Planning agent");
  });

  it("includes generatedBy version", () => {
    const result = codexAdapter.formatSkill(testSkillTemplate, "1.0.0");
    expect(result).toContain('generatedBy: "1.0.0"');
  });
});

// ============================================================================
// GitHub Copilot adapter — .agent.md format
// ============================================================================

// ============================================================================
// Skill frontmatter — new behavioral fields
// ============================================================================

describe("formatSkill — userInvocable field", () => {
  it("emits user-invocable: false when userInvocable is false", () => {
    const result = claudeAdapter.formatSkill(
      { ...testSkillTemplate, userInvocable: false },
      "1.0.0",
    );
    expect(result).toContain("user-invocable: false");
  });

  it("does not emit user-invocable when userInvocable is true", () => {
    const result = claudeAdapter.formatSkill(
      { ...testSkillTemplate, userInvocable: true },
      "1.0.0",
    );
    expect(result).not.toContain("user-invocable");
  });

  it("does not emit user-invocable when userInvocable is undefined", () => {
    const result = claudeAdapter.formatSkill(testSkillTemplate, "1.0.0");
    expect(result).not.toContain("user-invocable");
  });
});

describe("formatSkill — argumentHint field", () => {
  it("emits argument-hint when argumentHint is set", () => {
    const result = claudeAdapter.formatSkill(
      { ...testSkillTemplate, argumentHint: "issue URL or description" },
      "1.0.0",
    );
    expect(result).toContain("argument-hint: issue URL or description");
  });

  it("does not emit argument-hint when argumentHint is absent", () => {
    const result = claudeAdapter.formatSkill(testSkillTemplate, "1.0.0");
    expect(result).not.toContain("argument-hint");
  });
});

describe("formatSkill — allowedTools field", () => {
  it("emits allowed-tools as comma-separated list", () => {
    const result = claudeAdapter.formatSkill(
      { ...testSkillTemplate, allowedTools: ["Read", "Grep", "Glob"] },
      "1.0.0",
    );
    expect(result).toContain("allowed-tools: Read, Grep, Glob");
  });

  it("does not emit allowed-tools when allowedTools is empty array", () => {
    const result = claudeAdapter.formatSkill(
      { ...testSkillTemplate, allowedTools: [] },
      "1.0.0",
    );
    expect(result).not.toContain("allowed-tools");
  });

  it("does not emit allowed-tools when allowedTools is undefined", () => {
    const result = claudeAdapter.formatSkill(testSkillTemplate, "1.0.0");
    expect(result).not.toContain("allowed-tools");
  });
});

describe("formatSkill — field ordering", () => {
  it("emits disable-model-invocation before user-invocable", () => {
    const result = claudeAdapter.formatSkill(
      { ...testSkillTemplate, disableModelInvocation: true, userInvocable: false },
      "1.0.0",
    );
    const dmiPos = result.indexOf("disable-model-invocation");
    const uiPos = result.indexOf("user-invocable");
    expect(dmiPos).toBeLessThan(uiPos);
  });

});

describe("GitHub Copilot formatAgent", () => {
  it("uses .github/agents/<name>.agent.md path", () => {
    expect(githubCopilotAdapter.getAgentPath!(AGENT_NAMES.PLAN)).toBe(
      ".github/agents/kernel-plan.agent.md",
    );
    expect(githubCopilotAdapter.getAgentPath!(AGENT_NAMES.REVIEW)).toBe(
      ".github/agents/kernel-review.agent.md",
    );
  });

  it("generates YAML frontmatter with name and description", () => {
    const result = githubCopilotAdapter.formatAgent!(testAgentTemplate, "1.0.0");
    const frontmatter = result.split("---")[1];
    expect(frontmatter).toContain(`name: ${AGENT_NAMES.PLAN}`);
    expect(frontmatter).toContain("description:");
  });

  it("emits model field when template specifies one", () => {
    const withModel = githubCopilotAdapter.formatAgent!(
      { ...testAgentTemplate, model: "Claude Opus 4.5" },
      "1.0.0",
    );
    expect(withModel).toContain("model: Claude Opus 4.5");
  });

  it("omits model field when not set", () => {
    const result = githubCopilotAdapter.formatAgent!(testAgentTemplate, "1.0.0");
    expect(result).not.toContain("model:");
  });

  it("maps availableSkills to ## Available skills in body", () => {
    const result = githubCopilotAdapter.formatAgent!(testAgentTemplate, "1.0.0");
    const body = result.split("---")[2];
    expect(body).toContain("## Available skills");
    expect(body).toContain(`- ${SKILL_NAMES.GIT}`);
    expect(body).toContain(`- ${SKILL_NAMES.DESIGN}`);
  });

  it("omits ## Available skills when availableSkills is empty", () => {
    const result = githubCopilotAdapter.formatAgent!(
      { ...testAgentTemplate, availableSkills: [] },
      "1.0.0",
    );
    const body = result.split("---")[2];
    expect(body).not.toContain("## Available skills");
  });

  it("includes acceptance checks in body when present", () => {
    const result = githubCopilotAdapter.formatAgent!(
      { ...testAgentTemplate, acceptanceChecks: ["All tasks done", "Tests pass"] },
      "1.0.0",
    );
    expect(result).toContain("## Acceptance checks");
    expect(result).toContain("- All tasks done");
    expect(result).toContain("- Tests pass");
  });

  it("emits tools as YAML array when allowedTools is set", () => {
    const result = githubCopilotAdapter.formatAgent!(
      { ...testAgentTemplate, allowedTools: ["Read", "Grep", "Glob"] },
      "1.0.0",
    );
    const frontmatter = result.split("---")[1];
    expect(frontmatter).toContain("tools: [Read, Grep, Glob]");
    expect(frontmatter).not.toContain("allowed-tools:");
  });

  it("omits tools when allowedTools is empty", () => {
    const result = githubCopilotAdapter.formatAgent!(
      { ...testAgentTemplate, allowedTools: [] },
      "1.0.0",
    );
    const frontmatter = result.split("---")[1];
    expect(frontmatter).not.toContain("tools:");
  });

  it("emits handoffs when defined", () => {
    const result = githubCopilotAdapter.formatAgent!(
      {
        ...testAgentTemplate,
        handoffs: [
          {
            label: "Start Execution",
            agent: "kernel-do",
            prompt: "Execute the plan.",
            send: false,
          },
        ],
      },
      "1.0.0",
    );
    const frontmatter = result.split("---")[1];
    expect(frontmatter).toContain("handoffs:");
    expect(frontmatter).toContain("label: Start Execution");
    expect(frontmatter).toContain("agent: kernel-do");
    expect(frontmatter).toContain("prompt: Execute the plan.");
    expect(frontmatter).toContain("send: false");
  });

  it("omits handoffs when not defined", () => {
    const result = githubCopilotAdapter.formatAgent!(testAgentTemplate, "1.0.0");
    expect(result).not.toContain("handoffs:");
  });
});

describe("GitHub Copilot formatSkill — behavioral fields", () => {
  it("emits disable-model-invocation when set", () => {
    const result = githubCopilotAdapter.formatSkill(
      { ...testSkillTemplate, disableModelInvocation: true },
      "1.0.0",
    );
    expect(result).toContain("disable-model-invocation: true");
  });

  it("emits user-invocable: false when set", () => {
    const result = githubCopilotAdapter.formatSkill(
      { ...testSkillTemplate, userInvocable: false },
      "1.0.0",
    );
    expect(result).toContain("user-invocable: false");
  });

  it("emits argument-hint when set", () => {
    const result = githubCopilotAdapter.formatSkill(
      { ...testSkillTemplate, argumentHint: "issue URL" },
      "1.0.0",
    );
    expect(result).toContain("argument-hint: issue URL");
  });

  it("emits allowed-tools when set", () => {
    const result = githubCopilotAdapter.formatSkill(
      { ...testSkillTemplate, allowedTools: ["Read", "Grep"] },
      "1.0.0",
    );
    expect(result).toContain("allowed-tools: Read, Grep");
  });
});

describe("GitHub Copilot manifest", () => {
  it("has getManifestPath", () => {
    expect(githubCopilotAdapter.getManifestPath!()).toBe(".github/skills-index.md");
  });

  it("generates manifest content", () => {
    const result = githubCopilotAdapter.formatManifest!([testSkillTemplate], "1.0.0");
    expect(result).toContain("# Skills Index");
    expect(result).toContain("## planner");
    expect(result).toContain("**Description**: Planning agent");
  });
});

describe("COMMAND_NAMES", () => {
  it("all command names have kernel- prefix", () => {
    const values = Object.values(COMMAND_NAMES);
    expect(values.length).toBeGreaterThan(0);
    for (const cmd of values) {
      expect(cmd).toStartWith("kernel-");
    }
  });

  it("all command names are unique", () => {
    const values = Object.values(COMMAND_NAMES);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });

  it("expected commands are defined", () => {
    expect(COMMAND_NAMES.SYNC).toBe("kernel-sync");
    expect(COMMAND_NAMES.DOCTOR).toBe("kernel-doctor");
    expect(COMMAND_NAMES.GH_PR_ERRORS).toBe("kernel-gh-pr-errors");
  });
});
