---
# =============================================================================
# PRODUCT REQUIREMENTS DOCUMENT (PRD) TEMPLATE
# =============================================================================
# Copy this file to create a new PRD.
# Fill in all fields below - see frontmatter-schema.md for full definitions.
# =============================================================================

# === IDENTITY ===
title: "PRD Title"                       # REQUIRED: Human-readable title
type: prd                                # REQUIRED: client | venture | case-study | feature | research | architecture | prd | strategy | retrospective
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

# PRD: [Product/Feature Name]

## Overview

**One paragraph summarizing what this product/feature is, who it's for, and why it matters.**

---

## Problem Statement

### The Problem

Describe the specific problem this product solves.

### Who Has This Problem

- **Primary User**: 
- **Secondary Users**: 

### Current Alternatives

How do users currently solve this problem?

---

## Goals & Success Metrics

### Product Goals

1. **Goal 1**: 
2. **Goal 2**: 

### Success Metrics

| Metric | Definition | Target |
|--------|------------|--------|
|        |            |        |

---

## User Personas

### Persona 1

**Name**:   
**Role**:   
**Goals**:   
**Pain Points**:   
**How We Help**: 

### Persona 2

**Name**:   
**Role**:   
**Goals**:   
**Pain Points**:   
**How We Help**: 

---

## User Stories

### Must Have

1. **As a** [user] **I want to** [action] **so that** [benefit]
   - [ ] Acceptance criteria

2. **As a** [user] **I want to** [action] **so that** [benefit]
   - [ ] Acceptance criteria

### Should Have

3. **As a** [user] **I want to** [action] **so that** [benefit]
   - [ ] Acceptance criteria

### Could Have

4. **As a** [user] **I want to** [action] **so that** [benefit]
   - [ ] Acceptance criteria

---

## Functional Requirements

### Requirement 1

**Description**:  
**Priority**: Must Have | Should Have | Could Have | Won't Have  
**User Story**:   
**Acceptance Criteria**:
- [ ] 
- [ ] 

### Requirement 2

**Description**:  
**Priority**: Must Have | Should Have | Could Have | Won't Have  
**User Story**:   
**Acceptance Criteria**:
- [ ] 
- [ ] 

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

### Scalability

- **Requirement**: 
- **Target**: 

---

## UI/UX Requirements

### Layout

Describe layout requirements.

### Visual Design

- **Color Palette**: 
- **Typography**: 
- **Spacing**: 

### Components

| Component | States | Behavior |
|-----------|--------|----------|
|           |        |          |

### User Flows

#### Primary Flow

1. Step 1
2. Step 2
3. Step 3

#### Error Flows

1. Error scenario handling

---

## Technical Requirements

### Architecture

Describe any architectural requirements.

### API Requirements

| Endpoint | Method | Description |
|----------|--------|-------------|
|          |        |             |

### Data Requirements

| Data | Source | Storage | Retention |
|------|--------|---------|-----------|
|      |        |         |           |

### Third-Party Integrations

| Service | Purpose | Requirements |
|---------|---------|--------------|
|         |         |              |

---

## Analytics & Tracking

| Event | Trigger | Properties |
|-------|---------|------------|
|        |         |            |

---

## Launch Plan

### Phased Rollout

- [ ] Phase 1: Description
- [ ] Phase 2: Description

### Go/No-Go Criteria

| Criterion | Threshold |
|-----------|-----------|
|           |           |

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

## Appendix

### Glossary

| Term | Definition |
|------|------------|
|      |            |

### References

- [Reference 1](url)
- [Reference 2](url)