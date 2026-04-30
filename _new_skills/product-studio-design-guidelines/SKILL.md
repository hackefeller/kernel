---
name: product-studio-design-guidelines
description: Use when designing, reviewing, or writing UI, product copy, brand systems, visual identity, print production guidance, or product studio artifacts for Ponti Studios, Hakumi, or related studio work. Applies to app interfaces, websites, design systems, AI product behavior, brand tone, accessibility reviews, cross-device UX, and premium physical/print presentation standards.
---

# Product Studio Design Guidelines

## Overview

Use this skill to make product and brand work feel like Ponti Studios: unified, quiet, accessible, premium, and built around the user's work rather than decorative self-expression.

The core stance is that mature tools should reduce visual choice at the interface layer so users can spend attention on their own work. Design should feel like a clean, reliable stage: calm, exacting, cross-device, and materially honest.

## First Moves

1. Identify the surface: digital product, brand/copy, design system, or physical production.
2. Check existing project tokens, components, and docs before inventing new primitives.
3. Prefer one strong default interface over theme systems or decorative variants.
4. Design for attention, accessibility, and continuity across devices.
5. When the task is brand-specific, load the relevant reference:
   - Hakumi digital product, voice, and identity: `references/hakumi.md`
   - Print, physical goods, archival art, and material standards: `references/production.md`
   - Full studio doctrine and review checklist: `references/studio-principles.md`

## Studio Principles

### Unified Interfaces Win

Do not treat theming as a default virtue. A standard interface preserves user mental models, lowers cognitive load, improves accessibility guarantees, and creates trust across devices.

Avoid:
- User-customizable palettes as a central product feature
- Novel texture or color systems that make controls harder to recognize
- Local one-off UI styles that break spatial memory
- Visual novelty that makes the user solve the interface before doing the work

Prefer:
- A single vetted visual standard
- Stable placement for navigation, save, close, state, and action patterns
- Reusable semantic colors with consistent meanings
- Predictable cross-device behavior

### Negative Space Is Functional

Whitespace is not emptiness; it is attention management. Interfaces can be information-dense, but they should still feel breathable, organized, and easy to scan.

Use negative space to reveal hierarchy, pacing, and calm. Do not compensate for weak information architecture with cards, borders, gradients, or decorative sections.

### Accessibility Is Non-Negotiable

Treat software as infrastructure. A unified standard allows the studio to guarantee contrast, semantic color, readable typography, and predictable control behavior.

Always check:
- Text/background contrast
- Color meaning independent of color alone
- Focus states and keyboard reachability
- Touch target size
- Reduced ambiguity in icons, labels, errors, and empty states

### The Interface Should Disappear

The best interface becomes a clear window. It should feel refined, but not attention-seeking. Let the user's notes, goals, work, art, or decisions carry the personality.

## Visual Direction

For Ponti Studios digital work, default toward:
- Absolute black, pure white, and tonal grays
- Sparse, purposeful accents
- Quiet surfaces with crisp hierarchy
- Refined typography and generous line-height
- Dense but calm information architecture

Functional accent meanings:
- Red: urgent alerts, overdue tasks, destructive or critical states
- Green: completion, goal milestones, positive resolution
- Yellow: suggestions, active AI processing, temporary attention

Do not build a one-note decorative palette. Keep color semantic and restrained.

## Product Behavior

AI and product behavior should feel calm, minimal, and efficient.

Frame suggestions as help, not command. The product should wait when the user needs control and act only where the system has clear context. Error states should be direct, low-drama, and actionable.

For productivity tools, prioritize:
- Fast return to the user's flow
- Cross-device continuity
- Clear system state
- Low-friction capture and retrieval
- Integration of notes, calendars, AI conversations, and goals when relevant

## Design System Rules

Prefer a single source of truth for tokens and style configuration. If Tailwind is involved, avoid split-brain configuration: either wire `tailwind.config.ts` explicitly with `@config` or remove stale config.

For semantic classes:
- Use `@utility` when variant prefixes are needed in markup.
- Use plain/component classes when state behavior belongs in CSS selectors such as `.surface:focus-within`.
- Standardize on one pattern within a project.

## Physical Production Standard

For premium physical works, the standard is archival, museum-grade, and materially precise. Do not describe print production as generic merch. Treat high-value works as multi-generational assets.

Default language and specs should favor:
- Mohawk Superfine Eggshell 120lb / 324gsm where appropriate
- OBA-free, acid-neutral, buffered stock
- Archival giclee with mineral pigment language
- Custom ICC profiling for absorbent uncoated stock
- Off-gassing, filtration, authentication, museum acrylic, and reversible conservation mounting

Load `references/production.md` before writing detailed print specifications.

## Review Checklist

Before finishing design work, verify:
- The UI has one coherent standard, not a theme collection.
- The first screen is the actual product experience when building an app or tool.
- Layout supports scanning and repeated use.
- Text, controls, and dynamic states do not overlap at mobile or desktop sizes.
- Accent colors are semantic and consistent.
- Accessibility is protected by the system, not left to user taste.
- Copy is calm, minimal, and efficient.
- Any physical production claims match archival material standards.

## Source Notes

This skill was distilled from the vault docs under `design/`, including studio philosophy, production standards, Hakumi identity, Hakumi voice, Hakumi app spec, and design-system implementation tips.

The index mentions Kadosabi docs, but those files were not present in the source directory at skill creation time. Do not invent Kadosabi-specific canon unless future references are added.
