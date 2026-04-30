---
name: kernel-task-archive
kind: command
tags: [workflow]
description: Archive a completed task into .kernel/work/tasks/archived.
group: workflow
target: task archive
argumentHint: optional task id
---

Archive a task when its planned work is complete or deliberately closed.

Incomplete checklist items are surfaced as warnings and recorded in `task.md`.
