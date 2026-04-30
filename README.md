# Kernel

`kernel` is a local-first brain and project OS for coding agents.

It gives you one canonical place on your machine to define skills, agents, and commands, then syncs that brain into the dot-directories your agent hosts already use.

It also gives each repo a committed `.kernel/` directory that acts as the full living documentation system for the project: goals, epics, tasks, decisions, research, runbooks, concepts, and local runtime state.

## What It Does

- Stores your canonical agent brain in `~/.kernel/brain/`
- Syncs that brain into enabled hosts like `.codex`, `.claude`, `.copilot`, and `.pi`
- Keeps host-specific formatting at the edge through small materializers
- Manages repo-local project memory in `.kernel/`
- Uses one markdown file plus one YAML file per trackable record
- Keeps `.kernel/state/` ignored for local pointers and runtime state

## Layout

### User Brain

```text
~/.kernel/
  config.yaml
  brain/
    skills/<id>/SKILL.md
    agents/<id>/AGENT.md
    commands/<id>.yaml
  state/
    sync-manifest.json
```

### Repo Project OS

```text
.kernel/
  README.md
  project.md
  .gitignore
  work/
    goals/<id>/
      goal.md
      goal.yaml
    epics/<id>/
      epic.md
      epic.yaml
    tasks/
      active/<id>/
        task.md
        task.yaml
      archived/<date>-<id>/
        task.md
        task.yaml
  knowledge/
    decisions/<id>/
      decision.md
      decision.yaml
    research/<id>/
      research.md
      research.yaml
    runbooks/<id>/
      runbook.md
      runbook.yaml
    concepts/<id>/
      concept.md
      concept.yaml
  state/
    pointers.json
```

## CLI

```text
kernel init
kernel sync
kernel doctor
kernel host list
kernel goal new "<title>"
kernel epic new "<title>" --goal <goalId>
kernel task new "<title>" --epic <epicId>
kernel task next
kernel task done <checklist-item>
kernel task archive [id]
kernel decision new "<title>"
kernel research new "<title>"
kernel runbook new "<title>"
kernel concept new "<title>"
```

## Quick Start

```bash
npm install -g @hackefeller/kernel
kernel init
kernel goal new "make onboarding effortless"
kernel epic new "document setup path" --goal make-onboarding-effortless
kernel task new "write setup guide" --epic document-setup-path
kernel task next
```

## Design Principles

- Define once locally, sync everywhere
- `.kernel` is the repo's committed project memory
- One markdown file per record; YAML is machine state
- Durable knowledge is linked, not copied
- Host-specific behavior stays in small adapters/materializers
- Local work state should be visible in the repo, not hidden in chat
