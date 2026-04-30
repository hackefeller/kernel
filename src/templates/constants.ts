/**
 * Template Constants
 *
 * Single source of truth for all template identifiers.
 * When updating a name, update it here and rebuild.
 *
 * All identifiers include the KERNEL_TEMPLATE_PREFIX and are defined with
 * full prefix as they appear in generated files.
 *
 * SKILL_NAMES: Complete skill identifiers (includes prefix)
 * AGENT_NAMES: Complete agent identifiers (includes prefix)
 * COMMAND_NAMES: Complete command identifiers (includes prefix)
 */

export const KERNEL_TEMPLATE_PREFIX = "kernel-";

export function prefixKernelTemplateName(name: string): string {
  return name.startsWith(KERNEL_TEMPLATE_PREFIX) ? name : `${KERNEL_TEMPLATE_PREFIX}${name}`;
}

// =============================================================================
// Skill Names (must include prefix as defined in skill templates)
// =============================================================================
export const SKILL_NAMES = {
  // Git skills
  GIT: prefixKernelTemplateName("git"),

  // Engineering skills
  PROJECT_SETUP: prefixKernelTemplateName("project-setup"),
  DOCS: prefixKernelTemplateName("docs"),
  PROJECT_INIT: prefixKernelTemplateName("project-init"),
  BUILD: prefixKernelTemplateName("build"),
  LOCATE: prefixKernelTemplateName("locate"),

  // Workflow skills
  APPLY: prefixKernelTemplateName("apply"),
  ARCHIVE: prefixKernelTemplateName("archive"),
  BOARD: prefixKernelTemplateName("board"),
  CLOSE: prefixKernelTemplateName("close"),
  EXECUTE: prefixKernelTemplateName("execute"),
  INTAKE: prefixKernelTemplateName("intake"),
  PLAN: prefixKernelTemplateName("plan"),
  PROPOSE: prefixKernelTemplateName("propose"),
  INVESTIGATE: prefixKernelTemplateName("investigate"),
  REVIEW: prefixKernelTemplateName("review"),
  SHIP: prefixKernelTemplateName("ship"),
  STATUS: prefixKernelTemplateName("status"),
  SYNC: prefixKernelTemplateName("sync"),
  TRIAGE: prefixKernelTemplateName("triage"),
  UNBLOCK: prefixKernelTemplateName("unblock"),
  // Specialist skills
  API_ARCHITECTURE: prefixKernelTemplateName("api-architecture"),
  ASSET_INTEGRATION_SECURITY: prefixKernelTemplateName("asset-integration-security"),
  AUTH_CONTRACT: prefixKernelTemplateName("auth-contract"),
  DATABASE: prefixKernelTemplateName("database"),
  DOCKER: prefixKernelTemplateName("docker"),
  PDF: prefixKernelTemplateName("pdf"),
  REACT: prefixKernelTemplateName("react"),
  TESTING: prefixKernelTemplateName("testing"),
  TYPESCRIPT_ARCHITECTURE: prefixKernelTemplateName("typescript-architecture"),
  // Mobile skills
  REACT_NATIVE: prefixKernelTemplateName("react-native"),

  // Design skills
  DESIGN: prefixKernelTemplateName("design"),
  // Ecosystem skills
  SKILL_BUILDER: prefixKernelTemplateName("skill-builder"),
} as const;

export const AGENT_NAMES = {
  ARCHITECT: prefixKernelTemplateName("architect"),
  CAPTURE: prefixKernelTemplateName("capture"),
  DESIGNER: prefixKernelTemplateName("designer"),
  DO: prefixKernelTemplateName("do"),
  GIT: prefixKernelTemplateName("git"),
  PLAN: prefixKernelTemplateName("plan"),
  REVIEW: prefixKernelTemplateName("review"),
  SEARCH: prefixKernelTemplateName("search"),
} as const;

export const COMMAND_NAMES = {
  INIT: prefixKernelTemplateName("init"),
  SYNC: prefixKernelTemplateName("sync"),
  DOCTOR: prefixKernelTemplateName("doctor"),
  GH_PR_ERRORS: prefixKernelTemplateName("gh-pr-errors"),
  GOAL_NEW: prefixKernelTemplateName("goal-new"),
  GOAL_PLAN: prefixKernelTemplateName("goal-plan"),
  GOAL_STATUS: prefixKernelTemplateName("goal-status"),
  GOAL_LIST: prefixKernelTemplateName("goal-list"),
  GOAL_DONE: prefixKernelTemplateName("goal-done"),
  EPIC_NEW: prefixKernelTemplateName("epic-new"),
  EPIC_PLAN: prefixKernelTemplateName("epic-plan"),
  EPIC_STATUS: prefixKernelTemplateName("epic-status"),
  EPIC_LIST: prefixKernelTemplateName("epic-list"),
  EPIC_DONE: prefixKernelTemplateName("epic-done"),
  TASK_NEW: prefixKernelTemplateName("task-new"),
  TASK_PLAN: prefixKernelTemplateName("task-plan"),
  TASK_NEXT: prefixKernelTemplateName("task-next"),
  TASK_DONE: prefixKernelTemplateName("task-done"),
  TASK_STATUS: prefixKernelTemplateName("task-status"),
  TASK_ARCHIVE: prefixKernelTemplateName("task-archive"),
  TASK_LIST: prefixKernelTemplateName("task-list"),
  TASK_RESTORE: prefixKernelTemplateName("task-restore"),
  DECISION_NEW: prefixKernelTemplateName("decision-new"),
  DECISION_LIST: prefixKernelTemplateName("decision-list"),
  DECISION_STATUS: prefixKernelTemplateName("decision-status"),
  RESEARCH_NEW: prefixKernelTemplateName("research-new"),
  RESEARCH_LIST: prefixKernelTemplateName("research-list"),
  RESEARCH_STATUS: prefixKernelTemplateName("research-status"),
  RUNBOOK_NEW: prefixKernelTemplateName("runbook-new"),
  RUNBOOK_LIST: prefixKernelTemplateName("runbook-list"),
  CONCEPT_NEW: prefixKernelTemplateName("concept-new"),
  CONCEPT_LIST: prefixKernelTemplateName("concept-list"),
} as const;
