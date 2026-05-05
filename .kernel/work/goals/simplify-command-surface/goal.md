---
id: simplify-command-surface
title: Simplify the command surface
status: active
tags:
  - workflow
  - architecture
createdAt: 2026-05-05T18:04:33.000Z
updatedAt: 2026-05-05T18:04:33.000Z
---

# Simplify the command surface

## Summary

Refactor the Kernel command and workflow surface so the conceptual model lives in skills and the command layer stays thin and justified.

## Context

The current surface has a mix of thin commands, duplicated guidance, and a few legacy entry points that no longer add enough value. We want one canonical explanation of the Goal / Epic / Task / Knowledge model, fewer low-value commands, and a clear boundary between user-facing commands and reusable workflow policy.

## Success Criteria

- [ ] `kernel-plan` is the canonical model for Goal, Epic, Task, and Knowledge guidance.
- [ ] Low-value commands are removed or folded into clearer workflows.
- [ ] The execution guidance boundary between `kernel-do` and `kernel-execute` is explicit.
- [ ] Templates, skills, CLI, and tests agree on the reduced command surface.

## Epics

- `refactor-planning-and-execution-guidance` - Refactor planning and execution guidance.

## Linked Knowledge

- None yet

## Journal

- 2026-05-05T18:04:33.000Z: Created goal `simplify-command-surface`.
