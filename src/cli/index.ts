#!/usr/bin/env bun

/**
 * Command-line interface
 *
 * Harness-agnostic AI agent distribution platform.
 */

import { Command } from "commander";
import packageJson from "../../package.json";
import { registerDoctorCommand } from "./commands/doctor.js";
import { registerEpicCommand } from "./commands/epic.js";
import { registerGoalCommand } from "./commands/goal.js";
import { registerHostCommand } from "./commands/host.js";
import { registerInitCommand } from "./commands/init.js";
import { registerKnowledgeCommands } from "./commands/knowledge.js";
import { registerSyncCommand } from "./commands/sync.js";
import { registerTaskCommand } from "./commands/task.js";

const program = new Command();

program
  .name("kernel")
  .description("Local brain and workflow OS for coding agents")
  .version(packageJson.version)
  .option("--json", "Emit JSON output instead of human-readable output")
  .showHelpAfterError();

registerInitCommand(program);
registerSyncCommand(program);
registerDoctorCommand(program);
registerHostCommand(program);
registerGoalCommand(program);
registerEpicCommand(program);
registerTaskCommand(program);
registerKnowledgeCommands(program);

export { program };
