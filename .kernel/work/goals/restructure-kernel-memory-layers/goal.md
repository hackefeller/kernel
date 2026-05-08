---
id: restructure-kernel-memory-layers
title: Restructure the kernel memory layers
status: done
tags:
  - architecture
  - migration
  - naming
linkedKnowledgeIds:
  - kernel-memory-layer-vocabulary
createdAt: 2026-05-08T07:38:31.000Z
updatedAt: 2026-05-08T16:52:04.000Z
doneAt: 2026-05-08T16:52:04.000Z
---

# Restructure the kernel memory layers

## Summary

Replace the abstract `brain` and `project-os` naming with a clearer `catalog` and `workspace` model, and simplify the repo-local knowledge taxonomy so the directory tree reads like something a user would naturally expect.

## Context

The current structure uses names that are technically meaningful but cognitively expensive. `brain` sounds clever but vague, and `project-os` introduces unnecessary platform language. On the repo side, `knowledge` has grown into a set of buckets that are individually valid but collectively more formal than they need to be.

This migration intentionally has **no backward compatibility**. That allows the code, docs, generated templates, and tests to move to the new model cleanly without preserving deprecated paths or aliases.

## Problem / Opportunity Statement

The current directory and module names create avoidable confusion for users and contributors. The architecture should use direct language that reflects the actual responsibilities:

- a synced global `catalog` of reusable assets
- a repo-local `workspace` for project memory
- knowledge buckets that describe intent instead of editorial history

## Success Criteria

- [ ] Global `brain` terminology and paths are replaced by `catalog` everywhere.
- [ ] `project-os` terminology and paths are replaced by `workspace` everywhere.
- [ ] Repo-local knowledge directories are simplified into clearer buckets.
- [ ] Legacy names, paths, and docs are removed rather than preserved.
- [ ] Build, tests, template generation, and CLI behavior all pass on the new structure.

## Scope

### In scope

- Internal module/package renames
- On-disk path migration for global and repo-local storage
- Directory taxonomy changes for knowledge
- Documentation, templates, and tests
- Generated bundled registry output

### Out of scope

- Backward compatibility shims
- Migration helpers for old paths
- Dual-write or dual-read support
- Retaining deprecated terminology in user-facing docs

## Constraints and Risks

- The rename touches path resolution, sync output, discovery, and record creation, so the migration must be coordinated across code, docs, and generated templates.
- The knowledge rewrite changes how users browse durable context, so the final buckets need to be simple enough to explain in one sentence each.
- Because backward compatibility is intentionally off, all dependent references must be updated in the same migration window.

## Task Groups

### Global catalog
- Rename the global brain layer to catalog.
- Move module and path references off `brain`.
- Update sync and discovery behavior to use catalog terminology.

### Repo workspace
- Rename the repo-local project memory layer to workspace.
- Remove the last traces of `project-os` naming.
- Update `.kernel` bootstrap output and repo docs.

### Knowledge taxonomy
- Restructure knowledge into simpler buckets.
- Migrate existing files into the new bucket layout.
- Remove old folder names from docs and templates.

### Cleanup and validation
- Purge stale names from generated templates, docs, and tests.
- Run build and test validation.

## Linked Knowledge

- `kernel-memory-layer-vocabulary`

## Journal

- 2026-05-08T07:38:31.000Z: Created goal `restructure-kernel-memory-layers`.
- 2026-05-08T16:52:04.000Z: Completed the kernel memory layer migration: catalog, workspace, and the new knowledge taxonomy are in place; legacy names were removed from the shipped surface; build and tests passed.
