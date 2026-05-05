---
id: extend-kernel-plan
title: Extend kernel-plan into the canonical model skill
status: active
goalId: simplify-command-surface
epicId: refactor-planning-and-execution-guidance
createdAt: 2026-05-05T18:04:33.000Z
updatedAt: 2026-05-05T19:02:21.000Z
checklist:
  - id: canonical-model
    title: Add the Goal / Epic / Task / Knowledge model to kernel-plan
    done: true
  - id: cli-map
    title: Update the CLI map and markdown contract to match the reduced surface
    done: true
  - id: status-boundary
    title: Update kernel-status guidance so it points at the canonical model instead
      of the thin commands
    done: false
  - id: verify-references
    title: Verify there are no stale planning references left in templates or skills
    done: false
---

# Extend kernel-plan into the canonical model skill

## Summary

Make `kernel-plan` the authoritative explanation for how Goal, Epic, Task, and Knowledge records fit together.

## Context

The command layer currently carries too much of the mental model. This task moves that explanation into the skill so commands can stay thin and the workflow becomes easier to teach.

## Acceptance Criteria

- [ ] The skill explains the record model, linking rules, and lifecycle boundaries clearly.
- [ ] The markdown contract matches the current knowledge layout.
- [ ] Status and execute guidance reference the new canonical explanation.
- [ ] Planning docs do not point at deleted or misleading subcommands.

## Plan

- Expand the scope model and CLI map in `kernel-plan`.
- Clarify when knowledge should be created versus linked.
- Align `kernel-status` and any related workflow docs with the updated model.
- Validate there are no stale references to removed commands.

## Checklist

- [x] Add the Goal / Epic / Task / Knowledge model to kernel-plan
- [x] Update the CLI map and markdown contract to match the reduced surface
- [ ] Update kernel-status guidance so it points at the canonical model instead of the thin commands
- [ ] Verify there are no stale planning references left in templates or skills

## Linked Knowledge

- None yet

## Journal

- 2026-05-05T18:04:33.000Z: Created task `extend-kernel-plan`.
- 2026-05-05T18:41:37.000Z: Added the Goal / Epic / Task / Knowledge model to `kernel-plan`.
- 2026-05-05T19:02:21.000Z: Updated the CLI map and markdown contract for the reduced surface and learnings essays.
