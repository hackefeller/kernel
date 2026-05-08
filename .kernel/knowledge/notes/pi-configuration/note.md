---
id: pi-resource-discovery-and-sync-layout
title: Pi resource discovery and sync layout
status: active
kind: research
linkedWorkIds:
  - simplify-command-surface
  - refactor-planning-and-execution-guidance
  - align-pi-sync-layout-with-documented-resources
createdAt: 2026-05-05T22:37:35.000Z
updatedAt: 2026-05-05T22:37:35.000Z
tags:
  - kernel
  - pi
  - sync
---

# Pi resource discovery and sync layout

## Research

## Context

Kernel sync currently mirrors command and skill artifacts into `~/.pi`, but Pi’s documented discovery model uses `~/.pi/agent/*` for global config and `~/.agents/skills` for skills.

## Details

- Pi loads skills from `~/.pi/agent/skills/` and `~/.agents/skills/`
- Pi loads prompt templates from `~/.pi/agent/prompts/` and `.pi/prompts/`
- Pi loads extensions from `~/.pi/agent/extensions/` and `.pi/extensions/`
- Pi loads themes from `~/.pi/agent/themes/` and `.pi/themes/`
- Pi command completion is built from extension commands, prompt templates, and skills
- There is no documented `~/.pi/commands/` resource directory
- Because skills are already discoverable from `~/.agents/skills`, duplicating them into `~/.pi` is unnecessary
- Kernel sync should keep skills canonical in `~/.agents` and only generate Pi-native prompt templates or extensions in documented locations

## Links

- simplify-command-surface
- refactor-planning-and-execution-guidance
- align-pi-sync-layout-with-documented-resources
