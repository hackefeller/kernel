import type { Command } from "commander";
import { initializeWorkspace } from "../../core/workspace/index.js";
import { syncKernelCatalog } from "../../core/catalog/sync.js";
import { printOutput } from "./output.js";

export function registerSyncCommand(program: Command): void {
  program
    .command("sync")
    .description("Initialize (if needed) and sync Kernel catalog + workspace")
    .option("--verbose", "Show replaced and removed paths during sync")
    .action(async (options: { verbose?: boolean }) => {
      await initializeWorkspace();
      printOutput(
        await syncKernelCatalog(undefined, { verbose: options.verbose }),
        {
          ...(program.opts() as { json?: boolean }),
          verbose: options.verbose,
        },
      );
    });
}
