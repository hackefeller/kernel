---
id: rename-memory-layers-and-knowledge-taxonomy
title: Rename the memory layers and simplify the knowledge taxonomy
taskId: purge-legacy-names-and-validate
archivedAt: 2026-05-08
linkedGoalIds:
  - restructure-kernel-memory-layers
linkedKnowledgeIds:
  - kernel-memory-layer-vocabulary
---

# Rename the memory layers and simplify the knowledge taxonomy

## Abstract

We replaced the abstract `brain` and `project-os` naming with clearer `catalog` and `workspace` concepts, then simplified the repo-local knowledge layout into intent-based buckets. The migration was intentionally non-backward-compatible, which let us remove the old names cleanly, update shipped templates and docs, and validate the new structure without maintaining compatibility shims.

## Problem

The repository used names that were technically accurate but cognitively expensive. `brain` sounded clever instead of functional, `project-os` introduced platform language where a plain workspace would do, and the knowledge tree mixed different kinds of durable context in a way that was hard to explain quickly. The result was a system that required too much project-specific vocabulary before a user could understand where things lived.

## Background

The project already had a durable memory model built around goals, tasks, and knowledge, but the surrounding naming made the model feel more abstract than it needed to be. The global synced assets and the repo-local project memory were conceptually separate, and the knowledge layer needed to distinguish between observations, procedures, stable reference, and lessons learned without inventing new jargon. We treated the migration as a redesign, not a compatibility exercise.

## Approach

We split the change into layers so each concept could be renamed and validated on its own. First, the global user-owned asset layer became `catalog`. Then the repo-local memory layer became `workspace`. Finally, we renamed the knowledge taxonomy into intent-based buckets so the directory tree read like how people actually use the content. Each step updated code, docs, templates, and tests together so there was no shadow path left behind.

## Implementation

The global module tree moved from `src/core/brain` to `src/core/catalog`, with the local synced source root now living at `~/.kernel/catalog` and the distribution root remaining `~/.agents`. The repo-local module tree moved from `src/core/project-os` to `src/core/workspace`, and its bootstrap surface now creates a `.kernel` workspace directly. The knowledge tree was flattened into `notes/`, `guides/`, `reference/`, and `learnings/`, and existing records were moved into the new buckets with record-style subdirectories and canonical markdown files.

## Outcomes

The codebase now uses direct, familiar words for all three layers: `catalog`, `workspace`, and knowledge buckets that describe intent. The shipped docs and templates reflect the new model, the workspace bootstrap creates the new directories, and the tests and build pass on the migrated structure. The old names were removed rather than retained, which kept the final shape simple and unambiguous.

## Lessons Learned

**Plain nouns beat clever metaphors in durable project memory.** If a user has to learn the project’s internal joke before using it, the model is too abstract.

**A migration without compatibility is easier to reason about, but it requires strict all-at-once cleanup.** Once old paths are gone, every shipped reference has to move in the same window or the build will resurrect stale concepts.

**Directory names should describe intent, not lifecycle editorial categories.** `notes`, `guides`, and `reference` were easier to explain than a more formal taxonomy that mixed reuse level with content type.

**Update the docs and templates at the same time as the code or the old language will come back through generation.** The bundled templates mattered as much as the source files because they define the shipped surface.

## References

- Task: `purge-legacy-names-and-validate` (archived 2026-05-08)
- Goal: `restructure-kernel-memory-layers`
- Knowledge: `kernel-memory-layer-vocabulary`
