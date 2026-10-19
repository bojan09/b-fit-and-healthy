# Mobile spacing implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement task by task. User authorized direct execution.

**Goal:** Repair shared spacing and improve the four demo product pages.
**Architecture:** Keep existing components and styling files; fix selector scope and stylesheet order before adding page-specific presentation. Enhance the shared WeightChart with visible context.
**Tech stack:** Next.js, React, TypeScript, CSS, Vitest, Playwright.
**Spec:** ../specs/2026-10-19-mobile-spacing-design.md

## Global constraints
Keep current identity, locale parity, existing functionality, 44px controls, no new dependencies, and no backend changes. Work in the existing audit-improvements checkout. Do not commit or push this pass without a request.

## Review focus
320px phones, Macedonian labels, light theme contrast, meal/training planner selector isolation, and unchanged local demo interactions.

### Task 1: Shared layout and demo cards
- [x] Fix stylesheet order, one owner of page padding, compact headings and panel spacing.
- [x] Scope Today ordering and training planner styles; define nutrition planner layout.
- [x] Compact demo header/banner, expose nav labels, group habits and nutrition, flatten training.
- [x] Capture all four demo pages and assert overflow, 44px controls and mobile banner bounds.

### Task 2: Readable weight trend
- [x] Add failing component tests for latest measurement, localized scale/date context, and history.
- [x] Implement visible chart context and bounded plot sizing in WeightChart/tracking.css.
- [x] Run the focused component tests and then the full suite.

### Task 3: Verification and audit record
- [x] Inspect before/after screenshots and 320/768px, locale and theme variants.
- [x] Run typecheck, lint and tests; record concrete metrics and any limits in the audit spec.
- [x] Review the final diff for scope, accessibility, and style collisions.
