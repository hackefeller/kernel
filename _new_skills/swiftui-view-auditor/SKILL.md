---
name: swiftui-view-auditor
description: Perform deep best-practices audits of SwiftUI and iOS UI code. Use when Codex needs to review SwiftUI views, view models, navigation, state management, UIKit interop, async UI behavior, accessibility, performance, previews, design-system usage, or maintainability risks in an iOS/macOS SwiftUI codebase.
---

# SwiftUI View Auditor

## Workflow

Use this skill for review/audit tasks, not implementation by default. Lead with findings, ordered by severity and grounded in file/line references.

1. Discover SwiftUI and view-related files.
2. Inspect representative app entry points, navigation, shared components, view models, and design-system files.
3. Audit against [review-rubric.md](references/review-rubric.md).
4. Report concrete issues with severity, evidence, why it matters in SwiftUI terms, and a recommended fix.
5. Separate systemic patterns from one-off issues.

## Scope

Audit:

- `View` structs
- custom view modifiers
- `UIViewRepresentable` / `NSViewRepresentable`
- navigation and routing
- sheet / fullScreenCover / popover logic
- alerts and confirmation dialogs
- environment usage
- state and bindings
- animation
- async UI work
- lifecycle hooks such as `onAppear`, `onDisappear`, `task`, and `onChange`
- lists, scroll views, and lazy containers
- reusable components
- forms, inputs, and focus state
- accessibility modifiers
- previews
- theming, styling, and design-system components
- view models and observable objects used by SwiftUI views
- extensions/helpers primarily created to support UI

If UIKit interop exists, audit it from the perspective of SwiftUI correctness and necessity.

## Review Standard

Be skeptical, concrete, and exhaustive. Do not assume code is fine unless it clearly is.

Evaluate against:

- idiomatic modern SwiftUI
- current Apple architectural direction where applicable
- separation of view, state, side effects, and business logic
- composability
- correctness
- performance
- accessibility
- testability
- previewability
- consistency
- maintainability

## Output

Use this structure:

```markdown
# SwiftUI Audit Summary

## Executive Summary

## High-Impact Findings

## Detailed Findings

## Quick Wins

## Systemic Patterns

## Refactor Priorities

## Scorecard

## Bottom Line
```

For each finding include:

- file and line
- severity
- issue
- why it matters
- recommended fix
- confidence level

Read [review-rubric.md](references/review-rubric.md) for the full checklist.
