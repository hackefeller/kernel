---
id: evaluate-kernel-execute-consolidation
title: Evaluate kernel-execute consolidation
status: active
goalId: simplify-command-surface
epicId: refactor-planning-and-execution-guidance
createdAt: 2026-05-05T18:04:33.000Z
updatedAt: 2026-05-05T18:04:33.000Z
checklist:
  - id: choose-boundary
    title: Decide whether execution policy remains a skill or moves into kernel-do
    done: false
  - id: encode-decision
    title: Rewrite the command and skill so the chosen ownership model is unambiguous
    done: false
  - id: preserve-loop
    title: Keep the one-checklist-item-at-a-time loop and verification guardrails
      intact
    done: false
  - id: validate-copy
    title: Update user-facing guidance and examples to match the chosen shape
    done: false
---

# Evaluate kernel-execute consolidation

## Summary

Decide whether `kernel-execute` should remain a reusable skill or be folded into the `kernel-do` command surface.

## Context

The current split is reasonable, but it is also a candidate for simplification. We need a deliberate decision so the user-facing surface and the reusable policy layer do not drift apart.

## Acceptance Criteria

- [ ] The ownership boundary between `kernel-do` and `kernel-execute` is explicitly decided.
- [ ] The chosen shape is reflected in the command template and skill contract.
- [ ] The execution loop and verification guardrails remain intact.
- [ ] User-facing examples match the final arrangement.

## Plan

- Compare the value of a reusable execution skill against a command-only policy.
- Decide whether to merge, rename, or retain the current split.
- Update the command and skill text so the boundary is obvious.
- Verify the execution loop still tells users exactly how to progress one checklist item at a time.

## Checklist

- [ ] Decide whether execution policy remains a skill or moves into kernel-do
- [ ] Rewrite the command and skill so the chosen ownership model is unambiguous
- [ ] Keep the one-checklist-item-at-a-time loop and verification guardrails intact
- [ ] Update user-facing guidance and examples to match the chosen shape

## Linked Knowledge

- None yet

## Journal

- 2026-05-05T18:04:33.000Z: Created task `evaluate-kernel-execute-consolidation`.
