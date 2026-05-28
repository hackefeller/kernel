import { afterEach, describe, expect, it, spyOn } from "bun:test";
import { printOutput } from "../output.js";

describe("printOutput", () => {
  let logSpy: ReturnType<typeof spyOn> | undefined;
  let tableSpy: ReturnType<typeof spyOn> | undefined;

  afterEach(() => {
    logSpy?.mockRestore();
    tableSpy?.mockRestore();
    logSpy = undefined;
    tableSpy = undefined;
  });

  it("prints flat arrays as tables by default", () => {
    logSpy = spyOn(console, "log").mockImplementation(() => undefined);
    tableSpy = spyOn(console, "table").mockImplementation(() => undefined);

    printOutput([{ host: "claude", created: 1, updated: 0, removed: 0 }], {});

    expect(tableSpy).toHaveBeenCalledTimes(1);
    expect(tableSpy?.mock.calls[0]?.[0]).toEqual([
      {
        host: "claude",
        written: 1,
        replaced: 0,
        removed: 0,
      },
    ]);
  });

  it("omits tracked from sync host tables", () => {
    logSpy = spyOn(console, "log").mockImplementation(() => undefined);
    tableSpy = spyOn(console, "table").mockImplementation(() => undefined);

    printOutput(
      {
        catalogPath: "/tmp/.agents",
        hosts: [
          {
            host: "claude",
            created: 1,
            updated: 0,
            removed: 0,
            tracked: ["/tmp/.claude/skills/kernel-review"],
          },
        ],
      },
      {},
    );

    expect(tableSpy).toHaveBeenCalledTimes(1);
    expect(tableSpy?.mock.calls[0]?.[0]).toEqual([
      {
        host: "claude",
        written: 1,
        replaced: 0,
        removed: 0,
      },
    ]);
  });

  it("prints json when requested", () => {
    logSpy = spyOn(console, "log").mockImplementation(() => undefined);
    tableSpy = spyOn(console, "table").mockImplementation(() => undefined);

    printOutput(
      {
        catalogPath: "/tmp/.agents",
        hosts: [{ id: "claude", detected: true }],
      },
      { json: true },
    );

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy?.mock.calls[0]?.[0]).toContain('"catalogPath": "/tmp/.agents"');
    expect(tableSpy).not.toHaveBeenCalled();
  });

  it("prints replaced and removed sync paths in verbose mode", () => {
    logSpy = spyOn(console, "log").mockImplementation(() => undefined);
    tableSpy = spyOn(console, "table").mockImplementation(() => undefined);
    const sawLog = (value: string): boolean =>
      Boolean(logSpy?.mock.calls.some((call: unknown[]) => call[0] === value));

    printOutput(
      {
        catalogPath: "/tmp/.agents",
        hosts: [
          {
            host: "claude",
            created: 0,
            updated: 1,
            removed: 1,
            tracked: [],
            updatedPaths: ["/tmp/.claude/commands/kernel/kernel-sync.md"],
            removedPaths: ["/tmp/.claude/commands/kernel/kernel-old.md"],
          },
        ],
      },
      { verbose: true },
    );

    expect(tableSpy).toHaveBeenCalledTimes(1);
    expect(sawLog("claude details")).toBe(true);
    expect(sawLog("replaced")).toBe(true);
    expect(sawLog("removed")).toBe(true);
    expect(sawLog("- /tmp/.claude/commands/kernel/kernel-sync.md")).toBe(true);
    expect(sawLog("- /tmp/.claude/commands/kernel/kernel-old.md")).toBe(true);
  });
});
