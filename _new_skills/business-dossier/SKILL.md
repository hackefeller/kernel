---
name: business-dossier
description: Build business dossiers and business-plan sections using an isolated section workflow. Use when Codex needs to generate a full business plan, run selected sections only, draft/review/edit business dossier sections, avoid cross-section contamination, assemble a final dossier, or run cross-section consistency QA and targeted alignment repair.
---

# Business Dossier

## Workflow

Use this skill to build a full or partial business dossier while keeping each section isolated until final assembly.

Core loop for every requested section:

1. Generate section draft in isolation.
2. Review that draft in isolation.
3. Edit that draft using only the draft, review findings, and section brief.

Only after requested sections are final should you run assembly review for cross-section contradictions and missing alignment.

## References

Read only the references needed for the current step:

- [orchestrator.md](references/orchestrator.md) for the end-to-end workflow.
- [section-generator.md](references/section-generator.md) when drafting one section.
- [section-reviewer.md](references/section-reviewer.md) when reviewing one section.
- [section-editor.md](references/section-editor.md) when revising one section.
- [assembly-reviewer.md](references/assembly-reviewer.md) when reviewing the assembled dossier.

## Section Isolation Rules

- Do not allow Section N to influence Section N+1 unless the user explicitly requests cross-section consistency during generation.
- Pass only the source idea, current section name, current section brief or skill path, and explicit user constraints into section generation.
- Pass only the generated draft, current section brief or skill path, and explicit source constraints into section review.
- Pass only the generated draft, reviewer findings, and current section brief or skill path into section editing.
- Store the final section and clear working assumptions before starting the next section.

## Full Dossier

When the user asks for a full dossier:

1. Determine requested sections. If unspecified, default to all available dossier sections.
2. Run generator -> reviewer -> editor for each section independently.
3. Assemble finalized sections in order.
4. Run assembly review.
5. If impacted sections are identified, run one targeted repair pass for those sections only.
6. Reassemble and rerun assembly review once.
7. Stop after one assembly review rerun, even if residual issues remain.

## Selected Sections

When the user asks for selected sections only:

1. Run only the named sections.
2. Keep selected sections isolated during drafting.
3. Review the assembled selected sections only.
4. Run at most one targeted alignment repair pass.

## Final Output

Return:

1. Completed sections in order
2. Final assembly review result
3. Alignment repairs applied, if any
4. Missing inputs still needed from the user

If the user gives an output path, write the dossier there. Otherwise, return the assembled dossier in chat.
