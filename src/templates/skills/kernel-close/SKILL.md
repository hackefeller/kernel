---
name: kernel-close
kind: skill
tags:
  - workflow
profile: core
description: Close completed .kernel goals, epics, or tasks by verifying state,
  archiving completed tasks, and capturing durable lessons as knowledge records.
license: MIT
metadata:
  author: project
  version: "3.0"
  category: Workflow
when:
  - user asks to wrap up, close, or finalize work
termination:
  - Target record marked done or archived
  - Follow-ups captured as tasks
  - Lessons captured as knowledge records
outputs:
  - Closed .kernel work records
  - Linked follow-up tasks or knowledge records
disableModelInvocation: true
argumentHint: goal, epic, or task ID to close
allowedTools:
  - bash
---

# kernel-close

Close work in `.kernel` without losing project memory.

Use `kernel task archive`, `kernel epic done`, and `kernel goal done` for lifecycle closure. Deferred work gets a new task. Reusable rationale gets a research, runbook, or concept record.
