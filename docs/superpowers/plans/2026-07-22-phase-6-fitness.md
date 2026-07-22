# Phase 6 Fitness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a private, mobile-first fitness system covering exercise discovery, workout creation and scheduling, session logging, history, and genuine personal records.

**Architecture:** Use a public bilingual exercise catalogue plus normalized private Supabase tables for templates, planning, immutable session snapshots, and completed sets. Server actions authorize every mutation, pure domain functions calculate volume and records, and App Router pages use the existing Sky Dusk product shell.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, CSS custom properties, Supabase/PostgreSQL with RLS, Zod 4, Node test runner, Vitest.

## Global Constraints

- English is primary and Macedonian receives matching interface and catalogue coverage.
- Store load canonically in kilograms; render using the existing metric/imperial preference.
- Only completed sets and sessions contribute to records.
- Do not add dependencies, GSAP, Three.js, AI coaching, medical advice, social features, drag-and-drop, or offline mutation.
- Do not commit, push, merge, reset, or perform any other Git operation.

---

### Task 1: Phase contracts and fitness domain

**Files:**
- Create: `tests/phase-6-fitness.test.js`
- Create: `tests/unit/fitness-domain.test.ts`
- Create: `src/features/fitness/domain.ts`

**Interfaces:**
- Produces: `buildSessionSummary(sets)`, `derivePersonalRecords(sessions)`, `kgToDisplayLoad(kg, units)`, `displayLoadToKg(value, units)`, and `trainingWeekDates(date)`.

- [ ] Add a contract that requires the Phase 6 routes, `202607220001_fitness.sql`, owner-based RLS, server-authorized actions, product navigation, and bilingual exercise data.
- [ ] Add unit assertions for volume excluding incomplete/bodyweight sets, record derivation from completed sessions only, kilogram/pound conversion, and Monday-first week dates.
- [ ] Run `node --test tests/phase-6-fitness.test.js` and `npm.cmd run test:unit -- tests/unit/fitness-domain.test.ts`; confirm missing files/functions fail.
- [ ] Implement the pure domain functions with bounded numeric normalization and deterministic sorting.
- [ ] Re-run the focused domain tests and require all assertions to pass.

### Task 2: Database foundation and exercise catalogue

**Files:**
- Create: `supabase/migrations/202607220001_fitness.sql`
- Modify: `src/types/database.ts`
- Create: `src/features/fitness/catalogue.ts`

**Interfaces:**
- Produces public `exercises` and `exercise_muscles`; private `workout_programs`, `workout_templates`, `workout_template_exercises`, `planned_workouts`, `workout_sessions`, `workout_session_exercises`, and `workout_sets`.
- `catalogue.ts` exports `exercises`, `getExercise(slug)`, and filter option constants.

- [ ] Define all tables, constraints, indexes, updated-at triggers, anonymous revocation, authenticated grants, and RLS policies described by the specification.
- [ ] Add a partial unique index allowing one active session per user.
- [ ] Seed the approved bilingual exercise foundation and stable anatomy-compatible muscle keys.
- [ ] Extend `Database` table types with exact row, insert, and update shapes.
- [ ] Mirror seeded exercises in a typed local catalogue so library/detail pages remain reviewable before the migration is applied.
- [ ] Run the Phase 6 contract and typecheck; require schema/catalogue assertions to pass.

### Task 3: Validation, repository, and server actions

**Files:**
- Create: `src/features/fitness/schemas.ts`
- Create: `src/features/fitness/repository.ts`
- Create: `src/features/fitness/actions.ts`
- Create: `src/features/fitness/content.ts`

**Interfaces:**
- Repository produces training home, template, planner, active session, history, and record query models.
- Actions produce create/edit template, schedule/skip, start/resume, set update/add/remove, finish/discard, and delete-template mutations.

- [ ] Validate bounded names, prescriptions, dates, sets, RPE half-steps, load/duration, and UUIDs with Zod.
- [ ] Implement repository queries that return explicit `unavailable` states rather than throwing when the migration is missing.
- [ ] Implement authenticated server actions using `auth.getUser`, owner filters, safe redirects, and targeted revalidation.
- [ ] Start-session must return an existing active session, otherwise copy the template and target sets into snapshots.
- [ ] Finish-session must require one completed set, stamp duration, and complete the linked planned workout.
- [ ] Add complete English/Macedonian labels and status/error copy.
- [ ] Run contract, unit tests, typecheck, and lint for this slice.

### Task 4: Exercise library and details

**Files:**
- Create: `src/app/(product)/exercises/page.tsx`
- Create: `src/app/(product)/exercises/[slug]/page.tsx`
- Create: `src/features/fitness/exercise-library.tsx`
- Create: `tests/component/exercise-library.test.tsx`

**Interfaces:**
- `ExerciseLibrary` consumes locale and the typed catalogue, and owns client-side search/filter state.

- [ ] Write component tests for text search, equipment filtering, clear filters, and empty results.
- [ ] Run the component test and confirm the missing component fails.
- [ ] Build the accessible filter toolbar, result cards, and no-result recovery.
- [ ] Build readable bilingual exercise details with instructions, muscles, mistakes, safety, variations, and home/gym guidance.
- [ ] Add owned CSS movement-pattern illustrations without external media.
- [ ] Re-run component, contract, typecheck, and lint checks.

### Task 5: Workout templates and builder

**Files:**
- Create: `src/app/(product)/workouts/page.tsx`
- Create: `src/app/(product)/workouts/new/page.tsx`
- Create: `src/app/(product)/workouts/[id]/page.tsx`
- Create: `src/app/(product)/workouts/[id]/edit/page.tsx`
- Create: `src/features/fitness/workout-builder.tsx`
- Create: `tests/component/workout-builder.test.tsx`

**Interfaces:**
- `WorkoutBuilder` submits `exerciseIds`, names, positions, target sets, rep bounds, rest, optional RPE, and notes to create/update actions.

- [ ] Write component tests proving exercise addition, accessible reordering, removal, and empty-workout validation.
- [ ] Build template library empty/populated states and lightweight program grouping.
- [ ] Build the client builder with stable row keys, labelled prescription controls, move buttons, and serialized exercise rows.
- [ ] Build template detail with equipment summary, schedule form, edit action, and start action.
- [ ] Verify builder tests, actions, typecheck, and mobile-safe markup.

### Task 6: Planner and active session logger

**Files:**
- Create: `src/app/(product)/training/page.tsx`
- Create: `src/app/(product)/training/planner/page.tsx`
- Create: `src/app/(product)/session/[id]/page.tsx`
- Create: `src/features/fitness/session-logger.tsx`
- Create: `tests/component/session-logger.test.tsx`

**Interfaces:**
- `SessionLogger` consumes the server-built session model, unit preference, previous-performance map, and server actions.

- [ ] Write component tests for completed-set state, add set, repeat previous values, bodyweight mode, and Finish action availability.
- [ ] Build the training home with next plan, active resume, seven-day rhythm, recent sessions, and local route directory.
- [ ] Build the vertical weekly planner with schedule, reschedule, skip, and remove actions.
- [ ] Build the mobile logger with sticky identity, elapsed-time display hidden from live announcements, one expanded exercise, large controls, and finish/discard actions.
- [ ] Persist each set through authenticated actions while retaining entered values on validation failure.
- [ ] Re-run component, contract, unit, typecheck, and lint checks.

### Task 7: History, session detail, and personal records

**Files:**
- Create: `src/app/(product)/workout-history/page.tsx`
- Create: `src/app/(product)/workout-history/[id]/page.tsx`
- Create: `src/app/(product)/personal-records/page.tsx`
- Create: `src/features/fitness/record-summary.tsx`
- Create: `tests/component/record-summary.test.tsx`

**Interfaces:**
- `RecordSummary` consumes the output of `derivePersonalRecords` and renders genuine records per exercise.

- [ ] Write component tests for empty records and populated heaviest-load, reps, set-volume, and session-volume output.
- [ ] Build reverse-chronological history with preserved session summaries and detail links.
- [ ] Build session detail from snapshots rather than current templates.
- [ ] Build the records view with calculation explanations and no estimated 1RM.
- [ ] Verify component, domain, contract, typecheck, and lint checks.

### Task 8: Product integration, styling, and setup documentation

**Files:**
- Modify: `src/components/shell/product-navigation.tsx`
- Modify: `src/lib/supabase/proxy.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/(product)/today/page.tsx`
- Create: `docs/supabase-fitness.md`

**Interfaces:**
- Product navigation exposes Training in desktop and mobile primary navigation and keeps secondary fitness routes locally connected.

- [ ] Add all Phase 6 prefixes to the protected-route contract and proxy.
- [ ] Add Training to desktop and mobile navigation; retain every existing destination under primary or More.
- [ ] Add completed/next training context to Today without duplicating the training home.
- [ ] Add responsive Sky Dusk styles for library, builder, planner, session, history, records, empty/error states, 44px controls, and reduced motion.
- [ ] Document migration order, RLS scope, catalogue source strategy, units, and local verification without creating `.env.example`.
- [ ] Run the complete contract and component suites.

### Task 9: Final verification and phase report

**Files:**
- No production changes expected unless verification finds a defect.

- [ ] Run `npm.cmd run test`, `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build`, stopping on the first failure.
- [ ] Restart the production server on port 3000 and probe public, auth, and protected Phase 6 routes.
- [ ] Verify `dist` and `.env.example` remain absent and no Git operation occurred.
- [ ] Report implemented routes, responsive/manual limitations, migration requirement, verification counts, remaining concerns, and the Phase 7 recommendation.
