# Workout Builder and Full-body Presets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align workout-row controls at every breakpoint and make every full-body preset a ten-movement routine with movement-appropriate prescriptions.

**Architecture:** Replace slug-only builder rows with a small `WorkoutPrescription` model shared by presets, builder state, validation, and persistence. Keep the existing local catalogue and server actions, but give row controls a fixed responsive action rail rather than allowing flex content to determine their position.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Zod, Supabase, CSS, Vitest, Testing Library, Playwright.

## Global Constraints

- Do not commit; the user will review and commit.
- Do not add dependencies.
- Preserve existing templates and completed sessions.
- Every full-body preset contains exactly ten unique valid exercises.
- Controls remain keyboard accessible and usable at 320px.
- English remains primary and existing Macedonian content remains intact.

---

## File Structure

- Modify `src/features/fitness/workout-ideas.ts`: prescription contract and complete presets.
- Modify `src/features/fitness/workout-builder.tsx`: prescription-aware builder rows and accessible action rail.
- Modify `src/features/fitness/schemas.ts`: validated prescription JSON.
- Modify `src/features/fitness/actions.ts`: persist each reviewed prescription.
- Create `supabase/migrations/202607260001_workout_duration_prescriptions.sql`: persist timed movement targets.
- Modify `src/types/database.ts`: add generated-style duration-column typings.
- Modify `src/app/(product)/workouts/new/page.tsx`: pass a preset's prescriptions into the builder.
- Modify `src/app/(product)/workouts/[id]/edit/page.tsx`: reconstruct prescriptions from saved rows.
- Modify `src/features/discovery/local.ts`: normalize workout ideas from prescriptions.
- Modify `src/features/fitness/workout-idea-library.tsx`: count prescription rows.
- Modify `src/styles/product.css`: fixed action-rail layout and responsive stacking.
- Modify `tests/unit/workout-discovery.test.ts`: full-body and prescription invariants.
- Modify `tests/component/workout-builder.test.tsx`: row behavior and accessible controls.
- Modify `tests/e2e/authenticated-smoke.spec.ts`: narrow viewport overflow check.

### Task 1: Prescription Contract and Full-body Invariants

**Files:**
- Modify: `src/features/fitness/workout-ideas.ts`
- Modify: `tests/unit/workout-discovery.test.ts`

**Interfaces:**
- Produces: `WorkoutPrescription`, `WorkoutIdea.exercises`, `getWorkoutIdea(slug)`.
- Consumes: catalogue exercise slugs from `src/features/fitness/catalogue.ts`.

- [ ] **Step 1: Add failing prescription and full-body tests**

Add:

```ts
import { exercises } from "@/features/fitness/catalogue";
import {
  getWorkoutIdea,
  workoutIdeas,
  type WorkoutPrescription,
} from "@/features/fitness/workout-ideas";

const catalogueSlugs = new Set(exercises.map((exercise) => exercise.slug));

it("gives every full-body preset ten unique valid exercises", () => {
  const fullBody = workoutIdeas.filter((idea) => idea.isFullBody);
  expect(fullBody.map((idea) => idea.slug)).toEqual([
    "bodyweight-foundations",
    "dumbbell-full-body",
    "warm-up-flow",
    "steady-circuit",
  ]);
  for (const idea of fullBody) {
    const slugs = idea.exercises.map((row) => row.exerciseSlug);
    expect(slugs).toHaveLength(10);
    expect(new Set(slugs)).toHaveLength(10);
    expect(slugs.every((slug) => catalogueSlugs.has(slug))).toBe(true);
  }
});

it("uses duration prescriptions for warm-up movements", () => {
  const warmup = getWorkoutIdea("warm-up-flow")!;
  expect(warmup.exercises.every((row) =>
    row.durationSeconds !== null && row.repMin === null && row.repMax === null
  )).toBe(true);
});

it("uses valid sets, rest, reps, or duration", () => {
  for (const idea of workoutIdeas) {
    for (const row of idea.exercises) {
      expect(row.sets).toBeGreaterThan(0);
      expect(row.restSeconds).toBeGreaterThanOrEqual(0);
      expect(
        row.durationSeconds !== null ||
        (row.repMin !== null && row.repMax !== null),
      ).toBe(true);
    }
  }
});
```

- [ ] **Step 2: Run the tests and verify failure**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/workout-discovery.test.ts
```

Expected: FAIL because `WorkoutIdea` has `exerciseSlugs` and no prescriptions.

- [ ] **Step 3: Define the shared prescription model**

Use:

```ts
export type WorkoutPrescription = {
  exerciseSlug: string;
  sets: number;
  repMin: number | null;
  repMax: number | null;
  durationSeconds: number | null;
  restSeconds: number;
};

export type WorkoutIdea = {
  slug: string;
  title: string;
  summary: string;
  goal: WorkoutGoal;
  durationMinutes: number;
  level: "beginner" | "intermediate";
  equipment: string[];
  isFullBody: boolean;
  exercises: WorkoutPrescription[];
};
```

Add focused constructors:

```ts
const reps = (
  exerciseSlug: string,
  sets = 3,
  repMin = 8,
  repMax = 12,
  restSeconds = 90,
): WorkoutPrescription => ({
  exerciseSlug,
  sets,
  repMin,
  repMax,
  durationSeconds: null,
  restSeconds,
});

const timed = (
  exerciseSlug: string,
  durationSeconds = 40,
  restSeconds = 20,
): WorkoutPrescription => ({
  exerciseSlug,
  sets: 1,
  repMin: null,
  repMax: null,
  durationSeconds,
  restSeconds,
});
```

- [ ] **Step 4: Populate all presets and the four ten-movement sequences**

Use exactly these full-body sequences:

```ts
// Bodyweight Foundations, 45 minutes
[
  "bodyweight-squat", "reverse-lunge", "hip-bridge",
  "push-up", "incline-push-up", "pike-push-up",
  "bird-dog", "dead-bug", "side-plank", "standing-calf-raise",
]

// Dumbbell Full Body, 60 minutes
[
  "goblet-squat", "romanian-deadlift", "split-squat",
  "dumbbell-bench-press", "one-arm-row", "overhead-press",
  "lateral-raise", "biceps-curl", "overhead-triceps-extension",
  "farmer-carry",
]

// Full-body Warm-up Flow, 18 minutes, all timed()
[
  "cat-cow", "thoracic-rotation", "hip-flexor-mobility",
  "ankle-rock", "bodyweight-squat", "reverse-lunge",
  "hip-bridge", "incline-push-up", "bird-dog", "dead-bug",
]

// Steady Full-body Circuit, 35 minutes
[
  "bodyweight-squat", "reverse-lunge", "hip-bridge",
  "push-up", "pike-push-up", "standing-calf-raise",
  "bird-dog", "dead-bug", "front-plank", "side-plank",
]
```

Mark only those four ideas with `isFullBody: true`. Convert every other preset from `exerciseSlugs` to `exercises`.

- [ ] **Step 5: Run the focused tests**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/workout-discovery.test.ts
```

Expected: PASS.

- [ ] **Step 6: Review checkpoint**

Confirm every preset references valid catalogue slugs and leave changes uncommitted.

### Task 2: Prescription Validation and Persistence

**Files:**
- Modify: `src/features/fitness/schemas.ts`
- Modify: `src/features/fitness/actions.ts`
- Create: `supabase/migrations/202607260001_workout_duration_prescriptions.sql`
- Modify: `src/types/database.ts`
- Modify: `tests/unit/fitness-domain.test.ts`

**Interfaces:**
- Consumes: `WorkoutPrescription`.
- Produces: `templateSchema.shape.prescriptions` and persisted `workout_template_exercises` values.

- [ ] **Step 1: Add failing schema tests**

Add:

```ts
import { templateSchema } from "@/features/fitness/schemas";

it("parses reviewed workout prescriptions", () => {
  const result = templateSchema.parse({
    name: "Full body",
    description: "",
    duration: "45",
    prescriptions: JSON.stringify([{
      exerciseSlug: "bodyweight-squat",
      sets: 3,
      repMin: 8,
      repMax: 12,
      durationSeconds: null,
      restSeconds: 90,
    }]),
  });
  expect(result.prescriptions[0].exerciseSlug).toBe("bodyweight-squat");
});

it("rejects rows without reps or duration", () => {
  expect(() => templateSchema.parse({
    name: "Invalid",
    description: "",
    duration: "45",
    prescriptions: JSON.stringify([{
      exerciseSlug: "bodyweight-squat",
      sets: 3,
      repMin: null,
      repMax: null,
      durationSeconds: null,
      restSeconds: 90,
    }]),
  })).toThrow();
});
```

- [ ] **Step 2: Verify the tests fail**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/fitness-domain.test.ts
```

Expected: FAIL because the schema accepts `exerciseSlugs`.

- [ ] **Step 3: Implement exact prescription validation**

Define:

```ts
export const workoutPrescriptionSchema = z.object({
  exerciseSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sets: z.number().int().min(1).max(20),
  repMin: z.number().int().min(1).max(1000).nullable(),
  repMax: z.number().int().min(1).max(1000).nullable(),
  durationSeconds: z.number().int().min(1).max(3600).nullable(),
  restSeconds: z.number().int().min(0).max(1800),
}).refine((row) =>
  row.durationSeconds !== null ||
  (row.repMin !== null && row.repMax !== null && row.repMin <= row.repMax),
  { message: "Use either a duration or a valid repetition range." },
);
```

Transform the `prescriptions` form string with `JSON.parse`, then pipe it through `z.array(workoutPrescriptionSchema).min(1).max(30)`.

- [ ] **Step 4: Persist exact row values**

In `createTemplateAction` and `updateTemplateAction`:

1. Load catalogue exercise IDs for all prescription slugs.
2. Reject the action if any slug is absent.
3. Insert rows with `target_sets`, `rep_min`, `rep_max`, `rest_seconds`, and the existing nullable fields.
4. Persist timed duration in the new `target_duration_seconds` column and update `src/types/database.ts`.

Create:

```sql
begin;

alter table public.workout_template_exercises
  add column target_duration_seconds integer
  check (target_duration_seconds is null or target_duration_seconds between 1 and 3600);

commit;
```

- [ ] **Step 5: Run schema, type, and existing fitness tests**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/fitness-domain.test.ts tests/component/workout-builder.test.tsx
npm.cmd run typecheck
```

Expected: PASS.

- [ ] **Step 6: Review checkpoint**

Inspect inserts for owner IDs and verify completed session snapshots remain unchanged.

### Task 3: Responsive Builder Rows

**Files:**
- Modify: `src/features/fitness/workout-builder.tsx`
- Modify: `src/styles/product.css`
- Modify: `tests/component/workout-builder.test.tsx`

**Interfaces:**
- Consumes: `WorkoutPrescription[]`.
- Produces: stable `.builder-row-content` and `.builder-row-actions` regions.

- [ ] **Step 1: Add failing structure and behavior tests**

Add:

```tsx
it("keeps every row action in a stable labelled rail", () => {
  render(<WorkoutBuilder initial={{
    prescriptions: [
      {
        exerciseSlug: "bodyweight-squat",
        sets: 3,
        repMin: 8,
        repMax: 12,
        durationSeconds: null,
        restSeconds: 90,
      },
    ],
  }} />);
  const rail = screen.getByRole("group", {
    name: "Reorder or remove Bodyweight squat",
  });
  expect(within(rail).getAllByRole("button")).toHaveLength(3);
  expect(within(rail).getByRole("button", { name: "Move Bodyweight squat up" })).toBeDisabled();
});

it("renders timed prescriptions without fake repetition copy", () => {
  render(<WorkoutBuilder initial={{
    prescriptions: [{
      exerciseSlug: "cat-cow",
      sets: 1,
      repMin: null,
      repMax: null,
      durationSeconds: 40,
      restSeconds: 20,
    }],
  }} />);
  expect(screen.getByText("40 sec · 20 sec rest")).toBeInTheDocument();
  expect(screen.queryByText(/8–12 reps/)).not.toBeInTheDocument();
});
```

Import `within` from Testing Library.

- [ ] **Step 2: Run and verify failure**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/component/workout-builder.test.tsx
```

Expected: FAIL because the builder stores only slugs and has no labelled rail.

- [ ] **Step 3: Refactor builder state**

Store `WorkoutPrescription[]`. Adding a catalogue exercise creates:

```ts
{
  exerciseSlug: exercise.slug,
  sets: 3,
  repMin: 8,
  repMax: 12,
  durationSeconds: null,
  restSeconds: 90,
}
```

Render the action region as:

```tsx
<div
  className="builder-row-actions"
  role="group"
  aria-label={`Reorder or remove ${exercise.titleEn}`}
>
  <button type="button" aria-label={`Move ${exercise.titleEn} up`} ...>
    <ArrowUp aria-hidden="true" />
  </button>
  <button type="button" aria-label={`Move ${exercise.titleEn} down`} ...>
    <ArrowDown aria-hidden="true" />
  </button>
  <button type="button" aria-label={`Remove ${exercise.titleEn}`} ...>
    <Trash2 aria-hidden="true" />
  </button>
</div>
```

Write `JSON.stringify(rows)` to the hidden `prescriptions` input.

- [ ] **Step 4: Implement fixed responsive layout**

Use:

```css
.builder-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-4);
}

.builder-row-content {
  min-width: 0;
}

.builder-row-actions {
  width: 7.75rem;
  display: grid;
  grid-template-columns: repeat(3, 2.25rem);
  gap: 0.5rem;
}

.builder-row-actions button {
  width: 2.25rem;
  height: 2.25rem;
  min-height: 2.25rem;
  display: grid;
  place-items: center;
  padding: 0;
}

.builder-row-actions svg {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 30rem) {
  .builder-row {
    grid-template-columns: 1fr;
  }

  .builder-row-actions {
    justify-self: end;
  }
}
```

Remove the broad `.builder-row button` rule that forces 2.75rem controls.

- [ ] **Step 5: Run component tests**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/component/workout-builder.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Review checkpoint**

Inspect keyboard order and disabled control stability before continuing.

### Task 4: Preset and Edit-page Integration

**Files:**
- Modify: `src/app/(product)/workouts/new/page.tsx`
- Modify: `src/app/(product)/workouts/[id]/edit/page.tsx`
- Modify: `src/features/fitness/workout-idea-library.tsx`
- Modify: `src/features/discovery/local.ts`
- Modify: `tests/unit/workout-discovery.test.ts`

**Interfaces:**
- Consumes: `WorkoutIdea.exercises`.
- Produces: prescription-aware new/edit builders and normalized local discovery workouts.

- [ ] **Step 1: Add assertions for local discovery preservation**

Add:

```ts
it("normalizes every prescription into local workout discovery", () => {
  const source = getWorkoutIdea("dumbbell-full-body")!;
  const normalized = localDiscoveryWorkouts.find(
    (item) => item.externalId === source.slug,
  )!;
  expect(normalized.exercises).toHaveLength(10);
  expect(normalized.exercises[0]).toMatchObject({
    exerciseId: `local:${source.exercises[0].exerciseSlug}`,
    sets: source.exercises[0].sets,
    repMin: source.exercises[0].repMin,
  });
});
```

- [ ] **Step 2: Verify failure**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/workout-discovery.test.ts
```

Expected: FAIL while consumers still read `exerciseSlugs`.

- [ ] **Step 3: Update all consumers**

- New workout page passes `prescriptions: idea.exercises`.
- Edit page maps persisted rows to `WorkoutPrescription`, including duration.
- Workout idea cards show `idea.exercises.length`.
- Local discovery maps each prescription without replacing its values with universal defaults.

- [ ] **Step 4: Run focused tests and typecheck**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/workout-discovery.test.ts tests/component/workout-builder.test.tsx
npm.cmd run typecheck
```

Expected: PASS.

- [ ] **Step 5: Review checkpoint**

Confirm a saved non-preset workout still opens in the editor.

### Task 5: Browser and Production Verification

**Files:**
- Modify: `tests/e2e/authenticated-smoke.spec.ts`
- Modify only implementation files required by failures.

**Interfaces:**
- Consumes: completed builder implementation.
- Produces: responsive regression evidence.

- [ ] **Step 1: Add authenticated browser coverage**

Add a credential-guarded test that opens:

```text
/workouts/new?idea=dumbbell-full-body
```

Assert:

```ts
await expect(page.getByTestId("builder-row")).toHaveCount(10);
await expect(page.locator(".builder-row-actions")).toHaveCount(10);
expect(await page.evaluate(() =>
  document.documentElement.scrollWidth <= document.documentElement.clientWidth
)).toBe(true);
```

Run it at desktop and 375px mobile.

- [ ] **Step 2: Run focused browser checks**

Run:

```powershell
node node_modules/@playwright/test/cli.js test tests/e2e/authenticated-smoke.spec.ts --project=chromium-desktop --project=chromium-mobile
```

Expected: PASS, or documented credential-guarded skip.

- [ ] **Step 3: Run all verification**

Run:

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

Expected: all commands exit 0.

- [ ] **Step 4: Refresh local production**

Restart the existing scoped Next.js process on port 3000 and inspect the builder at 320px, 375px, 768px, and desktop.

- [ ] **Step 5: Final review checkpoint**

Report changed files, migration requirements, verification results, and leave all work uncommitted.
