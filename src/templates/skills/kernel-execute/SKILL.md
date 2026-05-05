---
name: kernel-execute
kind: skill
tags:
  - workflow
profile: core
description: Execute implementation work from .kernel tasks one checklist item at
  a time. Use when tasks are ready for implementation, or when users say start,
  build, implement, or do this.
license: MIT
metadata:
  author: project
  version: "3.0"
  category: Workflow
  tags:
    - workflow
    - execute
    - implement
when:
  - user wants to implement work from a .kernel task
  - there is an unblocked task ready for implementation
termination:
  - Task checklist items implemented, verified, and marked done
  - Task markdown and YAML state reflect reality
outputs:
  - Implemented code changes
  - Updated .kernel task state and journal
dependencies:
  - kernel-plan
disableModelInvocation: true
argumentHint: task ID or checklist item to execute
allowedTools:
  - bash
---

# kernel-execute

Work from `.kernel/work/tasks/active/<task-id>/task.md`. One task, one checklist item, one verification loop at a time.

## Loop

1. Run `kernel task status [taskId]`.
2. Read the task's `task.md`.
3. Run `kernel task status [taskId]` and read the next unchecked item.
4. State the observable completion criterion.
5. Implement only that checklist item.
6. Verify with tests or manual checks.
7. Run `kernel task done <checklist-item-id> --task <taskId>`.
8. Record durable rationale as linked knowledge when it will matter later.

## Guardrails

- Do not create `brief.md`, `plan.md`, `tasks.md`, or `journal.md`.
- Do not mark checklist items done before verification.
- Do not duplicate research in multiple tasks; link knowledge records.
- Stop and re-plan if the task scope changes.
