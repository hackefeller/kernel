---
# =============================================================================
# RETROSPECTIVE TEMPLATE
# =============================================================================
# Copy this file to create a retrospective (post-mortem, learnings).
# Fill in all fields below - see frontmatter-schema.md for full definitions.
# =============================================================================

# === IDENTITY ===
title: "Retrospective Title"           # REQUIRED: Human-readable title
type: retrospective                     # REQUIRED: client | venture | case-study | feature | research | architecture | prd | strategy | retrospective
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

# === DISCOVERY ===
domains: [industry, categories]        # REQUIRED: Business domains (e.g., healthcare, education)
tags: [technical, feature, keywords]   # REQUIRED: Searchable tags (e.g., ai, mobile, web)
keywords: [specific, terms, for, search]  # REQUIRED: Free-form search terms

# === RELATIONSHIPS ===
related:                                # OPTIONAL: Related documents
  - relative/path/to/doc.md
parent: relative/path/to/parent.md      # OPTIONAL: Parent document if sub-document

# === METRICS ===
impact_areas: [user-growth, revenue, technical-debt, performance]  # OPTIONAL: Business impact areas

# === DOCUMENT METADATA ===
---

# Retrospective: [Project/Feature Name]

## Overview

**One paragraph summarizing what was accomplished, the timeframe, and the purpose of this retrospective.**

---

## Project Summary

### What Was Built

Describe what was delivered.

### Timeline

| Phase | Start | End | Notes |
|-------|-------|-----|-------|
|       |       |     |       |

### Team

| Name | Role | Time Spent |
|------|------|------------|
|      |      |            |

---

## What Went Well

### Successes

1. **Success 1**: Description
   - **Impact**: 

2. **Success 2**: Description
   - **Impact**: 

### Things to Celebrate

- 

---

## What Could Have Gone Better

### Challenges

1. **Challenge 1**: Description
   - **Root Cause**: 
   - **Impact**: 

2. **Challenge 2**: Description
   - **Root Cause**: 
   - **Impact**: 

### Mistakes Made

- 

---

## Lessons Learned

### Process Improvements

| Lesson | Recommendation | Priority |
|--------|---------------|----------|
|        |               |          |

### Technical Learnings

| Lesson | Recommendation | Priority |
|--------|---------------|----------|
|        |               |          |

### Team & Communication

| Lesson | Recommendation | Priority |
|--------|---------------|----------|
|        |               |          |

---

## Metrics Review

### Planned vs Actual

| Metric | Planned | Actual | Variance |
|--------|---------|--------|----------|
|        |         |        |          |

### Key Outcomes

- **Outcome 1**: 
- **Outcome 2**: 

---

## Action Items

### Immediate Actions (Next Sprint)

- [ ] Action 1 (Owner: , Due: )
- [ ] Action 2 (Owner: , Due: )

### Medium-Term Actions (Next Quarter)

- [ ] Action 1 (Owner: , Due: )
- [ ] Action 2 (Owner: , Due: )

### Long-Term Actions (Strategic)

- [ ] Action 1 (Owner: , Due: )
- [ ] Action 2 (Owner: , Due: )

---

## Would We Do It Again?

**Answer**: Yes / No / With Changes

**Rationale**: 

---

## Related Documents

- [Project Document](path/to/doc.md)
- [Previous Retrospective](path/to/doc.md)