# Complete Editorial UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign every B Fit & Healthy route around the approved Balanced Daily Canvas, expand recipe and workout discovery, and make signed-in navigation feel immediate without removing existing functionality.

**Architecture:** Establish semantic design tokens and focused shared primitives first, then migrate route groups in independently testable waves. Keep curated nutrition, fitness, and anatomy data authoritative; isolate optional external providers behind server-only adapters with timeouts and fallbacks. Preserve the product shell across navigation, deduplicate account reads, stream secondary data, and validate every route with contract, component, accessibility, responsive, and production-build gates.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, CSS, Supabase SSR, Vitest, Testing Library, Playwright, axe-core, existing GSAP/Three.js progressive-enhancement boundaries

## Global Constraints

- Use Source Sans 3 through `next/font`; page H1 weight is exactly 500.
- Product H1 size stays within 36–44 px desktop and 30–36 px mobile.
- Public display size stays within 48–64 px desktop and 38–44 px mobile.
- Standard controls are 40 px high; direct touch targets are at least 44 by 44 px.
- The content shell is at most 1180 px wide.
- Standard card radius is 13 px; control radius is 9 px.
- Dark mode uses near-neutral ink surfaces; the blue ambient halo is capped at approximately 8% visual opacity.
- Sky blue is reserved for action, selection, progress, focus, and restrained atmosphere.
- English is primary; existing Macedonian functionality remains intact and no mojibake may ship.
- The SVG anatomy atlas remains the accessible baseline.
- External providers never block curated local recipes, workouts, exercises, or active sessions.
- Do not add `.env.example`.
- Do not create commits; the user reviews and commits all changes.
- Preserve unrelated working-tree changes, including the existing `next-env.d.ts` modification.

---

## File Structure

### Shared foundation

- `src/app/globals.css` — import hub and only truly global reset/base rules after extraction.
- `src/styles/tokens.css` — approved color, type, size, radius, shadow, and spacing custom properties.
- `src/styles/base.css` — document typography, focus, media, forms, reduced motion, and utility layout.
- `src/styles/shell.css` — public/product header, primary navigation, mobile navigation, footer, and page shell.
- `src/styles/components.css` — buttons, fields, cards, panels, notices, loading, empty states, tables, and filters.
- `src/styles/public.css` — landing, feature, auth, blog, article, legal, and offline compositions.
- `src/styles/product.css` — Today, nutrition, fitness, tracking, assistant, and planner compositions.
- `src/styles/anatomy.css` — atlas, directory, detail panel, and responsive anatomy rules.
- `src/styles/responsive.css` — cross-feature breakpoint outcomes that cannot live beside a component.

### New shared components

- `src/components/ui/page-heading.tsx` — consistent page title, eyebrow, description, and action slot.
- `src/components/ui/empty-state.tsx` — compact actionable empty state.
- `src/components/ui/field.tsx` — visible label, description, error, and control association.
- `src/components/ui/route-skeleton.tsx` — destination-shaped loading layouts.
- `src/components/shell/navigation-intent.tsx` — intent-based warming for primary product routes.

### Content discovery

- `src/features/nutrition/recipe-types.ts` — normalized curated/provider recipe contracts.
- `src/features/nutrition/recipe-catalogue.ts` — authoritative curated recipe collection.
- `src/features/nutrition/recipe-discovery.ts` — pure search/filter/category functions.
- `src/features/nutrition/providers/types.ts` — server provider interface.
- `src/features/nutrition/providers/themealdb.ts` — optional labelled inspiration adapter.
- `src/features/nutrition/recipe-library.tsx` — interactive recipe discovery UI.
- `src/features/fitness/workout-ideas.ts` — curated workout-idea contracts and data.
- `src/features/fitness/workout-discovery.ts` — pure filters and copy-to-template mapping.
- `src/features/fitness/workout-idea-library.tsx` — filters, previews, and add-to-workouts UI.
- `src/features/fitness/providers/types.ts` — normalized exercise provider interface.
- `src/features/fitness/providers/wger.ts` — optional server-side wger exercise adapter.

### Performance and loading

- `src/features/auth/session.ts` — request-memoized current-user/profile access.
- `src/app/(product)/loading.tsx` — product-shell loading fallback.
- Route-local `loading.tsx` files for Today, Nutrition, Recipes, Training, Progress, and Assistant.
- `src/lib/performance/navigation-marks.ts` — browser navigation mark names and helper.

### Tests

- New unit tests for tokens, recipe discovery, workout discovery, provider normalization/fallbacks, and navigation marks.
- New component tests for page heading, empty state, recipe library, workout idea library, and navigation intent.
- Expanded Playwright route inventory, accessibility, responsive, and navigation-performance coverage.

---

### Task 1: Lock the Editorial Design Contracts

**Files:**
- Create: `tests/editorial-design-system.test.js`
- Modify: `tests/e2e/route-inventory.ts`
- Modify: `tests/e2e/responsive-layout.spec.ts`
- Modify: `tests/e2e/accessibility.spec.ts`

**Interfaces:**
- Consumes: approved specification values from `docs/superpowers/specs/2026-07-25-complete-editorial-ui-redesign-design.md`
- Produces: repository-level contracts that later tasks must satisfy

- [ ] **Step 1: Add failing repository contracts**

Add assertions that require Source Sans 3, extracted style modules, the neutral dark tokens, a 1180 px shell, route-level product loading, and no yellow primary button token:

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("editorial design system is centralized", () => {
  const layout = read("src/app/layout.tsx");
  const tokens = read("src/styles/tokens.css");
  assert.match(layout, /Source_Sans_3/);
  assert.match(tokens, /--shell:\s*73\.75rem/);
  assert.match(tokens, /--control-height:\s*2\.5rem/);
  assert.match(tokens, /--radius-card:\s*0\.8125rem/);
  assert.match(tokens, /--background:\s*#10161a/i);
  assert.doesNotMatch(tokens, /--brand:[^;]*(yellow|#f[bc][0-9a-f]{3})/i);
});

test("primary product routes expose local loading UI", () => {
  for (const route of ["today", "nutrition", "recipes", "training", "progress", "assistant"]) {
    assert.ok(fs.existsSync(`src/app/(product)/${route}/loading.tsx`), route);
  }
});
```

- [ ] **Step 2: Run the contract and confirm failure**

Run:

```powershell
node --test tests/editorial-design-system.test.js
```

Expected: failure because `src/styles/tokens.css`, Source Sans 3, and route loading files do not yet exist.

- [ ] **Step 3: Expand the complete route inventories**

Add every existing public and protected page from `src/app/**/page.tsx` to the appropriate inventory. Include detail-route samples for recipes, workouts, exercises, history, and anatomy. Add authenticated responsive samples for Today, Nutrition, Training, Progress, and Assistant using the authenticated Playwright project.

- [ ] **Step 4: Add shared accessibility assertions**

For each route under test, require:

```ts
await expect(page.locator('main#main-content')).toHaveCount(1);
await expect(page.locator("h1")).toHaveCount(1);
await page.keyboard.press("Tab");
await expect(page.getByRole("link", { name: /skip/i })).toBeVisible();
```

Retain the existing axe and runtime-monitor checks.

- [ ] **Step 5: Record the red baseline**

Run:

```powershell
npm run test:contracts
npm run test:unit
```

Expected: existing suites remain green; the new editorial contract remains red until Task 2.

---

### Task 2: Build the Typography, Token, and CSS Foundation

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `src/styles/shell.css`
- Create: `src/styles/components.css`
- Create: `src/styles/public.css`
- Create: `src/styles/product.css`
- Create: `src/styles/anatomy.css`
- Create: `src/styles/responsive.css`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Test: `tests/editorial-design-system.test.js`

**Interfaces:**
- Produces: semantic CSS properties used by every later task
- Required properties: `--background`, `--surface`, `--surface-raised`, `--foreground`, `--foreground-secondary`, `--border`, `--border-strong`, `--brand`, `--brand-hover`, `--brand-soft`, `--sage`, `--clay`, `--danger`, `--shell`, `--control-height`, `--touch-target`, `--radius-control`, `--radius-card`

- [ ] **Step 1: Replace Manrope with Source Sans 3**

In `src/app/layout.tsx`:

```tsx
import { JetBrains_Mono, Source_Sans_3 } from "next/font/google";

const sans = Source_Sans_3({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});
```

Apply `sans.variable` to the body and update light/dark `themeColor` to the approved neutral page colors.
Replace the corrupted metadata separator with the literal `·` character while this file is open.

- [ ] **Step 2: Define exact semantic tokens**

In `src/styles/tokens.css`, define light mode values from the specification and dark values under `.dark`. Include:

```css
:root {
  --background: #f3f4f1;
  --surface: #fbfcfa;
  --surface-raised: #ffffff;
  --foreground: #18221f;
  --foreground-secondary: #5d6964;
  --border: #d3d9d5;
  --border-strong: #b9c3bd;
  --brand: #347fa8;
  --brand-hover: #28698d;
  --brand-soft: #e2f1f8;
  --sage: #5e8c76;
  --clay: #b97d4d;
  --shell: 73.75rem;
  --control-height: 2.5rem;
  --touch-target: 2.75rem;
  --radius-control: 0.5625rem;
  --radius-card: 0.8125rem;
}

.dark {
  --background: #10161a;
  --surface: #161d22;
  --surface-raised: #1c252c;
  --foreground: #eef3f5;
  --foreground-secondary: #aeb8bf;
  --border: #303a42;
  --border-strong: #46545e;
  --brand: #78c9ef;
  --brand-hover: #98dbf7;
  --brand-soft: #1b3441;
  --sage: #83b79b;
  --clay: #d19a6b;
}
```

- [ ] **Step 3: Extract global CSS by responsibility**

Move existing selectors without changing class names first. Preserve cascade order through these imports at the top of `globals.css`:

```css
@import "../styles/tokens.css";
@import "../styles/base.css";
@import "../styles/shell.css";
@import "../styles/components.css";
@import "../styles/public.css";
@import "../styles/product.css";
@import "../styles/anatomy.css";
@import "../styles/responsive.css";
```

Delete moved declarations from `globals.css`; do not duplicate them.

- [ ] **Step 4: Apply the approved scale**

Set shared page typography and controls:

```css
.public-display {
  font-size: clamp(2.375rem, 5vw, 4rem);
  font-weight: 500;
  line-height: 0.98;
}

.product-page-heading h1 {
  font-size: clamp(1.875rem, 4vw, 2.75rem);
  font-weight: 500;
  line-height: 1.05;
}

.ui-button,
.button,
input,
select {
  min-height: var(--control-height);
  border-radius: var(--radius-control);
}
```

Replace broad blue page gradients with a neutral background plus a maximum 8% sky halo.

- [ ] **Step 5: Add reduced-motion and media safety**

Keep background halo and shimmer static under reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 6: Verify foundation contracts**

Run:

```powershell
node --test tests/editorial-design-system.test.js
npm run typecheck
npm run lint
```

Expected: token and typography assertions pass; loading-file assertions remain red until Task 4.

---

### Task 3: Standardize Shared UI and Shell Components

**Files:**
- Create: `src/components/ui/page-heading.tsx`
- Create: `src/components/ui/empty-state.tsx`
- Create: `src/components/ui/field.tsx`
- Create: `src/components/ui/route-skeleton.tsx`
- Create: `src/components/shell/navigation-intent.tsx`
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/card.tsx`
- Modify: `src/components/shell/brand.tsx`
- Modify: `src/components/shell/public-header.tsx`
- Modify: `src/components/shell/product-header.tsx`
- Modify: `src/components/shell/product-navigation.tsx`
- Modify: `src/components/shell/mobile-product-navigation.tsx`
- Test: `tests/component/page-heading.test.tsx`
- Test: `tests/component/empty-state.test.tsx`
- Test: `tests/component/field.test.tsx`
- Test: `tests/component/navigation-intent.test.tsx`

**Interfaces:**
- Produces:

```ts
type PageHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ "aria-hidden"?: boolean }>;
};

type FieldProps = {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactElement;
};
```

- [ ] **Step 1: Write component tests**

Require one semantic heading, optional description/action slots, compact actionable empty states, and `aria-describedby`/`aria-invalid` field wiring.

```tsx
render(<Field label="Weight" error="Enter a value"><input name="weight" /></Field>);
expect(screen.getByLabelText("Weight")).toHaveAttribute("aria-invalid", "true");
expect(screen.getByRole("alert")).toHaveTextContent("Enter a value");
```

- [ ] **Step 2: Run component tests and confirm failure**

Run:

```powershell
npx vitest run tests/component/page-heading.test.tsx tests/component/empty-state.test.tsx tests/component/field.test.tsx
```

Expected: module-not-found failures.

- [ ] **Step 3: Implement the shared primitives**

Keep components semantic and presentation-light. Use `cloneElement` in `Field` only to add generated IDs and ARIA relationships; preserve caller handlers and props.

- [ ] **Step 4: Normalize button and card variants**

Keep the current CVA approach, but expose only:

```ts
type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";
type CardTone = "default" | "raised" | "soft" | "interactive";
```

Remove legacy yellow/beige primary styling and page-specific button geometry.

- [ ] **Step 5: Correct brand destinations and navigation hierarchy**

Continue using `resolveBrandDestination(authenticated)`. Public logo resolves to `/`; product logo resolves to `/today`. Public header exposes Sign in. Desktop product navigation keeps Today, Nutrition, Training, Progress, and Coach; mobile keeps Today, Nutrition, Training, and More.

- [ ] **Step 6: Add navigation intent feedback**

`NavigationIntent` listens to `pointerenter`, `focus`, and `touchstart` on primary route links, calls `router.prefetch(href)`, and sets a `data-navigation-pending` attribute immediately after activation. It must not prefetch external URLs.

- [ ] **Step 7: Run shared component tests**

Run:

```powershell
npx vitest run tests/component/page-heading.test.tsx tests/component/empty-state.test.tsx tests/component/field.test.tsx tests/component/navigation-intent.test.tsx tests/unit/brand-destination.test.ts
npm run typecheck
```

Expected: all pass.

---

### Task 4: Make Product Navigation Persistent and Measurably Faster

**Files:**
- Modify: `src/features/auth/session.ts`
- Modify: `src/app/(product)/layout.tsx`
- Create: `src/app/(product)/loading.tsx`
- Create: `src/app/(product)/today/loading.tsx`
- Create: `src/app/(product)/nutrition/loading.tsx`
- Create: `src/app/(product)/recipes/loading.tsx`
- Create: `src/app/(product)/training/loading.tsx`
- Create: `src/app/(product)/progress/loading.tsx`
- Create: `src/app/(product)/assistant/loading.tsx`
- Create: `src/lib/performance/navigation-marks.ts`
- Test: `tests/unit/session-request-cache.test.ts`
- Test: `tests/unit/navigation-marks.test.ts`
- Modify: `tests/e2e/authenticated-smoke.spec.ts`

**Interfaces:**
- Produces:

```ts
export const requireUser: () => Promise<User>;
export const getCurrentProfile: (userId?: string) => Promise<Profile | null>;
export const NAVIGATION_INTENT_MARK = "bfh:navigation-intent";
export const NAVIGATION_READY_MARK = "bfh:navigation-ready";
export function markNavigationIntent(href: string): void;
export function markNavigationReady(href: string): void;
```

- [ ] **Step 1: Write request-cache and navigation-mark tests**

Mock Supabase and prove two `requireUser()` calls within one render request call `auth.getUser()` once. Prove navigation helpers are no-ops on the server and create named marks in a browser environment.

- [ ] **Step 2: Memoize server account reads**

Wrap internal implementations with React `cache`:

```ts
import { cache } from "react";

const readRequiredUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  return user;
});

export const requireUser = () => readRequiredUser();
```

Use a cached profile reader keyed by user ID.

- [ ] **Step 3: Remove unnecessary layout-wide forced dynamic rendering**

Delete `export const dynamic = "force-dynamic"` from the product layout. Let authenticated cookie access make only necessary routes dynamic. Keep authorization on the server.

- [ ] **Step 4: Isolate secondary header data**

Keep user/profile/locale required for the shell. Render notification count in its own Suspense boundary so a count query does not block the header and page.

- [ ] **Step 5: Add destination-shaped loading states**

Use `RouteSkeleton` variants:

```ts
type RouteSkeletonVariant =
  | "today"
  | "nutrition"
  | "recipes"
  | "training"
  | "progress"
  | "assistant";
```

Each local loading file returns `<RouteSkeleton variant="…" />` inside a main landmark with an accessible loading label.

- [ ] **Step 6: Add signed-in navigation timing coverage**

In the authenticated Playwright suite, click each primary navigation item, assert active-state feedback appears before navigation completes, assert no blank body occurs, and capture measured time between intent and ready marks. Fail only above the agreed 750 ms warmed p75 budget after a warm-up pass.

- [ ] **Step 7: Verify performance foundation**

Run:

```powershell
npx vitest run tests/unit/session-request-cache.test.ts tests/unit/navigation-marks.test.ts
node --test tests/editorial-design-system.test.js
npm run typecheck
```

Expected: all editorial contracts now pass.

---

### Task 5: Redesign Public, Authentication, Blog, and Article Routes

**Files:**
- Modify: all files under `src/app/(marketing)/**/page.tsx`
- Modify: all files under `src/app/(auth)/**/page.tsx`
- Modify: `src/features/auth/auth-shell.tsx`
- Modify: `src/features/auth/auth-form.tsx`
- Modify: `src/features/auth/reset-form.tsx`
- Modify: `src/features/knowledge/knowledge-library.tsx`
- Modify: `src/components/content/article-card.tsx`
- Modify: `src/components/content/feature-page.tsx`
- Modify: `src/components/content/information-page.tsx`
- Modify: `src/components/content/section-intro.tsx`
- Modify: `src/lib/i18n/public-content.ts`
- Test: `tests/component/knowledge-library.test.tsx`
- Modify: `tests/e2e/public-routes.spec.ts`
- Modify: `tests/e2e/public-interactions.spec.ts`

**Interfaces:**
- Consumes: `PageHeading`, shared buttons/cards/fields, public shell tokens
- Produces: complete public and account routes with one H1 and `main#main-content`

- [ ] **Step 1: Add public-route structure tests**

Require discoverable Sign in, correct logo destination, one H1, valid main target, article reading wrapper, visible topic/summary/time metadata, and non-overlapping public navigation.

- [ ] **Step 2: Redesign the landing and feature routes**

Use the approved scale, shorter hero hierarchy, balanced content modules, interactive constellation hover/focus states, neutral surfaces, and two clear hero actions. Preserve ambient-pointer reduced-motion safeguards.

- [ ] **Step 3: Redesign auth routes**

Use one focused auth composition, shared `Field`, 40 px controls, visible validation, and direct routes between sign-in, sign-up, magic link, and recovery. Preserve all server actions and redirects.

- [ ] **Step 4: Rebuild the blog landing hierarchy**

Add an explanatory introduction, topic filters, a featured article, and the full library grid. Keep filters client-side over the local article catalogue and ensure all content remains present without JavaScript.

- [ ] **Step 5: Correct article reading rhythm**

Apply a 62–68 character body measure, 1.7 line height, shared paragraph/subheading flow, separated educational disclaimer, and related articles after the body. Do not rewrite accurate article content solely to fill space.

- [ ] **Step 6: Redesign information, legal, states, contact, and offline pages**

Use document layouts for legal pages, actionable status layouts for states/offline, and a compact labelled contact form. Remove decorative full-width empty panels.

- [ ] **Step 7: Verify the public wave**

Run:

```powershell
npx vitest run tests/component/knowledge-library.test.tsx tests/unit/content.test.ts tests/unit/i18n.test.ts
npm run test:contracts
npm run typecheck
npm run lint
npx playwright test tests/e2e/public-routes.spec.ts tests/e2e/public-interactions.spec.ts --project=chromium-desktop
```

Expected: all pass with a clean runtime monitor.

---

### Task 6: Redesign Today, Tracking, Progress, and AI Coach

**Files:**
- Modify: `src/app/(product)/today/page.tsx`
- Modify: `src/features/dashboard/today-canvas.tsx`
- Modify: `src/features/dashboard/daily-balance.tsx`
- Modify: `src/features/dashboard/rhythm-rail.tsx`
- Modify: `src/features/dashboard/guidance-panel.tsx`
- Modify: product pages for progress, goals, habits, notifications, onboarding, and assistant
- Modify: `src/features/tracking/tracking-form.tsx`
- Modify: `src/features/tracking/goal-actions.tsx`
- Modify: `src/features/tracking/habit-actions.tsx`
- Modify: `src/features/tracking/notification-actions.tsx`
- Modify: `src/features/progress/weight-chart.tsx`
- Modify: `src/features/assistant/assistant-canvas.tsx`
- Modify: `src/features/assistant/conversation-list.tsx`
- Modify: `src/features/assistant/message-list.tsx`
- Modify: `src/features/assistant/draft-card.tsx`
- Test: relevant existing component/unit suites

**Interfaces:**
- Consumes: shared page heading, cards, fields, empty state, route loading
- Preserves: AI drafts remain review-only and require explicit user confirmation

- [ ] **Step 1: Strengthen component assertions**

Update Today tests to require a compact next action, linear Daily Balance rows, and a useful empty rhythm state. Update assistant tests to require one conversation heading, compact prompt chips, visible context disclosure, and draft confirmation controls.

- [ ] **Step 2: Implement Balanced Daily Canvas**

Use a main grid of approximately `minmax(0, 1.45fr) minmax(17rem, .55fr)` at wide desktop. Keep the greeting at product H1 scale, place next action and Daily Balance in the main column, and limit the rail to one nudge plus connected summaries.

- [ ] **Step 3: Recompose tracking and progress**

Place trend summaries before entry forms when data exists. Use compact forms with shared fields. Replace oversized empty charts with `EmptyState` and one direct action.

- [ ] **Step 4: Recompose goals, habits, notifications, and onboarding**

Prioritize active records, next check-ins, read/unread structure, and short onboarding steps. Keep action buttons within the shared 40/44 px geometry.

- [ ] **Step 5: Recompose AI Coach**

Keep conversation central. Make the context rail narrower, move recent conversations into a compact rail/drawer, reduce unused empty height, and place the composer directly after messages. Keep draft cards visually distinct from messages and preserve every confirmation requirement.

- [ ] **Step 6: Run product-core tests**

Run:

```powershell
npx vitest run tests/component/daily-balance.test.tsx tests/component/assistant-canvas.test.tsx tests/component/assistant-draft-card.test.tsx tests/component/weight-chart.test.tsx tests/unit/tracking-domain.test.ts tests/unit/assistant-domain.test.ts tests/unit/assistant-draft-actions.test.ts
npm run typecheck
npm run lint
```

Expected: all pass.

---

### Task 7: Expand and Redesign Nutrition and Recipe Discovery

**Files:**
- Create: `src/features/nutrition/recipe-types.ts`
- Create: `src/features/nutrition/recipe-catalogue.ts`
- Create: `src/features/nutrition/recipe-discovery.ts`
- Create: `src/features/nutrition/recipe-library.tsx`
- Create: `src/features/nutrition/providers/types.ts`
- Create: `src/features/nutrition/providers/themealdb.ts`
- Modify: `src/features/nutrition/catalogue.ts`
- Modify: `src/features/nutrition/nutrition-forms.tsx`
- Modify: `src/app/(product)/nutrition/page.tsx`
- Modify: `src/app/(product)/meal-planner/page.tsx`
- Modify: `src/app/(product)/grocery-list/page.tsx`
- Modify: `src/app/(product)/recipes/page.tsx`
- Modify: `src/app/(product)/recipes/[slug]/page.tsx`
- Test: `tests/unit/recipe-discovery.test.ts`
- Test: `tests/unit/recipe-provider.test.ts`
- Test: `tests/component/recipe-library.test.tsx`

**Interfaces:**
- Produces:

```ts
export type RecipeIngredient = {
  name: { en: string; mk?: string };
  quantity: number;
  unit: string;
};

export type Recipe = {
  id: string;
  slug: string;
  source: "curated" | "themealdb";
  verifiedNutrition: boolean;
  mealTypes: Array<"breakfast" | "lunch" | "dinner" | "snack">;
  tags: string[];
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  title: { en: string; mk?: string };
  summary: { en: string; mk?: string };
  nutrition?: {
    energyKcal: number;
    proteinG: number;
    carbohydrateG: number;
    fatG: number;
    fibreG: number;
  };
  ingredients: RecipeIngredient[];
  steps: { en: string[]; mk?: string[] };
  attribution?: { label: string; href: string };
};

export type RecipeFilters = {
  query: string;
  mealType: "all" | Recipe["mealTypes"][number];
  maxMinutes: number | null;
  tag: string | null;
};

export function filterRecipes(recipes: readonly Recipe[], filters: RecipeFilters): Recipe[];
```

- [ ] **Step 1: Write recipe-domain tests**

Test case-insensitive title/ingredient search, meal type, maximum total time, tag filtering, deterministic category ordering, English fallback when Macedonian is absent, and provider nutrition remaining unverified.

- [ ] **Step 2: Create the 24-recipe curated core**

Add at least five breakfasts, five lunches, six dinners, and four snacks. Each curated item includes complete ingredients, steps, timings, tags, servings, macros, provenance, and reviewed/estimated status. Move the three existing recipes without changing their stable IDs or slugs.

- [ ] **Step 3: Build pure discovery functions**

Normalize search text with locale-aware lowercase, search titles and ingredients, and never mutate input arrays. Category groups return several results rather than one.

- [ ] **Step 4: Implement the optional TheMealDB adapter**

The adapter is server-only, aborts after 1500 ms, normalizes attribution and images, never invents macros, and returns:

```ts
type RecipeProviderResult =
  | { available: true; recipes: Recipe[] }
  | { available: false; recipes: []; reason: "disabled" | "timeout" | "upstream" | "invalid" };
```

Do not call it unless an existing deployment environment variable explicitly enables it. Do not create an example environment file.

- [ ] **Step 5: Build the recipe library UI**

Render search, compact filter controls, total results, grouped recipe grids, verified/estimated/provider labels, and a clear empty-filter reset. Cards expose time and key verified nutrition without hover.

- [ ] **Step 6: Recompose nutrition, planner, grocery, and recipe details**

Convert meal slots to compact ledger sections, align food search with custom-food disclosure, make the planner week scannable, group groceries, and add Save/Add to planner actions to recipe details.

- [ ] **Step 7: Verify nutrition**

Run:

```powershell
npx vitest run tests/unit/recipe-discovery.test.ts tests/unit/recipe-provider.test.ts tests/component/recipe-library.test.tsx tests/unit/nutrition-domain.test.ts
node --test tests/phase-5-nutrition-planning.test.js
npm run typecheck
npm run lint
```

Expected: all pass; provider timeout tests complete without network access.

---

### Task 8: Add Workout Ideas and Redesign the Fitness Experience

**Files:**
- Create: `src/features/fitness/workout-ideas.ts`
- Create: `src/features/fitness/workout-discovery.ts`
- Create: `src/features/fitness/workout-idea-library.tsx`
- Create: `src/features/fitness/providers/types.ts`
- Create: `src/features/fitness/providers/wger.ts`
- Modify: `src/features/fitness/catalogue.ts`
- Modify: `src/features/fitness/workout-builder.tsx`
- Modify: `src/features/fitness/exercise-library.tsx`
- Modify: fitness product route pages under `src/app/(product)`
- Modify: `src/features/fitness/actions.ts`
- Test: `tests/unit/workout-discovery.test.ts`
- Test: `tests/unit/exercise-provider.test.ts`
- Test: `tests/component/workout-idea-library.test.tsx`
- Modify: `tests/component/workout-builder.test.tsx`

**Interfaces:**
- Produces:

```ts
export type WorkoutIdea = {
  id: string;
  slug: string;
  title: { en: string; mk?: string };
  summary: { en: string; mk?: string };
  durationMinutes: number;
  difficulty: "beginner" | "intermediate";
  goal: "strength" | "mobility" | "recovery" | "general";
  environment: "home" | "gym" | "either";
  equipment: string[];
  exercises: Array<{
    exerciseSlug: string;
    sets: number;
    repMin: number | null;
    repMax: number | null;
    durationSeconds: number | null;
    restSeconds: number;
    note: string;
  }>;
};

export type WorkoutIdeaFilters = {
  goal: "all" | WorkoutIdea["goal"];
  environment: "all" | WorkoutIdea["environment"];
  maxDurationMinutes: number | null;
  equipment: string | null;
  difficulty: "all" | WorkoutIdea["difficulty"];
};

export type TemplateInput = {
  name: string;
  description: string;
  difficulty: WorkoutIdea["difficulty"];
  expectedDurationMinutes: number;
  goal: WorkoutIdea["goal"];
  exercises: WorkoutIdea["exercises"];
};

export function filterWorkoutIdeas(
  ideas: readonly WorkoutIdea[],
  filters: WorkoutIdeaFilters,
): WorkoutIdea[];

export function workoutIdeaToTemplateInput(idea: WorkoutIdea): TemplateInput;
```

- [ ] **Step 1: Write workout discovery tests**

Cover duration, goal, environment, equipment, difficulty, deterministic ordering, missing exercise references, and conversion into editable template input.

- [ ] **Step 2: Create 12–16 curated workout ideas**

Include every category specified in the design. Reference only stable local exercise slugs. Provide exact sets, reps/time, rest, equipment, goal, and safety-oriented notes.

- [ ] **Step 3: Add the workout library UI**

Render a suggested workout, filters, six initial cards, preview disclosure/dialog, and Add to My Workouts. Metadata remains visible without hover.

- [ ] **Step 4: Add the copy action**

Validate the idea slug, create a user-owned workout template plus ordered template exercises in one server action, then redirect to the editable workout detail. On partial database failure, delete the created template before returning an error state.

- [ ] **Step 5: Implement optional wger enrichment**

Use a 1500 ms abort timeout, normalize names/equipment/muscles, attach required attribution, and return the same available/unavailable discriminated union pattern as recipes. Never use external data to construct an active session automatically.

- [ ] **Step 6: Recompose all fitness routes**

Training begins with next planned or suggested workout, then inspiration, then management destinations. Builders, session logging, history, records, exercise detail, and planner use shared scale and compact data layouts.

- [ ] **Step 7: Verify fitness**

Run:

```powershell
npx vitest run tests/unit/workout-discovery.test.ts tests/unit/exercise-provider.test.ts tests/component/workout-idea-library.test.tsx tests/component/workout-builder.test.tsx tests/component/session-logger.test.tsx tests/unit/fitness-domain.test.ts
node --test tests/phase-6-fitness.test.js
npm run typecheck
npm run lint
```

Expected: all pass.

---

### Task 9: Refine the Clinical SVG Anatomy Atlas

**Files:**
- Modify: `src/features/anatomy/atlas-paths.ts`
- Modify: `src/features/anatomy/svg-anatomy-renderer.tsx`
- Modify: `src/features/anatomy/anatomy-figure.tsx`
- Modify: `src/features/anatomy/anatomy-explorer.tsx`
- Modify: `src/features/anatomy/data.ts`
- Modify: `src/features/anatomy/related-content.tsx`
- Modify: anatomy marketing routes
- Modify: `src/styles/anatomy.css`
- Test: existing anatomy unit/component suites
- Modify: `tests/e2e/public-interactions.spec.ts`

**Interfaces:**
- Preserves: `AnatomyRendererProps`, front/back selection, SVG fallback, Three.js boundary
- Produces: recognizable clinical-athletic proportions and complete keyboard/touch selection

- [ ] **Step 1: Strengthen anatomy tests**

Require front/back controls, unique accessible muscle names, all interactive regions reachable by keyboard, selected region reflected in the detail heading, and SVG fallback when 3D is unavailable.

- [ ] **Step 2: Refine figure proportions**

Redraw silhouette and muscle paths around consistent head, shoulder, ribcage, pelvis, arm, thigh, knee, calf, and foot landmarks. Keep paths in the existing stable viewBox and keep muscle IDs unchanged so links and data associations do not break.

- [ ] **Step 3: Improve interaction states**

Use a quiet neutral silhouette, restrained default muscle fill, sky focus ring, and stronger selected state. Add an SVG text/DOM alternative only where it improves naming; do not rely on visual position for meaning.

- [ ] **Step 4: Recompose the explorer**

Keep view controls above the atlas, place the muscle panel beside it on desktop and after it on mobile, and include function, benefit, training, common mistake, and related content.

- [ ] **Step 5: Preserve progressive enhancement**

Keep `ThreeAnatomyBoundary` optional. Reduced motion and low-power paths render the SVG immediately without loading Three.js.

- [ ] **Step 6: Verify anatomy**

Run:

```powershell
npx vitest run tests/component/anatomy-directory.test.tsx tests/component/anatomy-motion.test.tsx tests/component/anatomy-renderer.test.tsx tests/unit/anatomy-asset-manifest.test.ts tests/unit/anatomy-knowledge.test.ts
node --test tests/phase-7-anatomy-knowledge.test.js tests/phase-9-motion-three.test.js
npm run typecheck
```

Expected: all pass.

---

### Task 10: Complete Cross-Route Responsive, Accessibility, and Performance QA

**Files:**
- Modify: `tests/e2e/route-inventory.ts`
- Modify: `tests/e2e/responsive-layout.spec.ts`
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `tests/e2e/authenticated-smoke.spec.ts`
- Create: `tests/e2e/navigation-performance.spec.ts`
- Modify: `tests/e2e/support/layout.ts`
- Modify: `tests/e2e/support/accessibility.ts`
- Modify: CSS and route files identified by failures
- Modify: `docs/content-strategy.md`
- Modify: `docs/motion-and-three-operations.md`

**Interfaces:**
- Consumes: every preceding task
- Produces: production-ready verified redesign with documented content/provider rules

- [ ] **Step 1: Add the required viewport matrix**

Run representative public and authenticated routes at 320, 375, 480, 768, 1024, 1280, and 1440 px. For each route assert:

```ts
expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth + 1);
```

Also collect elements extending beyond the viewport and fixed/sticky elements covering the active element.

- [ ] **Step 2: Add interaction accessibility coverage**

Keyboard-test public/product navigation, modal/sheet focus containment, recipe/workout filters, anatomy selection, workout builder ordering, session controls, forms, and assistant draft review. Run axe after opening each meaningful state.

- [ ] **Step 3: Add theme-parity screenshots**

Capture named light/dark screenshots for landing, article, anatomy, Today, Nutrition, Recipes, Training, Progress, and Assistant at desktop and mobile. Use these as human-review artifacts; do not commit Playwright report output.

- [ ] **Step 4: Validate navigation budgets**

Warm each primary signed-in route once, then measure at least five transitions. Assert no blank state, immediate active feedback, and a p75 useful-content measurement at or below 750 ms in the local production server. Log timings on failure.

- [ ] **Step 5: Test provider failure modes**

Run recipe and exercise discovery with disabled, timeout, invalid JSON, and HTTP-error providers. Assert curated content, search, workout copying, and sessions still work.

- [ ] **Step 6: Fix every discovered regression**

For each failing route, add or narrow a regression assertion before changing implementation. Keep fixes scoped to the responsible style/component file; do not add route-specific `!important` overrides.

- [ ] **Step 7: Update operating documentation**

Document curated-content provenance, verified/estimated nutrition labels, provider attribution/enablement, timeout/fallback behaviour, SVG/Three.js fallback, and reduced-motion rules. Explicitly state that no external API is required for core operation.

- [ ] **Step 8: Remove user-facing mojibake**

Run:

```powershell
rg -n "Ð|Ñ|Â|Ã" src --glob "*.ts" --glob "*.tsx"
```

Review every match and replace corrupted English/Macedonian strings with valid UTF-8 content. Keep intentional Cyrillic text. Re-run `tests/unit/i18n.test.ts` and the public/product route smoke tests after the corrections.

- [ ] **Step 9: Run the complete production gate**

Run:

```powershell
npm run test
npm run typecheck
npm run lint
npm run build
npm run test:e2e:all
```

Expected: every command exits 0, runtime monitors report no avoidable errors, and all breakpoint/theme screenshots are available for user review.

- [ ] **Step 10: Inspect the working tree without committing**

Run:

```powershell
git status --short
git diff --stat
```

Confirm no `.env.example`, secrets, generated Playwright report, test results, build output, or unrelated user files were added. Leave all intended changes uncommitted for user review.

---

## Execution Order and Review Gates

1. **Foundation gate:** Tasks 1–4. Review typography, light/dark theme, component scale, shell, and route speed in the browser.
2. **Public gate:** Task 5. Review landing, auth, blog landing/article, anatomy entry, and legal/information routes.
3. **Product-core gate:** Task 6. Review Today, Progress, Goals, Habits, Notifications, Onboarding, and AI Coach.
4. **Nutrition gate:** Task 7. Review recipe volume, filters, detail, planner, grocery, and provider fallback.
5. **Fitness gate:** Task 8. Review workout ideas, builders, sessions, exercise library, history, and records.
6. **Anatomy gate:** Task 9. Review front/back atlas realism, keyboard/touch selection, and detail flow.
7. **Production gate:** Task 10. Review all breakpoint/theme artifacts and final verification output.

No gate authorizes a commit. The user performs commits after reviewing the complete working tree.
