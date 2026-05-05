import { afterEach, describe, expect, it } from "bun:test";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import {
  archiveTask,
  completeTaskChecklistItem,
  createEpic,
  createGoal,
  createKnowledge,
  createTask,
  initializeProjectOs,
  listKnowledge,
  listTasks,
  nextTask,
  restoreTask,
  taskStatus,
} from "../index.js";

async function mkTmpDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "project-os-test-"));
}

async function listNames(dir: string): Promise<string[]> {
  return (await fs.readdir(dir)).sort();
}

describe(".kernel project OS", () => {
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

    const result = await initializeProjectOs(tmpDir);

    expect(result.kernelDir).toBe(".kernel");
    expect(await fs.readFile(path.join(tmpDir, ".kernel", ".gitignore"), "utf-8")).toBe("state/\n");
    await expect(fs.stat(path.join(tmpDir, ".kernel", "README.md"))).resolves.toBeDefined();
    await expect(fs.stat(path.join(tmpDir, ".kernel", "project.md"))).resolves.toBeDefined();
    await expect(fs.stat(path.join(tmpDir, ".kernel", "work", "tasks", "active"))).resolves.toBeDefined();
    await expect(fs.stat(path.join(tmpDir, ".kernel", "knowledge", "research"))).resolves.toBeDefined();
  });

  it("creates one markdown file plus one yaml file per work record", async () => {
    tmpDir = await mkTmpDir();
    await fs.writeFile(path.join(tmpDir, "package.json"), '{"name":"kernel-test"}');

    const goal = await createGoal("Improve onboarding", {}, tmpDir);
    const epic = await createEpic("Document setup path", { goalId: goal.goalId }, tmpDir);
    const task = await createTask("Write setup guide", { epicId: epic.epicId }, tmpDir);

    expect(await listNames(path.join(tmpDir, goal.goalDir))).toEqual(["goal.md", "goal.yaml"]);
    expect(await listNames(path.join(tmpDir, epic.epicDir))).toEqual(["epic.md", "epic.yaml"]);
    expect(await listNames(path.join(tmpDir, task.taskDir))).toEqual(["task.md", "task.yaml"]);

    const taskYaml = await fs.readFile(path.join(tmpDir, task.taskDir, "task.yaml"), "utf-8");
    expect(taskYaml).toContain(`epicId: ${epic.epicId}`);
    expect(taskYaml).toContain(`goalId: ${goal.goalId}`);
  });

  it("links knowledge records from tasks", async () => {
    tmpDir = await mkTmpDir();
    await fs.writeFile(path.join(tmpDir, "package.json"), '{"name":"kernel-test"}');

    const research = await createKnowledge("research", "Use SQLite locally", {}, tmpDir);
    const task = await createTask("Wire local storage", { linkedKnowledgeIds: [research.knowledgeId] }, tmpDir);

    expect(await listNames(path.join(tmpDir, ".kernel", "knowledge", "research", research.knowledgeId))).toEqual([
      "research.md",
      "research.yaml",
    ]);
    expect(await listKnowledge("research", tmpDir)).toEqual({
      items: [{ id: research.knowledgeId, title: "Use SQLite locally", kind: "research", status: "active" }],
    });
    const taskMarkdown = await fs.readFile(path.join(tmpDir, task.taskDir, "task.md"), "utf-8");
    expect(taskMarkdown).toContain(research.knowledgeId);
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
