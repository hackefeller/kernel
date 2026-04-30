---
# =============================================================================
# RESEARCH DOCUMENT TEMPLATE
# =============================================================================
# Copy this file to create a research document (user research, market analysis).
# Fill in all fields below - see frontmatter-schema.md for full definitions.
# =============================================================================

# === IDENTITY ===
title: "Research Title"                # REQUIRED: Human-readable title
type: research                          # REQUIRED: client | venture | case-study | feature | research | architecture | prd | strategy | retrospective
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

# === DISCOVERY ===
domains: [industry, categories]        # REQUIRED: Business domains (e.g., healthcare, education)
tags: [technical, feature, keywords]   # REQUIRED: Searchable tags (e.g., ai, mobile, web)
keywords: [specific, terms, for, search]  # REQUIRED: Free-form search terms

# === RELATIONSHIPS ===
related:                                # OPTIONAL: Related documents
  - relative/path/to/doc.md
parent: relative/path/to/parent.md      # OPTIONAL: Parent document if sub-document

# === DOCUMENT METADATA ===
---

# Research: [Topic]

## Executive Summary

**One paragraph summarizing the research question, methodology, key findings, and recommendations.**

---

## Research Question

### Primary Question

What specific question are you trying to answer?

### Secondary Questions

1. **Question 1**: 
2. **Question 2**: 

---

## Methodology

### Research Type

- [ ] User Interviews
- [ ] Surveys
- [ ] Competitive Analysis
- [ ] Market Analysis
- [ ] Usability Testing
- [ ] A/B Testing
- [ ] Other: 

### Participants

- **Number of Participants**: 
- **Selection Criteria**: 
- **Demographics**: 

### Data Collection

Describe how data was collected.

### Analysis Approach

Describe how data was analyzed.

---

## Findings

### Finding 1

**Description**:  
**Evidence**:  
**Implication**: 

### Finding 2

**Description**:  
**Evidence**:  
**Implication**: 

### Finding 3

**Description**:  
**Evidence**:  
**Implication**: 

---

## Quotes & Insights

### Participant Quotes

> "Quote 1"
> — Participant [ID]

> "Quote 2"
> — Participant [ID]

### Key Insights

1. **Insight 1**: 
2. **Insight 2**: 

---

## Recommendations

### Recommendation 1

**Based on**: Finding 1  
**Recommendation**:   
**Priority**: High | Medium | Low

### Recommendation 2

**Based on**: Finding 2  
**Recommendation**:   
**Priority**: High | Medium | Low

---

## Limitations

- **Limitation 1**: 
- **Limitation 2**: 

---

## Next Steps

- [ ] Action 1
- [ ] Action 2

---

## Appendix

### Raw Data

[Link to raw data or include summary]

### Interview Guide

[Include interview questions]

### Survey Questions

[Include survey questions]

---

## Related Documents

- [Related Document 1](path/to/doc.md)
- [Related Document 2](path/to/doc.md)