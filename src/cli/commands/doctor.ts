import type { Command } from "commander";
import { doctorKernel } from "../../core/catalog/doctor.js";
import { printOutput } from "./output.js";

export function registerDoctorCommand(program: Command): void {
  program
    .command("doctor")
    .description("Diagnose the local Kernel catalog and generated host output")
    .action(async () => {
      printOutput(await doctorKernel(), program.opts() as { json?: boolean });
    });
}
