---
name: kernel-do
kind: command
tags:
  - workflow
description: Execute the active .kernel task checklist item by item.
group: workflow
argumentHint: optional task id or checklist item
backedBySkill: kernel-execute
---

Use this when a task exists under `.kernel/work/tasks/active/` and implementation should begin or continue.

Before editing code:

1. Run `kernel task status`.
2. Read `.kernel/work/tasks/active/<task-id>/task.md`.
3. Note the next unchecked checklist item from the status output.

After verifying a checklist item, run:

```bash
kernel task done <checklist-item-id>
```

Use `--task <taskId>` when completing an item outside the active task pointer.
