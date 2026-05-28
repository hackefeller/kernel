/**
 * Pi (pi-coding-agent) adapter
 *
 * Formats Pi-facing resources for Pi — a minimal terminal coding harness.
 *
 * Directory conventions (Pi docs / Agent Skills standard):
 * - Skills:          ~/.agents/skills/<name>/SKILL.md (Pi discovers these directly)
 * - Prompt templates: ~/.pi/agent/prompts/<name>.md
 *
 * Pi implements the Agent Skills standard and scans directories to discover skills.
 * Skills are loaded on-demand based on description matching.
 *
 * References:
 * - https://github.com/badlogic/pi-coding-agent
 * - https://agentskills.io/specification
 * - https://pi.dev
 */

import path from "path";
import type { ToolCommandAdapter } from "./types.js";
import type { CommandTemplate, SkillTemplate } from "../templates/types.js";
import {
  closeSkillFrontmatter,
  formatBaseSkillFrontmatter,
  formatManifestContent,
  formatPromptTemplate,
} from "./shared.js";

export const piAdapter: ToolCommandAdapter = {
  toolId: "pi",
  toolName: "Pi",
  skillsDir: ".pi",
  // Pi discovers shared Agent Skills locations directly, including ~/.agents/skills,
  // so we keep Kernel skills canonical there instead of mirroring duplicates into .pi.
  mirrorSkills: false,

  getSkillPath(skillName: string): string {
    return path.join(".pi", "skills", skillName, "SKILL.md");
  },

  getCommandPath(commandName: string): string {
    return path.join(".pi", "agent", "prompts", `${commandName}.md`);
  },

  formatSkill(template: SkillTemplate, version: string): string {
    // Pi uses the Agent Skills standard - keep frontmatter minimal
    // but include essential fields: name, description, license, compatibility, metadata
    return closeSkillFrontmatter(
      formatBaseSkillFrontmatter(template, version),
      template.instructions,
    );
  },

  formatCommand(template: CommandTemplate, _version: string): string {
    return formatPromptTemplate(template);
  },

  getManifestPath(): string {
    // Kept only so the sync cleanup can remove legacy mirrored layouts.
    return path.join(".pi", "skills-index.md");
  },

  formatManifest(skills: SkillTemplate[], version: string): string {
    return formatManifestContent(skills, version);
  },
};
