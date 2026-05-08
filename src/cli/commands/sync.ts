import type { Command } from "commander";
import { initializeWorkspace } from "../../core/workspace/index.js";
import { syncKernelCatalog } from "../../core/catalog/sync.js";
import { printOutput } from "./output.js";

export function registerSyncCommand(program: Command): void {
  program
    .command("sync")
    .description("Initialize (if needed) and sync Kernel catalog + workspace")
    .action(async () => {
      await initializeWorkspace();
      printOutput(await syncKernelCatalog(), program.opts() as { json?: boolean });
    });
}
