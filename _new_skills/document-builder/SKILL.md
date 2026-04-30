---
name: document-builder
description: Create highly opinionated working documents from rough notes, conversations, briefs, or source material. Use when Codex needs to draft, rewrite, or structure project docs, product docs, PRDs, research notes, strategy docs, architecture docs, proposals, case studies, meeting notes, pitch decks, outreach, daily notes, ideas, user stories, pre-mortems, all-hands outlines, Excalidraw starters, or agent skill design docs.
---

# Document Builder

Use this skill as the canonical document builder for the vault. It should make documents feel like real working artifacts: clear, useful, opinionated, and ready to live in the system.

## Core Workflow

1. Identify the document type, audience, project, and intended use.
2. Choose the closest reference from `references/project-docs/` or `references/general/`.
3. Produce a filled document, not a template with placeholders.
4. Preserve useful frontmatter conventions and relative links.
5. Remove instructional filler unless the user explicitly asks for a blank template.
6. Mark unsupported facts as `TBD` instead of inventing details.
7. Prefer the narrower skill when the task is clearly media strategy, workshop design, art object dossiers, videos, business dossiers, lyrics, image style, or codebase architecture.

## Project Documents

Use `references/project-docs/` for studio, client, product, and project documents:

- **Architecture**: `architecture.md` for system design, technical architecture, infrastructure, or data flow.
- **Case study**: `case-study.md` for completed work, portfolio writeups, outcomes, or project showcases.
- **Client overview**: `client.md` for client project summaries and engagement overviews.
- **Feature spec**: `feature.md` for feature-level product specs.
- **PRD**: `prd.md` for product requirements, flows, scope, and release planning.
- **Research**: `research.md` for discovery, user research, market research, and competitive analysis.
- **Retrospective**: `retrospective.md` for postmortems, after-action reviews, and lessons learned.
- **Strategy**: `strategy.md` for vision, positioning, go-to-market, portfolio, or business strategy.
- **Venture**: `venture.md` for internal products and ventures.
- **Lightweight shells**: use `*-template.md`, `meeting-notes-template.md`, or `lightweight-template.md` when the fuller templates are too heavy.
- **StreamYard/Collab docs**: use the StreamYard collaboration references for client-specific testing, feedback, and collaboration guides.
- **Proposal DOCX assets**: use `assets/project-docs/` when the requested output is a proposal document asset.

## General Documents

Use `references/general/` for recurring vault documents:

- **Daily note**: `daily-note.md`
- **1-on-1**: `one-on-one.md`
- **Idea**: `idea.md`
- **Project page**: `project.md`
- **User story**: `user-story.md`
- **Market research stub**: `market-research.md`
- **User outreach**: `user-outreach.md`
- **User interview email**: `user-interview-email.md`
- **Pre-mortem**: `pre-mortem.md`
- **All-hands outline**: `all-hands.md`
- **Product pitch deck**: `product-slide-deck.md`
- **Agent skill design**: `agent-skill-architecture.md`; prefer the system `skill-creator` skill when available.
- **Excalidraw starter**: use `assets/general/excalidraw-template.md` when a blank Obsidian Excalidraw canvas is requested.

## Defaults

- Default status: `discovery` for new projects unless the source clearly says otherwise.
- Default category: `ventures` for internal products and `clients` for client work.
- Use `n/a` for repository, deployment, or budget when unknown.
- Use concise, decisive prose. The document should feel like a real artifact, not a form.

## Quality Bar

- Make the document immediately useful after creation.
- Keep structure strong, but cut sections that do not serve the job.
- Prefer concrete decisions, open questions, risks, and next actions over generic description.
- Write in a practical studio voice: direct, sharp, plainspoken, and specific.
- Do not over-polish personal notes; do polish client-facing, portfolio, proposal, and strategy docs.
