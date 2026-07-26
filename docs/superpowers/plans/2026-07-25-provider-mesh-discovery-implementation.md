# Provider Mesh Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver fast, blended food, recipe, exercise, and workout discovery across curated local content and optional external providers, with explicit review and stable private snapshots.

**Architecture:** All providers are isolated server-side adapters normalized into shared discovery models. A local-first orchestrator runs eligible providers concurrently, deduplicates and deterministically ranks results, while a generic Supabase snapshot table preserves confirmed external content for later logging, planning, and workout creation.

**Tech Stack:** Next.js 16 App Router and Route Handlers, React 19, TypeScript, Zod, Supabase/PostgreSQL RLS, native `fetch`, Vitest, Testing Library, Playwright.

## Global Constraints

- Do not create commits; the user will review and commit.
- Do not create `.env.example`; update only server-side schema and documentation.
- Do not add dependencies.
- Local catalogues must remain fully usable with no provider credentials or network access.
- Do not invent missing nutrition values.
- Require explicit user confirmation before saving or applying external content.
- Keep provider credentials and calls server-side.
- English remains primary; Macedonian remains supported for local content.
- Do not use Open Food Facts for search-as-you-type.
- Do not require MuscleWiki for core product behavior.
- Preserve route prefetching and avoid external calls during ordinary navigation.

## File Structure

- Create `src/features/discovery/types.ts`: normalized result, provenance, completeness, and snapshot types.
- Create `src/features/discovery/merge.ts`: deduplication and deterministic ranking.
- Create `src/features/discovery/provider-runner.ts`: concurrent provider execution and timeout isolation.
- Create `src/features/discovery/schemas.ts`: route and snapshot validation.
- Create `src/features/discovery/context.ts`: active-goal and recent-selection ranking context.
- Create `src/features/discovery/safe-url.ts`: provider media/source URL allowlisting.
- Create `src/features/discovery/repository.ts`: snapshot persistence.
- Create `src/features/discovery/actions.ts`: authenticated import actions.
- Create `supabase/migrations/202607250001_provider_snapshots.sql`: snapshot table, RLS, and workout exercise linkage.
- Modify `src/types/database.ts`: generated-style database typings.
- Modify `src/lib/env/server-schema.ts` and `src/lib/env/server.ts`: optional production keys.
- Create `src/features/nutrition/providers/open-food-facts.ts`.
- Refactor `src/features/nutrition/usda.ts` to emit normalized foods.
- Modify `src/features/nutrition/providers/themealdb.ts`.
- Create `src/features/fitness/providers/wger.ts`.
- Create `src/features/fitness/providers/musclewiki.ts`.
- Create `src/app/api/discovery/foods/route.ts`.
- Create `src/app/api/discovery/recipes/route.ts`.
- Create `src/app/api/discovery/exercises/route.ts`.
- Create `src/app/api/discovery/workouts/route.ts`.
- Keep `src/app/api/foods/search/route.ts` as a compatibility wrapper during migration.
- Create `src/features/discovery/use-discovery-search.ts`.
- Create `src/components/discovery/discovery-status.tsx`.
- Create `src/components/discovery/review-sheet.tsx`.
- Create `src/features/nutrition/food-discovery.tsx`.
- Modify `src/features/nutrition/nutrition-forms.tsx` and `src/app/(product)/nutrition/page.tsx`.
- Modify `src/features/nutrition/recipe-library.tsx` and `src/app/(product)/recipes/page.tsx`.
- Modify `src/features/fitness/exercise-library.tsx` and `src/app/(product)/exercises/page.tsx`.
- Modify `src/features/fitness/workout-idea-library.tsx`, `src/features/fitness/workout-builder.tsx`, and `src/features/fitness/actions.ts`.
- Modify `src/styles/components.css`, `src/styles/product.css`, and `src/styles/responsive.css`.
- Add focused unit, component, route-contract, and Playwright tests described below.

---

### Task 1: Shared discovery contracts

**Files:**
- Create: `src/features/discovery/types.ts`
- Create: `src/features/discovery/merge.ts`
- Create: `src/features/discovery/provider-runner.ts`
- Create: `src/features/discovery/schemas.ts`
- Create: `src/features/discovery/context.ts`
- Create: `src/features/discovery/safe-url.ts`
- Create: `tests/unit/discovery-merge.test.ts`
- Create: `tests/unit/provider-runner.test.ts`

**Interfaces:**
- Produces: `DiscoveryItem`, `DiscoveryFood`, `DiscoveryRecipe`, `DiscoveryExercise`, `DiscoveryWorkout`, `mergeAndRank()`, `runProviders()`, `loadDiscoveryContext()`, `safeProviderUrl()`.

- [ ] **Step 1: Define failing merge and runner tests**

```ts
it("deduplicates matching food and prefers the more complete result", () => {
  const results = mergeAndRank([
    food({ id: "local:oats", provider: "local", title: "Rolled oats", barcode: null }),
    food({ id: "usda:1", provider: "usda", title: "Rolled oats", barcode: null, proteinG: 13.2 }),
  ], { query: "rolled oats" });
  expect(results).toHaveLength(1);
  expect(results[0].provider).toBe("local");
  expect(results[0].alternates).toContain("usda:1");
});

it("keeps successful providers when another times out", async () => {
  const outcome = await runProviders([
    { id: "fast", run: async () => ["result"] },
    { id: "slow", run: async (signal) => new Promise((_, reject) => signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")))) },
  ], { timeoutMs: 10 });
  expect(outcome.results).toEqual(["result"]);
  expect(outcome.failures[0].provider).toBe("slow");
});
```

- [ ] **Step 2: Run and verify failures**

Run: `npx vitest run tests/unit/discovery-merge.test.ts tests/unit/provider-runner.test.ts`  
Expected: FAIL because discovery modules do not exist.

- [ ] **Step 3: Implement explicit shared types**

Use a discriminated union:

```ts
type DiscoveryBase = {
  id: string;
  kind: "food" | "recipe" | "exercise" | "workout";
  provider: "local" | "usda" | "open-food-facts" | "themealdb" | "wger" | "musclewiki";
  externalId: string;
  title: string;
  normalizedTitle: string;
  sourceUrl: string | null;
  attribution: string;
  retrievedAt: string;
  quality: "curated" | "verified" | "community";
  completeness: string[];
  alternates: string[];
};
```

Define type-specific fields exactly as approved in the specification. `DiscoveryFood` nutrient fields are `number | null`; `DiscoveryRecipe.nutrition` is a nutrient object or `null`.

`mergeAndRank(items, context)` must use provider/external ID, barcode, title+brand, then title+material attributes. Sort by exact match, prefix match, user compatibility, completeness, local status, recent selection, provider reliability, and stable ID.

`runProviders()` uses one `AbortController` per provider and `Promise.allSettled`, returning `{ results, failures, elapsedMs }`.

- `loadDiscoveryContext(userId)` loads active goal kinds and recently saved snapshot IDs; equipment and difficulty filters come from the current search request because those preferences are not stored in the existing schema.
- `safeProviderUrl(value, provider)` returns a URL only when its HTTPS hostname belongs to that provider's explicit allowlist; otherwise it returns `null`.

- [ ] **Step 4: Run focused tests**

Run: `npx vitest run tests/unit/discovery-merge.test.ts tests/unit/provider-runner.test.ts`  
Expected: PASS.

- [ ] **Step 5: Review checkpoint**

Verify shared files contain no provider-specific response shapes and leave changes uncommitted.

### Task 2: Provider adapters and environment gates

**Files:**
- Modify: `src/lib/env/server-schema.ts`
- Modify: `src/lib/env/server.ts`
- Modify: `tests/unit/env.test.ts`
- Modify: `src/features/nutrition/usda.ts`
- Create: `src/features/nutrition/providers/open-food-facts.ts`
- Modify: `src/features/nutrition/providers/themealdb.ts`
- Create: `src/features/fitness/providers/wger.ts`
- Create: `src/features/fitness/providers/musclewiki.ts`
- Create: `tests/unit/food-providers.test.ts`
- Modify: `tests/unit/recipe-provider.test.ts`
- Create: `tests/unit/exercise-providers.test.ts`

**Interfaces:**
- Produces: `searchUsdaFoods`, `lookupOpenFoodFactsBarcode`, `searchOpenFoodFactsBrands`, `searchMealDb`, `searchWgerExercises`, `searchMuscleWikiExercises`, `searchMuscleWikiWorkouts`.

- [ ] **Step 1: Extend environment and adapter tests**

```ts
const value = parseServerEnv({
  USDA_FDC_API_KEY: "usda",
  THEMEALDB_API_KEY: "meal",
  MUSCLEWIKI_API_KEY: "",
});
expect(value.THEMEALDB_API_KEY).toBe("meal");
expect(value.MUSCLEWIKI_API_KEY).toBeUndefined();
```

Provider fixtures must assert nutrient units, `null` nutrition for TheMealDB, community quality for Open Food Facts, wger equipment/muscle normalization, and that MuscleWiki returns `{ available: false, results: [] }` without a key.

- [ ] **Step 2: Verify failures**

Run: `npx vitest run tests/unit/env.test.ts tests/unit/food-providers.test.ts tests/unit/recipe-provider.test.ts tests/unit/exercise-providers.test.ts`  
Expected: FAIL for missing env fields and adapters.

- [ ] **Step 3: Implement adapters**

Rules:

- USDA uses the existing server key and normalized nutrients.
- Open Food Facts sends `User-Agent: B-Fit-and-Healthy/0.1.0 (https://b-fit-and-healthy.vercel.app)`, uses `/api/v3/product/{barcode}` for barcode lookup, and only invokes deliberate brand search.
- TheMealDB uses `THEMEALDB_API_KEY`; key `1` is accepted only when `NODE_ENV !== "production"`.
- wger reads public `/api/v2/exerciseinfo/` results and normalizes only English records with usable names/instructions.
- MuscleWiki sends `X-API-Key` only server-side and treats 401, 403, and 429 as provider-unavailable outcomes.
- Every adapter accepts an `AbortSignal`.
- External media URLs remain remote references and are never copied.

- [ ] **Step 4: Run adapter tests**

Run: `npx vitest run tests/unit/env.test.ts tests/unit/food-providers.test.ts tests/unit/recipe-provider.test.ts tests/unit/exercise-providers.test.ts`  
Expected: PASS.

- [ ] **Step 5: Review checkpoint**

Confirm no key appears in a client file, public env variable, log message, or example env file.

### Task 3: Private snapshot persistence

**Files:**
- Create: `supabase/migrations/202607250001_provider_snapshots.sql`
- Modify: `src/types/database.ts`
- Create: `src/features/discovery/repository.ts`
- Create: `src/features/discovery/actions.ts`
- Create: `tests/unit/discovery-snapshots.test.ts`
- Modify: `supabase/tests/foundation_rls.sql`

**Interfaces:**
- Produces: `saveDiscoverySnapshot(userId, item)`, `loadDiscoverySnapshots(userId, kind)`, `importDiscoveryItemAction`.

- [ ] **Step 1: Write snapshot construction tests**

```ts
it("preserves reviewed provider values and schema version", () => {
  const row = toSnapshotInsert("user-1", recipeResult);
  expect(row).toMatchObject({
    user_id: "user-1",
    content_type: "recipe",
    provider: "themealdb",
    external_id: recipeResult.externalId,
    schema_version: 1,
    payload: recipeResult,
  });
});
```

- [ ] **Step 2: Verify failure**

Run: `npx vitest run tests/unit/discovery-snapshots.test.ts`  
Expected: FAIL because snapshot functions do not exist.

- [ ] **Step 3: Add the migration**

Create:

```sql
create table public.external_content_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_type text not null check (content_type in ('food','recipe','exercise','workout')),
  provider text not null,
  external_id text not null,
  title text not null,
  source_url text,
  attribution text not null,
  schema_version integer not null default 1,
  payload jsonb not null,
  retrieved_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, content_type, provider, external_id)
);
```

Enable RLS with an owner-only policy, revoke anon access, and grant authenticated CRUD. Add nullable `external_snapshot_id` to `meal_entries`, `meal_plan_items`, and `workout_template_exercises`. Make `workout_template_exercises.exercise_id` nullable and add a check requiring exactly one of `exercise_id` or `external_snapshot_id`.

- [ ] **Step 4: Implement repository and authenticated action**

Validate the submitted item with a Zod discriminated union. Upsert on `(user_id, content_type, provider, external_id)`. Never accept `user_id` from the form.

- [ ] **Step 5: Run snapshot and schema checks**

Run:

```powershell
npx vitest run tests/unit/discovery-snapshots.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Review checkpoint**

Inspect migration paths for owner-only RLS and leave changes uncommitted.

### Task 4: Local-first discovery route handlers

**Files:**
- Create: `src/app/api/discovery/foods/route.ts`
- Create: `src/app/api/discovery/recipes/route.ts`
- Create: `src/app/api/discovery/exercises/route.ts`
- Create: `src/app/api/discovery/workouts/route.ts`
- Modify: `src/app/api/foods/search/route.ts`
- Create: `tests/unit/discovery-routes.test.ts`

**Interfaces:**
- Produces authenticated GET routes returning `{ results, failures, partial, query }`.

- [ ] **Step 1: Write route behavior tests**

Tests must cover:

- 401 without a Supabase user.
- 400 below two meaningful characters.
- Local results returned when every provider throws.
- Provider results blended and deduplicated.
- `barcode` invokes Open Food Facts detail, not search.
- `source=branded` is required before Open Food Facts text search.
- Workouts remain local when MuscleWiki is unavailable.

- [ ] **Step 2: Verify route tests fail**

Run: `npx vitest run tests/unit/discovery-routes.test.ts`  
Expected: FAIL because the routes are missing.

- [ ] **Step 3: Implement route orchestration**

Each route:

```ts
const parsed = discoveryQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
if (!parsed.success) return NextResponse.json({ message: "Enter at least two characters.", results: [] }, { status: 400 });
```

Authenticate, search local data synchronously, run only eligible providers through `runProviders`, call `mergeAndRank`, and return partial-failure metadata without exposing raw exceptions.

Keep `/api/foods/search` as a thin compatibility wrapper that delegates to the new food search function until all callers move.

Successful responses set `Cache-Control: private, max-age=30, stale-while-revalidate=120` and include `freshness: "live" | "cached"`. Stable provider metadata requests use Next fetch revalidation for 30 days. Routes generate a correlation ID and record provider, operation, status, and latency without logging the user's raw health query.

- [ ] **Step 4: Run route tests**

Run: `npx vitest run tests/unit/discovery-routes.test.ts`  
Expected: PASS.

- [ ] **Step 5: Review checkpoint**

Verify ordinary product route rendering does not import or invoke any provider adapter.

### Task 5: Shared discovery client behavior

**Files:**
- Create: `src/features/discovery/use-discovery-search.ts`
- Create: `src/components/discovery/discovery-status.tsx`
- Create: `src/components/discovery/review-sheet.tsx`
- Create: `tests/component/discovery-search.test.tsx`
- Create: `tests/component/review-sheet.test.tsx`
- Modify: `src/styles/components.css`
- Modify: `src/styles/responsive.css`

**Interfaces:**
- Produces: `useDiscoverySearch<T>({ endpoint, localResults, minLength })`, `DiscoveryStatus`, `ReviewSheet`.

- [ ] **Step 1: Write failing behavior tests**

Use fake timers and mocked fetch to verify:

- Local results render immediately.
- Fetch starts after 275ms.
- A changed query aborts the old request.
- A stale response cannot replace a newer response.
- Partial failure retains results.
- Escape closes the review sheet and restores trigger focus.

- [ ] **Step 2: Verify failure**

Run: `npx vitest run tests/component/discovery-search.test.tsx tests/component/review-sheet.test.tsx`  
Expected: FAIL for missing modules.

- [ ] **Step 3: Implement the hook and primitives**

The hook state is:

```ts
type DiscoveryState<T> = {
  query: string;
  results: T[];
  status: "idle" | "loading" | "success" | "partial" | "error";
  message: string | null;
};
```

Use `AbortController`, a monotonically increasing request ID, and a 275ms timeout. `ReviewSheet` uses a native dialog-compatible accessible pattern, visible title, close button, focus return, and no silent submission.

- [ ] **Step 4: Run focused tests**

Run: `npx vitest run tests/component/discovery-search.test.tsx tests/component/review-sheet.test.tsx`  
Expected: PASS.

- [ ] **Step 5: Review checkpoint**

Check the shared UI at 320px and confirm source meaning is text, not color alone.

### Task 6: Food discovery and import-on-log

**Files:**
- Create: `src/features/nutrition/food-discovery.tsx`
- Modify: `src/features/nutrition/nutrition-forms.tsx`
- Modify: `src/features/nutrition/actions.ts`
- Modify: `src/app/(product)/nutrition/page.tsx`
- Create: `tests/component/food-discovery.test.tsx`
- Modify: `tests/unit/nutrition-domain.test.ts`

**Interfaces:**
- Consumes: `/api/discovery/foods`, `ReviewSheet`, `importDiscoveryItemAction`.
- Produces: explicit serving/meal review followed by snapshot and meal-entry creation.

- [ ] **Step 1: Write the food review tests**

Verify that search shows provenance, selecting a food opens serving and meal controls, and clicking **Add to day** submits the reviewed normalized payload. Verify `null` nutrient data blocks logging with an explanatory message.

- [ ] **Step 2: Verify failure**

Run: `npx vitest run tests/component/food-discovery.test.tsx`  
Expected: FAIL because `FoodDiscovery` is missing.

- [ ] **Step 3: Implement food discovery**

Move external search out of the dense `FoodSearchForm`. Keep `CustomFoodForm`, planner, and grocery forms unchanged. The confirmation action must:

1. Validate the normalized food and user adjustments.
2. Upsert the private snapshot.
3. Insert `meal_entries` using scaled reviewed values and `external_snapshot_id`.
4. Revalidate nutrition/today routes.

Add a separate **Scan or enter barcode** disclosure that invokes `?barcode=...`.

- [ ] **Step 4: Run nutrition tests**

Run: `npx vitest run tests/component/food-discovery.test.tsx tests/unit/nutrition-domain.test.ts`  
Expected: PASS.

- [ ] **Step 5: Review checkpoint**

Confirm local saved foods still appear before any network response and leave changes uncommitted.

### Task 7: Recipe discovery and saved snapshots

**Files:**
- Modify: `src/features/nutrition/recipe-library.tsx`
- Modify: `src/app/(product)/recipes/page.tsx`
- Modify: `src/features/nutrition/actions.ts`
- Modify: `src/features/nutrition/repository.ts`
- Modify: `tests/component/recipe-library.test.tsx`
- Modify: `tests/unit/recipe-provider.test.ts`

**Interfaces:**
- Consumes: `/api/discovery/recipes`.
- Produces: blended recipe cards, review sheet, saved recipe snapshots, and meal-plan handoff.

- [ ] **Step 1: Extend recipe tests**

Test that local recipes remain instant, provider recipes display **Nutrition unavailable**, source labels remain visible, and saving an external recipe submits servings plus the normalized snapshot.

- [ ] **Step 2: Verify the new assertions fail**

Run: `npx vitest run tests/component/recipe-library.test.tsx tests/unit/recipe-provider.test.ts`  
Expected: FAIL before blended discovery is implemented.

- [ ] **Step 3: Implement blended recipe discovery**

Retain existing local filters. External search begins only for text queries of two or more characters. External cards use stable provider IDs and never link to nonexistent local slugs. Selecting one opens a review sheet with ingredients, instructions, servings, source, and nutrition availability.

Saving calls the snapshot action. **Plan this meal** creates a `meal_plan_items` row with `external_snapshot_id`, `recipe_id = null`, reviewed label, and servings.

- [ ] **Step 4: Run recipe tests**

Run: `npx vitest run tests/component/recipe-library.test.tsx tests/unit/recipe-discovery.test.ts tests/unit/recipe-provider.test.ts`  
Expected: PASS.

- [ ] **Step 5: Review checkpoint**

Confirm TheMealDB absence does not change local recipe browsing.

### Task 8: Exercise and workout discovery

**Files:**
- Modify: `src/features/fitness/exercise-library.tsx`
- Modify: `src/features/fitness/workout-idea-library.tsx`
- Modify: `src/features/fitness/workout-builder.tsx`
- Modify: `src/features/fitness/actions.ts`
- Modify: `src/features/fitness/schemas.ts`
- Modify: `src/app/(product)/exercises/page.tsx`
- Modify: `src/app/(product)/training/page.tsx`
- Modify: `tests/component/exercise-library.test.tsx`
- Modify: `tests/component/workout-builder.test.tsx`
- Modify: `tests/unit/workout-discovery.test.ts`

**Interfaces:**
- Consumes: `/api/discovery/exercises`, `/api/discovery/workouts`.
- Produces: blended exercise discovery and reviewed provider exercises/workouts that can create editable templates.

- [ ] **Step 1: Extend exercise and workout tests**

Verify:

- Local exercises remain visible instantly.
- External exercises show provider, muscles, equipment, and media availability.
- Video is not fetched before detail/review opens.
- **Add to workout** submits sets/reps/duration and snapshot.
- Provider workouts open an editable review and never create a template without confirmation.
- Missing MuscleWiki credentials preserve local workout ideas.

- [ ] **Step 2: Verify failures**

Run: `npx vitest run tests/component/exercise-library.test.tsx tests/component/workout-builder.test.tsx tests/unit/workout-discovery.test.ts`  
Expected: FAIL before provider discovery is wired.

- [ ] **Step 3: Implement blended exercise UI**

Keep existing local filters. Query external sources after debounce. Review shows instructions, safety copy, target muscles, equipment, source, and lazy media. External exercises are represented in builder state by `externalSnapshotId`; local exercises continue using `exerciseId`.

- [ ] **Step 4: Implement workout import**

The workout route returns local ideas and optional MuscleWiki workouts. Confirmation creates:

- One private workout snapshot.
- One editable `workout_templates` row.
- Ordered `workout_template_exercises` rows referencing either local exercise IDs or external exercise snapshot IDs.

Do not persist provider media binaries.

- [ ] **Step 5: Run fitness tests**

Run: `npx vitest run tests/component/exercise-library.test.tsx tests/component/workout-builder.test.tsx tests/unit/workout-discovery.test.ts tests/unit/fitness-domain.test.ts`  
Expected: PASS.

- [ ] **Step 6: Review checkpoint**

Confirm a complete workout can still be built with only the local catalogue.

### Task 9: Cross-surface browser and production verification

**Files:**
- Modify: `tests/e2e/authenticated-smoke.spec.ts`
- Create: `tests/e2e/discovery.spec.ts`
- Modify only implementation files required by failures.

- [ ] **Step 1: Add authenticated discovery coverage**

Mock external provider responses at the B Fit & Healthy route-handler boundary and verify food, recipe, exercise, and workout result review. Include a partial-failure case and a 375px overflow assertion.

- [ ] **Step 2: Run focused browser tests**

Run:

```powershell
npx playwright test tests/e2e/discovery.spec.ts --project=chromium-desktop --project=chromium-mobile
```

Expected: PASS when dedicated E2E credentials exist, otherwise documented skip.

- [ ] **Step 3: Run all automated verification**

Run:

```powershell
npm run test
npm run typecheck
npm run lint
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 4: Run public and authenticated browser regression**

Run:

```powershell
npm run test:e2e:all
```

Expected: all configured projects PASS; credential-dependent tests may skip only through the existing credential guard.

- [ ] **Step 5: Manual provider-failure review**

Run production locally with provider keys absent, then with each configured provider individually. Confirm local-only operation, fast page navigation, correct provenance, explicit confirmation, responsive review sheets, and no console errors.

- [ ] **Step 6: Final review checkpoint**

Report modified files, configured/disabled providers, migration requirement, verification results, and unresolved external-account requirements. Do not commit.
