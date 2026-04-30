import type { Command } from "commander";
import {
  createKnowledge,
  knowledgeStatus,
  listKnowledge,
} from "../../core/project-os/index.js";
import type { KnowledgeKind } from "../../core/project-os/types.js";
import { printOutput } from "./output.js";

function parseCsv(value?: string): string[] | undefined {
  return value?.split(",").map((item) => item.trim()).filter(Boolean);
}

function pluralKind(kind: KnowledgeKind): string {
  return kind === "research" ? "research" : `${kind}s`;
}

function registerKnowledgeKind(program: Command, kind: KnowledgeKind): void {
  const command = program.command(kind).description(`${kind} records under .kernel/knowledge/${pluralKind(kind)}/`);

  command
    .command("new <title>")
    .description(`Create a new ${kind}`)
    .option("--tag <tags>", "Comma-separated tags")
    .option("--work <ids>", "Comma-separated linked work IDs")
    .action(async (title: string, options: { tag?: string; work?: string }) => {
      printOutput(
        await createKnowledge(kind, title, {
          tags: parseCsv(options.tag),
          linkedWorkIds: parseCsv(options.work),
        }),
        program.opts() as { json?: boolean },
      );
    });

  command.command("list").description(`List ${kind} records`).action(async () => {
    printOutput(await listKnowledge(kind), program.opts() as { json?: boolean });
  });

  if (kind === "decision" || kind === "research") {
    command.command("status <id>").description(`Show status for a ${kind}`).action(async (id: string) => {
      printOutput(await knowledgeStatus(kind, id), program.opts() as { json?: boolean });
    });
  }
}

export function registerKnowledgeCommands(program: Command): void {
  registerKnowledgeKind(program, "decision");
  registerKnowledgeKind(program, "research");
  registerKnowledgeKind(program, "runbook");
  registerKnowledgeKind(program, "concept");
}
