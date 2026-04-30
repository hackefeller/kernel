---
# =============================================================================
# VENTURE PROJECT OVERVIEW TEMPLATE
# =============================================================================
# Copy this file to create a new venture (internal project) document.
# Fill in all fields below - see frontmatter-schema.md for full definitions.
# =============================================================================

# === IDENTITY ===
title: "Venture Project Title"          # REQUIRED: Human-readable title
type: venture                           # REQUIRED: client | venture | case-study | feature | research | architecture | prd | strategy | retrospective
category: ventures                      # REQUIRED: clients | ventures
project: project-slug                   # REQUIRED: Parent project identifier (kebab-case)

# === STATUS ===
status: active                          # REQUIRED: discovery | active | paused | completed | canceled | archived
stage: mvp                              # REQUIRED: concept | mvp | growth | mature | sunset (ventures only)

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
client: null                            # REQUIRED: null for internal ventures

# === TECHNICAL ===
tech_stack: [Technology, List]         # REQUIRED: All technologies used
repository: URL | n/a                   # REQUIRED: Code repository URL or n/a
deployment: URL | n/a                    # OPTIONAL: Production deployment URL

# === BUSINESS ===
budget: "$amount" | internal | confidential  # REQUIRED: Project budget
revenue_model: consulting | subscription | transaction | ads | internal | null  # REQUIRED: How it generates revenue
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

# === METRICS ===
impact_areas: [user-growth, revenue, technical-debt, performance]  # OPTIONAL: Business impact areas
kpis:                                    # OPTIONAL: Key performance indicators
  - metric: "Metric Name"
    target: value
    current: value
    unit: "users|dollars|percent"

# === DOCUMENT METADATA ===
---

# Venture Overview

## Vision

**One sentence describing the ultimate goal of this venture.**

What problem are you solving? For whom? Why now?

---

## Problem Statement

### The Problem

Describe the core problem in detail. Include:
- Current state
- Who is affected
- Consequences of not solving

### Target Market

- **Market Size**: 
- **Target Users**: 
- **Market Trends**: 

---

## Solution

### Product/Service Description

What are you building? How does it solve the problem?

### Key Features

1. **Feature 1**: Description
2. **Feature 2**: Description
3. **Feature 3**: Description

### Business Model

- **Revenue Model**: 
- **Pricing Strategy**: 
- **Unit Economics**: 

---

## Competition

### Competitive Landscape

| Competitor | Strengths | Weaknesses | Our Differentiation |
|------------|-----------|------------|---------------------|
|            |           |            |                     |

---

## Roadmap

### Phase 1: MVP (Current)

- [ ] Feature A
- [ ] Feature B

### Phase 2: Growth

- [ ] Feature C
- [ ] Feature D

### Phase 3: Scale

- [ ] Feature E
- [ ] Feature F

---

## Team

| Name | Role | Background |
|------|------|------------|
|      |      |            |

---

## Metrics & Goals

### KPIs

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
|        |        |         |        |

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
|      |           |        |            |

---

## Next Steps

- [ ] Action item 1
- [ ] Action item 2