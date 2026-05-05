---
name: kernel-sync
kind: skill
tags:
  - workflow
  - kernel
profile: core
description: Reconcile .kernel project OS records with what actually happened in
  the codebase. Use when task state, linked knowledge, or documentation has drifted.
license: MIT
metadata:
  author: project
  version: "3.0"
  category: Workflow
  tags:
    - workflow
    - sync
disableModelInvocation: true
allowedTools:
  - bash
---

# kernel-sync

Audit `.kernel` against the repo. Present a drift report before changing records.

Check active tasks, archived tasks, goals, epics, and linked knowledge. Mark checklist items done only after verifying code or tests. Capture durable findings as linked research, runbook, or concept records.
