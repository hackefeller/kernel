---
# COPY THIS TEMPLATE and fill in your project details
type: client | internal | proof-of-concept | lab-experiment # REQUIRED: Pick one
status: discovery | active | paused | completed | archived # REQUIRED: Current state
client: Client Name # REQUIRED for type=client, omit for internal
start_date: YYYY-MM-DD # REQUIRED: When project began
end_date: YYYY-MM-DD | ongoing # REQUIRED: End date or ongoing
team: # REQUIRED: List all team members
  - Name (Role)
  - Name (Role)
tech_stack: [technology, list] # REQUIRED: Technologies used
budget: amount | internal | confidential # REQUIRED: Budget info
priority: high | medium | low # REQUIRED: Project priority
impact_areas: [business, goals] # REQUIRED: Areas of impact
repository: URL | n/a # REQUIRED: Code repo or n/a
tags: [relevant, keywords] # REQUIRED: Searchable tags
---

# Project Name

## The Challenge

**What problem are you solving? Frame it as a compelling question.**

Describe the context and why this matters. What is the current state? Who is affected? What are the consequences of not solving this?

**Key Problems:**

- **Problem 1**: Specific description with impact
- **Problem 2**: Specific description with impact
- **Problem 3**: Specific description with impact

---

## The Solution

**What are you building/creating? High-level approach in one sentence.**

Explain your solution approach. How does it address the challenges above?

### Features & Capabilities

#### Feature Name

Description of what this feature does.

- Bullet point about functionality
- Bullet point about functionality
- Bullet point about functionality

**Addresses**: Which problem from The Challenge does this solve?

#### Another Feature

Description...

### Technical Architecture

#### System Design

Brief description of architecture approach.

#### Technology Stack

- **Frontend**: [Framework/technologies]
- **Backend**: [Framework/technologies]
- **Database**: [Technology]
- **Infrastructure**: [Cloud/hosting]

---

## Progress & Outcomes

### Current Status

**One sentence describing current state.** (e.g., "Project completed March 2024.", "In active development - MVP launching next month.", "Discovery phase - researching user needs.")

### Key Milestones

| Date | Milestone | Status |
|---

---|-----------|--------|
| YYYY-MM-DD | Milestone name | Complete/In Progress/Planned |
| YYYY-MM-DD | Milestone name | Complete/In Progress/Planned |
| YYYY-MM-DD | Milestone name | Complete/In Progress/Planned |

### Target Metrics

- **Metric 1**: Target (e.g., "User adoption: 1000+ users within 3 months")
- **Metric 2**: Target (e.g., "Performance: <2 second load time")
- **Metric 3**: Target (e.g., "Conversion: 15% trial-to-paid rate")

### Actual Outcomes

If project is complete or has results:

- Outcome 1 with specific numbers
- Outcome 2 with specific numbers

---

## Next Steps

### Immediate (This Week/Month)

1. **Task 1**: Description
2. **Task 2**: Description
3. **Task 3**: Description

### Medium-Term (Next Quarter)

1. **Goal 1**: Description
2. **Goal 2**: Description

### Future Vision

Long-term aspiration for this project.

---

## Resources & Links

### Documentation

- [Document name](link)
- [Document name](link)

### Assets

- [Asset description](link)
- [Asset description](link)

### Related Projects

- [Related project](link)
- [Related project](link)

---

## Team Reflections

### What Worked

- What went well?
- What should you repeat?

### What We Learned

- Key insights
- Surprising discoveries

### What We'd Do Differently

- Changes for next time
- Avoided pitfalls

---

## Instructions for Using This Template

### 1. Copy This File

Copy this template to create a new project file:

```bash
cp PROJECT-TEMPLATE.md your-project-name.md
```

### 2. Fill in Frontmatter

Replace all bracketed placeholders with actual values:

- All fields marked REQUIRED must be filled
- Use "unknown" or "TBD" if information isn't available yet
- Dates must be in YYYY-MM-DD format
- Arrays use [item1, item2] format

### 3. Complete All Sections

- **The Challenge**: Define 2-3 specific problems with context
- **The Solution**: Describe features and how they address challenges
- **Progress & Outcomes**: Current status, milestones, metrics
- **Next Steps**: Immediate, medium-term, and future plans
- **Resources**: Links to documentation, assets, related work
- **Team Reflections**: Capture learnings (even for ongoing projects)

### 4. Follow Content Guidelines

- Be specific: Use numbers, dates, and concrete examples
- Connect sections: Every feature should address a specific problem
- Be honest: Include challenges and what didn't work
- Keep it current: Update status and next steps regularly

### 5. File Naming

Use kebab-case (hyphens between words):

- ✅ `client-name-project-name.md`
- ✅ `internal-project-name.md`
- ❌ `Project Name.md` (spaces)
- ❌ `projectName.md` (camelCase)

### 6. Save Location

Place files in appropriate directories:

- Client projects: `/projects/clients/[client-name]/`
- Internal projects: `/projects/internal/`

### 7. Validation Checklist

Before finalizing, verify:

---

**Questions?** Refer to the universal format specification in `/instructions/case-study.instructions.md`
