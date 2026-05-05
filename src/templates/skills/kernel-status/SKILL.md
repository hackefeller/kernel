---
name: kernel-status
kind: skill
tags:
  - workflow
profile: core
description: "Report current state from the repo .kernel project OS: goals, epics,
  tasks, and linked knowledge. Use when asking where things stand, what is
  blocking progress, or what comes next."
license: MIT
metadata:
  author: project
  version: "3.0"
  category: Workflow
  tags:
    - workflow
    - status
when:
  - user asks where things stand, what is blocking, or what comes next
termination:
  - Status report delivered from verifiable .kernel records
  - Next action is unambiguous
outputs:
  - Status report with progress and recommendations
disableModelInvocation: false
argumentHint: goal, epic, task, or knowledge ID
allowedTools:
  - bash
---

# kernel-status

Read `.kernel` and report what is true right now.

Use `kernel goal list`, `kernel epic list`, `kernel task list`, and `kernel knowledge list` to gather facts. Run `kernel task status` when the user asks what to do next — the next unchecked item is included in the output.

Report only facts from `.kernel` records. If a record is stale or unclear, call that out and recommend the next update.
