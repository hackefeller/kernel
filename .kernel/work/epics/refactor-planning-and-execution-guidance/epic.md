---
id: refactor-planning-and-execution-guidance
title: Refactor planning and execution guidance
status: active
goalId: simplify-command-surface
tags:
  - workflow
  - architecture
createdAt: 2026-05-05T18:04:33.000Z
updatedAt: 2026-05-05T18:04:33.000Z
---

# Refactor planning and execution guidance

## Summary

Make the planning skill the canonical explanation for the project OS model, prune commands that no longer justify their existence, and decide whether execution policy belongs in a skill or directly on the command surface.

## Context

The current command templates are thin enough that they are doubling as documentation. That makes the surface harder to teach and easier to drift. This epic centralizes the model in `kernel-plan`, removes stale or low-value commands, and resolves the `kernel-do` / `kernel-execute` boundary.

## Acceptance Criteria

- [ ] `kernel-plan` explains the Goal / Epic / Task / Knowledge model and where each record belongs.
- [ ] Record metadata for goals, epics, tasks, and knowledge lives in frontmatter inside the markdown file.
- [ ] Low-value command paths are removed from the active surface.
- [ ] The execution workflow has a single documented ownership model.
- [ ] The CLI, templates, registry, and tests are aligned after the refactor.

## Plan

1. Extend `kernel-plan` so it explains the record model, when to choose each record, and how knowledge should be linked.
2. Migrate record metadata to frontmatter so records are self-contained markdown files with metadata in the same file.
3. Remove commands that add little value or duplicate clearer workflows, starting with the task lifecycle outliers.
4. Decide whether `kernel-execute` remains a reusable skill or is folded into the `kernel-do` command surface.
5. Reconcile the CLI, registry, templates, and tests so the final surface is coherent.

## Tasks

- `extend-kernel-plan`
- `migrate-record-metadata-to-frontmatter`
- `prune-low-value-commands`
- `evaluate-kernel-execute-consolidation`

## Linked Knowledge

- None yet

## Journal

- 2026-05-05T18:04:33.000Z: Created epic `refactor-planning-and-execution-guidance`.
