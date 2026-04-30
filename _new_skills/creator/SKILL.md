---
name: creator
description: Create and produce creative artifacts across video, image prompts, character art direction, and physical art object documentation. Use when Codex needs creator-led video scripts, production plans, lightweight video outlines, Caravaggio-style image prompts, Kadosabi character prompts, Lucy character renders, stylized 3D art direction, archival art object dossiers, conservation records, edition documentation, authentication notes, or collector maintenance guidance.
---

# Creator

Use this skill as the creative production hub. Pick one lane, load only that lane's references, and produce the requested artifact with strong creative direction.

## Routing

- **Video scripts and production**: use `references/video/`.
- **Caravaggio-style image prompts**: use `references/caravaggio/style-contract.md`.
- **Kadosabi character prompts, brand canon, content, and products**: use `references/kadosabi/`.
- **Art object dossiers**: use `references/art-objects/technical-dossier.md`.

Prefer narrower non-creator skills only when the task is mainly business planning, generic document writing, workshop design, codebase architecture, or research synthesis.

## Video

Use this lane for creator-led 3-5 minute video scripts, production plans, short-form cutdowns, and lightweight outlines.

Read only the needed file:

- `references/video/creator-contract.md` for scripts or script rewrites.
- `references/video/producer-contract.md` for production plans and editing checklists.
- `references/video/simple-video-outline.md` for quick outline-only requests.

Default script behavior:

1. Extract the strongest thesis.
2. Write for 3-5 minutes, about 450-750 spoken words.
3. Make the opening tight and tension-forward.
4. Include production notes, shot list, caption beats, alternate hooks, and shorts cutdowns when useful.

## Image Style Prompts

Use this lane for prompt craft and art direction, not image generation itself unless the user explicitly asks to generate an image.

For Caravaggio-style transfer:

1. Identify composition, subjects, pose, and emotional center.
2. Preserve basic subject positioning.
3. Replace modern lighting with single-source tenebrism.
4. Add Baroque materiality, psychological weight, earthy palette, and aged oil-paint finish.
5. Return prompt, negative constraints, and brief notes.

For Kadosabi character work:

1. Identify character, scene, pose, outfit, and output format.
2. Read `references/kadosabi/brand-identity.md` when the request touches brand, naming, product universe, or high-level visual direction.
3. Read `references/kadosabi/character-bible.md` when the request touches the wider cast, world, animation physics, sound, or story canon.
4. Read `references/kadosabi/animation-style.md` for premium toy-like 3D character renders.
5. Read `references/kadosabi/lucy.md` for Lucy-specific prompts.
6. Read `references/kadosabi/content-calendar.md` for content planning and character equity work.
7. Read `references/kadosabi/product-catalog.md` for product, home goods, print, apparel, or SKU planning.
8. Preserve the clean-vs-gritty contrast: polished simplified character, optional urban texture in the environment.
9. Return the requested artifact: prompt, style guide, content plan, product plan, or production notes.

Kadosabi has two adjacent visual modes. Do not collapse them accidentally:

- **Toy-like 3D render mode**: clean premium character/product render language from `animation-style.md` and `lucy.md`.
- **Rubber-hose future-world mode**: 1930s ink characters inside crisp art-deco sci-fi environments from `brand-identity.md` and `character-bible.md`.

When the user asks for "Kadosabi style" without specifying a mode, infer from context. If the output is an image prompt for Lucy or a toy render, use toy-like 3D mode. If the output is animation, story, worldbuilding, brand, or character universe work, use rubber-hose future-world mode.

## Art Object Documentation

Use this lane for physical artworks, especially archival prints and editioned objects.

Default sections:

1. Object identity and edition data
2. Substrate specifications
3. Pigment, ink, or material deposition data
4. Production log and environmental controls
5. Conservation, mounting, and glazing details
6. Forensic authentication and registry data
7. Collector maintenance requirements
8. Certification statement

Use technical language carefully. Separate known facts, recommended specs, and missing data. Mark missing fields as `TBD` instead of inventing specifications.

## Output Quality

- Be specific, visual, and production-minded.
- Keep style systems consistent across outputs.
- Do not over-explain; deliver the artifact.
- Avoid unverifiable claims about provenance, conservation, materials, or production.
- For video, preserve a sharp, natural, opinionated creator voice unless the user asks otherwise.
