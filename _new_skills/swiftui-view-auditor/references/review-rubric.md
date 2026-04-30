# SwiftUI Review Rubric

Use this checklist for deep SwiftUI view and UI architecture audits.

## 1. State Management

Look for misuse or questionable use of:

- `@State`
- `@Binding`
- `@StateObject`
- `@ObservedObject`
- `@EnvironmentObject`
- `@Environment`
- `@Observable`
- `@Bindable`
- `@FocusState`
- computed state derived in the wrong place
- duplicated state
- conflicting sources of truth
- state that should be owned higher or lower in the tree
- derived values stored instead of computed
- reference types where value semantics would be better
- view models created in the wrong lifecycle location
- object recreation bugs
- hidden coupling through global environment state

Ask:

- Is there a single source of truth?
- Is state ownership correct?
- Is the view doing too much?
- Is ephemeral UI state mixed with app/business state?
- Is state structure making rendering or debugging harder?

## 2. Business Logic In Views

Find logic that should not live in SwiftUI views:

- networking
- persistence
- analytics
- data transformation
- filtering/sorting that belongs elsewhere
- navigation orchestration embedded everywhere
- async workflows tangled into button actions
- validation logic mixed into rendering
- giant closures with multiple responsibilities

Flag views acting like controllers.

## 3. View Composition

Look for:

- massive views
- components split too aggressively
- poor naming
- deeply nested layout stacks
- repeated modifier chains
- copy-paste UI
- unstructured conditional rendering
- giant `body` implementations
- unreadable `if/else` trees
- missing helper views where useful
- helper views extracted too early
- poor file organization

## 4. Performance

Look for:

- unstable identity in `ForEach`
- misuse of `.id(...)`
- unnecessary re-render triggers
- expensive computed work inside `body`
- unnecessary `GeometryReader`
- layout thrashing
- eager rendering where lazy containers are better
- incorrect `AnyView` or type erasure
- overuse of preference keys or coordinate spaces
- repeated object creation in `body`
- animation churn
- unbounded lists
- image loading patterns that hurt scrolling
- main-thread work in UI paths

For each issue, explain risk, SwiftUI sensitivity, severity, and fix.

## 5. Navigation And Presentation

Audit for:

- brittle navigation state
- scattered destinations
- hidden dependencies between screens
- programmatic navigation hacks
- incorrect `NavigationStack`
- poor deep-link support
- duplicated route logic
- sheets/alerts driven by booleans when item-based presentation would be cleaner
- conflicting presentation states
- hard-to-test navigation
- view-driven routing that should be centralized

## 6. Concurrency And Async

Look for:

- misuse of `.task`
- repeated task execution
- cancellation bugs
- async work kicked off in `onAppear` without control
- race conditions from state updates
- view models not isolated properly
- main actor violations
- side effects triggered by recomposition
- duplicate network calls
- unstructured async button actions

## 7. Accessibility And UX

Look for:

- missing labels, hints, traits, and values
- tappable areas that are too small
- poor Dynamic Type behavior
- insufficient contrast
- inaccessible custom controls
- missing VoiceOver ordering
- layout that breaks at larger text sizes
- motion/animation issues for reduce motion
- focus issues

## 8. Styling And Design System

Look for:

- hardcoded colors, fonts, spacing, and shadows
- inconsistent component variants
- repeated styling without abstraction
- design-system bypasses
- over-abstracted design components that reduce clarity
- layout constants scattered across files

## 9. Data Flow And Dependencies

Look for:

- UI importing persistence or networking directly
- global singletons hidden in views
- environment objects used as dumping grounds
- query/data logic mixed with presentation
- app-wide state passed where local state is enough
- unclear ownership of side effects

## 10. SwiftUI Correctness

Look for:

- non-idiomatic modifiers
- incorrect binding lifetimes
- incorrect view identity
- reliance on lifecycle assumptions that SwiftUI does not guarantee
- misuse of `EquatableView`
- side effects in computed properties
- modifier order bugs

## 11. Testing And Previewability

Look for:

- views impossible to preview without real services
- view models impossible to instantiate in tests
- missing preview states
- no error/empty/loading previews
- hardcoded data or dependencies that prevent isolated UI testing

## 12. Maintainability

Look for:

- brittle files with too many responsibilities
- unclear naming
- no obvious ownership
- repeated local patterns
- hidden coupling
- patterns that will become hard to scale as screens grow

## Report Behavior

- Lead with findings.
- Do not produce vague best-practice advice.
- Prefer exact file references.
- Explain precisely why each issue matters in SwiftUI terms.
- Avoid rewriting the whole app unless asked.
