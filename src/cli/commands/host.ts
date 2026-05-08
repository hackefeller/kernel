import type { Command } from "commander";
import { listHostStatus } from "../../core/catalog/host-status.js";
import { printOutput } from "./output.js";

export function registerHostCommand(program: Command): void {
  const host = program.command("host").description("Inspect enabled and detected agent hosts");

  host
    .command("list")
    .description("List known hosts and whether they are detected and enabled")
    .action(async () => {
      printOutput(await listHostStatus(), program.opts() as { json?: boolean });
    });
}
