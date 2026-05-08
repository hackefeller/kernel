import { afterEach, describe, expect, it } from "bun:test";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import { parseFrontmatter } from "../../templates/frontmatter.js";
import {
  archiveTask,
  completeTaskChecklistItem,
  createGoal,
  createKnowledge,
  createTask,
  initializeWorkspace,
  listKnowledge,
  listTasks,
  nextTask,
  restoreTask,
  taskStatus,
} from "../index.js";

async function mkTmpDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "workspace-test-"));
}

async function listNames(dir: string): Promise<string[]> {
  return (await fs.readdir(dir)).sort();
}

describe(".kernel workspace", () => {
  let tmpDir = "";

  afterEach(async () => {
    if (tmpDir) {
      await fs.rm(tmpDir, { recursive: true, force: true });
      tmpDir = "";
    }
  });

  it("initializes committed docs and ignored local state", async () => {
    tmpDir = await mkTmpDir();
    await fs.writeFile(path.join(tmpDir, "package.json"), '{"name":"kernel-test"}');

    const result = await initializeWorkspace(tmpDir);

    expect(result.kernelDir).toBe(".kernel");
    expect(result.readmePath).toBe(".kernel/README.md");
    expect(await fs.readFile(path.join(tmpDir, ".kernel", ".gitignore"), "utf-8")).toBe("state.json\n");
    await expect(fs.stat(path.join(tmpDir, ".kernel", "README.md"))).resolves.toBeDefined();
    await expect(fs.stat(path.join(tmpDir, ".kernel", "state.json"))).resolves.toBeDefined();
    await expect(fs.stat(path.join(tmpDir, ".kernel", "work", "tasks", "active"))).resolves.toBeDefined();
    await expect(fs.stat(path.join(tmpDir, ".kernel", "knowledge", "notes"))).resolves.toBeDefined();
    await expect(fs.stat(path.join(tmpDir, ".kernel", "knowledge", "guides"))).resolves.toBeDefined();
    await expect(fs.stat(path.join(tmpDir, ".kernel", "knowledge", "reference"))).resolves.toBeDefined();
    await expect(fs.stat(path.join(tmpDir, ".kernel", "knowledge", "learnings"))).resolves.toBeDefined();
  });

  it("creates one markdown file with frontmatter per work record", async () => {
    tmpDir = await mkTmpDir();
    await fs.writeFile(path.join(tmpDir, "package.json"), '{"name":"kernel-test"}');

    const goal = await createGoal("Improve onboarding", {}, tmpDir);
    const task = await createTask("Write setup guide", { goalId: goal.goalId }, tmpDir);

    expect(await listNames(path.join(tmpDir, goal.goalDir))).toEqual(["goal.md"]);
    expect(await listNames(path.join(tmpDir, task.taskDir))).toEqual(["task.md"]);

    const goalMarkdown = await fs.readFile(path.join(tmpDir, goal.goalDir, "goal.md"), "utf-8");
    const taskMarkdown = await fs.readFile(path.join(tmpDir, task.taskDir, "task.md"), "utf-8");

    expect(parseFrontmatter(goalMarkdown).frontmatter).toMatchObject({ id: goal.goalId, title: "Improve onboarding" });
    expect(parseFrontmatter(taskMarkdown).frontmatter).toMatchObject({ id: task.taskId, goalId: goal.goalId });
  });

  it("links knowledge records from tasks", async () => {
    tmpDir = await mkTmpDir();
    await fs.writeFile(path.join(tmpDir, "package.json"), '{"name":"kernel-test"}');

    const note = await createKnowledge("Use SQLite locally", {}, tmpDir);
    const task = await createTask("Wire local storage", { linkedKnowledgeIds: [note.knowledgeId] }, tmpDir);

    expect(await listNames(path.join(tmpDir, ".kernel", "knowledge", "notes", note.knowledgeId))).toEqual([
      "note.md",
    ]);
    expect(await listKnowledge(tmpDir)).toEqual({
      items: [{ id: note.knowledgeId, title: "Use SQLite locally", kind: "note", status: "active" }],
    });
    const noteMarkdown = await fs.readFile(path.join(tmpDir, ".kernel", "knowledge", "notes", note.knowledgeId, "note.md"), "utf-8");
    const taskMarkdown = await fs.readFile(path.join(tmpDir, task.taskDir, "task.md"), "utf-8");
    expect(parseFrontmatter(noteMarkdown).frontmatter).toMatchObject({ id: note.knowledgeId, kind: "note" });
    expect(parseFrontmatter(taskMarkdown).frontmatter).toMatchObject({ linkedKnowledgeIds: [note.knowledgeId] });
  });

  it("updates checklist state and journal inside task.md", async () => {
    tmpDir = await mkTmpDir();
    await fs.writeFile(path.join(tmpDir, "package.json"), '{"name":"kernel-test"}');

    const task = await createTask("Complete checklist", {}, tmpDir);
    expect(await nextTask(undefined, tmpDir)).toMatchObject({
      checklistItemId: "clarify-scope",
      nextTask: "Clarify scope and acceptance criteria",
    });

    const completed = await completeTaskChecklistItem("clarify-scope", undefined, tmpDir);
    expect(completed.remaining).toBe(3);

    const status = await taskStatus(task.taskId, tmpDir);
    expect(status.progress.complete).toBe(1);
    expect(status.nextTask).toBe("Implement the core path");

    const markdown = await fs.readFile(path.join(tmpDir, task.taskDir, "task.md"), "utf-8");
    expect(markdown).toContain("- [x] Clarify scope and acceptance criteria");
    expect(markdown).toContain("Completed checklist item: Clarify scope and acceptance criteria");
  });

  it("archives and restores tasks under .kernel/work/tasks", async () => {
    tmpDir = await mkTmpDir();
    await fs.writeFile(path.join(tmpDir, "package.json"), '{"name":"kernel-test"}');

    const task = await createTask("Archive me", {}, tmpDir);
    const archived = await archiveTask(task.taskId, tmpDir);

    expect(archived.archivedTo).toContain(".kernel/work/tasks/archived/");
    await expect(fs.stat(path.join(tmpDir, archived.archivedTo, "task.md"))).resolves.toBeDefined();
    expect((await listTasks({ archived: true }, tmpDir)).tasks.map((item) => item.id)).toContain(task.taskId);

    const restored = await restoreTask(task.taskId, tmpDir);
    expect(restored.restoredTo).toBe(`.kernel/work/tasks/active/${task.taskId}`);
    expect((await listTasks({}, tmpDir)).currentTaskId).toBe(task.taskId);
  });
});
