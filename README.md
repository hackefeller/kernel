# Kernel

`kernel` is a local-first catalog and workspace for coding agents.

It gives you one canonical place on your machine to define skills, agents, and commands, then syncs that catalog into the dot-directories your agent hosts already use.

It also gives each repo a committed `.kernel/` directory that acts as the full living project memory for the project: goals, tasks, research, runbooks, concepts, learnings, and local runtime state.

## What It Does

- Stores your canonical agent catalog in `~/.kernel/catalog/`
- Syncs that catalog into enabled hosts like `.codex`, `.claude`, `.copilot`, and `.pi`
- Keeps host-specific formatting at the edge through small materializers
- Manages repo-local project memory in `.kernel/`
- Uses one markdown file with frontmatter per trackable record
- Keeps `.kernel/state.json` ignored for local pointers and runtime state

## Layout

### User Catalog

```text
~/.kernel/
  config.yaml
  catalog/
    skills/<id>/SKILL.md
    agents/<id>/AGENT.md
    commands/<id>.yaml
  state/
    sync-manifest.json
```

### Repo Workspace

```text
.kernel/
  README.md
  .gitignore
  work/
    goals/<id>/
      goal.md
    tasks/
      active/<id>/
        task.md
      archived/<date>-<id>/
        task.md
  knowledge/
    notes/<id>/
      note.md
    guides/<id>/
      guide.md
    reference/<id>/
      reference.md
    learnings/<slug>.md
  state.json
```

## CLI

```text
kernel sync
kernel doctor
kernel host list
kernel goal new "<title>"
kernel task new "<title>" --goal <goalId>
kernel task status [id]
kernel task done <checklist-item>
kernel task archive [id]
kernel knowledge list
kernel research new "<title>"
kernel runbook new "<title>"
kernel concept new "<title>"
```

## Quick Start

```bash
npm install -g @hackefeller/kernel
kernel sync
kernel goal new "make onboarding effortless"
kernel goal new "document setup path"
kernel task new "write setup guide" --goal document-setup-path
kernel task status
```

## Local Workflows

This repo uses `just` as the local source of truth for development and release workflows. GitHub Actions call these same recipes.

```bash
just ci                 # typecheck, test, build, and compiled-binary validation
just validate-binary    # smoke test dist/kernel in isolated temp fixtures
just install            # build and install kernel to ~/bin/kernel
```

Release and publish commands are dry-run by default unless explicitly confirmed:

```bash
just version-dry-run patch
just release-dry-run
just publish-dry-run

just version-bump patch
just release confirm=true
just publish confirm=true
```

## Design Principles

- Define once locally, sync everywhere
- `.kernel` is the repo's committed project memory
- One markdown file per record; frontmatter is metadata
- Durable knowledge is linked, not copied
- Host-specific behavior stays in small adapters/materializers
- Local work state should be visible in the repo, not hidden in chat
