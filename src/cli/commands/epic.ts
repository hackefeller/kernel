import type { Command } from "commander";
import {
  createEpic,
  doneEpic,
  epicStatus,
  listEpics,
  planEpic,
} from "../../core/project-os/index.js";
import { printOutput } from "./output.js";

function parseCsv(value?: string): string[] | undefined {
  return value?.split(",").map((item) => item.trim()).filter(Boolean);
}

export function registerEpicCommand(program: Command): void {
  const epic = program.command("epic").description("Epic management under .kernel/work/epics/");

  epic
    .command("new <title>")
    .description("Create a new epic")
    .option("--goal <goalId>", "Goal ID")
    .option("--target-date <date>", "Target completion date (e.g. 2026-06-30)")
    .option("--tag <tags>", "Comma-separated tags")
    .option("--knowledge <ids>", "Comma-separated linked knowledge IDs")
    .action(async (title: string, options: { goal?: string; targetDate?: string; tag?: string; knowledge?: string }) => {
      printOutput(
        await createEpic(title, {
          goalId: options.goal,
          targetDate: options.targetDate,
          tags: parseCsv(options.tag),
          linkedKnowledgeIds: parseCsv(options.knowledge),
        }),
        program.opts() as { json?: boolean },
      );
    });

  epic.command("plan [epicId]").description("Refresh an epic markdown file").action(async (epicId?: string) => {
    printOutput(await planEpic(epicId), program.opts() as { json?: boolean });
  });

  epic.command("status [epicId]").description("Show status for an epic").action(async (epicId?: string) => {
    printOutput(await epicStatus(epicId), program.opts() as { json?: boolean });
  });

  epic.command("list").description("List epics").action(async () => {
    printOutput(await listEpics(), program.opts() as { json?: boolean });
  });

  epic.command("done [epicId]").description("Mark an epic as done").action(async (epicId?: string) => {
    printOutput(await doneEpic(epicId), program.opts() as { json?: boolean });
  });
}
