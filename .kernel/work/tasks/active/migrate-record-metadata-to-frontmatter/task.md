---
id: migrate-record-metadata-to-frontmatter
title: Migrate record metadata to frontmatter
status: active
goalId: simplify-command-surface
epicId: refactor-planning-and-execution-guidance
createdAt: 2026-05-05T19:07:11.000Z
updatedAt: 2026-05-05T19:48:28.000Z
checklist:
  - id: define-frontmatter-schema
    title: Define the frontmatter schema for goals, epics, tasks, knowledge, and
      learnings
    done: true
  - id: update-read-write-paths
    title: Update readers, writers, and renderers so records use frontmatter instead
      of YAML sidecars
    done: true
  - id: migrate-existing-records
    title: Migrate existing .kernel records and remove the sidecar files
    done: true
  - id: align-docs-tests
    title: Align templates, skills, docs, and tests with the frontmatter contract
    done: true
---

# Migrate record metadata to frontmatter

## Summary

Replace YAML sidecars with frontmatter for .kernel records so each record is self-contained in its markdown file.

## Context

The current record format splits human-authored content and metadata across markdown plus sidecar YAML. That adds friction, makes drift more likely, and breaks the “single canonical file” shape we want for project memory. Frontmatter keeps the metadata adjacent to the content and removes a whole class of sync problems.

## Acceptance Criteria

- [ ] Goal, epic, task, and knowledge records store metadata in markdown frontmatter.
- [ ] Learnings essays also use frontmatter when metadata is needed, otherwise remain simple markdown.
- [ ] YAML sidecars are removed for non-state .kernel records.
- [ ] Readers, writers, templates, and tests agree on the new format.

## Plan

- Define the metadata fields that belong in frontmatter for each record type.
- Update the record writers and readers to parse and emit frontmatter.
- Migrate the current .kernel records away from YAML sidecars.
- Remove or rewrite docs and templates that describe the old contract.
- Verify the project OS still loads and serializes records correctly.

## Checklist

- [x] Define the frontmatter schema for goals, epics, tasks, knowledge, and learnings
- [x] Update readers, writers, and renderers so records use frontmatter instead of YAML sidecars
- [x] Migrate existing .kernel records and remove the sidecar files
- [ ] Align templates, skills, docs, and tests with the frontmatter contract

## Linked Knowledge

- None yet

## Journal

- 2026-05-05T19:07:11.000Z: Created task `migrate-record-metadata-to-frontmatter`.
- 2026-05-05T19:18:47.000Z: Defined the frontmatter schema types for goals, epics, tasks, knowledge, and learnings.
- 2026-05-05T19:27:00.000Z: Updated project-os readers, writers, and renderers to use markdown frontmatter while keeping YAML sidecars as a fallback during migration.
- 2026-05-05T19:41:06.000Z: Migrated existing `.kernel` records to frontmatter and removed YAML sidecars.
- 2026-05-05T19:48:28.000Z: Aligned templates, skills, docs, and tests with the frontmatter contract.
