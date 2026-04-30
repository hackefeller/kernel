---
name: kernel-review
kind: command
tags:
  - review
description: Review completed work against the active .kernel task and changed code.
group: workflow
backedBySkill: kernel-review
argumentHint: optional task id or changed files
---

Review findings first. Compare implementation against `.kernel/work/tasks/active/<task-id>/task.md`, especially acceptance criteria and checklist state.

If approved, mark the verified checklist item with `kernel task done <item-id>` and archive the task when all planned work is complete.
