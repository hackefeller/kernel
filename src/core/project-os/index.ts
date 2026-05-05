import { cp, rename } from "fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import * as yaml from "yaml";
import {
  directoryExists,
  ensureDir,
  fileExists,
  listDirs,
  readFile,
  removeDir,
  writeFile,
} from "../utils/file-system.js";
import { slugify } from "../utils/slugify.js";
import type {
  ChecklistItem,
  EpicRecord,
  GoalRecord,
  KnowledgeKind,
  KnowledgeRecord,
  ProjectOsLayout,
  TaskRecord,
} from "./types.js";

const RECORD_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function assertValidProjectOsId(id: string, label = "recordId"): string {
  if (!RECORD_ID_PATTERN.test(id)) {
    throw new Error(`Invalid ${label}: ${id}`);
  }
  return id;
}

async function findProjectRoot(startDir: string): Promise<string> {
  let currentDir = resolve(startDir);
  while (true) {
    if (
      (await directoryExists(join(currentDir, ".git"))) ||
      (await fileExists(join(currentDir, "package.json")))
    ) {
      return currentDir;
    }
    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      return resolve(startDir);
    }
    currentDir = parentDir;
  }
}

export async function resolveProjectOs(startDir = process.cwd()): Promise<ProjectOsLayout> {
  const rootDir = await findProjectRoot(startDir);
  const kernelDir = join(rootDir, ".kernel");
  const workDir = join(kernelDir, "work");
  const knowledgeDir = join(kernelDir, "knowledge");
  const stateDir = join(kernelDir, "state");
  return {
    rootDir,
    kernelDir,
    readmePath: join(kernelDir, "README.md"),
    projectPath: join(kernelDir, "project.md"),
    gitignorePath: join(kernelDir, ".gitignore"),
    goalsDir: join(workDir, "goals"),
    epicsDir: join(workDir, "epics"),
    activeTasksDir: join(workDir, "tasks", "active"),
    archivedTasksDir: join(workDir, "tasks", "archived"),
    knowledgeDir,
    researchDir: join(knowledgeDir, "research"),
    runbooksDir: join(knowledgeDir, "runbooks"),
    conceptsDir: join(knowledgeDir, "concepts"),
    stateDir,
    pointersPath: join(stateDir, "pointers.json"),
  };
}

async function ensureProjectOsLayout(layout: ProjectOsLayout): Promise<void> {
  await ensureDir(layout.goalsDir);
  await ensureDir(layout.epicsDir);
  await ensureDir(layout.activeTasksDir);
  await ensureDir(layout.archivedTasksDir);
  await ensureDir(layout.researchDir);
  await ensureDir(layout.runbooksDir);
  await ensureDir(layout.conceptsDir);
  await ensureDir(layout.stateDir);
}

function renderKernelReadme(): string {
  return `# .kernel

This directory is the committed project operating system for this repository.

## Map

- \`project.md\` - durable project brief, architecture notes, and conventions
- \`work/goals/\` - strategic outcomes
- \`work/epics/\` - coherent deliverables under goals
- \`work/tasks/active/\` - executable work
- \`work/tasks/archived/\` - completed task records
- \`knowledge/research/\` - investigations and findings
- \`knowledge/runbooks/\` - operational procedures
- \`knowledge/concepts/\` - glossary and domain concepts

Only \`state/\` is local runtime state and should stay ignored.
`;
}

function renderProjectBrief(): string {
  return `# Project

## Purpose

<!-- What this repository exists to do. -->

## Architecture

<!-- High-level system shape, key modules, and boundaries. -->

## Conventions

<!-- Local development, testing, release, and documentation conventions. -->

## Current Focus

<!-- Link current goals, epics, and tasks. -->
`;
}

export async function initializeProjectOs(startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  await ensureProjectOsLayout(layout);
  if (!(await fileExists(layout.readmePath))) {
    await writeFile(layout.readmePath, renderKernelReadme());
  }
  if (!(await fileExists(layout.projectPath))) {
    await writeFile(layout.projectPath, renderProjectBrief());
  }
  if (!(await fileExists(layout.gitignorePath))) {
    await writeFile(layout.gitignorePath, "state/\n");
  }
  return {
    kernelDir: relative(layout.rootDir, layout.kernelDir),
    readmePath: relative(layout.rootDir, layout.readmePath),
    projectPath: relative(layout.rootDir, layout.projectPath),
  };
}

function defaultChecklist(): ChecklistItem[] {
  return [
    { id: "clarify-scope", title: "Clarify scope and acceptance criteria", done: false },
    { id: "implement-core-path", title: "Implement the core path", done: false },
    { id: "verify-behavior", title: "Verify behavior", done: false },
    { id: "capture-knowledge", title: "Capture knowledge and follow-ups", done: false },
  ];
}

async function writePointers(layout: ProjectOsLayout, currentTaskId: string | null): Promise<void> {
  await writeFile(layout.pointersPath, JSON.stringify({ currentTaskId }, null, 2));
}

async function readPointers(layout: ProjectOsLayout): Promise<{ currentTaskId: string | null }> {
  if (!(await fileExists(layout.pointersPath))) {
    return { currentTaskId: null };
  }
  return JSON.parse(await readFile(layout.pointersPath)) as { currentTaskId: string | null };
}

async function nextUniqueId(parentDir: string, title: string, fallback: string): Promise<string> {
  const baseId = slugify(title) || fallback;
  let id = baseId;
  const existing = new Set(await listDirs(parentDir));
  let index = 2;
  while (existing.has(id)) {
    id = `${baseId}-${index}`;
    index += 1;
  }
  return id;
}

function renderLinkList(ids: string[] | undefined): string {
  if (!ids || ids.length === 0) {
    return "- None yet";
  }
  return ids.map((id) => `- ${id}`).join("\n");
}

function renderGoalMarkdown(record: GoalRecord): string {
  return `# ${record.title}

## Summary

<!-- Strategic outcome or direction this goal represents. -->

## Context

<!-- Why this matters now and what problem it solves. -->

## Success Criteria

- [ ] <!-- Measurable outcome -->
- [ ] <!-- Observable signal -->

## Epics

<!-- Link related epic ids in delivery order. -->

## Linked Knowledge

${renderLinkList(record.linkedKnowledgeIds)}

## Journal

- ${record.createdAt}: Created goal \`${record.id}\`.
`;
}

function renderEpicMarkdown(record: EpicRecord): string {
  return `# ${record.title}

## Summary

<!-- Coherent deliverable or phase this epic produces. -->

## Context

<!-- Parent goal, constraints, and why this epic is sequenced here. -->

## Acceptance Criteria

- [ ] <!-- Deliverable or state that can be verified -->
- [ ] <!-- Testable completion signal -->

## Plan

<!-- Approach, sequencing, risks, and validation. -->

## Tasks

<!-- Link task ids in execution order. -->

## Linked Knowledge

${renderLinkList(record.linkedKnowledgeIds)}

## Journal

- ${record.createdAt}: Created epic \`${record.id}\`.
`;
}

function renderTaskMarkdown(record: TaskRecord): string {
  const checklist = record.checklist.map((item) => `- [${item.done ? "x" : " "}] ${item.title}`).join("\n");
  return `# ${record.title}

## Summary

<!-- Executable unit of work and intended outcome. -->

## Context

<!-- Parent goal/epic, relevant constraints, and current state. -->

## Acceptance Criteria

- [ ] <!-- Specific, observable criterion -->
- [ ] <!-- Test, behavior, or artifact that proves completion -->

## Plan

<!-- Implementation approach, risks, validation, and rollback notes. -->

## Checklist

${checklist}

## Linked Knowledge

${renderLinkList(record.linkedKnowledgeIds)}

## Journal

- ${record.createdAt}: Created task \`${record.id}\`.
`;
}

function renderKnowledgeMarkdown(record: KnowledgeRecord): string {
  const heading = record.kind.charAt(0).toUpperCase() + record.kind.slice(1);
  return `# ${record.title}

## ${heading}

<!-- Capture the durable knowledge once. Link to it from goals, epics, and tasks. -->

## Context

<!-- Why this exists and what repo areas it affects. -->

## Details

<!-- Decision, finding, procedure, or concept explanation. -->

## Links

${renderLinkList(record.linkedWorkIds)}
`;
}

async function saveGoal(layout: ProjectOsLayout, record: GoalRecord): Promise<void> {
  const root = join(layout.goalsDir, record.id);
  await ensureDir(root);
  await writeFile(join(root, "goal.yaml"), yaml.stringify(record));
  if (!(await fileExists(join(root, "goal.md")))) {
    await writeFile(join(root, "goal.md"), renderGoalMarkdown(record));
  }
}

async function saveEpic(layout: ProjectOsLayout, record: EpicRecord): Promise<void> {
  const root = join(layout.epicsDir, record.id);
  await ensureDir(root);
  await writeFile(join(root, "epic.yaml"), yaml.stringify(record));
  if (!(await fileExists(join(root, "epic.md")))) {
    await writeFile(join(root, "epic.md"), renderEpicMarkdown(record));
  }
}

async function saveTask(layout: ProjectOsLayout, record: TaskRecord): Promise<void> {
  const root = join(layout.activeTasksDir, record.id);
  await ensureDir(root);
  await writeFile(join(root, "task.yaml"), yaml.stringify(record));
  if (!(await fileExists(join(root, "task.md")))) {
    await writeFile(join(root, "task.md"), renderTaskMarkdown(record));
  }
}

async function saveKnowledge(layout: ProjectOsLayout, record: KnowledgeRecord): Promise<void> {
  const root = join(knowledgeDirForKind(layout, record.kind), record.id);
  await ensureDir(root);
  await writeFile(join(root, `${record.kind}.yaml`), yaml.stringify(record));
  if (!(await fileExists(join(root, `${record.kind}.md`)))) {
    await writeFile(join(root, `${record.kind}.md`), renderKnowledgeMarkdown(record));
  }
}

async function loadGoal(layout: ProjectOsLayout, goalId: string): Promise<GoalRecord> {
  const safeId = assertValidProjectOsId(goalId, "goalId");
  return yaml.parse(await readFile(join(layout.goalsDir, safeId, "goal.yaml"))) as GoalRecord;
}

async function loadEpic(layout: ProjectOsLayout, epicId: string): Promise<EpicRecord> {
  const safeId = assertValidProjectOsId(epicId, "epicId");
  return yaml.parse(await readFile(join(layout.epicsDir, safeId, "epic.yaml"))) as EpicRecord;
}

async function loadTask(layout: ProjectOsLayout, taskId: string): Promise<TaskRecord> {
  const safeId = assertValidProjectOsId(taskId, "taskId");
  const root = join(layout.activeTasksDir, safeId);
  const record = yaml.parse(await readFile(join(root, "task.yaml"))) as TaskRecord;
  const markdownPath = join(root, "task.md");
  if (await fileExists(markdownPath)) {
    const parsedChecklist = parseChecklist(await readFile(markdownPath), record.checklist);
    if (parsedChecklist.length > 0) {
      record.checklist = parsedChecklist;
    }
  }
  return record;
}

function parseChecklist(markdown: string, stored: ChecklistItem[]): ChecklistItem[] {
  const checklistSection = markdown.split("\n## Checklist\n")[1]?.split(/\n## /)[0] ?? "";
  const storedBySlug = new Map<string, ChecklistItem>();
  for (const item of stored ?? []) {
    storedBySlug.set(item.id, item);
    storedBySlug.set(slugify(item.title), item);
  }
  return checklistSection
    .split("\n")
    .map((line) => line.match(/^- \[( |x)\] (.+)$/i))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map((match) => {
      const title = match[2];
      const slug = slugify(title);
      const storedItem = storedBySlug.get(slug);
      const done = match[1].toLowerCase() === "x";
      return {
        id: storedItem?.id ?? slug,
        title,
        done,
        completedAt: done ? storedItem?.completedAt : undefined,
      };
    });
}

function matchesChecklistIdentifier(item: ChecklistItem, normalized: string): boolean {
  return item.id === normalized || slugify(item.title) === normalized;
}

async function resolveGoalId(layout: ProjectOsLayout, goalId?: string): Promise<string> {
  if (goalId) {
    return assertValidProjectOsId(goalId, "goalId");
  }
  const ids = (await listDirs(layout.goalsDir)).sort();
  if (ids.length === 0) {
    throw new Error("No goals found. Run `kernel goal new <title>` to create one.");
  }
  if (ids.length === 1) {
    return ids[0];
  }
  const active = (await Promise.all(ids.map(async (id) => {
    try {
      return await loadGoal(layout, id);
    } catch {
      return null;
    }
  }))).filter((record): record is GoalRecord => record !== null && record.status === "active")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (active.length > 0) {
    return active[0].id;
  }
  throw new Error(`Multiple goals found. Pass a goal ID: ${ids.join(", ")}`);
}

async function resolveEpicId(layout: ProjectOsLayout, epicId?: string): Promise<string> {
  if (epicId) {
    return assertValidProjectOsId(epicId, "epicId");
  }
  const ids = (await listDirs(layout.epicsDir)).sort();
  if (ids.length === 0) {
    throw new Error("No epics found. Run `kernel epic new <title>` to create one.");
  }
  if (ids.length === 1) {
    return ids[0];
  }
  const active = (await Promise.all(ids.map(async (id) => {
    try {
      return await loadEpic(layout, id);
    } catch {
      return null;
    }
  }))).filter((record): record is EpicRecord => record !== null && record.status === "active")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (active.length > 0) {
    return active[0].id;
  }
  throw new Error(`Multiple epics found. Pass an epic ID: ${ids.join(", ")}`);
}

async function resolveTaskId(layout: ProjectOsLayout, taskId?: string): Promise<string> {
  if (taskId) {
    return assertValidProjectOsId(taskId, "taskId");
  }
  const pointers = await readPointers(layout);
  if (pointers.currentTaskId && await directoryExists(join(layout.activeTasksDir, pointers.currentTaskId))) {
    return pointers.currentTaskId;
  }
  const ids = (await listDirs(layout.activeTasksDir)).sort();
  if (ids.length === 0) {
    throw new Error("No active tasks found. Run `kernel task new <title>` to create one.");
  }
  if (ids.length === 1) {
    await writePointers(layout, ids[0]);
    return ids[0];
  }
  const active = (await Promise.all(ids.map(async (id) => {
    try {
      return await loadTask(layout, id);
    } catch {
      return null;
    }
  }))).filter((record): record is TaskRecord => record !== null && record.status === "active")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (active.length > 0) {
    await writePointers(layout, active[0].id);
    return active[0].id;
  }
  throw new Error(`Multiple tasks found. Pass a task ID: ${ids.join(", ")}`);
}

export async function createGoal(title: string, opts: { tags?: string[]; linkedKnowledgeIds?: string[] } = {}, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  await ensureProjectOsLayout(layout);
  const id = await nextUniqueId(layout.goalsDir, title, "goal");
  const now = new Date().toISOString();
  const record: GoalRecord = { id, title, status: "active", tags: opts.tags, linkedKnowledgeIds: opts.linkedKnowledgeIds, createdAt: now, updatedAt: now };
  await saveGoal(layout, record);
  return { goalId: id, goalDir: relative(layout.rootDir, join(layout.goalsDir, id)), markdownPath: relative(layout.rootDir, join(layout.goalsDir, id, "goal.md")) };
}

export async function planGoal(goalId?: string, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  await ensureProjectOsLayout(layout);
  const id = await resolveGoalId(layout, goalId);
  const record = await loadGoal(layout, id);
  record.updatedAt = new Date().toISOString();
  await saveGoal(layout, record);
  return { goalId: id, markdownPath: relative(layout.rootDir, join(layout.goalsDir, id, "goal.md")) };
}

export async function goalStatus(goalId?: string, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  const id = await resolveGoalId(layout, goalId);
  const record = await loadGoal(layout, id);
  return { goalId: id, title: record.title, status: record.status, goalDir: relative(layout.rootDir, join(layout.goalsDir, id)) };
}

export async function listGoals(startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  if (!(await directoryExists(layout.goalsDir))) {
    return { items: [] };
  }
  const items = await Promise.all((await listDirs(layout.goalsDir)).map(async (id) => {
    const record = await loadGoal(layout, id);
    return { id: record.id, title: record.title, status: record.status };
  }));
  return { items };
}

export async function doneGoal(goalId?: string, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  const id = await resolveGoalId(layout, goalId);
  const record = await loadGoal(layout, id);
  const activeEpics: string[] = [];
  for (const epicId of await listDirs(layout.epicsDir)) {
    try {
      const epic = await loadEpic(layout, epicId);
      if (epic.goalId === id && epic.status === "active") {
        activeEpics.push(epicId);
      }
    } catch {
      // skip unreadable records
    }
  }
  const now = new Date().toISOString();
  record.status = "done";
  record.doneAt = now;
  record.updatedAt = now;
  await saveGoal(layout, record);
  return { goalId: id, status: "done", warnings: activeEpics.length > 0 ? [`${activeEpics.length} linked epic(s) are still active: ${activeEpics.join(", ")}`] : undefined };
}

export async function createEpic(title: string, opts: { goalId?: string; targetDate?: string; tags?: string[]; linkedKnowledgeIds?: string[] } = {}, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  await ensureProjectOsLayout(layout);
  if (opts.goalId && !(await fileExists(join(layout.goalsDir, assertValidProjectOsId(opts.goalId, "goalId"), "goal.yaml")))) {
    throw new Error(`Unknown goal: ${opts.goalId}`);
  }
  const id = await nextUniqueId(layout.epicsDir, title, "epic");
  const now = new Date().toISOString();
  const record: EpicRecord = { id, title, status: "active", goalId: opts.goalId, targetDate: opts.targetDate, tags: opts.tags, linkedKnowledgeIds: opts.linkedKnowledgeIds, createdAt: now, updatedAt: now };
  await saveEpic(layout, record);
  return { epicId: id, epicDir: relative(layout.rootDir, join(layout.epicsDir, id)), markdownPath: relative(layout.rootDir, join(layout.epicsDir, id, "epic.md")) };
}

export async function planEpic(epicId?: string, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  await ensureProjectOsLayout(layout);
  const id = await resolveEpicId(layout, epicId);
  const record = await loadEpic(layout, id);
  record.updatedAt = new Date().toISOString();
  await saveEpic(layout, record);
  return { epicId: id, markdownPath: relative(layout.rootDir, join(layout.epicsDir, id, "epic.md")) };
}

export async function epicStatus(epicId?: string, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  const id = await resolveEpicId(layout, epicId);
  const record = await loadEpic(layout, id);
  return { epicId: id, title: record.title, status: record.status, goalId: record.goalId, targetDate: record.targetDate, epicDir: relative(layout.rootDir, join(layout.epicsDir, id)) };
}

export async function listEpics(startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  if (!(await directoryExists(layout.epicsDir))) {
    return { items: [] };
  }
  const items = await Promise.all((await listDirs(layout.epicsDir)).map(async (id) => {
    const record = await loadEpic(layout, id);
    return { id: record.id, title: record.title, status: record.status, goalId: record.goalId };
  }));
  return { items };
}

export async function doneEpic(epicId?: string, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  const id = await resolveEpicId(layout, epicId);
  const record = await loadEpic(layout, id);
  const activeTasks: string[] = [];
  for (const taskId of await listDirs(layout.activeTasksDir)) {
    try {
      const task = await loadTask(layout, taskId);
      if (task.epicId === id && task.status === "active") {
        activeTasks.push(taskId);
      }
    } catch {
      // skip unreadable records
    }
  }
  const now = new Date().toISOString();
  record.status = "done";
  record.doneAt = now;
  record.updatedAt = now;
  await saveEpic(layout, record);
  return { epicId: id, status: "done", warnings: activeTasks.length > 0 ? [`${activeTasks.length} linked task(s) are still active: ${activeTasks.join(", ")}`] : undefined };
}

export async function createTask(title: string, opts: { goalId?: string; epicId?: string; tags?: string[]; linkedKnowledgeIds?: string[] } = {}, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  await ensureProjectOsLayout(layout);
  let goalId = opts.goalId;
  if (opts.epicId) {
    const epic = await loadEpic(layout, opts.epicId);
    goalId = goalId ?? epic.goalId;
  }
  if (goalId && !(await fileExists(join(layout.goalsDir, assertValidProjectOsId(goalId, "goalId"), "goal.yaml")))) {
    throw new Error(`Unknown goal: ${goalId}`);
  }
  const id = await nextUniqueId(layout.activeTasksDir, title, "task");
  const now = new Date().toISOString();
  const record: TaskRecord = { id, title, status: "active", goalId, epicId: opts.epicId, tags: opts.tags, linkedKnowledgeIds: opts.linkedKnowledgeIds, createdAt: now, updatedAt: now, checklist: defaultChecklist() };
  await saveTask(layout, record);
  await writePointers(layout, id);
  return { taskId: id, taskDir: relative(layout.rootDir, join(layout.activeTasksDir, id)), markdownPath: relative(layout.rootDir, join(layout.activeTasksDir, id, "task.md")) };
}

export async function planTask(taskId?: string, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  await ensureProjectOsLayout(layout);
  const id = await resolveTaskId(layout, taskId);
  const record = await loadTask(layout, id);
  record.updatedAt = new Date().toISOString();
  await saveTask(layout, record);
  await writePointers(layout, id);
  return { taskId: id, markdownPath: relative(layout.rootDir, join(layout.activeTasksDir, id, "task.md")) };
}

export async function nextTask(taskId?: string, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  const id = await resolveTaskId(layout, taskId);
  const record = await loadTask(layout, id);
  const nextItem = record.checklist.find((item) => !item.done);
  await writePointers(layout, id);
  return { taskId: id, checklistItemId: nextItem?.id ?? null, nextTask: nextItem?.title ?? null, remaining: record.checklist.filter((item) => !item.done).length };
}

export async function taskStatus(taskId?: string, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  const id = await resolveTaskId(layout, taskId);
  const record = await loadTask(layout, id);
  const complete = record.checklist.filter((item) => item.done).length;
  return { taskId: id, title: record.title, status: record.status, goalId: record.goalId, epicId: record.epicId, progress: { total: record.checklist.length, complete, remaining: record.checklist.length - complete }, nextTask: record.checklist.find((item) => !item.done)?.title ?? null, taskDir: relative(layout.rootDir, join(layout.activeTasksDir, id)) };
}

export async function completeTaskChecklistItem(checklistItemId: string, taskId?: string, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  const id = await resolveTaskId(layout, taskId);
  const record = await loadTask(layout, id);
  const normalized = slugify(checklistItemId);
  if (!normalized) {
    throw new Error(`Unknown checklist item: ${checklistItemId}`);
  }
  const item = record.checklist.find((entry) => matchesChecklistIdentifier(entry, normalized));
  if (!item) {
    throw new Error(`Unknown checklist item: ${checklistItemId}`);
  }
  const now = new Date().toISOString();
  item.done = true;
  item.completedAt = now;
  record.updatedAt = now;
  await saveTask(layout, record);
  await syncTaskMarkdown(layout, id, item);
  await appendTaskJournal(layout, id, `Completed checklist item: ${item.title}`);
  return { taskId: id, completedItem: item.title, remaining: record.checklist.filter((entry) => !entry.done).length };
}

async function syncTaskMarkdown(layout: ProjectOsLayout, taskId: string, completedItem: ChecklistItem): Promise<void> {
  const markdownPath = join(layout.activeTasksDir, taskId, "task.md");
  if (!(await fileExists(markdownPath))) {
    return;
  }
  const lines = (await readFile(markdownPath)).split("\n");
  let updated = false;
  const nextLines = lines.map((line) => {
    if (updated) {
      return line;
    }
    const match = line.match(/^- \[( |x)\] (.+)$/i);
    if (!match) {
      return line;
    }
    const title = match[2];
    if (title !== completedItem.title && slugify(title) !== completedItem.id) {
      return line;
    }
    updated = true;
    return `- [x] ${title}`;
  });
  if (updated) {
    await writeFile(markdownPath, nextLines.join("\n"));
  }
}

async function appendTaskJournal(layout: ProjectOsLayout, taskId: string, entry: string): Promise<void> {
  const markdownPath = join(layout.activeTasksDir, taskId, "task.md");
  if (!(await fileExists(markdownPath))) {
    return;
  }
  const current = await readFile(markdownPath);
  const line = `- ${new Date().toISOString()}: ${entry}`;
  if (current.includes("\n## Journal\n")) {
    await writeFile(markdownPath, current.trimEnd() + "\n" + line + "\n");
  } else {
    await writeFile(markdownPath, current.trimEnd() + "\n\n## Journal\n\n" + line + "\n");
  }
}

export async function listTasks(opts: { archived?: boolean } = {}, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  const baseDir = opts.archived ? layout.archivedTasksDir : layout.activeTasksDir;
  if (!(await directoryExists(baseDir))) {
    return { currentTaskId: opts.archived ? undefined : (await readPointers(layout)).currentTaskId, tasks: [] };
  }
  const tasks = await Promise.all((await listDirs(baseDir)).map(async (dirName) => {
    try {
      const yamlPath = join(baseDir, dirName, "task.yaml");
      const record = yaml.parse(await readFile(yamlPath)) as TaskRecord;
      const complete = (record.checklist ?? []).filter((item) => item.done).length;
      return { id: record.id, title: record.title, status: record.status, goalId: record.goalId, epicId: record.epicId, taskDir: relative(layout.rootDir, join(baseDir, dirName)), progress: { total: (record.checklist ?? []).length, complete, remaining: (record.checklist ?? []).length - complete } };
    } catch {
      return { id: dirName, title: "(unreadable)", status: "archived" as const, taskDir: relative(layout.rootDir, join(baseDir, dirName)), progress: { total: 0, complete: 0, remaining: 0 } };
    }
  }));
  const pointers = await readPointers(layout);
  return opts.archived ? { tasks } : { currentTaskId: pointers.currentTaskId, tasks };
}

async function pathExists(filePath: string): Promise<boolean> {
  return (await fileExists(filePath)) || (await directoryExists(filePath));
}

async function resolveArchiveTarget(layout: ProjectOsLayout, taskId: string): Promise<string> {
  const baseName = `${new Date().toISOString().slice(0, 10)}-${taskId}`;
  let target = join(layout.archivedTasksDir, baseName);
  let index = 2;
  while (await pathExists(target)) {
    target = join(layout.archivedTasksDir, `${baseName}-${index}`);
    index += 1;
  }
  return target;
}

export async function archiveTask(taskId?: string, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  await ensureProjectOsLayout(layout);
  const id = await resolveTaskId(layout, taskId);
  const record = await loadTask(layout, id);
  const incompleteItems = record.checklist.filter((item) => !item.done).map((item) => item.title);
  const now = new Date().toISOString();
  record.status = "archived";
  record.doneAt = now;
  record.updatedAt = now;
  await saveTask(layout, record);
  await appendTaskJournal(layout, id, incompleteItems.length > 0 ? `Archived with ${incompleteItems.length} incomplete checklist item(s): ${incompleteItems.join(", ")}` : "Archived task");
  const source = join(layout.activeTasksDir, id);
  const target = await resolveArchiveTarget(layout, id);
  try {
    await rename(source, target);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "EXDEV") {
      await cp(source, target, { recursive: true });
      await removeDir(source);
    } else {
      throw err;
    }
  }
  const remaining = (await listDirs(layout.activeTasksDir)).sort();
  const pointers = await readPointers(layout);
  if (pointers.currentTaskId === id || pointers.currentTaskId === null) {
    await writePointers(layout, remaining[0] ?? null);
  }
  return { taskId: id, archivedTo: relative(layout.rootDir, target), nextTaskId: remaining[0] ?? null, warnings: incompleteItems.length > 0 ? [`${incompleteItems.length} incomplete checklist item(s) were archived: ${incompleteItems.join(", ")}`] : undefined };
}

export async function restoreTask(taskId: string, startDir = process.cwd()) {
  const safeId = assertValidProjectOsId(taskId, "taskId");
  const layout = await resolveProjectOs(startDir);
  await ensureProjectOsLayout(layout);
  let foundDir: string | null = null;
  for (const dirName of await listDirs(layout.archivedTasksDir)) {
    try {
      const record = yaml.parse(await readFile(join(layout.archivedTasksDir, dirName, "task.yaml"))) as TaskRecord;
      if (record.id === safeId) {
        foundDir = dirName;
        break;
      }
    } catch {
      // skip unreadable records
    }
  }
  if (!foundDir) {
    throw new Error(`No archived task found with id: ${taskId}`);
  }
  const source = join(layout.archivedTasksDir, foundDir);
  const dest = join(layout.activeTasksDir, safeId);
  if (await directoryExists(dest)) {
    throw new Error(`Task ${taskId} already exists in active tasks.`);
  }
  try {
    await rename(source, dest);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "EXDEV") {
      await cp(source, dest, { recursive: true });
      await removeDir(source);
    } else {
      throw err;
    }
  }
  const record = yaml.parse(await readFile(join(dest, "task.yaml"))) as TaskRecord;
  record.status = "active";
  delete record.doneAt;
  record.updatedAt = new Date().toISOString();
  await writeFile(join(dest, "task.yaml"), yaml.stringify(record));
  await appendTaskJournal(layout, safeId, "Restored from archive");
  await writePointers(layout, safeId);
  return { taskId: safeId, restoredTo: relative(layout.rootDir, dest) };
}

function knowledgeDirForKind(layout: ProjectOsLayout, kind: KnowledgeKind): string {
  switch (kind) {
    case "research":
      return layout.researchDir;
    case "runbook":
      return layout.runbooksDir;
    case "concept":
      return layout.conceptsDir;
  }
}

export async function createKnowledge(kind: KnowledgeKind, title: string, opts: { tags?: string[]; linkedWorkIds?: string[] } = {}, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  await ensureProjectOsLayout(layout);
  const parentDir = knowledgeDirForKind(layout, kind);
  const id = await nextUniqueId(parentDir, title, kind);
  const now = new Date().toISOString();
  const record: KnowledgeRecord = { id, title, kind, status: "active", tags: opts.tags, linkedWorkIds: opts.linkedWorkIds, createdAt: now, updatedAt: now };
  await saveKnowledge(layout, record);
  return { [`${kind}Id`]: id, knowledgeId: id, markdownPath: relative(layout.rootDir, join(parentDir, id, `${kind}.md`)), knowledgeDir: relative(layout.rootDir, join(parentDir, id)) };
}

async function loadKnowledge(layout: ProjectOsLayout, kind: KnowledgeKind, id: string): Promise<KnowledgeRecord> {
  const safeId = assertValidProjectOsId(id, `${kind}Id`);
  return yaml.parse(await readFile(join(knowledgeDirForKind(layout, kind), safeId, `${kind}.yaml`))) as KnowledgeRecord;
}

export async function knowledgeStatus(kind: KnowledgeKind, id: string, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  const record = await loadKnowledge(layout, kind, id);
  return { knowledgeId: record.id, [`${kind}Id`]: record.id, title: record.title, kind: record.kind, status: record.status, knowledgeDir: relative(layout.rootDir, join(knowledgeDirForKind(layout, kind), record.id)) };
}

export async function listKnowledge(kind: KnowledgeKind, startDir = process.cwd()) {
  const layout = await resolveProjectOs(startDir);
  const parentDir = knowledgeDirForKind(layout, kind);
  if (!(await directoryExists(parentDir))) {
    return { items: [] };
  }
  const items = await Promise.all((await listDirs(parentDir)).map(async (id) => {
    const record = await loadKnowledge(layout, kind, id);
    return { id: record.id, title: record.title, kind: record.kind, status: record.status };
  }));
  return { items };
}
