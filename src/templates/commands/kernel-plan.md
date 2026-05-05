---
name: kernel-plan
kind: command
tags:
  - workflow
  - planning
description: Plan work and knowledge in the repo .kernel project OS.
group: workflow
argumentHint: goal, epic, task, or knowledge to plan
backedBySkill: kernel-plan
---

Use this before implementation begins, or whenever scope, sequence, or project knowledge is unclear.

Plan into `.kernel`, not chat:

- Goals live in `.kernel/work/goals/<id>/goal.md`
- Epics live in `.kernel/work/epics/<id>/epic.md`
- Tasks live in `.kernel/work/tasks/active/<id>/task.md`
- Knowledge lives in `.kernel/knowledge/research|runbooks|concepts/<id>/<kind>.md` and `.kernel/knowledge/learnings/<slug>.md`

Each record has one markdown file plus one YAML tracking file. Link research, runbooks, and concepts from work records instead of copying knowledge around.
