import type { Command } from "commander";
import {
  createGoal,
  doneGoal,
  goalStatus,
  listGoals,
  planGoal,
} from "../../core/workspace/index.js";
import { printOutput } from "./output.js";

function parseCsv(value?: string): string[] | undefined {
  return value?.split(",").map((item) => item.trim()).filter(Boolean);
}

export function registerGoalCommand(program: Command): void {
  const goal = program.command("goal").description("Goal management under .kernel/work/goals/");

  goal
    .command("new <title>")
    .description("Create a new goal")
    .option("--tag <tags>", "Comma-separated tags")
    .option("--knowledge <ids>", "Comma-separated linked knowledge IDs")
    .action(async (title: string, options: { tag?: string; knowledge?: string }) => {
      printOutput(
        await createGoal(title, {
          tags: parseCsv(options.tag),
          linkedKnowledgeIds: parseCsv(options.knowledge),
        }),
        program.opts() as { json?: boolean },
      );
    });

  goal.command("plan [goalId]").description("Refresh a goal markdown file").action(async (goalId?: string) => {
    printOutput(await planGoal(goalId), program.opts() as { json?: boolean });
  });

  goal.command("status [goalId]").description("Show status for a goal").action(async (goalId?: string) => {
    printOutput(await goalStatus(goalId), program.opts() as { json?: boolean });
  });

  goal.command("list").description("List goals").action(async () => {
    printOutput(await listGoals(), program.opts() as { json?: boolean });
  });

  goal.command("done [goalId]").description("Mark a goal as done").action(async (goalId?: string) => {
    printOutput(await doneGoal(goalId), program.opts() as { json?: boolean });
  });
}
