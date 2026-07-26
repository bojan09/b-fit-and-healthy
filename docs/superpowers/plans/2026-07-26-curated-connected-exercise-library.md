# Curated + Connected Exercise Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every meaningful exercise-library filter drive commercially permitted connected discovery while preserving fast local filtering, provenance, progressive disclosure, resilient provider behavior, and responsive accessibility.

**Architecture:** Add a provider-neutral exercise-search contract that derives an effective query and normalizes muscle/equipment/type aliases. The authenticated discovery route validates structured filters, runs the existing provider mesh, applies normalized filtering and ranking, and returns a bounded result set with provider status. The client keeps local filtering immediate, lets the existing discovery hook own debouncing and request cancellation, and progressively reveals connected results in groups of 12.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Zod, vanilla CSS, Vitest, Testing Library, Playwright.

## Global Constraints

- Preserve the current editorial visual direction and protected product shell.
- Keep local and connected exercise records visually and semantically separate.
- Only ExerciseAPI, commercially permitted wger records, wrkout/exercises.json, and local curated records may appear.
- MuscleWiki exercise search remains disabled until explicit commercial permission and exercise-level provenance exist.
- Do not add remote video or image loading to the result grid.
- Do not add infinite scrolling; reveal connected results in batches of 12 from one bounded response.
- Keep all controls keyboard accessible and usable at 320, 375, and 480 pixels.
- Do not add dependencies or change the technology stack.
- Do not commit changes; the user will commit after review.

## File Structure

- Create `src/features/fitness/exercise-search.ts`: provider-neutral criteria, effective-query derivation, alias normalization, URL construction, and connected-result filtering.
- Create `src/features/fitness/exercise-discovery.ts`: pure route-domain merge, filtering, ranking, and result bounding.
- Create `tests/unit/exercise-search.test.ts`: observable search-contract and alias/filter behavior.
- Create `tests/unit/discovery-schemas.test.ts`: structured discovery-query validation.
- Create `tests/unit/exercise-discovery-route.test.ts`: pure authenticated-route domain behavior.
- Modify `src/features/discovery/schemas.ts`: validate `muscle` and `type` exercise search parameters.
- Modify `src/app/api/discovery/exercises/route.ts`: apply structured criteria and return a bounded result set.
- Modify `src/features/discovery/use-discovery-search.ts`: expose retry and guarantee reset/cancellation semantics.
- Create `tests/component/use-discovery-search.test.tsx`: real hook behavior through a minimal rendered harness.
- Modify `src/components/discovery/discovery-status.tsx`: optional retry action for partial/error states.
- Modify `src/features/fitness/exercise-library.tsx`: filter-derived connected search, section composition, progressive disclosure, richer provenance cards, and filter disclosure.
- Modify `tests/component/exercise-library.test.tsx`: filter-only discovery, progressive disclosure, retry, metadata, and accessible controls.
- Modify `src/styles/product.css`: responsive filter disclosure, section rhythm, connected cards, status/retry, and compact “Show more” treatment.
- Modify `tests/e2e/authenticated-smoke.spec.ts`: protected browser checks for filter-only connected discovery and mobile overflow.

---

### Task 1: Structured Exercise Search Contract

**Files:**
- Create: `src/features/fitness/exercise-search.ts`
- Create: `tests/unit/exercise-search.test.ts`
- Create: `tests/unit/discovery-schemas.test.ts`
- Modify: `src/features/discovery/schemas.ts`

**Interfaces:**
- Produces:
  - `type ExerciseSearchCriteria = { query: string; muscle: string; equipment: string; type: "" | "strength" | "core" | "mobility" }`
  - `effectiveExerciseQuery(criteria: ExerciseSearchCriteria): string`
  - `buildExerciseDiscoveryEndpoint(criteria: ExerciseSearchCriteria): string`
  - `filterConnectedExercises(items: readonly DiscoveryExercise[], criteria: ExerciseSearchCriteria): DiscoveryExercise[]`
- Consumes: `normalizeDiscoveryTitle` and `DiscoveryExercise`.

- [ ] **Step 1: Write failing tests for effective-query priority and structured URL output**

Add literal expectations:

```ts
expect(effectiveExerciseQuery({
  query: "curl",
  muscle: "biceps",
  equipment: "Dumbbells",
  type: "strength",
})).toBe("curl");

expect(effectiveExerciseQuery({
  query: "",
  muscle: "biceps",
  equipment: "",
  type: "",
})).toBe("biceps");

expect(buildExerciseDiscoveryEndpoint({
  query: "",
  muscle: "biceps",
  equipment: "Dumbbells",
  type: "strength",
})).toBe(
  "/api/discovery/exercises?muscle=biceps&equipment=Dumbbells&type=strength",
);
```

The production break caught is a filter value failing to generate a connected-search request or being lost in the route URL.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
npm.cmd run test:unit -- tests/unit/exercise-search.test.ts
```

Expected: FAIL because `@/features/fitness/exercise-search` does not exist.

- [ ] **Step 3: Implement effective-query and URL construction**

Implement deterministic priority:

```ts
export function effectiveExerciseQuery(criteria: ExerciseSearchCriteria) {
  return [
    criteria.query,
    criteria.muscle,
    criteria.equipment,
    criteria.type,
  ].map((value) => value.trim()).find(Boolean) ?? "";
}
```

Build `URLSearchParams` from non-empty values. Do not add `q` when typed text is empty; the server will derive the same fallback from structured filters.

- [ ] **Step 4: Add failing alias/filter tests**

Use complete `DiscoveryExercise` fixtures and assert:

```ts
expect(filterConnectedExercises(
  [bicepsBrachiiCurl, tricepsExtension],
  { query: "", muscle: "biceps", equipment: "", type: "" },
).map((item) => item.id)).toEqual(["wger:biceps-curl"]);
```

Also cover:

- `bodyweight` matching `body only`.
- `dumbbells` matching `dumbbell`.
- `biceps` matching `biceps brachii`.
- Missing provider metadata not satisfying an explicitly selected facet.
- Typed title text combining with muscle and equipment filters.

The production break caught is a provider’s anatomical/equipment vocabulary causing valid records to disappear or invalid records to pass.

- [ ] **Step 5: Verify the new filter tests fail**

Run the same focused command. Expected: FAIL because `filterConnectedExercises` and alias normalization are missing.

- [ ] **Step 6: Implement provider-neutral normalization and filtering**

Normalize values with `normalizeDiscoveryTitle`, singularize known equipment aliases, and map:

```ts
const muscleAliases = {
  biceps: ["biceps", "biceps brachii"],
  triceps: ["triceps", "triceps brachii"],
  quads: ["quadriceps", "quadriceps femoris", "quads"],
  hamstrings: ["hamstrings", "biceps femoris"],
  glutes: ["glutes", "gluteus maximus", "gluteus medius"],
};
```

Filtering rules:

- Text query matches title, muscles, equipment, or movement pattern.
- Selected muscle must match primary or secondary muscles.
- Selected equipment must match normalized provider equipment.
- `core` matches core/abdominal muscle or movement signals.
- `mobility` matches mobility, stretch, flexibility, or warm-up title/pattern signals.
- `strength` accepts resistance/bodyweight movement records and rejects records positively identified as mobility.

- [ ] **Step 7: Extend query validation**

Add to `discoveryQuerySchema`:

```ts
muscle: z.string().trim().max(80).optional(),
type: z.enum(["strength", "core", "mobility"]).optional(),
```

Change the refinement so any one of `q`, `barcode`, `muscle`, `equipment`, or `type` satisfies search intent.

- [ ] **Step 8: Run Task 1 tests and the existing discovery schema tests**

Run:

```powershell
npm.cmd run test:unit -- tests/unit/exercise-search.test.ts tests/unit/discovery-schemas.test.ts
```

Expected: PASS.

- [ ] **Step 9: Review checkpoint**

Run `git diff --check`. Do not commit.

---

### Task 2: Authenticated Route Filtering and Bounded Results

**Files:**
- Modify: `src/app/api/discovery/exercises/route.ts`
- Modify: `src/features/fitness/providers/exercise-mesh.ts`
- Create: `src/features/fitness/exercise-discovery.ts`
- Create: `tests/unit/exercise-discovery-route.test.ts`

**Interfaces:**
- Consumes Task 1’s `ExerciseSearchCriteria`, `effectiveExerciseQuery`, and `filterConnectedExercises`.
- Produces an authenticated JSON response containing at most 60 ranked exercises plus `failures` and `partial`.

- [ ] **Step 1: Extract a testable route-domain function and write its failing test**

Add this pure exported function to `src/features/fitness/exercise-discovery.ts`:

```ts
resolveExerciseDiscovery({
  local,
  external,
  criteria,
  context,
})
```

The test supplies 70 hand-built connected fixtures and asserts:

- A muscle-only criterion returns matching external records.
- Nonmatching muscle/equipment/type records are excluded.
- Local and connected duplicates still prefer local.
- Output is ranked and capped at 60.

The production break caught is structured filters reaching the route but not constraining or bounding its response.

- [ ] **Step 2: Run the focused route-domain test and verify RED**

Run:

```powershell
npm.cmd run test:unit -- tests/unit/exercise-discovery-route.test.ts
```

Expected: FAIL because the resolver does not exist.

- [ ] **Step 3: Implement the pure route-domain resolver**

Apply filtering before `mergeAndRank`, preserve local records that match the criteria, then return:

```ts
mergeAndRank(filtered, {
  query: effectiveExerciseQuery(criteria),
  ...context,
  equipment: criteria.equipment ? [criteria.equipment] : undefined,
}).slice(0, 60);
```

- [ ] **Step 4: Update the authenticated GET route**

Create criteria from validated parameters:

```ts
const criteria: ExerciseSearchCriteria = {
  query: parsed.data.q ?? "",
  muscle: parsed.data.muscle ?? "",
  equipment: parsed.data.equipment ?? "",
  type: parsed.data.type ?? "",
};
```

Use `effectiveExerciseQuery(criteria)` for provider search and response metadata. Continue authenticating before provider calls and continue logging only safe provider status.

- [ ] **Step 5: Add provider-mesh test for filter-derived search terms**

In `tests/unit/exercise-provider-mesh.test.ts`, assert providers receive a non-empty term when the caller supplies the effective `biceps` term. Keep provider execution concurrent and failure isolation unchanged.

- [ ] **Step 6: Run focused route, mesh, merge, and commercial-license tests**

Run:

```powershell
npm.cmd run test:unit -- tests/unit/exercise-discovery-route.test.ts tests/unit/exercise-provider-mesh.test.ts tests/unit/discovery-merge.test.ts tests/unit/commercial-license.test.ts
```

Expected: PASS.

- [ ] **Step 7: Review checkpoint**

Run `git diff --check`. Do not commit.

---

### Task 3: Discovery Request Lifecycle and Retry

**Files:**
- Modify: `src/features/discovery/use-discovery-search.ts`
- Create: `tests/component/use-discovery-search.test.tsx`
- Modify: `src/components/discovery/discovery-status.tsx`

**Interfaces:**
- Produces from `useDiscoverySearch<T>`:
  - Existing `query`, `setQuery`, `results`, `status`, and `message`.
  - New `retry(): void`.
- `DiscoveryStatus` gains optional `onRetry?: () => void`.

- [ ] **Step 1: Write a real hook-harness test for stale-response prevention**

Render a small component that calls the actual hook. Stub only `fetch` with two controllable promises:

1. Search `biceps`.
2. Before it resolves, search `triceps`.
3. Resolve `triceps`.
4. Resolve the stale `biceps` request.

Assert the rendered result remains `Triceps extension`.

The production break caught is an obsolete response replacing the latest filter state.

- [ ] **Step 2: Run the test and confirm its current behavior**

Run:

```powershell
npm.cmd run test:unit -- tests/component/use-discovery-search.test.tsx
```

If the stale-response test already passes, retain it as a characterization test and continue to the missing reset/retry behavior. Do not alter working cancellation logic merely to force a failure.

- [ ] **Step 3: Write failing reset and retry tests**

Assert:

- Dropping below `minLength` immediately exposes local results and idle state.
- Calling `retry()` after an error repeats the same URL once.
- A retry cannot revive an obsolete query.

Expected RED reason: `retry` is not returned and inactive searches do not reset internal state.

- [ ] **Step 4: Implement minimal reset and retry behavior**

Add a retry generation counter included in the request effect. When search becomes inactive:

```ts
setResults(localResults);
setStatus("idle");
setMessage(null);
```

`retry()` increments the request generation only when the current query is searchable.

- [ ] **Step 5: Add retry rendering to `DiscoveryStatus`**

For `partial` and `error` statuses with `onRetry`, render a compact:

```tsx
<button type="button" className="discovery-retry" onClick={onRetry}>
  Try again
</button>
```

Do not render retry while loading or idle.

- [ ] **Step 6: Run hook and existing discovery component tests**

Run:

```powershell
npm.cmd run test:unit -- tests/component/use-discovery-search.test.tsx tests/component/exercise-library.test.tsx
```

Expected: PASS before continuing.

- [ ] **Step 7: Review checkpoint**

Run `git diff --check`. Do not commit.

---

### Task 4: Curated and Connected Library Composition

**Files:**
- Modify: `src/features/fitness/exercise-library.tsx`
- Modify: `tests/component/exercise-library.test.tsx`

**Interfaces:**
- Consumes Task 1’s criteria helpers and Task 3’s `retry`.
- Produces two labeled result regions, connected progressive disclosure, richer connected cards, and responsive filter disclosure state.

- [ ] **Step 1: Write a failing muscle-only connected-search test**

Render `ExerciseLibrary`, choose `biceps`, advance the debounce, and assert fetch receives:

```text
/api/discovery/exercises?muscle=biceps&q=biceps
```

Return one connected curl and assert it appears under “Connected libraries.”

The production break caught is exactly the screenshot regression: selecting only a muscle leaves connected count at zero.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
npm.cmd run test:unit -- tests/component/exercise-library.test.tsx
```

Expected: FAIL because muscle changes do not update provider search.

- [ ] **Step 3: Wire criteria to connected discovery**

Build memoized criteria from `query`, `muscle`, `equipment`, and `type`. Build the endpoint from structured filters. Synchronize `providerSearch.setQuery(effectiveExerciseQuery(criteria))` in an effect.

Clear must:

- Empty every filter.
- Reset visible connected count to 12.
- Return provider discovery to idle through the hook.

- [ ] **Step 4: Write failing progressive-disclosure tests**

Return 25 distinct connected exercises and assert:

- 12 cards initially.
- First “Show more” click yields 24.
- Second click yields 25 and removes the control.
- Changing muscle resets visible connected cards to 12.

The production break caught is an oversized first render or stale disclosure state carrying across searches.

- [ ] **Step 5: Implement progressive disclosure**

Add:

```ts
const CONNECTED_PAGE_SIZE = 12;
const [visibleConnectedCount, setVisibleConnectedCount] = useState(
  CONNECTED_PAGE_SIZE,
);
```

Reset on effective-query/criteria key changes. Slice the connected array for rendering. The button copy includes the remaining count, for example `Show 12 more`.

- [ ] **Step 6: Write failing status, metadata, and accessibility tests**

Assert:

- Partial response keeps cards and shows “Try again.”
- Connected cards expose provider, license, difficulty, equipment, and “Instructions available.”
- Curated and connected containers have accessible headings.
- Local-only, connected-only, and no-results responses render distinct explanatory states.
- A connected error leaves matching local cards usable.
- Mobile filter button exposes `aria-expanded` and controls an identified region.
- Keyboard activation opens the existing review dialog.

- [ ] **Step 7: Implement the approved composition**

Structure:

```tsx
<section aria-labelledby="curated-exercises-title">...</section>
<section aria-labelledby="connected-exercises-title">...</section>
```

Add a compact filter-disclosure button for narrow layouts while keeping the search field outside the collapsible region. Add metadata only when present; use concise fallback copy for missing values.

Pass `providerSearch.retry` to `DiscoveryStatus`.

- [ ] **Step 8: Run the complete component test**

Run:

```powershell
npm.cmd run test:unit -- tests/component/exercise-library.test.tsx tests/component/use-discovery-search.test.tsx
```

Expected: PASS.

- [ ] **Step 9: Review checkpoint**

Run `git diff --check`. Do not commit.

---

### Task 5: Responsive Polish and End-to-End Verification

**Files:**
- Modify: `src/styles/product.css`
- Modify: `tests/e2e/authenticated-smoke.spec.ts`

**Interfaces:**
- Consumes Task 4’s class names and accessible labels.
- Produces a responsive no-overflow layout and protected browser regression coverage.

- [ ] **Step 1: Add a failing authenticated browser scenario**

Mock `/api/discovery/exercises**` in Playwright so credentials are not required for external providers. After authenticated setup:

1. Open `/exercises`.
2. Choose `biceps`.
3. Assert the request contains `muscle=biceps` and `q=biceps`.
4. Assert 12 connected cards appear from a 25-record fixture.
5. Activate “Show 12 more” and assert 24.
6. Assert the review dialog is keyboard reachable.

The production break caught is the integrated page failing despite isolated component tests.

- [ ] **Step 2: Add mobile overflow checks**

At the 320-pixel authenticated project viewport, assert:

```ts
expect(await page.evaluate(
  () => document.documentElement.scrollWidth <= window.innerWidth,
)).toBe(true);
```

Open and close the filter disclosure with keyboard input and verify `aria-expanded`.

- [ ] **Step 3: Run the browser scenario and verify RED where applicable**

Run:

```powershell
npm.cmd run test:e2e -- --project=authenticated-chromium tests/e2e/authenticated-smoke.spec.ts
```

Expected without configured E2E credentials: authenticated scenarios skip with the documented guard. With credentials: new scenarios fail until CSS/composition polish is applied.

- [ ] **Step 4: Implement responsive CSS**

Add narrowly scoped rules for:

- `.exercise-library-sections`
- `.exercise-filter-toggle`
- `.exercise-filter-region`
- `.provider-card-provenance`
- `.provider-card-facts`
- `.connected-results-footer`
- `.discovery-retry`

Desktop:

- Three-column cards when space permits.
- Consistent 24–32 pixel section rhythm.
- Compact filter and progressive-disclosure controls.

At `max-width: 48rem`:

- Single-column cards.
- Visible filter disclosure button.
- Hidden secondary filter region when collapsed.
- Wrapped provenance/fact rows.
- Full-content-width but compact “Show more” button.

Do not reduce interactive targets below 44 CSS pixels.

- [ ] **Step 5: Run focused tests**

Run:

```powershell
npm.cmd run test:unit -- tests/unit/exercise-search.test.ts tests/unit/exercise-discovery-route.test.ts tests/unit/exercise-provider-mesh.test.ts tests/component/use-discovery-search.test.tsx tests/component/exercise-library.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Verify the real provider path independently**

With the local production server running and an authenticated browser, choose `biceps` and verify:

- Local results remain immediate.
- ExerciseAPI, wger, or wrkout contributes at least one commercially permitted connected record when available.
- Every connected card shows provider and license.
- Failure of one source produces partial results, not an empty library.

- [ ] **Step 7: Run repository quality gates**

Run:

```powershell
git diff --check
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

Expected: all commands exit 0.

- [ ] **Step 8: Run relevant browser verification**

Run:

```powershell
npm.cmd run test:e2e -- --project=authenticated-chromium tests/e2e/authenticated-smoke.spec.ts
```

Report skipped authenticated tests honestly if `E2E_TEST_EMAIL` or `E2E_TEST_PASSWORD` is absent. Also report unrelated pre-existing public-suite failures separately; do not represent them as regressions from this phase.

- [ ] **Step 9: Restart local production and hand off**

Start the verified production build on port 3000, confirm HTTP 200, list changed files and unresolved checks, and leave all changes uncommitted.
