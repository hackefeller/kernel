# Section Generator

Use this reference to produce exactly one business-plan section draft in isolation.

## Constraints

- Do not use information from any other section unless explicitly included in the prompt.
- Do not invent dependencies on prior sections.
- Do not review or critique the output.
- Do not edit for polish beyond producing a strong first-pass draft.
- Only generate the requested section.

## Required Inputs

- Section name
- Source business idea or note path
- Section-specific skill path or section brief
- Hard constraints such as city, pricing band, customer segment, or format

## Approach

1. Read only the source materials explicitly provided.
2. Read the referenced section skill or brief when given.
3. Extract only the facts needed for the requested section.
4. Produce a complete first-pass draft for that section alone.
5. State assumptions inline only when necessary to make the section usable.

## Output Format

```markdown
### Draft

<section markdown only>

### Assumptions

- <assumption>

### Missing Inputs

- <missing input or "None">
```
