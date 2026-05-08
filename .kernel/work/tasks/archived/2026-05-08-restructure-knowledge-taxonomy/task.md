---
id: restructure-knowledge-taxonomy
title: Restructure the knowledge taxonomy
status: archived
goalId: restructure-kernel-memory-layers
linkedKnowledgeIds:
  - kernel-memory-layer-vocabulary
createdAt: 2026-05-08T07:38:31.000Z
updatedAt: 2026-05-08T16:52:04.000Z
doneAt: 2026-05-08T16:52:04.000Z
checklist:
  - id: define-new-buckets
    title: Finalize the new knowledge buckets and map the old names to them
    done: true
    completedAt: 2026-05-08T16:52:04.000Z
  - id: migrate-knowledge-files
    title: Move existing knowledge records into the new taxonomy
    done: true
    completedAt: 2026-05-08T16:52:04.000Z
  - id: update-knowledge-commands
    title: Update knowledge-related commands, templates, and docs to the new structure
    done: true
    completedAt: 2026-05-08T16:52:04.000Z
  - id: validate-knowledge-discovery
    title: Verify listing, linking, and loading still work after the migration
    done: true
    completedAt: 2026-05-08T16:52:04.000Z
---

# Restructure the knowledge taxonomy

## Summary

Simplify the knowledge directory into a small set of intent-based buckets instead of the current more formal taxonomy.

## Context

The current knowledge structure mixes several useful but uneven labels. This task makes the layout easier to understand and explain by grouping content around how it is used: observations, procedures, stable reference, and lessons learned. Because the migration has no backward compatibility, the old bucket names should be removed completely once the move is done.

## Acceptance Criteria

- [ ] Knowledge buckets are renamed to a simpler, intent-based taxonomy.
- [ ] Existing knowledge files are migrated into the new buckets.
- [ ] Commands, docs, and templates point at the new layout.
- [ ] No old knowledge bucket names remain in the shipped surface.

## Plan

- Decide the final bucket names and their meaning.
- Move existing notes, runbooks, concepts, and learnings into the new taxonomy.
- Update commands, templates, and docs to describe the new layout.
- Validate that knowledge listing and linked references still behave correctly.

## Checklist

- [ ] Finalize the new knowledge buckets and map the old names to them
- [ ] Move existing knowledge records into the new taxonomy
- [ ] Update knowledge-related commands, templates, and docs to the new structure
- [ ] Verify listing, linking, and loading still work after the migration

## Linked Knowledge

- `kernel-memory-layer-vocabulary`

## Journal

- 2026-05-08T07:38:31.000Z: Created task `restructure-knowledge-taxonomy`.
- 2026-05-08T16:52:04.000Z: Reworked the knowledge taxonomy into notes/guides/reference/learnings, moved existing records into the new buckets, updated docs/templates, and validated the new layout with tests and build.
- 2026-05-08T16:52:04.000Z: Archived after migration and validation.
