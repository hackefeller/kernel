---
id: purge-legacy-names-and-validate
title: Purge legacy names and validate the migration
status: done
goalId: restructure-kernel-memory-layers
linkedKnowledgeIds:
  - kernel-memory-layer-vocabulary
createdAt: 2026-05-08T07:38:31.000Z
updatedAt: 2026-05-08T16:52:04.000Z
doneAt: 2026-05-08T16:52:04.000Z
checklist:
  - id: remove-legacy-terms
    title: Remove remaining `brain`, `project-os`, and old knowledge taxonomy references
    done: true
    completedAt: 2026-05-08T16:52:04.000Z
  - id: refresh-generated-output
    title: Regenerate bundled templates and any derived catalogs so shipped output matches source
    done: true
    completedAt: 2026-05-08T16:52:04.000Z
  - id: run-build-and-tests
    title: Run the full build and test pipeline against the migrated structure
    done: true
    completedAt: 2026-05-08T16:52:04.000Z
  - id: confirm-no-backcompat
    title: Confirm there are no compatibility shims, aliases, or old-path fallbacks left
    done: true
    completedAt: 2026-05-08T16:52:04.000Z
---

# Purge legacy names and validate the migration

## Summary

Remove any remaining stale terminology and prove the new structure is the only structure the codebase supports.

## Context

Because this migration has no backward compatibility, the cleanup task is not optional housekeeping — it is part of the architecture change itself. The goal is to eliminate every old name from the shipped output and then validate the build, registry, templates, and tests all agree with the new model.

## Acceptance Criteria

- [ ] No shipped docs, templates, or code paths reference the deprecated names.
- [ ] Generated output reflects the renamed catalog/workspace/knowledge structure.
- [ ] Build and tests pass on the new structure.
- [ ] No fallback logic remains for old paths or old directory names.

## Plan

- Search for and remove all legacy terminology.
- Regenerate bundled artifacts so shipped templates match source changes.
- Run the build/test pipeline and fix any fallout.
- Do a final pass to confirm there are no shims or aliases left.

## Checklist

- [ ] Remove remaining `brain`, `project-os`, and old knowledge taxonomy references
- [ ] Regenerate bundled templates and any derived catalogs so shipped output matches source
- [ ] Run the full build and test pipeline against the migrated structure
- [ ] Confirm there are no compatibility shims, aliases, or old-path fallbacks left

## Linked Knowledge

- `kernel-memory-layer-vocabulary`

## Journal

- 2026-05-08T07:38:31.000Z: Created task `purge-legacy-names-and-validate`.
- 2026-05-08T16:52:04.000Z: Removed remaining legacy terminology from the shipped source surface, regenerated bundled output, and validated the migrated structure with tests and build.
- 2026-05-08T16:52:04.000Z: Archived after migration and validation.
