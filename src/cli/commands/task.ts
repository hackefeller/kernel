import type { Command } from "commander";
import {
  archiveTask,
  completeTaskChecklistItem,
  createTask,
  listTasks,
  nextTask,
  planTask,
  restoreTask,
  taskStatus,
} from "../../core/project-os/index.js";
import { printOutput } from "./output.js";

function parseCsv(value?: string): string[] | undefined {
  return value?.split(",").map((item) => item.trim()).filter(Boolean);
}

export function registerTaskCommand(program: Command): void {
  const task = program.command("task").description("Task management under .kernel/work/tasks/");

  task
    .command("new <title>")
    .description("Create a new task")
    .option("--goal <goalId>", "Goal ID")
    .option("--epic <epicId>", "Epic ID")
    .option("--tag <tags>", "Comma-separated tags")
    .option("--knowledge <ids>", "Comma-separated linked knowledge IDs")
    .action(async (title: string, options: { goal?: string; epic?: string; tag?: string; knowledge?: string }) => {
      printOutput(
        await createTask(title, {
          goalId: options.goal,
          epicId: options.epic,
          tags: parseCsv(options.tag),
          linkedKnowledgeIds: parseCsv(options.knowledge),
        }),
        program.opts() as { json?: boolean },
      );
    });

  task.command("plan [taskId]").description("Refresh a task markdown file").action(async (taskId?: string) => {
    printOutput(await planTask(taskId), program.opts() as { json?: boolean });
  });

  task.command("next [taskId]").description("Show the next unchecked checklist item").action(async (taskId?: string) => {
    printOutput(await nextTask(taskId), program.opts() as { json?: boolean });
  });

  task.command("status [taskId]").description("Show status for a task").action(async (taskId?: string) => {
    printOutput(await taskStatus(taskId), program.opts() as { json?: boolean });
  });

  task
    .command("done <checklistItemId>")
    .description("Mark a checklist item complete in the active task")
    .option("--task <taskId>", "Task ID")
    .action(async (checklistItemId: string, options: { task?: string }) => {
      printOutput(
        await completeTaskChecklistItem(checklistItemId, options.task),
        program.opts() as { json?: boolean },
      );
    });

  task
    .command("list")
    .description("List tasks")
    .option("--archived", "List archived tasks instead of active tasks")
    .action(async (options: { archived?: boolean }) => {
      printOutput(await listTasks({ archived: options.archived }), program.opts() as { json?: boolean });
    });

  task.command("archive [taskId]").description("Archive a completed task").action(async (taskId?: string) => {
    printOutput(await archiveTask(taskId), program.opts() as { json?: boolean });
  });

  task.command("restore <taskId>").description("Restore an archived task").action(async (taskId: string) => {
    printOutput(await restoreTask(taskId), program.opts() as { json?: boolean });
  });
}
