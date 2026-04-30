---
# =============================================================================
# FEATURE SPECIFICATION TEMPLATE
# =============================================================================
# Copy this file to create a new feature specification or PRD.
# Fill in all fields below - see frontmatter-schema.md for full definitions.
# =============================================================================

# === IDENTITY ===
title: "Feature Name"                   # REQUIRED: Human-readable title
type: feature                           # REQUIRED: client | venture | case-study | feature | research | architecture | prd | strategy | retrospective
category: clients | ventures            # REQUIRED: clients | ventures
project: project-slug                   # REQUIRED: Parent project identifier (kebab-case)

# === STATUS ===
status: discovery                       # REQUIRED: discovery | active | paused | completed | canceled | archived

# === DATES ===
created: YYYY-MM-DD                     # REQUIRED: Document creation date
updated: YYYY-MM-DD                     # REQUIRED: Last significant update
start_date: YYYY-MM-DD                  # REQUIRED: When work began
end_date: YYYY-MM-DD | ongoing | null  # REQUIRED: End date or ongoing

# === PEOPLE ===
owner: "First Last"                    # REQUIRED: Primary owner/author
team:                                    # REQUIRED: All contributors
  - "First Last (Role)"
  - "First Last (Role)"
client: "Client Name" | null           # REQUIRED: Client organization name or null

# === TECHNICAL ===
tech_stack: [Technology, List]         # REQUIRED: All technologies used (if technical)
repository: URL | n/a                   # REQUIRED: Code repository URL or n/a
deployment: URL | n/a                    # OPTIONAL: Production deployment URL

# === BUSINESS ===
priority: critical | high | medium | low  # REQUIRED: Business priority

# === DISCOVERY ===
domains: [industry, categories]        # REQUIRED: Business domains (e.g., healthcare, education)
tags: [technical, feature, keywords]   # REQUIRED: Searchable tags (e.g., ai, mobile, web)
keywords: [specific, terms, for, search]  # REQUIRED: Free-form search terms

# === RELATIONSHIPS ===
related:                                # OPTIONAL: Related documents
  - relative/path/to/doc.md
parent: relative/path/to/parent.md      # OPTIONAL: Parent document if sub-document
dependencies:                           # OPTIONAL: Dependent projects
  - project-slug-1

# === DOCUMENT METADATA ===
---

# Feature Specification: [Feature Name]

## Overview

**One sentence describing what this feature is and why it matters.**

---

## Problem Statement

### The Problem

Describe the specific problem this feature solves.

### Who Experiences This Problem

- **User Segment 1**: 
- **User Segment 2**: 

### Current Workaround

How do users currently solve this problem (if at all)?

---

## Goals & Success Criteria

### Goals

1. **Goal 1**: Description
2. **Goal 2**: Description

### Success Criteria

| Criterion | Target | Measurement |
|-----------|--------|-------------|
|           |        |             |

---

## User Stories

### User Story 1

**As a** [user type]  
**I want to** [action]  
**So that** [benefit]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2

### User Story 2

**As a** [user type]  
**I want to** [action]  
**So that** [benefit]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2

---

## Functional Requirements

### Requirement 1

**Description**:  
**Priority**: Must Have | Should Have | Could Have | Won't Have  
**Dependencies**: 

### Requirement 2

**Description**:  
**Priority**: Must Have | Should Have | Could Have | Won't Have  
**Dependencies**: 

---

## Non-Functional Requirements

### Performance

- **Requirement**: 
- **Target**: 

### Security

- **Requirement**: 
- **Target**: 

### Accessibility

- **Requirement**: 
- **Target**: 

---

## Design

### UI/UX Overview

Describe the expected user interface and experience.

### Wireframes/Mockups

[Link to design files or describe the UI]

### User Flows

1. **Flow 1**: Step-by-step description

---

## Technical Design

### Architecture Changes

Describe any architectural changes required.

### API Design

#### Endpoint 1

```
Method: GET/POST/PUT/DELETE
Path: /api/resource
Request: 
Response: 
```

### Data Model

```typescript
// Example type definition
interface FeatureData {
  field: string;
}
```

### Edge Cases

1. **Edge Case 1**: Description and handling

---

## Implementation Plan

### Phases

#### Phase 1: MVP

- [ ] Task 1
- [ ] Task 2

#### Phase 2: Enhancement

- [ ] Task 3
- [ ] Task 4

---

## Testing Strategy

### Unit Tests

- [ ] Test case 1
- [ ] Test case 2

### Integration Tests

- [ ] Test case 1

### Manual Testing

- [ ] Test case 1

---

## Metrics & Analytics

| Metric | Description | Target |
|--------|-------------|--------|
|        |             |        |

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
|      |           |        |            |

---

## Open Questions

- Question 1?
- Question 2?

---

## Related Documents

- [Related Document 1](path/to/doc.md)
- [Related Document 2](path/to/doc.md)