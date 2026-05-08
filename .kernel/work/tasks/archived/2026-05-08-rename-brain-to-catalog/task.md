---
id: rename-brain-to-catalog
title: Rename the global brain layer to catalog
status: archived
goalId: restructure-kernel-memory-layers
linkedKnowledgeIds:
  - kernel-memory-layer-vocabulary
createdAt: 2026-05-08T07:38:31.000Z
updatedAt: 2026-05-08T16:52:04.000Z
doneAt: 2026-05-08T16:52:04.000Z
checklist:
  - id: rename-home-layer
    title: Replace `~/.kernel/brain` with `~/.kernel/catalog`
    done: false
  - id: rename-internal-modules
    title: Rename `src/core/brain` to `src/core/catalog` and update imports
    done: false
  - id: update-sync-and-discovery
    title: Update sync, discovery, and host mapping logic to use catalog terminology
    done: false
  - id: purge-old-brain-references
    title: Remove old brain terminology from docs, templates, and tests
    done: false
---

# Rename the global brain layer to catalog

## Summary

Move the global reusable asset layer from the abstract `brain` model to a clearer `catalog` model.

## Context

The current name suggests a metaphor rather than a function. Users should be able to understand the directory and module name without learning project-specific jargon. This task covers the global layer only: the user-owned synced assets, config, discovery, and the module surface that manages them.

## Acceptance Criteria

- [ ] The global path is `~/.kernel/catalog` instead of `~/.kernel/brain`.
- [ ] The codebase uses `catalog` naming instead of `brain` for the global asset layer.
- [ ] Sync and discovery logic still resolve and materialize the right assets.
- [ ] No user-facing docs or tests mention the old global brain layer.

## Plan

- Rename the global module tree and adjust exported helpers.
- Update global path resolution and storage routines to point at `catalog`.
- Update sync/discovery code and any host-facing text.
- Remove old terminology from templates and tests.

## Checklist

- [ ] Replace `~/.kernel/brain` with `~/.kernel/catalog`
- [ ] Rename `src/core/brain` to `src/core/catalog` and update imports
- [ ] Update sync, discovery, and host mapping logic to use catalog terminology
- [ ] Remove old brain terminology from docs, templates, and tests

## Linked Knowledge

- `kernel-memory-layer-vocabulary`

## Journal

- 2026-05-08T07:38:31.000Z: Created task `rename-brain-to-catalog`.
- 2026-05-08T16:52:04.000Z: Archived after migration and validation.
