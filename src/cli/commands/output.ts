import chalk from "chalk";
import { inspect } from "node:util";

export interface OutputOptions {
  json?: boolean;
  verbose?: boolean;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isTableRenderable(value: unknown): value is string | number | boolean | null | undefined {
  return value === null || value === undefined || ["string", "number", "boolean"].includes(typeof value);
}

function toTableRow(entry: Record<string, unknown>): Record<string, unknown> {
  const isSyncSummary =
    "host" in entry &&
    "created" in entry &&
    "updated" in entry &&
    "removed" in entry;

  if (isSyncSummary) {
    return {
      host: entry.host,
      written: entry.created,
      replaced: entry.updated,
      removed: entry.removed,
    };
  }

  const row: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(entry)) {
    if (key === "tracked") {
      continue;
    }
    row[key] = value;
  }

  return row;
}

function formatScalar(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (value === null) {
    return "null";
  }
  if (value === undefined) {
    return "undefined";
  }
  return inspect(value, { colors: true, depth: null, compact: true, sorted: true });
}

function printArray(value: unknown[]): void {
  if (value.length === 0) {
    console.log(chalk.dim("(empty)"));
    return;
  }

  if (value.every(isPlainObject)) {
    const rows = value.map(toTableRow);
    if (rows.every((entry) => Object.values(entry).every(isTableRenderable))) {
      console.table(rows);
      return;
    }
  }

  for (const item of value) {
    console.log(`- ${formatScalar(item)}`);
  }
}

function printVerboseSyncDetails(value: Record<string, unknown>): void {
  const hosts = value.hosts;
  if (!Array.isArray(hosts) || hosts.length === 0) {
    return;
  }

  for (const host of hosts) {
    if (!isPlainObject(host) || typeof host.host !== "string") {
      continue;
    }

    const updatedPaths = Array.isArray(host.updatedPaths) ? host.updatedPaths : [];
    const removedPaths = Array.isArray(host.removedPaths) ? host.removedPaths : [];
    if (updatedPaths.length === 0 && removedPaths.length === 0) {
      continue;
    }

    console.log(chalk.bold(`${host.host} details`));

    if (updatedPaths.length > 0) {
      console.log(chalk.cyan("replaced"));
      printArray(updatedPaths);
    }

    if (removedPaths.length > 0) {
      console.log(chalk.cyan("removed"));
      printArray(removedPaths);
    }
  }
}

function printObject(value: Record<string, unknown>): void {
  const entries = Object.entries(value);

  if (entries.length === 0) {
    console.log(chalk.dim("(empty)"));
    return;
  }

  for (const [key, entry] of entries) {
    if (Array.isArray(entry)) {
      console.log(chalk.bold(key));
      printArray(entry);
      continue;
    }

    if (isPlainObject(entry)) {
      console.log(chalk.bold(key));
      console.log(inspect(entry, { colors: true, depth: null, compact: false, sorted: true }));
      continue;
    }

    console.log(`${chalk.cyan(`${key}:`)} ${formatScalar(entry)}`);
  }
}

export function printOutput(value: unknown, options: OutputOptions = {}): void {
  if (options.json) {
    console.log(JSON.stringify(value, null, 2));
    return;
  }

  if (typeof value === "string") {
    console.log(value);
    return;
  }

  if (Array.isArray(value)) {
    printArray(value);
    return;
  }

  if (isPlainObject(value)) {
    printObject(value);
    if (options.verbose) {
      printVerboseSyncDetails(value);
    }
    return;
  }

  console.log(formatScalar(value));
}
