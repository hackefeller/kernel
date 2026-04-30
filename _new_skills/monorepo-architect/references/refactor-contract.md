# Monorepo Refactor Contract

Use this reference for refactor mode.

## Role

Act as a senior staff-level monorepo architect and implementation agent.

Rewrite, reorganize, and wire the monorepo into a consistent architecture across:

- mobile
- web
- API
- RPC
- database / persistence
- shared domain logic

Do not preserve inconsistent legacy patterns just because they exist. Create coherent, enforceable software structure.

## Core Principles

1. Separate artifact types by purpose.
2. Name files after what they concretely contain.
3. Give every layer a clear job.
4. Enforce one-way dependency flow.
5. Make cross-layer transitions explicit.
6. Use runtime schemas for boundary data.
7. Do not use `shared` as a dumping ground.
8. Prefer consistency over local style differences.

## Target Architecture

Adapt names to the repo, but preserve clear boundaries:

- `apps/web`
- `apps/mobile`
- `apps/api`
- `packages/domain`
- `packages/rpc`
- `packages/data`
- `packages/ui-shared` only if justified
- `packages/shared-infra` only if justified

Do not force these exact names if the repo already has better equivalents.

## Layer Responsibilities

### Domain Layer

Contains:

- core business entities
- domain rules
- domain services / use cases
- pure business logic
- domain-specific types

Must not depend on React, React Native, API framework details, database ORM details, transport details, or UI state.

Suggested files:

- `*.types.ts`
- `*.service.ts`

### Data / Persistence Layer

Contains:

- Drizzle schema
- database queries
- repositories
- transactions
- persistence mappers

Must not export database rows as universal app types.

Suggested files:

- `*.db.ts`
- `*.repository.ts`
- `*.mapper.ts`

### RPC / Transport Layer

Contains:

- Hono route modules
- RPC procedure definitions
- request/response schemas
- transport error envelopes
- auth middleware at boundaries

Suggested files:

- `*.rpc.ts`
- `*.schema.ts`
- `*.route.ts`

### UI Layer

Contains:

- React / React Native views
- presentation components
- view models
- query hooks
- form state
- navigation-specific shaping

Suggested files:

- `*.view.tsx`
- `*.vm.ts`
- `*.queries.ts`
- `*.mutations.ts`

## Naming Rules

Prefer concrete file names:

- `user.types.ts`
- `user.schema.ts`
- `user.db.ts`
- `user.rpc.ts`
- `user.mapper.ts`
- `user.service.ts`
- `user.repository.ts`
- `user.vm.ts`

Avoid vague names unless rigorously defined:

- `contracts.ts`
- `helpers.ts`
- `utils.ts`
- `common.ts`
- `manager.ts`
- `provider.ts`
- `adapter.ts`
- `orchestrator.ts`

## Explicit Anti-Patterns

Avoid:

- one object shape reused across database, domain, RPC, and UI
- packages named by vagueness rather than responsibility
- cross-package imports that bypass intended public APIs
- barrel files that hide dependency direction
- generic internal frameworks around libraries that are already sufficient
- business logic in UI components
- persistence details leaking into API handlers or UI
- schemas duplicated across layers without a reason
- premature shared packages

## Rules For Contracts

- Runtime schemas define boundary data.
- TypeScript types may be inferred from schemas at boundaries.
- Domain types may differ from transport/database shapes.
- Shape changes must happen in mappers or equivalent boundary conversion points.
- Do not call a file `contracts.ts` unless the repo has a precise convention for what contract means.

## Transformation Rules

When implementing:

1. Read existing patterns before editing.
2. Identify boundaries and invariants before moving code.
3. Prefer small behavior-preserving phases.
4. Move code before rewriting logic when possible.
5. Add mappers where shape boundaries are currently blurred.
6. Keep public imports stable until consumers are migrated.
7. Delete obsolete wrappers only after all consumers move.
8. Update tests, imports, and docs as part of each phase.

## Validation Rules

Run the repo's relevant validation commands, such as:

- typecheck
- lint
- test
- app-specific build checks
- API contract tests
- query/schema tests

If validation cannot run, state why and list residual risk.

## Dependency Rules

Enforce one-way dependency flow:

- apps depend on packages
- transport depends on domain and data
- data may depend on domain types only when appropriate
- domain depends on nothing app/framework-specific
- UI must not import database code
- database must not import UI or transport code

## Refactoring Heuristics

Prefer:

- merging packages that only serve one consumer
- keeping domain logic pure
- placing runtime validation at boundaries
- deleting re-export packages
- using TanStack Query mutations for writes
- centralizing query key factories where useful
- explicit repositories for persistence if they reduce duplication

Be skeptical of:

- "shared" packages
- "core" packages
- generated SDKs inside the same monorepo when Hono RPC already provides types
- abstractions that only wrap one function
- config packages that increase indirection

## Output Requirements

When planning:

1. Target architecture
2. Migration phases
3. File moves / renames
4. Import updates
5. Validation plan
6. Risks and rollback notes

When implementing:

1. Make scoped changes.
2. Preserve behavior.
3. Validate.
4. Summarize changed files and remaining risks.
