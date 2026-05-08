import type { Command } from "commander";
import { createKnowledge } from "../../core/workspace/index.js";
import { printOutput } from "./output.js";

function parseCsv(value?: string): string[] | undefined {
  return value?.split(",").map((item) => item.trim()).filter(Boolean);
}

export async function captureKnowledgeNote(
  program: Command,
  title: string,
  options: { tag?: string; work?: string } = {},
): Promise<void> {
  const result = await createKnowledge(title, {
    tags: parseCsv(options.tag),
    linkedWorkIds: parseCsv(options.work),
  });

  printOutput(
    {
      created: "note",
      id: result.knowledgeId,
      path: result.markdownPath,
      ...result,
    },
    program.opts() as { json?: boolean },
  );
}
