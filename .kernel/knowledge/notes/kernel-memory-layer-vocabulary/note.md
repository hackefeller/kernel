---
id: kernel-memory-layer-vocabulary
title: Kernel memory layer vocabulary and migration model
status: active
kind: note
tags:
  - architecture
  - migration
  - naming
linkedWorkIds:
  - restructure-kernel-memory-layers
createdAt: 2026-05-08T07:38:31.000Z
updatedAt: 2026-05-08T07:38:31.000Z
---

# Kernel memory layer vocabulary and migration model

## Note

## Context

The current `brain` and `project-os` names are too abstract for most users, and the `knowledge` taxonomy also mixes intent, lifecycle, and reuse level. The new plan is to replace the global layer with a `catalog` concept, keep the repo-local layer as a `workspace`, and simplify knowledge into clearer buckets.

## Details

- Global synced assets should be framed as a `catalog` rather than a `brain`.
- Repo-local committed project memory should be framed as a `workspace` rather than a `project OS`.
- Knowledge should be reorganized around intent:
  - `notes/` for observations and research findings
  - `guides/` for procedures and runbooks
  - `reference/` for stable concepts and canonical explanations
  - `learnings/` for post-task lessons
- This migration is planned with no backward compatibility, so the codebase can remove old names cleanly instead of layering shims on top.

## Links

- `restructure-kernel-memory-layers`
