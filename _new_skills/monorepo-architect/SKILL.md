---
name: monorepo-architect
description: Audit, simplify, and refactor TypeScript monorepos using Turborepo, pnpm workspaces, Expo/React Native, web apps, Hono API/RPC, Drizzle, Postgres, TanStack Query, and ArkType. Use when Codex needs to review package boundaries, reduce duplicated code, propose behavior-preserving refactor plans, reorganize workspace architecture, enforce layer boundaries, or implement monorepo-wide structural changes.
---

# Monorepo Architect

## Modes

Use this skill in one of two modes:

1. **Audit mode:** analyze the monorepo and produce a concrete refactor strategy. Read [audit-rubric.md](references/audit-rubric.md).
2. **Refactor mode:** implement or plan architectural changes across packages. Read [refactor-contract.md](references/refactor-contract.md).

If the user asks for a review, diagnosis, assessment, or plan, default to audit mode. If the user asks to reorganize, rewrite, wire, or implement, use refactor mode after gathering enough context.

## North Star

Prefer:

- less code
- fewer layers
- fewer duplicated concepts
- clearer package boundaries
- stronger alignment between runtime truth and TypeScript truth
- explicit cross-layer mapping
- incremental, behavior-preserving changes
- boring, enforceable structure over abstraction theater

Do not recommend a rewrite unless the existing structure is fundamentally broken and incremental migration is not credible.

## Required Context Gathering

Before giving recommendations or editing code, inspect the actual repo shape. Use fast local tools first:

- `rg --files`
- workspace manifests such as `package.json`, `pnpm-workspace.yaml`, `turbo.json`
- package-level `package.json` files
- `tsconfig` and path alias configuration
- API/RPC/router/schema/db directories
- app/web/mobile query and client usage

When making code changes, preserve user work in a dirty tree. Do not revert unrelated changes.

## Audit Output

For audit mode, produce:

1. Executive summary
2. Current architecture assessment
3. Package-by-package assessment
4. Cross-cutting duplication and over-engineering map
5. Code reduction map
6. Target architecture proposal
7. Prioritized refactor plan
8. Risk and regression analysis
9. Final recommendation

Use [audit-rubric.md](references/audit-rubric.md) for what to inspect and how to score findings.

## Refactor Output

For refactor mode, produce or implement:

1. Target package/layer structure
2. Explicit boundary rules
3. File naming and artifact naming rules
4. Migration phases
5. Concrete edits, if requested
6. Validation commands
7. Residual risks

Use [refactor-contract.md](references/refactor-contract.md) for layer responsibilities, anti-patterns, and transformation rules.

## Style

Be skeptical, concrete, and migration-safe. Prefer high-signal findings over generic architecture advice. Explain why each recommendation reduces code, removes duplication, clarifies ownership, or lowers future maintenance cost.
