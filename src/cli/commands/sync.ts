import type { Command } from "commander";
import { initializeProjectOs } from "../../core/project-os/index.js";
import { syncKernelBrain } from "../../core/brain/sync.js";
import { printOutput } from "./output.js";

export function registerSyncCommand(program: Command): void {
  program
    .command("sync")
    .description("Initialize (if needed) and sync Kernel brain + project OS")
    .action(async () => {
      await initializeProjectOs();
      printOutput(await syncKernelBrain(), program.opts() as { json?: boolean });
    });
}
