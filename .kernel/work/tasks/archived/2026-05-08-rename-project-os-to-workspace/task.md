---
id: rename-project-os-to-workspace
title: Rename the repo-local project OS to workspace
status: archived
goalId: restructure-kernel-memory-layers
linkedKnowledgeIds:
  - kernel-memory-layer-vocabulary
createdAt: 2026-05-08T07:38:31.000Z
updatedAt: 2026-05-08T16:52:04.000Z
doneAt: 2026-05-08T16:52:04.000Z
checklist:
  - id: rename-module
    title: Rename `src/core/project-os` to `src/core/workspace` and update imports
    done: true
    completedAt: 2026-05-08T16:47:12.000Z
  - id: update-kernel-bootstrap
    title: Update `.kernel` bootstrap docs and generated layout to describe a workspace
    done: true
    completedAt: 2026-05-08T16:47:12.000Z
  - id: remove-old-project-os-language
    title: Remove `project-os` wording from CLI text, docs, and generated artifacts
    done: true
    completedAt: 2026-05-08T16:47:12.000Z
  - id: validate-workspace-records
    title: Verify goal, task, and knowledge records still load and persist in the new layout
    done: true
    completedAt: 2026-05-08T16:47:12.000Z
---

# Rename the repo-local project OS to workspace

## Summary

Replace `project-os` with a simpler `workspace` concept for the repo-local committed project memory.

## Context

The repo-local layer is not a platform and does not need operating-system language. `workspace` communicates the intent more directly: it is the place where the project’s goals, tasks, knowledge, and local state live. This task covers the repo-local storage surface, bootstrap text, and the code that resolves and initializes the workspace.

## Acceptance Criteria

- [ ] The repo-local layer is called `workspace` in code and docs.
- [ ] `.kernel` bootstrap output no longer advertises `project-os`.
- [ ] Repo-local record creation and loading continue to work in the new layout.
- [ ] Old `project-os` terminology is removed rather than preserved.

## Plan

- Rename the repo-local module tree and exported helpers.
- Update bootstrap/readme text to describe a workspace.
- Remove `project-os` references from docs, tests, and generated content.
- Verify workspace records load, write, archive, and restore correctly.

## Checklist

- [ ] Rename `src/core/project-os` to `src/core/workspace` and update imports
- [ ] Update `.kernel` bootstrap docs and generated layout to describe a workspace
- [ ] Remove `project-os` wording from CLI text, docs, and generated artifacts
- [ ] Verify goal, task, and knowledge records still load and persist in the new layout

## Linked Knowledge

- `kernel-memory-layer-vocabulary`

## Journal

- 2026-05-08T07:38:31.000Z: Created task `rename-project-os-to-workspace`.
- 2026-05-08T16:47:12.000Z: Renamed the repo-local project memory layer from `project-os` to `workspace`, updated docs and CLI wiring, and validated the new layout with tests and build.
- 2026-05-08T16:52:04.000Z: Archived after migration and validation.
