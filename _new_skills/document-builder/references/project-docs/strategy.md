---
# =============================================================================
# STRATEGY DOCUMENT TEMPLATE
# =============================================================================
# Copy this file to create a strategy document (vision, positioning, go-to-market).
# Fill in all fields below - see frontmatter-schema.md for full definitions.
# =============================================================================

# === IDENTITY ===
title: "Strategy Title"                # REQUIRED: Human-readable title
type: strategy                          # REQUIRED: client | venture | case-study | feature | research | architecture | prd | strategy | retrospective
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

# === METRICS ===
impact_areas: [user-growth, revenue, technical-debt, performance]  # OPTIONAL: Business impact areas
kpis:                                    # OPTIONAL: Key performance indicators
  - metric: "Metric Name"
    target: value
    current: value
    unit: "users|dollars|percent"

# === DOCUMENT METADATA ===
---

# Strategy: [Title]

## Executive Summary

**One paragraph summarizing the strategic vision, key opportunities, and expected outcomes.**

---

## Vision & Mission

### Vision

**What does success look like in 3-5 years?**

Describe the long-term aspirational state.

### Mission

**Why do we exist? What problem are we solving?**

One sentence describing your core purpose.

### Values

- **Value 1**: 
- **Value 2**: 

---

## Market Analysis

### Market Size

- **TAM (Total Addressable Market)**: 
- **SAM (Serviceable Addressable Market)**: 
- **SOM (Serviceable Obtainable Market)**: 

### Market Trends

1. **Trend 1**: Description and impact
2. **Trend 2**: Description and impact

### Customer Segments

| Segment | Size | Needs | Priority |
|---------|------|-------|----------|
|         |      |       |          |

---

## Competitive Landscape

### Competitors

| Competitor | Strengths | Weaknesses | Market Position |
|------------|-----------|------------|------------------|
|            |           |            |                  |

### Competitive Advantages

1. **Advantage 1**: Description
2. **Advantage 2**: Description

### Barriers to Entry

- **Barrier 1**: 
- **Barrier 2**: 

---

## Product Strategy

### Value Proposition

**One sentence describing the unique value delivered to customers.**

### Key Pillars

1. **Pillar 1**: Description
2. **Pillar 2**: Description
3. **Pillar 3**: Description

### Product Roadmap

| Phase | Timeline | Focus | Key Deliverables |
|-------|----------|-------|------------------|
|       |          |       |                  |

---

## Go-to-Market Strategy

### Channel Strategy

| Channel | Target Customers | Expected ROI | Investment |
|---------|------------------|--------------|------------|
|         |                  |              |            |

### Pricing Strategy

- **Model**: 
- **Tiers**: 
- **Rationale**: 

### Marketing Strategy

| Initiative | Target | Timeline | Budget |
|------------|--------|----------|--------|
|            |        |          |        |

---

## Sales Strategy

### Sales Model

- **Direct**: 
- **Indirect**: 
- **Channel Partners**: 

### Sales Process

1. **Stage 1**: 
2. **Stage 2**: 
3. **Stage 3**: 

### Target Accounts

| Segment | # Accounts | ACV | Priority |
|---------|-------------|-----|----------|
|         |             |     |          |

---

## Financial Projections

### Revenue Model

- **Revenue Streams**: 
- **Unit Economics**: 

### Projections

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Revenue|        |        |        |
| Users  |        |        |        |
| CAC    |        |        |        |
| LTV    |        |        |        |

---

## Team & Organization

### Key Roles

| Role | Responsibilities | Headcount |
|------|-----------------|-----------|
|      |                 |           |

### Organizational Structure

[Describe org structure]

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
|      |           |        |            |

---

## Success Metrics

| Metric | Definition | Target | Timeline |
|--------|------------|--------|----------|
|        |            |        |          |

---

## Timeline & Milestones

- [ ] **Milestone 1**: Description (Date)
- [ ] **Milestone 2**: Description (Date)
- [ ] **Milestone 3**: Description (Date)

---

## Next Steps

- [ ] Action 1
- [ ] Action 2

---

## Appendix

### Assumptions

- Assumption 1
- Assumption 2

### References

- [Reference 1](url)
- [Reference 2](url)