---
name: kernel-intake
kind: skill
tags:
  - workflow
profile: core
description: Classify new requests into the .kernel project OS as a goal, epic,
  task, or knowledge record. Use when a new bug, feature, or unstructured request
  needs a durable home.
license: MIT
metadata:
  author: project
  version: "3.0"
  category: Workflow
when:
  - a new unstructured request needs placement
termination:
  - Request classified into the correct .kernel record type
  - Parent and knowledge links captured
outputs:
  - New or updated .kernel record
disableModelInvocation: true
allowedTools:
  - bash
---

# kernel-intake

Classify incoming work into `.kernel`.

- Strategic outcome: `kernel goal new`
- Coherent deliverable: `kernel epic new`
- Executable work: `kernel task new`
- Durable rationale or reusable context: `kernel decision|research|runbook|concept new`

Before creating a record, search existing `.kernel/work/` and `.kernel/knowledge/` to avoid duplicates. Link knowledge records instead of copying context into task files.
