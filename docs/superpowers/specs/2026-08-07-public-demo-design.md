# Public Demo — Design Spec

Date: 2026-08-07
Status: approved by user, ready for implementation planning

## Summary

Add a `/demo` experience visitors can use without an account, showcasing realistic example data
across 4 core screens (Today, Nutrition, Training, Progress) so they understand what B Fit &
Healthy does before signing up. Fully static/mock data — no Supabase involvement anywhere in the
demo tree — for guaranteed isolation from real user data. Linked from the landing hero via a new
"Try the demo" action.

## Architecture

New route group `src/app/(demo)/demo/*`, a sibling to `(marketing)`/`(product)`/`(auth)` — not
nested under either. Because `/demo` is not in `src/lib/supabase/proxy.ts`'s `protectedPrefixes`
list, it is public by default and requires **no changes to the auth middleware**. This is the
core isolation guarantee: the demo route tree literally cannot import `@/lib/supabase/*` (enforced
by a contract test, see Testing below), so there is no code path by which it could read or write
real user data.

Routes:
- `/demo` — redirects to `/demo/today` (`redirect()` in a thin `page.tsx`, not a client redirect)
- `/demo/today`
- `/demo/nutrition`
- `/demo/training`
- `/demo/progress`

All four are server components. Each reads static fixture data from one new module,
`src/features/demo/data.ts` (plain exported objects/arrays, no fetch, no async). Interactive
widgets are small `"use client"` components seeded via `useState(initialData)` from that fixture
data — no persistence, state resets on reload, nothing is written anywhere.

## Shell

`src/app/(demo)/demo/layout.tsx` wraps all 4 pages:
- A new `DemoNav` component (`src/components/shell/demo-nav.tsx`) — 4 links (Today, Nutrition,
  Training, Progress → `/demo/today` etc.), visually consistent with `ProductNavigation` but a
  separate, simpler component (hardcoded to the 4 demo hrefs, not parameterized) rather than
  modifying the real product nav.
- A persistent, non-dismissible banner on every demo page: "You're viewing example data — sign up
  to start tracking your own" + a "Get started" button linking to `/sign-up`.
- Header shows brand + `DemoNav` + a single "Sign up" CTA button — no account menu, no sign-in
  link, no theme/locale controls beyond what's already global (skip link, etc. stay).

## Per-screen content

**Today** (`/demo/today`): a hero focus card (styled like the real dashboard's today-canvas) plus
a short list of 3-4 habits/tasks with interactive checkboxes — clicking toggles local `done` state
only. Framing: "here's what your day looks like at a glance."

**Nutrition** (`/demo/nutrition`): a day's logged meals (3-4 entries: breakfast/lunch/dinner) each
showing the same labeled-macro pattern shipped on the landing page (calories + Protein/Carbs/Fat
grams). Running daily totals at the top. An "Add food" button appends one fixed canned demo item
from the fixture data to the list; totals recompute from local state.

**Training** (`/demo/training`): today's demo workout session — a header (session name + duration,
matching the landing preview pattern) and an exercise list with sets/reps and interactive
complete-checkboxes (reusing the landing training-row visual pattern: check icon +
"Done"/"Up next"). A "X/Y complete" counter derived from local state.

**Progress** (`/demo/progress`): reuses `src/features/progress/weight-chart.tsx` as-is (it's
already a pure component taking `points`/`unit`/labels as props, no Supabase dependency) fed a
static mock series from `src/features/demo/data.ts`. No interactivity needed here — a trend chart
is convincing as a static display.

## Landing CTA

`src/app/(marketing)/page.tsx` hero `action-row`: add a third action, a quiet-variant button/link
"Try the demo" → `/demo/today`, alongside the existing "Get started" (primary) and "Sign in"
(secondary). Copy added to `public-content.ts`'s `home` section (`tryDemoLabel`).

## i18n

New `demo` section in `public-content.ts` (both locales) covering: nav labels (reuse
`home.nutritionVisualLabel`-style short labels), banner copy, per-screen headings/labels, fixture
display strings that are UI chrome (button labels like "Add food", "Get started"). Fixture *data*
values (meal names, exercise names, habit names) live in `src/features/demo/data.ts` directly as
locale-keyed objects (`{ en: "...", mk: "..." }` per field), following the same pattern already
used for exercise/anatomy content data elsewhere in the app (data ≠ UI chrome, same distinction
maintained during the i18n consolidation work).

## Testing

- Contract test: `protectedPrefixes` in `proxy.ts` contains no entry that matches `/demo` (guards
  against someone later accidentally gating it).
- Contract test: no file under `src/app/(demo)/**` or `src/features/demo/**` imports
  `@/lib/supabase/*` (grep-based, same style as existing contract tests) — the hard isolation
  guarantee.
- Component tests: habit checkbox toggles local state, "Add food" updates totals correctly,
  exercise-complete counter updates correctly.

## Out of scope

- No data persistence, no localStorage, no demo→real-account conversion flow.
- No analytics/tracking on demo usage.
- Only the 4 agreed screens — not a tour of all ~25 product routes (assistant, habits, goals,
  recipes, meal-planner, etc. are not part of the demo; visitors reach those by signing up).
- No changes to `ProductNavigation`, `ProductHeader`, or any real `(product)` route.
