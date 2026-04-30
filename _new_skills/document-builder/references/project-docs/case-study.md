---
# =============================================================================
# CASE STUDY TEMPLATE
# =============================================================================
# Copy this file to create a completed work showcase.
# Fill in all fields below - see frontmatter-schema.md for full definitions.
# =============================================================================

# === IDENTITY ===
title: "Case Study Title"               # REQUIRED: Human-readable title
type: case-study                       # REQUIRED: client | venture | case-study | feature | research | architecture | prd | strategy | retrospective
category: clients | ventures            # REQUIRED: clients | ventures
project: project-slug                   # REQUIRED: Parent project identifier (kebab-case)

# === STATUS ===
status: completed                       # REQUIRED: discovery | active | paused | completed | canceled | archived

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
impact_areas: [user-growth, revenue, technical-debt, performance]  # REQUIRED: Business impact areas
kpis:                                    # REQUIRED: Key performance indicators
  - metric: "Metric Name"
    target: value
    current: value
    unit: "users|dollars|percent"

# === DOCUMENT METADATA ===
---

# Case Study: [Project Name]

## Executive Summary

**One paragraph summarizing the project, the challenge, the solution, and the outcome.**

---

## The Challenge

### Background

Describe the context before the project started.

### Problem Statement

What specific problem were you solving?

### Constraints & Requirements

- **Requirement 1**: 
- **Requirement 2**: 

---

## The Solution

### Approach

Describe your methodology and approach.

### Implementation

Describe the key technical or creative decisions and how they addressed the challenges.

### Key Deliverables

1. **Deliverable 1**: Description
2. **Deliverable 2**: Description

---

## Results & Impact

### Quantitative Results

| Metric | Before | After | Change |
|--------|--------|-------|--------|
|        |        |       |        |

### Qualitative Results

- **Outcome 1**: Description
- **Outcome 2**: Description

### Business Impact

How did this work impact the business?

---

## Lessons Learned

### What Worked Well

-

### Challenges & How We Overcame Them

1. **Challenge**: Description
   **Solution**: 

### Recommendations for Future Work

-

---

## Technical Details

### Architecture/Tech Stack

Describe the technologies used and why.

### Code Examples (Optional)

```language
// Example code if relevant
```

---

## Team

| Name | Role | Contribution |
|------|------|---------------|
|      |      |               |

---

## Timeline

| Phase | Duration | Key Activities |
|-------|----------|----------------|
|       |          |                |

---

## Related Documents

- [Related Document 1](path/to/doc.md)
- [Related Document 2](path/to/doc.md)