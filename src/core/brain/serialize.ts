import * as yaml from "yaml";
import { VALID_TAGS, type AgentHandoff, type AgentTemplate, type SkillTemplate, type TemplateTag } from "../templates/types.js";
import { parseFrontmatter } from "../templates/frontmatter.js";

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const items = value.filter((item): item is string => typeof item === "string" && item.length > 0);
  return items.length > 0 ? items : undefined;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTemplateTag(value: string): value is TemplateTag {
  return new Set<string>(VALID_TAGS).has(value);
}

function readTags(value: unknown): TemplateTag[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const validTags: TemplateTag[] = [];
  for (const tag of value) {
    if (typeof tag === "string" && isTemplateTag(tag)) {
      validTags.push(tag);
    }
  }
  return validTags.length > 0 ? validTags : undefined;
}

function readTemplateMetadata(value: unknown): SkillTemplate["metadata"] | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const metadata = {
    author: readString(value.author),
    version: readString(value.version),
    category: readString(value.category),
    tags: stringArray(value.tags),
  };
  return metadata.author || metadata.version || metadata.category || metadata.tags ? metadata : undefined;
}

function readAgentPermissionMode(value: unknown): AgentTemplate["permissionMode"] {
  if (value === "default" || value === "acceptEdits" || value === "dontAsk" || value === "bypassPermissions" || value === "plan") {
    return value;
  }
  return undefined;
}

function readAgentSandboxMode(value: unknown): AgentTemplate["sandboxMode"] {
  if (value === "read-only" || value === "workspace-write" || value === "danger-full-access") {
    return value;
  }
  return undefined;
}

function readAgentReasoningEffort(value: unknown): AgentTemplate["reasoningEffort"] {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }
  return undefined;
}

function readAgentMemory(value: unknown): AgentTemplate["memory"] {
  if (value === "user" || value === "project" || value === "local") {
    return value;
  }
  return undefined;
}

export function serializeAgentTemplate(template: AgentTemplate): string {
  const frontmatter = {
    name: template.name,
    kind: template.kind,
    tags: template.tags,
    description: template.description,
    license: template.license,
    compatibility: template.compatibility,
    metadata: template.metadata,
    role: template.role,
    route: template.route,
    capabilities: template.capabilities,
    availableSkills: template.availableSkills,
    defaultTools: template.defaultTools,
    allowedTools: template.allowedTools,
    acceptanceChecks: template.acceptanceChecks,
    argumentHint: template.argumentHint,
    model: template.model,
    permissionMode: template.permissionMode,
    sandboxMode: template.sandboxMode,
    reasoningEffort: template.reasoningEffort,
    disallowedTools: template.disallowedTools,
    maxTurns: template.maxTurns,
    memory: template.memory,
    handoffs: template.handoffs,
  };
  return `---\n${yaml.stringify(frontmatter).trim()}\n---\n\n${template.instructions.trim()}\n`;
}

export function parseAgentDocument(content: string): AgentTemplate {
  const { frontmatter, body } = parseFrontmatter(content);
  return {
    name: readString(frontmatter.name) ?? "kernel-agent",
    kind: "agent",
    tags: readTags(frontmatter.tags),
    description: readString(frontmatter.description) ?? "Kernel agent",
    instructions: body,
    license: readString(frontmatter.license),
    compatibility: readString(frontmatter.compatibility),
    role: readString(frontmatter.role),
    route: readString(frontmatter.route),
    capabilities: stringArray(frontmatter.capabilities),
    availableSkills: stringArray(frontmatter.availableSkills),
    defaultTools: stringArray(frontmatter.defaultTools),
    allowedTools: stringArray(frontmatter.allowedTools),
    acceptanceChecks: stringArray(frontmatter.acceptanceChecks),
    argumentHint: readString(frontmatter.argumentHint),
    model: readString(frontmatter.model),
    permissionMode: readAgentPermissionMode(frontmatter.permissionMode),
    sandboxMode: readAgentSandboxMode(frontmatter.sandboxMode),
    reasoningEffort: readAgentReasoningEffort(frontmatter.reasoningEffort),
    disallowedTools: stringArray(frontmatter.disallowedTools),
    maxTurns: typeof frontmatter.maxTurns === "number" ? frontmatter.maxTurns : undefined,
    memory: readAgentMemory(frontmatter.memory),
    handoffs: Array.isArray(frontmatter.handoffs)
      ? frontmatter.handoffs.filter(
          (handoff): handoff is AgentHandoff =>
            isRecord(handoff) &&
            typeof handoff.label === "string" &&
            typeof handoff.agent === "string" &&
            (handoff.prompt === undefined || typeof handoff.prompt === "string") &&
            (handoff.send === undefined || typeof handoff.send === "boolean") &&
            (handoff.model === undefined || typeof handoff.model === "string"),
        )
      : undefined,
  };
}

export function parseSkillDocument(content: string): SkillTemplate {
  const { frontmatter, body } = parseFrontmatter(content);
  return {
    name: readString(frontmatter.name) ?? "kernel-skill",
    kind: "skill",
    tags: readTags(frontmatter.tags),
    description: readString(frontmatter.description) ?? "",
    instructions: body,
    license: readString(frontmatter.license),
    compatibility: readString(frontmatter.compatibility),
    metadata: readTemplateMetadata(frontmatter.metadata),
    when: stringArray(frontmatter.when),
    applicability: stringArray(frontmatter.applicability),
    termination: stringArray(frontmatter.termination),
    outputs: stringArray(frontmatter.outputs),
    dependencies: stringArray(frontmatter.dependencies),
    role: readString(frontmatter.role),
    capabilities: stringArray(frontmatter.capabilities),
    availableSkills: stringArray(frontmatter.availableSkills),
    route: readString(frontmatter.route),
    disableModelInvocation: frontmatter.disableModelInvocation === true,
    userInvocable:
      typeof frontmatter.userInvocable === "boolean" ? frontmatter.userInvocable : undefined,
    argumentHint: readString(frontmatter.argumentHint),
    allowedTools: stringArray(frontmatter.allowedTools),
  };
}
