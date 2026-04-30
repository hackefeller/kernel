# Monorepo Audit Rubric

Use this reference for audit mode.

## Stack Lens

Assume the target monorepo may use:

- Turborepo
- pnpm workspaces
- Expo / React Native
- web app
- Hono API
- Hono RPC
- Drizzle
- Postgres
- TanStack Query
- ArkType

Adapt to the repo's real stack. Do not force conclusions from missing tools.

## Core Objective

Identify the highest-leverage opportunities to:

- reduce code volume
- remove duplication
- collapse unnecessary package boundaries
- standardize patterns across app, web, API, and shared packages
- eliminate over-engineering
- simplify data flow
- align runtime validation, transport contracts, and database shapes where appropriate
- preserve all existing product behavior unless explicitly justified otherwise

Assume production use. Balance simplicity with migration safety.

## What To Analyze

### 1. Workspace Structure

Assess whether package boundaries reflect real ownership and reuse.

Look for:

- too many tiny packages with weak identities
- packages created for theoretical reuse
- `shared`, `common`, `core`, `utils`, `types`, `models`, `sdk`, `api-client`, `ui`, `config`, `db`, or `schemas` packages that became dumping grounds
- path aliases hiding poor boundaries
- duplicated business logic across app, web, and API
- duplicated type/schema/client definitions
- packages coupled through implementation details
- circular dependencies or soft circular dependencies
- packages that exist mainly to make the architecture diagram look clean

For each package, determine:

- current responsibility
- whether responsibility is well-scoped
- whether the package truly needs to exist
- whether it should be kept, merged, split, simplified, relocated, or removed

### 2. Turborepo / pnpm Usage

Evaluate whether tooling reduces complexity or enables package proliferation.

Look for:

- packages that could be folders instead of workspaces
- task graphs that are more complicated than needed
- redundant build/typecheck/lint/test steps
- private packages with unnecessary publishing ceremony
- weak workspace dependency hygiene
- excessive cross-workspace imports
- packages that only re-export code
- duplicate config with little benefit

### 3. TypeScript And Runtime Truth

Analyze whether TypeScript types, runtime schemas, database shapes, and RPC payloads are aligned without being conflated.

Look for:

- one type used as database model, domain entity, RPC payload, and UI view model
- duplicated types drifting across layers
- schemas that claim runtime safety but are not used at boundaries
- unsafe `any`, casts, type assertions, or inferred contracts that hide real shape changes
- unclear ownership of generated or inferred types

### 4. ArkType Strategy

Check whether ArkType is used for boundary validation rather than decorative type duplication.

Prefer:

- runtime schemas at external and cross-package boundaries
- inferred TypeScript from runtime schemas where appropriate
- explicit mappers when boundary shapes differ

Avoid:

- schema duplication for every internal object
- using schemas as a substitute for domain modeling
- validating the same shape repeatedly across layers

### 5. Hono API / RPC Architecture

Evaluate routers, handlers, RPC clients, middleware, validation, error handling, auth boundaries, and response shapes.

Look for:

- duplicated request/response contracts
- mixed handler/domain/persistence logic
- RPC types leaking into UI view models
- inconsistent error envelopes
- app clients bypassing typed RPC paths
- route modules with unclear ownership

### 6. Expo / React Native And Web

Assess shared UI and app logic critically.

Look for:

- sharing code because it is possible rather than valuable
- duplicated query hooks or API clients
- platform-specific behavior hidden behind vague shared abstractions
- business logic inside components
- inconsistent navigation, state, forms, and async patterns

### 7. TanStack Query

Look for:

- inconsistent query key factories
- duplicated query/mutation wrappers
- API calls outside query/mutation boundaries
- cache invalidation drift
- query hooks that mix UI shaping, transport, and domain logic
- missing error/loading conventions

### 8. Drizzle / Postgres

Look for:

- schema, repository, and service logic mixed together
- database rows reused as domain entities
- query duplication
- unclear transaction ownership
- migrations and schema definitions out of sync
- leaky persistence details in API or UI layers

### 9. Shared Package Strategy

Only share code that truly belongs at a cross-package boundary.

Shared code should have:

- clear ownership
- stable API
- real reuse
- narrow dependency surface
- name that describes what it contains

### 10. Code Reduction And Dependencies

Identify concrete deletions, merges, and simplifications.

Look for:

- unused exports
- re-export barrels with no value
- duplicated helpers
- wrapper packages around libraries that already provide the abstraction
- dependencies used by only one package but centralized too early

### 11. Migration Safety

Recommendations must specify:

- behavior-preserving migration path
- test/validation commands
- rollout order
- risk level
- likely regression surface
- what not to change yet

## Output Format

### 1. Executive Summary

- 3-7 bullets
- highest-leverage simplifications
- biggest risks
- recommended first move

### 2. Current Architecture Assessment

Explain the current shape, where it is working, and where it is overcomplicated.

### 3. Package-By-Package Assessment

For each package:

- current role
- keep / merge / split / remove / relocate
- reasoning
- risk

### 4. Duplication And Over-Engineering Map

List duplicated concepts, unnecessary layers, and likely deletion opportunities.

### 5. Code Reduction Map

Group by quick wins, medium refactors, and deeper changes.

### 6. Target Architecture Proposal

Describe package boundaries and dependency direction.

### 7. Prioritized Refactor Plan

Use phases:

- Phase 1: quick wins
- Phase 2: structural simplification
- Phase 3: deeper architectural changes

### 8. Risk And Regression Analysis

List behavior risks, test gaps, migration risks, and mitigations.

### 9. Final Recommendation

Give the next 1-3 concrete actions.
