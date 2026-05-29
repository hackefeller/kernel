import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..", "..");
const sourceDir = path.join(repoRoot, "src", "templates");
const outputDir = path.join(repoRoot, "dist", "templates");

if (!existsSync(sourceDir)) {
  throw new Error(`Template source directory not found: ${sourceDir}`);
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(path.dirname(outputDir), { recursive: true });
cpSync(sourceDir, outputDir, { recursive: true });

console.log(`Copied templates to ${outputDir}`);