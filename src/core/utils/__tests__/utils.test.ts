import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";

import {
    directoryExists,
    ensureDir,
    fileExists,
    listDirs,
    readFile,
    removeDir,
    writeFile,
} from "../file-system.js";

async function mkTmpDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "utils-test-"));
}

describe("File System Utilities", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await mkTmpDir();
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  // --------------------------------------------------------------------------
  // directoryExists
  // --------------------------------------------------------------------------

  describe("directoryExists", () => {
    it("returns true for an existing directory", async () => {
      expect(await directoryExists(tmpDir)).toBe(true);
    });

    it("returns false for a nonexistent path", async () => {
      expect(await directoryExists(path.join(tmpDir, "nope"))).toBe(false);
    });

    it("returns false when path is a file, not a directory", async () => {
      const f = path.join(tmpDir, "file.txt");
      await fs.writeFile(f, "content", "utf-8");
      expect(await directoryExists(f)).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // fileExists
  // --------------------------------------------------------------------------

  describe("fileExists", () => {
    it("returns true for an existing file", async () => {
      const f = path.join(tmpDir, "exists.txt");
      await fs.writeFile(f, "hello", "utf-8");
      expect(await fileExists(f)).toBe(true);
    });

    it("returns false for a nonexistent path", async () => {
      expect(await fileExists(path.join(tmpDir, "ghost.txt"))).toBe(false);
    });

    it("returns false when path is a directory, not a file", async () => {
      expect(await fileExists(tmpDir)).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // ensureDir
  // --------------------------------------------------------------------------

  describe("ensureDir", () => {
    it("creates a nested directory structure", async () => {
      const nested = path.join(tmpDir, "a", "b", "c");
      await ensureDir(nested);
      expect(await directoryExists(nested)).toBe(true);
    });

    it("is idempotent — calling twice does not throw", async () => {
      const dir = path.join(tmpDir, "idempotent");
      await ensureDir(dir);
      await expect(ensureDir(dir)).resolves.toBeUndefined();
    });
  });

  // --------------------------------------------------------------------------
  // writeFile / readFile
  // --------------------------------------------------------------------------

  describe("writeFile", () => {
    it("creates parent directories automatically", async () => {
      const f = path.join(tmpDir, "deep", "nested", "file.txt");
      await writeFile(f, "hello");
      expect(await fileExists(f)).toBe(true);
    });

    it("overwrites existing file", async () => {
      const f = path.join(tmpDir, "overwrite.txt");
      await writeFile(f, "first");
      await writeFile(f, "second");
      const content = await fs.readFile(f, "utf-8");
      expect(content).toBe("second");
    });
  });

  describe("readFile", () => {
    it("returns the content that was written", async () => {
      const f = path.join(tmpDir, "read.txt");
      await writeFile(f, "the content");
      expect(await readFile(f)).toBe("the content");
    });

    it("throws for a nonexistent file", async () => {
      await expect(readFile(path.join(tmpDir, "missing.txt"))).rejects.toThrow();
    });
  });

  // --------------------------------------------------------------------------
  // removeDir
  // --------------------------------------------------------------------------

  describe("removeDir", () => {
    it("removes a directory and its contents", async () => {
      const dir = path.join(tmpDir, "to-remove");
      await ensureDir(dir);
      await writeFile(path.join(dir, "file.txt"), "content");
      await removeDir(dir);
      expect(await directoryExists(dir)).toBe(false);
    });

    it("does not throw for nonexistent directory", async () => {
      await expect(removeDir(path.join(tmpDir, "nope"))).resolves.toBeUndefined();
    });
  });

  // --------------------------------------------------------------------------
  // listDirs
  // --------------------------------------------------------------------------

  describe("listDirs", () => {
    it("returns only directory names", async () => {
      await ensureDir(path.join(tmpDir, "dir-a"));
      await ensureDir(path.join(tmpDir, "dir-b"));
      await writeFile(path.join(tmpDir, "file.txt"), "x");
      const dirs = await listDirs(tmpDir);
      expect(dirs).toContain("dir-a");
      expect(dirs).toContain("dir-b");
      expect(dirs).not.toContain("file.txt");
    });

    it("returns empty array for empty directory", async () => {
      const empty = path.join(tmpDir, "empty");
      await ensureDir(empty);
      expect(await listDirs(empty)).toHaveLength(0);
    });

    it("returns empty array for nonexistent path", async () => {
      expect(await listDirs(path.join(tmpDir, "nope"))).toEqual([]);
    });
  });
});
