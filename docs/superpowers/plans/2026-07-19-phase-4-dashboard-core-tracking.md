# Phase 4 Dashboard and Core Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the real-data Guided Daily Canvas plus secure water, weight, habits, goals, notifications, and progress foundations.

**Architecture:** Dynamic Server Components authorize and load private state through focused repositories; Server Actions validate and mutate user-owned rows; small Client Components provide pending feedback and interactive controls. Pure date, unit, summary, and next-action functions isolate business rules from Supabase and remain directly unit-testable.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, Tailwind CSS 4, customized UI primitives, Supabase PostgreSQL/Auth/RLS, Zod 4, Vitest, Testing Library, Node contract tests.

## Global Constraints

- Preserve Sage Dusk and the approved Guided Daily Canvas; do not restore KPI rings or analytics-dashboard density.
- English is primary and Macedonian has parity for every new label, action, status, validation message, and empty state.
- Store weight in kilograms and water in millilitres; convert only at the presentation/action boundary.
- Derive ownership from `auth.getUser()` and never trust a client-provided user ID.
- Do not fabricate nutrition, workout, AI, notification, streak, or progress data.
- Do not add Three.js, GSAP, scheduled reminders, or future-phase modules.
- Keep private routes dynamic and no-store; do not cache private data in the PWA.
- Use localhost port 3000.
- Do not inspect secrets, mutate/reset remote Supabase, or perform Git operations.

---

### Task 1: Tracking schema, database types, and pure domain rules

**Files:**
- Create: `supabase/migrations/202607190003_core_tracking.sql`
- Create: `src/features/tracking/schemas.ts`
- Create: `src/features/tracking/domain.ts`
- Create: `src/features/tracking/types.ts`
- Modify: `src/types/database.ts`
- Modify: `supabase/tests/foundation_rls.sql`
- Test: `tests/unit/tracking-domain.test.ts`

**Interfaces:**
- Produces `localDateInTimezone(timezone, now?)`, `kgToLb`, `lbToKg`, `mlToFluidOunces`, `fluidOuncesToMl`, `ratio`, `buildDailySummary(input)`, Zod form schemas, tracking row types, and typed Supabase tables.

- [ ] Write focused tests asserting timezone date rollover, rounded reversible unit conversions, clamped ratios, empty-target behavior, habit completion counts, and deterministic next-action priority.
- [ ] Run `npm.cmd run test:unit -- tests/unit/tracking-domain.test.ts` and verify missing-module failures.
- [ ] Add migration tables, constraints, indexes, updated-at triggers, grants, and owner-only RLS for `water_logs`, `body_measurements`, `habits`, `habit_checkins`, and `notifications`.
- [ ] Implement pure schemas and domain functions with explicit plain-data inputs and no Supabase imports.
- [ ] Expand `Database` types with exact Row/Insert/Update structures.
- [ ] Run the focused test and `npm.cmd run typecheck`; require zero failures.

### Task 2: Authorized tracking repositories and summary loader

**Files:**
- Create: `src/features/tracking/repository.ts`
- Create: `src/features/tracking/content.ts`
- Test: `tests/unit/tracking-content.test.ts`

**Interfaces:**
- Consumes `createClient()`, `requireUser()`, database types, timezone/date utilities.
- Produces `loadTrackingContext(userId)`, `loadTodayData(userId, settings)`, `loadProgressData(userId)`, `loadNotifications(userId)`, and `getTrackingContent(locale)`.

- [ ] Write bilingual-content tests requiring matching key shapes and English/Macedonian values for navigation, empty states, forms, statuses, and guidance.
- [ ] Run the focused test and verify the missing export failure.
- [ ] Implement the bilingual dictionary and focused server-only queries with required columns, date bounds, stable ordering, and capped history.
- [ ] Return typed empty collections for no rows and throw one generic repository error for query failures.
- [ ] Run focused tests and typecheck.

### Task 3: Secure tracking Server Actions and reusable forms

**Files:**
- Create: `src/features/tracking/actions.ts`
- Create: `src/features/tracking/tracking-form.tsx`
- Create: `src/features/tracking/habit-actions.tsx`
- Create: `src/features/tracking/goal-actions.tsx`
- Create: `src/features/tracking/notification-actions.tsx`
- Test: `tests/component/tracking-form.test.tsx`
- Test: `tests/phase-4-core-tracking.test.js`

**Interfaces:**
- Produces `addWaterAction`, `deleteWaterAction`, `saveWeightAction`, `createHabitAction`, `setHabitCheckinAction`, `archiveHabitAction`, `createGoalAction`, `setGoalStatusAction`, `markNotificationReadAction`, and `markAllNotificationsReadAction`.

- [ ] Add a failing Phase 4 contract for routes, server directives, `auth.getUser()`, route revalidation, schema objects, RLS, and absence of demo dashboard constants.
- [ ] Add component tests for visible labels, localized units, pending/error status regions, and native submit semantics.
- [ ] Verify both suites fail for missing production modules.
- [ ] Implement actions with session-derived ownership, schema validation, generic errors, idempotent check-in/read behavior, canonical-unit conversion, and route revalidation.
- [ ] Implement compact reusable forms and action controls with labels, descriptions, pending states, and live feedback.
- [ ] Run focused suites, typecheck, and lint.

### Task 4: Product navigation and accessible responsive shell

**Files:**
- Create: `src/components/shell/product-navigation.tsx`
- Create: `src/components/shell/mobile-product-navigation.tsx`
- Modify: `src/components/shell/product-header.tsx`
- Modify: `src/app/(product)/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/phase-4-core-tracking.test.js`

**Interfaces:**
- Consumes tracking content, current pathname, unread count, account controls.
- Produces desktop primary navigation, real notification badge, and a mobile bottom navigation restricted to implemented destinations.

- [ ] Extend the route contract to require four primary destinations, active-state semantics, notification count, and mobile safe-area padding; run red.
- [ ] Implement client navigation components using `usePathname()` only for active state.
- [ ] Load unread count server-side in the product layout and keep authorization in the layout.
- [ ] Add responsive shell CSS with 44px targets, no content coverage, and secondary resource links.
- [ ] Run contracts, typecheck, and lint.

### Task 5: Guided Daily Canvas

**Files:**
- Create: `src/features/dashboard/daily-balance.tsx`
- Create: `src/features/dashboard/rhythm-rail.tsx`
- Create: `src/features/dashboard/guidance-panel.tsx`
- Create: `src/features/dashboard/today-canvas.tsx`
- Replace: `src/app/(product)/today/page.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/component/daily-balance.test.tsx`
- Modify: `tests/phase-4-core-tracking.test.js`

**Interfaces:**
- Consumes `loadTodayData`, `buildDailySummary`, locale, units, and action controls.
- Produces an accessible next-action hero, linear Daily Balance, real rhythm rail, and deterministic guidance panel.

- [ ] Write component tests for labelled water/habit/goal meters, zero-data behavior, textual progress equivalents, and no circular chart semantics.
- [ ] Extend contracts to reject prototype values (`790`, `1,310`, `2,100`, `74g`, `34min`, `6 day streak`) and future-feature links; run red.
- [ ] Implement the server page and focused components using only persisted values.
- [ ] Add desktop two-column and mobile ordered layouts using the existing Sage Dusk tokens.
- [ ] Run focused tests, contracts, typecheck, and lint.

### Task 6: Habits, goals, progress, and notifications routes

**Files:**
- Create: `src/app/(product)/habits/page.tsx`
- Create: `src/app/(product)/goals/page.tsx`
- Create: `src/app/(product)/progress/page.tsx`
- Create: `src/app/(product)/notifications/page.tsx`
- Create: `src/features/progress/weight-chart.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/component/weight-chart.test.tsx`
- Modify: `tests/phase-4-core-tracking.test.js`

**Interfaces:**
- Consumes tracking repositories, action components, localized content, and unit conversion.
- Produces real CRUD/status flows, accessible weight history visualization and records, seven-day consistency, goal status, and notification inbox states.

- [ ] Add failing contracts for all four protected pages, meaningful empty states, server data access, and no fabricated rows.
- [ ] Write chart tests requiring a text summary, no chart below two points, and a record list accompanying the SVG.
- [ ] Implement each route as an authorized Server Component with focused forms and real empty/error states.
- [ ] Implement the bounded responsive SVG weight chart and textual history.
- [ ] Add route CSS for mobile-first records, forms, status pills, and responsive grids.
- [ ] Run focused tests, contracts, typecheck, and lint.

### Task 7: Documentation and production hardening

**Files:**
- Create: `docs/supabase-core-tracking.md`
- Modify: `README.md`
- Modify only failure-related production files during hardening.

**Interfaces:**
- Documents migration order, canonical units, RLS ownership, manual acceptance, and Phase 5 boundary.

- [ ] Document `202607190003_core_tracking.sql`, canonical units, timezone behavior, RLS, remote migration steps, and rollback-safe notes.
- [ ] Run `npm.cmd test`, `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build`; fix every attributable failure.
- [ ] Restart the production server on port 3000 and smoke-check `/today`, `/habits`, `/goals`, `/progress`, `/notifications`, protected redirects, and malformed-action/callback behavior.
- [ ] Check generated HTML/CSS contracts for responsive ordering, focus states, bilingual copy, reduced motion, and absence of demo health values.
- [ ] Update README delivery status and produce the Phase 4 completion report with remote authenticated and browser-visual limitations disclosed.
- [ ] Stop for Phase 5 approval without Git operations.

## Self-Review

- Every Phase 4 route, table, mutation, empty state, security boundary, locale/unit rule, and acceptance gate maps to a task.
- Interface names are stable across tasks and future-phase modules remain excluded.
- No placeholder implementation steps or fabricated acceptance data remain.
- Git steps are intentionally omitted because the repository master brief forbids all Git operations.
