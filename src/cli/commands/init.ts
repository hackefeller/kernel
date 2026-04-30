import type { Command } from "commander";
import { initializeKernel } from "../../core/brain/init.js";
import { initializeProjectOs } from "../../core/project-os/index.js";
import { printOutput } from "./output.js";

export function registerInitCommand(program: Command): void {
  program
    .command("init")
    .description("Initialize the Kernel brain and repo .kernel project OS")
    .action(async () => {
      const brain = await initializeKernel();
      const project = await initializeProjectOs();
      printOutput({ ...brain, project }, program.opts() as { json?: boolean });
    });
}
