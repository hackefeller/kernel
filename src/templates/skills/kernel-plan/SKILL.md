---
name: kernel-plan
kind: skill
tags:
  - workflow
  - planning
profile: core
description: "Structure and create project-OS plans in repo-local .kernel: goals,
  epics, tasks, and knowledge records. Use when planning new work, breaking
  down work, or capturing durable project knowledge."
license: MIT
metadata:
  author: project
  version: "3.0"
  category: Workflow
  tags:
    - workflow
    - plan
    - planning
    - local
when:
  - user wants to plan new work, a feature, or a breakdown
  - user describes a change request, product idea, or strategic goal
  - project knowledge needs to be captured in .kernel
termination:
  - Correct .kernel record type selected
  - One markdown file with frontmatter created for each requested record
  - Links between work and knowledge records captured
outputs:
  - Goal, epic, task, or knowledge records under .kernel
  - Single canonical markdown file per record
disableModelInvocation: true
argumentHint: goal, epic, task, or knowledge to plan
allowedTools:
  - bash
---

# kernel-plan

Plan work and knowledge in the repo-local `.kernel` project OS. `.kernel` is committed project memory; only `.kernel/state/` is local runtime state.

## Scope Model

| User intent | Record |
| --- | --- |
| Strategic outcome or direction | Goal |
| Coherent deliverable or phase | Epic |
| Executable unit of work | Task |
| Investigation or findings | Research |
| Repeatable procedure | Runbook |
| Domain term or concept | Concept |
| Archived task insight or durable lesson | Learning |

Knowledge records are research, runbooks, concepts, and learnings. Use research for investigations, runbooks for repeatable procedures, concepts for domain language, and learnings for durable post-task essays.

Default to the smallest record that fully contains the work. A concrete implementation request is a task, not an epic.

## Planning Flow

1. Classify the record type.
2. Ask only for missing intent that cannot be inferred from repo context.
3. Create the record with the matching CLI command.
4. Edit the single markdown file for that record as the canonical human-readable plan.
5. Link reusable knowledge instead of copying rationale into multiple work records.

## CLI Map

- `kernel goal new "<title>"`
- `kernel epic new "<title>" --goal <goalId>`
- `kernel task new "<title>" --epic <epicId>`
- `kernel task archive [taskId]` — archives a task and writes a learnings essay
- `kernel research new "<title>"`
- `kernel runbook new "<title>"`
- `kernel concept new "<title>"`
- `kernel knowledge list`

## Markdown Contract

Each record has exactly one markdown file with frontmatter unless noted otherwise:

- Goal: `.kernel/work/goals/<id>/goal.md`
- Epic: `.kernel/work/epics/<id>/epic.md`
- Task: `.kernel/work/tasks/active/<id>/task.md`
- Knowledge: `.kernel/knowledge/research|runbooks|concepts/<id>/<kind>.md`
- Learning: `.kernel/knowledge/learnings/<slug>.md` (markdown with frontmatter, written by task archive)

The markdown file should contain the useful project memory: summary, context, acceptance criteria or details, plan, linked records, checklist when applicable, journal, and follow-ups. Learning essays should additionally capture the abstract, problem, background, approach, implementation, outcomes, lessons learned, and references that explain the archived task.

## Guardrails

- Do not create `brief.md`, `plan.md`, `tasks.md`, or `journal.md`.
- Do not keep the plan only in chat.
- Do not duplicate durable rationale; create or link a knowledge record.
- Frontmatter is for record metadata. YAML is for machine state in `.kernel/state/`.
