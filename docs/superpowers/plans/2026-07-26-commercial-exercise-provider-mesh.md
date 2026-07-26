# Commercial Exercise Provider Mesh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand exercise discovery with commercially permitted local, ExerciseAPI, wrkout, and license-filtered wger content while retaining fast local-first behavior.

**Architecture:** Every provider remains an isolated server-only adapter that emits the shared discovery contract plus explicit license metadata. ExerciseAPI and wrkout use long-lived server caches; wger remains live but filters records through a strict commercial-license allowlist before normalization and merging.

**Tech Stack:** Next.js 16 Route Handlers, React 19, TypeScript, Zod, native `fetch`, Supabase snapshots, Vitest, Testing Library, Playwright.

## Global Constraints

- Do not commit; the user will review and commit.
- Do not add dependencies.
- Never store or use the MuscleWiki key exposed in chat.
- Only commercially permitted free data may be enabled in production.
- Local exercises remain available without network access.
- Provider calls remain server-side.
- Preserve source, license, and attribution in every saved snapshot.
- Do not preload external videos or animated media.
- Exclude unknown, missing, non-commercial, and testing-only licenses.

---

## File Structure

- Modify `src/features/discovery/types.ts`: explicit exercise license metadata and new providers.
- Modify `src/features/discovery/schemas.ts`: validate commercial license metadata.
- Modify `src/features/discovery/safe-url.ts`: allow official provider and media hosts.
- Create `src/features/discovery/commercial-license.ts`: strict allowlist and normalization.
- Modify `src/features/fitness/providers/wger.ts`: license-aware normalization.
- Create `src/features/fitness/providers/exercise-api.ts`: CC BY 4.0 adapter.
- Create `src/features/fitness/providers/wrkout.ts`: public-domain GitHub adapter.
- Modify `src/app/api/discovery/exercises/route.ts`: concurrent eligible provider mesh.
- Modify `src/features/discovery/merge.ts`: license-aware completeness without overriding local priority.
- Modify `src/features/fitness/exercise-library.tsx`: combined counts and attribution.
- Modify `src/styles/product.css`: compact provider/license treatments.
- Modify `tests/unit/exercise-providers.test.ts`: adapter fixtures and license rejection.
- Modify `tests/unit/discovery-merge.test.ts`: deterministic cross-provider merge.
- Create `tests/unit/commercial-license.test.ts`: allowlist contract.
- Modify `tests/component/exercise-library.test.tsx`: provider and attribution UI.
- Create `tests/e2e/exercise-discovery.spec.ts`: authenticated provider-failure and overflow checks.

### Task 1: Commercial License Contract

**Files:**
- Create: `src/features/discovery/commercial-license.ts`
- Modify: `src/features/discovery/types.ts`
- Modify: `src/features/discovery/schemas.ts`
- Create: `tests/unit/commercial-license.test.ts`

**Interfaces:**
- Produces: `CommercialExerciseLicense`, `normalizeCommercialLicense(input)`.
- Consumes: raw provider license name and URL.

- [ ] **Step 1: Write failing license tests**

Create:

```ts
import { describe, expect, it } from "vitest";
import {
  normalizeCommercialLicense,
} from "@/features/discovery/commercial-license";

describe("commercial exercise licenses", () => {
  it.each([
    ["CC BY 4.0", "CC-BY-4.0"],
    ["Creative Commons Attribution 4", "CC-BY-4.0"],
    ["CC-BY-SA 4", "CC-BY-SA-4.0"],
    ["Creative Commons Attribution Share Alike 4", "CC-BY-SA-4.0"],
    ["Unlicense", "Unlicense"],
  ])("accepts %s", (name, expected) => {
    expect(normalizeCommercialLicense({
      name,
      url: "https://example.com/license",
      attribution: "Source",
    })?.id).toBe(expected);
  });

  it.each([
    "CC BY-NC 4.0",
    "CC BY-NC-SA 4.0",
    "personal use",
    "",
  ])("rejects %s", (name) => {
    expect(normalizeCommercialLicense({
      name,
      url: null,
      attribution: "Source",
    })).toBeNull();
  });
});
```

- [ ] **Step 2: Verify failure**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/commercial-license.test.ts
```

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Define exact license metadata**

Add:

```ts
export type CommercialExerciseLicense = {
  id: "CC-BY-4.0" | "CC-BY-SA-4.0" | "Unlicense" | "LOCAL-CURATED";
  name: string;
  url: string | null;
  attribution: string;
  commercialUse: true;
};
```

Add `license: CommercialExerciseLicense` to `DiscoveryExercise`. Add providers:

```ts
| "exercise-api"
| "wrkout"
```

All local exercise normalizers use `LOCAL-CURATED`. ExerciseAPI uses `CC-BY-4.0`; wrkout uses `Unlicense`.

- [ ] **Step 4: Implement strict normalization**

Normalize whitespace, punctuation, and case. Match only the explicit accepted names from the tests. Do not infer commercial permission from a generic `Creative Commons` label.

- [ ] **Step 5: Update Zod validation**

Add an exercise license schema with `commercialUse: z.literal(true)` and the exact ID enum. Reject malformed provider exercises before persistence.

- [ ] **Step 6: Run focused tests and typecheck**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/commercial-license.test.ts tests/unit/discovery-snapshots.test.ts
npm.cmd run typecheck
```

Expected: initial type errors reveal every existing exercise constructor; update those constructors with explicit license metadata, then both commands PASS.

- [ ] **Step 7: Review checkpoint**

Search for every `kind: "exercise"` constructor and confirm each has a license.

### Task 2: License-filtered wger Adapter

**Files:**
- Modify: `src/features/fitness/providers/wger.ts`
- Modify: `tests/unit/exercise-providers.test.ts`

**Interfaces:**
- Consumes: `normalizeCommercialLicense`.
- Produces: `normalizeWgerExercise()` returning only commercially compatible exercises.

- [ ] **Step 1: Extend the wger fixture tests**

Add a license to the accepted fixture:

```ts
license: {
  full_name: "Creative Commons Attribution Share Alike 4",
  short_name: "CC-BY-SA 4",
  url: "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
},
license_author: "wger contributor",
```

Assert:

```ts
expect(result?.license).toMatchObject({
  id: "CC-BY-SA-4.0",
  attribution: "wger contributor",
});
```

Add:

```ts
it("rejects wger exercises without a commercial license", () => {
  expect(normalizeWgerExercise({
    id: 13,
    license: {
      full_name: "Creative Commons Attribution NonCommercial 4",
      short_name: "CC-BY-NC 4",
      url: "https://creativecommons.org/licenses/by-nc/4.0/",
    },
    translations: [{ language: 2, name: "Restricted curl" }],
  })).toBeNull();
});
```

- [ ] **Step 2: Verify failure**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/exercise-providers.test.ts
```

Expected: FAIL because licenses are ignored.

- [ ] **Step 3: Extend and filter the raw type**

Add:

```ts
license?: {
  full_name?: string;
  short_name?: string;
  url?: string;
};
license_author?: string;
```

Call `normalizeCommercialLicense` before reading translations. Return `null` when it rejects the record. Use the author, wger attribution, license name, and URL in the normalized result.

- [ ] **Step 4: Sanitize provider text**

Keep stripping HTML. Also remove zero-width characters and normalize whitespace before splitting instructions.

- [ ] **Step 5: Run adapter tests**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/exercise-providers.test.ts
```

Expected: PASS.

- [ ] **Step 6: Review checkpoint**

Verify the adapter never converts an unknown license to an allowed license.

### Task 3: ExerciseAPI Adapter

**Files:**
- Create: `src/features/fitness/providers/exercise-api.ts`
- Modify: `src/features/discovery/safe-url.ts`
- Modify: `tests/unit/exercise-providers.test.ts`

**Interfaces:**
- Produces: `normalizeExerciseApiExercise(record)`, `searchExerciseApiExercises(query, signal)`.
- Consumes: ExerciseAPI v1 list envelope.

- [ ] **Step 1: Add a failing fixture test**

Add:

```ts
it("normalizes ExerciseAPI records with required attribution", () => {
  const result = normalizeExerciseApiExercise({
    id: "barbell_bench_press",
    name: "Barbell bench press",
    primary_muscles: ["pectoralis major"],
    secondary_muscles: ["triceps"],
    equipment: ["barbell", "bench"],
    pattern: "horizontal push",
    instructions: ["Set the shoulders.", "Press with control."],
  });
  expect(result).toMatchObject({
    provider: "exercise-api",
    title: "Barbell bench press",
    license: {
      id: "CC-BY-4.0",
      commercialUse: true,
    },
  });
  expect(result.attribution).toMatch(/ExerciseAPI/);
});
```

- [ ] **Step 2: Verify failure**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/exercise-providers.test.ts
```

Expected: FAIL because the adapter does not exist.

- [ ] **Step 3: Implement normalization**

Use stable provider IDs, exact CC BY attribution, no invented difficulty, and only allow media/source URLs from:

```text
exercise-api.com
www.exercise-api.com
```

Do not assign images or videos that are absent.

- [ ] **Step 4: Implement cached catalogue search**

Fetch:

```text
https://exercise-api.com/v1/exercises?limit=200&offset=0
```

with:

```ts
next: { revalidate: 2_592_000 }
```

Filter the normalized catalogue server-side by title, muscles, equipment, and movement pattern. This makes one long-lived upstream catalogue request rather than one call per keystroke. Return `[]` on 429 or provider failure so the runner can retain other sources.

- [ ] **Step 5: Run adapter and URL tests**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/exercise-providers.test.ts tests/unit/discovery-safe-url.test.ts
```

Expected: PASS.

- [ ] **Step 6: Review checkpoint**

Confirm the exact CC BY attribution is stored on every item.

### Task 4: wrkout Public-domain Adapter

**Files:**
- Create: `src/features/fitness/providers/wrkout.ts`
- Modify: `src/features/discovery/safe-url.ts`
- Modify: `tests/unit/exercise-providers.test.ts`

**Interfaces:**
- Produces: `normalizeWrkoutExercise(record)`, `searchWrkoutExercises(query, signal)`.
- Consumes: GitHub repository tree and individual `exercise.json` files.

- [ ] **Step 1: Add a failing public-domain fixture test**

Add:

```ts
it("normalizes wrkout public-domain exercises", () => {
  const result = normalizeWrkoutExercise({
    name: "Barbell Curl",
    force: "pull",
    level: "beginner",
    mechanic: "isolation",
    equipment: "barbell",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    instructions: ["Stand tall.", "Curl the bar."],
    category: "strength",
    images: [],
  }, "Barbell_Curl");
  expect(result).toMatchObject({
    provider: "wrkout",
    externalId: "Barbell_Curl",
    license: { id: "Unlicense", commercialUse: true },
  });
});
```

- [ ] **Step 2: Verify failure**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/exercise-providers.test.ts
```

Expected: FAIL because the adapter does not exist.

- [ ] **Step 3: Implement normalization and host allowlisting**

Allow only:

```text
github.com
raw.githubusercontent.com
```

Do not automatically expose repository images; image licensing and host behavior must be reviewed independently before media is added. Normalize textual exercise data only.

- [ ] **Step 4: Implement repository search**

Fetch and cache the recursive tree:

```text
https://api.github.com/repos/wrkout/exercises.json/git/trees/master?recursive=1
```

for 30 days. Filter paths matching:

```text
exercises/<name>/exercise.json
```

Rank matching folder names locally, fetch no more than eight matching raw JSON files concurrently, and cache each for 30 days. Send the documented GitHub API `Accept` header and a B Fit & Healthy user agent. Do not require a GitHub token.

- [ ] **Step 5: Run adapter tests**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/exercise-providers.test.ts
```

Expected: PASS.

- [ ] **Step 6: Review checkpoint**

Confirm a broad query cannot trigger hundreds of raw GitHub requests.

### Task 5: Provider Mesh Orchestration and Ranking

**Files:**
- Modify: `src/app/api/discovery/exercises/route.ts`
- Modify: `src/features/discovery/merge.ts`
- Modify: `tests/unit/discovery-merge.test.ts`
- Create: `tests/unit/exercise-discovery-route-contract.test.ts`

**Interfaces:**
- Consumes: wger, ExerciseAPI, wrkout adapters and local catalogue.
- Produces: one authenticated normalized exercise response.

- [ ] **Step 1: Add merge tests**

Add:

```ts
it("prefers a complete local record and preserves provider alternatives", () => {
  const results = mergeAndRank([
    exercise({ id: "local:push-up", provider: "local", title: "Push-up" }),
    exercise({ id: "exercise-api:push_up", provider: "exercise-api", title: "Push up" }),
    exercise({ id: "wrkout:Push-Up", provider: "wrkout", title: "Push-Up" }),
  ], { query: "push up" });
  expect(results).toHaveLength(1);
  expect(results[0].provider).toBe("local");
  expect(results[0].alternates).toEqual(expect.arrayContaining([
    "exercise-api:push_up",
    "wrkout:Push-Up",
  ]));
});
```

Add route-contract tests with mocked adapters proving one provider failure retains the others.

- [ ] **Step 2: Verify failure**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/discovery-merge.test.ts tests/unit/exercise-discovery-route-contract.test.ts
```

Expected: FAIL until the providers are registered and normalization handles punctuation variants.

- [ ] **Step 3: Register eligible providers**

Run concurrently:

```ts
[
  { id: "wger", run: (signal) => searchWgerExercises(query, signal) },
  { id: "exercise-api", run: (signal) => searchExerciseApiExercises(query, signal) },
  { id: "wrkout", run: (signal) => searchWrkoutExercises(query, signal) },
]
```

Do not invoke MuscleWiki in production. If the existing adapter remains, gate it behind an explicitly paid-commercial configuration added in a future phase; it is not part of this route.

- [ ] **Step 4: Strengthen exercise identity**

Deduplicate normalized title punctuation variants using title, primary muscle overlap, and compatible equipment. Never merge materially different variations such as incline and flat presses.

- [ ] **Step 5: Run focused route and merge tests**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/unit/discovery-merge.test.ts tests/unit/exercise-discovery-route-contract.test.ts tests/unit/provider-runner.test.ts
```

Expected: PASS.

- [ ] **Step 6: Review checkpoint**

Inspect logs to confirm raw queries and provider payloads are not logged.

### Task 6: Exercise Library Provenance and Result Strength

**Files:**
- Modify: `src/features/fitness/exercise-library.tsx`
- Modify: `src/styles/product.css`
- Modify: `tests/component/exercise-library.test.tsx`

**Interfaces:**
- Consumes: merged `DiscoveryExercise[]`.
- Produces: visible source/license and combined result count.

- [ ] **Step 1: Extend component tests**

Mock a live provider response and assert:

```ts
expect(await screen.findByText("ExerciseAPI")).toBeInTheDocument();
expect(screen.getByText("CC BY 4.0")).toBeInTheDocument();
expect(screen.getByText(/connected exercises/i)).toBeInTheDocument();
```

Open review and assert instructions, muscles, equipment, source, license, and attribution are visible. Assert no `<video>` exists before review opens.

- [ ] **Step 2: Verify failure**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/component/exercise-library.test.tsx
```

Expected: FAIL because the current live cards omit license metadata and show a separate count.

- [ ] **Step 3: Implement combined discovery presentation**

- Show local results immediately.
- Once live results resolve, show a combined summary with local and connected counts.
- Keep existing local cards and detail links.
- Connected cards show provider, license short name, muscles, equipment, and review action.
- Review sheet shows full required attribution and source link.
- Use text labels, not color alone.

- [ ] **Step 4: Apply compact responsive styling**

Keep provider badges small, allow long attribution to wrap, and ensure the card grid has no minimum width that causes 320px overflow.

- [ ] **Step 5: Run component tests and accessibility checks**

Run:

```powershell
node node_modules/vitest/vitest.mjs run tests/component/exercise-library.test.tsx tests/component/review-sheet.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Review checkpoint**

Confirm local content remains interactive while providers load.

### Task 7: Production and Browser Verification

**Files:**
- Create: `tests/e2e/exercise-discovery.spec.ts`
- Modify only implementation files required by failures.

**Interfaces:**
- Consumes: completed provider mesh.
- Produces: responsive and failure-mode evidence.

- [ ] **Step 1: Add authenticated browser tests**

At the B Fit & Healthy discovery route boundary, mock:

1. All providers successful.
2. wger unavailable while ExerciseAPI and wrkout succeed.
3. All providers unavailable.

Assert local results remain visible in every case, source/license labels appear for live results, Escape closes review, and 375px has no horizontal overflow.

- [ ] **Step 2: Run focused browser tests**

Run:

```powershell
node node_modules/@playwright/test/cli.js test tests/e2e/exercise-discovery.spec.ts --project=chromium-desktop --project=chromium-mobile
```

Expected: PASS, or documented credential-guarded skip for authentication only.

- [ ] **Step 3: Run all automated verification**

Run:

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

Expected: all commands exit 0.

- [ ] **Step 4: Verify live sources independently**

From the server environment, test:

- Local only
- wger only
- ExerciseAPI only
- wrkout only
- All three concurrently

Confirm attribution, commercial license, timeout behavior, and response latency. Do not test the exposed MuscleWiki key.

- [ ] **Step 5: Refresh localhost**

Restart the scoped production process on port 3000. Inspect `/exercises` at 320, 375, 768, 1024, and 1440 pixels in light and dark mode.

- [ ] **Step 6: Final review checkpoint**

Report enabled sources, rejected license categories, cache behavior, tests, build status, and unresolved external-service risks. Leave all work uncommitted.
