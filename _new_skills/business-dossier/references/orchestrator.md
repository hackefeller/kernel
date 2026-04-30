# Business Dossier Orchestrator

Use this reference for full or selected business dossier workflows.

## Non-Negotiable Rule

Each section must be executed as a closed loop:

1. Generate section draft in isolation.
2. Review that draft in isolation.
3. Edit that draft using only the review findings and section brief.

Do not allow Section N to influence Section N+1 unless the user explicitly asks for cross-section consistency.

Only after all sections are finalized may you run a cross-section review of the assembled dossier. After that review, run one targeted alignment-repair pass only for sections named in the assembly review.

## Section Map

- Section I -> `.agents/skills/biz-section-01-executive-summary/SKILL.md`
- Section II -> `.agents/skills/biz-section-02-aesthetic-venue-design/SKILL.md`
- Section III -> `.agents/skills/biz-section-03-operational-model/SKILL.md`
- Section IV -> `.agents/skills/biz-section-04-unit-economics/SKILL.md`
- Section V -> `.agents/skills/biz-section-05-strategic-partnerships/SKILL.md`
- Section VI -> `.agents/skills/biz-section-06-content-programming/SKILL.md`
- Section VII -> `.agents/skills/biz-section-07-growth-projection/SKILL.md`
- Section VIII -> `.agents/skills/biz-section-08-pro-forma-pl/SKILL.md`
- Section IX -> `.agents/skills/biz-section-09-year1-ramp-model/SKILL.md`
- Section X -> `.agents/skills/biz-section-10-capital-stack/SKILL.md`
- Section XI -> `.agents/skills/biz-section-11-downside-stress-test/SKILL.md`

If these section skills are not present in the current repo, ask for section names/briefs or proceed with clear assumptions.

## Operating Rules

- Pass only the source idea, current section name, current section skill path or brief, and explicit user constraints into generation.
- Pass only the generated draft, current section skill path or brief, and explicit source constraints into review.
- Pass only the generated draft, reviewer findings, and current section skill path or brief into editing.
- After editing, store the final section and clear working assumptions before starting the next section.
- If the user wants only selected sections, run only those sections.
- After all requested sections are assembled, run assembly review on the completed dossier.
- If assembly review returns impacted sections, run one targeted repair pass using the section editor only for those sections.
- In repair, pass only current section text, assembly-review findings relevant to that section, and the section brief.
- After targeted repair, reassemble the dossier and rerun assembly review once.
- Do not reopen generation or section-level review during alignment repair.
- Stop after one assembly review rerun.

## Output Format

1. Completed sections in order
2. Final assembly review result
3. Alignment repairs applied, if any
4. Missing inputs still needed from the user
