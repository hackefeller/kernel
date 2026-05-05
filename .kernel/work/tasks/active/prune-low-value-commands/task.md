---
id: prune-low-value-commands
title: Prune low-value commands
status: active
goalId: simplify-command-surface
epicId: refactor-planning-and-execution-guidance
createdAt: 2026-05-05T18:04:33.000Z
updatedAt: 2026-05-05T18:04:33.000Z
checklist:
  - id: remove-orphans
    title: Remove task next and task restore from the CLI, core, templates, and tests
    done: false
  - id: audit-thin-commands
    title: Audit the remaining list/status/done commands and keep only the ones that
      still justify themselves
    done: false
  - id: update-references
    title: Update any docs or skills that still describe removed commands
    done: false
  - id: verify-registry
    title: Verify registry validation and command discovery still pass
    done: false
---

# Prune low-value commands

## Summary

Remove the commands that no longer add enough value to justify their presence in the surface.

## Context

We already removed several redundant knowledge commands. The remaining cleanup target is the task lifecycle outliers, plus a deliberate audit of the thin list/status/done commands to confirm what should stay.

## Acceptance Criteria

- [ ] The orphaned task lifecycle commands are removed from code, templates, and tests.
- [ ] Any remaining thin commands have an explicit keep/remove decision.
- [ ] Docs and skills do not describe deleted commands.
- [ ] The registry still validates the reduced command set.

## Plan

- Remove `task next` and `task restore` from the CLI and core.
- Review the remaining list/status/done commands for keep/remove value.
- Update references in templates and skills.
- Run the registry and project-os test suite after the cleanup.

## Checklist

- [ ] Remove task next and task restore from the CLI, core, templates, and tests
- [ ] Audit the remaining list/status/done commands and keep only the ones that still justify themselves
- [ ] Update any docs or skills that still describe removed commands
- [ ] Verify registry validation and command discovery still pass

## Linked Knowledge

- None yet

## Journal

- 2026-05-05T18:04:33.000Z: Created task `prune-low-value-commands`.
