# Catalogue Media Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the curated libraries to 60 exercises and 40 recipes, give every curated entry approved imagery, and safely display licensed connected-provider imagery.

**Architecture:** Add a typed catalogue-media contract and one reusable resilient image component. Curated content references local reviewed assets, while connected media remains provider-normalized, URL-allowlisted, attributed, and optional. Exercise and recipe catalogue work is independently testable and converges in shared responsive card/detail styling.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS, `next/image`, Vitest, Testing Library, Node test runner, Playwright.

## Global Constraints

- Keep the existing Next.js architecture and current Curated + Connected Library information design.
- Produce exactly 60 curated exercises and exactly 40 curated recipes.
- Every curated entry must have a real approved image; fallbacks are runtime safeguards only.
- Use only original, generated, public-domain, or commercially reusable imagery with recorded provenance.
- Keep TheMealDB test-key imagery out of public commercial production.
- Keep MuscleWiki media disabled until explicit commercial production rights are confirmed.
- Preserve light/dark themes, keyboard use, touch use, responsive layouts, and reduced-motion behavior.
- Do not add autoplaying exercise video or a media CMS.
- Do not commit changes; the user reviews and commits.
- Do not add `.env.example` or expose any `.env.local` values.

---

## File Structure

### Shared media

- Create `src/features/media/catalogue-media.ts`: media types, fallback categories, and validation helpers.
- Create `src/components/media/catalogue-image.tsx`: resilient `next/image` wrapper with accessible fallback.
- Create `src/components/media/catalogue-image-fallback.tsx`: deterministic local fallback rendering.
- Create `tests/unit/catalogue-media.test.ts`: media validation and fallback selection.
- Create `tests/component/catalogue-image.test.tsx`: image, alt, attribution, and error-state behavior.

### Exercise catalogue and UI

- Modify `src/features/fitness/catalogue.ts`: expand to 60 records and attach local media.
- Create `src/features/fitness/exercise-media.ts`: explicit curated exercise media manifest.
- Add `public/media/exercises/*.webp`: reviewed exercise images.
- Modify `src/features/fitness/exercise-library.tsx`: render curated and connected media.
- Modify `src/app/(product)/exercises/[slug]/page.tsx`: render detail media and attribution.
- Modify `src/features/fitness/providers/wrkout.ts`: preserve safe public-domain image URLs.
- Modify `src/features/fitness/providers/wger.ts`: preserve individually licensed image URLs when supplied.
- Modify `tests/unit/fitness-domain.test.ts`: catalogue count, coverage, uniqueness, and media.
- Modify `tests/unit/exercise-providers.test.ts`: provider image normalization and rejection.
- Modify `tests/component/exercise-library.test.tsx`: card image and fallback behavior.

### Recipe catalogue and UI

- Modify `src/features/nutrition/recipe-types.ts`: attach typed curated media.
- Modify `src/features/nutrition/recipe-catalogue.ts`: expand to 40 records and attach local media.
- Create `src/features/nutrition/recipe-media.ts`: explicit curated recipe media manifest.
- Add `public/media/recipes/*.webp`: reviewed recipe images.
- Modify `src/features/nutrition/recipe-library.tsx`: render curated and connected media.
- Modify `src/app/(product)/recipes/[slug]/page.tsx`: render detail media and attribution.
- Modify `src/features/discovery/local.ts`: carry curated recipe image metadata.
- Modify `tests/unit/nutrition-domain.test.ts`: count, category distribution, uniqueness, and media.
- Modify `tests/unit/recipe-provider.test.ts`: TheMealDB media policy behavior.
- Modify `tests/component/recipe-library.test.tsx`: card image and fallback behavior.

### Provider/security/style/verification

- Modify `src/features/discovery/types.ts`: define provider-media metadata.
- Modify `src/features/discovery/schemas.ts`: validate provider media.
- Modify `src/features/discovery/safe-url.ts`: expose and test media-host rules.
- Modify `next.config.mjs`: add minimal approved image hosts and CSP entries.
- Modify `src/styles/product.css`: image regions, cards, details, attribution, and fallbacks.
- Modify `tests/unit/discovery-safe-url.test.ts`: host/protocol rejection.
- Modify `tests/unit/discovery-schemas.test.ts`: provider-media contract.
- Modify `tests/e2e/responsive-layout.spec.ts`: media-library responsive checks.
- Modify `tests/e2e/authenticated-smoke.spec.ts`: representative authenticated library/detail checks.
- Modify `tests/phase-5-nutrition-planning.test.js`: recipe production contract.
- Modify `tests/phase-6-fitness.test.js`: exercise production contract.

---

### Task 1: Shared media domain and resilient image component

**Files:**
- Create: `src/features/media/catalogue-media.ts`
- Create: `src/components/media/catalogue-image.tsx`
- Create: `src/components/media/catalogue-image-fallback.tsx`
- Create: `tests/unit/catalogue-media.test.ts`
- Create: `tests/component/catalogue-image.test.tsx`

**Interfaces:**
- Produces:
  - `CatalogueMedia`
  - `DisplayMedia`
  - `MediaFallbackKind`
  - `validateCatalogueMedia(media: CatalogueMedia): boolean`
  - `fallbackKindForMedia(context: { kind: "exercise" | "recipe"; category: string }): MediaFallbackKind`
  - `catalogueMediaForDisplay(media: CatalogueMedia, locale: Locale): DisplayMedia`
  - `CatalogueImage(props: CatalogueImageProps)`

- [ ] **Step 1: Write failing media-domain tests**

```ts
import { describe, expect, it } from "vitest";
import {
  fallbackKindForMedia,
  validateCatalogueMedia,
  type CatalogueMedia,
} from "@/features/media/catalogue-media";

const valid: CatalogueMedia = {
  src: "/media/recipes/example.webp",
  alt: { en: "A grain bowl with roasted vegetables", mk: "A grain bowl with roasted vegetables" },
  width: 1200,
  height: 900,
  focalPoint: "50% 45%",
  sourceName: "B Fit & Healthy",
  licenseName: "Original",
};

describe("catalogue media", () => {
  it("accepts complete local media and rejects unsafe or dimensionless media", () => {
    expect(validateCatalogueMedia(valid)).toBe(true);
    expect(validateCatalogueMedia({ ...valid, src: "javascript:alert(1)" })).toBe(false);
    expect(validateCatalogueMedia({ ...valid, width: 0 })).toBe(false);
  });

  it("selects deterministic recipe and exercise fallbacks", () => {
    expect(fallbackKindForMedia({ kind: "recipe", category: "breakfast" })).toBe("recipe-breakfast");
    expect(fallbackKindForMedia({ kind: "exercise", category: "horizontal-push" })).toBe("exercise-push");
  });
});
```

- [ ] **Step 2: Run the media-domain test and verify RED**

Run: `npm.cmd run test:unit -- tests/unit/catalogue-media.test.ts`

Expected: FAIL because `@/features/media/catalogue-media` does not exist.

- [ ] **Step 3: Implement the typed media domain**

```ts
import type { Locale } from "@/lib/i18n/config";

export type CatalogueMedia = {
  src: string;
  alt: Record<Locale, string>;
  width: number;
  height: number;
  focalPoint?: `${number}% ${number}%`;
  sourceName: string;
  sourceUrl?: string;
  creator?: string;
  licenseName: string;
  licenseUrl?: string;
};

export type DisplayMedia = {
  src: string;
  alt: string;
  focalPoint?: `${number}% ${number}%`;
  sourceName: string;
  sourceUrl?: string;
  creator?: string;
  licenseName: string;
  licenseUrl?: string;
};

export type MediaFallbackKind =
  | "recipe-breakfast"
  | "recipe-lunch"
  | "recipe-dinner"
  | "recipe-snack"
  | "exercise-push"
  | "exercise-pull"
  | "exercise-legs"
  | "exercise-core"
  | "exercise-mobility";

export function validateCatalogueMedia(media: CatalogueMedia) {
  return media.src.startsWith("/media/")
    && media.src.endsWith(".webp")
    && media.width > 0
    && media.height > 0
    && Boolean(media.alt.en.trim())
    && Boolean(media.alt.mk.trim())
    && Boolean(media.sourceName.trim())
    && Boolean(media.licenseName.trim());
}
```

Implement `fallbackKindForMedia` as an exhaustive mapping: recipe meal values map directly; exercise patterns containing `push`, `pull`, `squat`, `lunge`, `hinge`, `carry`, `core`, `anti-`, or `mobility` map to the five exercise groups.

- [ ] **Step 4: Run the media-domain test and verify GREEN**

Run: `npm.cmd run test:unit -- tests/unit/catalogue-media.test.ts`

Expected: PASS.

- [ ] **Step 5: Write failing component tests**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CatalogueImage } from "@/components/media/catalogue-image";

it("renders localized alt text and attribution", () => {
  const displayMedia = catalogueMediaForDisplay(validMedia, "en");
  render(<CatalogueImage media={displayMedia} fallback="recipe-dinner" showAttribution />);
  expect(screen.getByAltText("A grain bowl with roasted vegetables")).toBeInTheDocument();
  expect(screen.getByText("Image: B Fit & Healthy")).toBeInTheDocument();
});

it("replaces a failed image with a labelled fallback", () => {
  const displayMedia = catalogueMediaForDisplay(validMedia, "en");
  render(<CatalogueImage media={displayMedia} fallback="exercise-push" />);
  fireEvent.error(screen.getByRole("img"));
  expect(screen.getByTestId("catalogue-image-fallback")).toBeInTheDocument();
});
```

- [ ] **Step 6: Run the component test and verify RED**

Run: `npm.cmd run test:unit -- tests/component/catalogue-image.test.tsx`

Expected: FAIL because `CatalogueImage` does not exist.

- [ ] **Step 7: Implement the resilient component**

`CatalogueImage` is a client component with:

```ts
export type CatalogueImageProps = {
  media: DisplayMedia | null;
  fallback: MediaFallbackKind;
  sizes?: string;
  priority?: boolean;
  showAttribution?: boolean;
  className?: string;
};
```

Use `next/image`, store `failed` state, set `style={{ objectPosition: media.focalPoint ?? "50% 50%" }}`, and render `CatalogueImageFallback` when `media` is null or `onError` fires. Render attribution as:

```tsx
<small className="catalogue-media-credit">
  Image: {media.sourceUrl ? <a href={media.sourceUrl}>{media.sourceName}</a> : media.sourceName}
  {media.creator ? ` · ${media.creator}` : ""}
</small>
```

The fallback receives `aria-hidden="true"` because adjacent card/detail text identifies the entry.

`catalogueMediaForDisplay(media, locale)` localizes the alt text and returns the shared `DisplayMedia` shape. Connected-provider components construct the same shape from normalized provider media without pretending that remote media is curated local media.

- [ ] **Step 8: Run shared media tests**

Run: `npm.cmd run test:unit -- tests/unit/catalogue-media.test.ts tests/component/catalogue-image.test.tsx`

Expected: PASS.

- [ ] **Step 9: Record the changed files without committing**

Run: `git status --short`

Expected: the five Task 1 files are listed; do not run `git commit`.

---

### Task 2: Expand and validate the curated exercise catalogue

**Files:**
- Create: `src/features/fitness/exercise-media.ts`
- Modify: `src/features/fitness/catalogue.ts`
- Modify: `tests/unit/fitness-domain.test.ts`
- Modify: `tests/phase-6-fitness.test.js`
- Add: `public/media/exercises/*.webp`

**Interfaces:**
- Consumes: `CatalogueMedia`, `validateCatalogueMedia`
- Produces:
  - `exerciseMedia: Record<string, CatalogueMedia>`
  - `Exercise.media: CatalogueMedia`
  - exactly 60 `Exercise` records

- [ ] **Step 1: Add failing catalogue contract tests**

```ts
import { exercises } from "@/features/fitness/catalogue";
import { validateCatalogueMedia } from "@/features/media/catalogue-media";

it("ships sixty unique curated exercises with approved media", () => {
  expect(exercises).toHaveLength(60);
  expect(new Set(exercises.map((item) => item.slug)).size).toBe(60);
  expect(exercises.every((item) => validateCatalogueMedia(item.media))).toBe(true);
});

it("covers the required movement and equipment breadth", () => {
  const patterns = new Set(exercises.map((item) => item.movementPattern));
  const equipment = new Set(exercises.flatMap((item) => item.equipment));
  for (const expected of ["squat", "hinge", "horizontal-push", "horizontal-pull", "vertical-push", "vertical-pull", "carry", "mobility"]) {
    expect(patterns.has(expected)).toBe(true);
  }
  for (const expected of ["Bodyweight", "Dumbbells", "Barbell", "Cable", "Machine", "Kettlebell", "Band"]) {
    expect(equipment.has(expected)).toBe(true);
  }
});
```

Add a Node contract assertion to `tests/phase-6-fitness.test.js` that reads `catalogue.ts` and verifies the media manifest is imported and all referenced local files exist.

- [ ] **Step 2: Run the focused exercise tests and verify RED**

Run: `npm.cmd run test:unit -- tests/unit/fitness-domain.test.ts`

Expected: FAIL because there are 30 exercises and no `media`.

- [ ] **Step 3: Build the reviewed exercise media set**

For each curated exercise:

1. Match an accurate record in `wrkout/exercises.json`.
2. Verify that the image is part of the Unlicense-covered repository.
3. Download the clearest demonstration frame to `public/media/exercises/<slug>.webp`.
4. Crop to 4:3 without cutting off hands, feet, or equipment.
5. Record the repository URL, creator when supplied, `Unlicense`, intrinsic dimensions, focal point, and useful localized alt text in `exercise-media.ts`.
6. For unmatched movements, use another reviewed original, generated, public-domain, or commercially reusable asset and record its actual licence.

The manifest uses explicit entries:

```ts
export const exerciseMedia: Record<string, CatalogueMedia> = {
  "bodyweight-squat": {
    src: "/media/exercises/bodyweight-squat.webp",
    alt: {
      en: "Athlete lowering into a bodyweight squat with feet grounded",
      mk: "Athlete lowering into a bodyweight squat with feet grounded",
    },
    width: 1200,
    height: 900,
    focalPoint: "50% 48%",
    sourceName: "wrkout/exercises.json",
    sourceUrl: "https://github.com/wrkout/exercises.json",
    licenseName: "Unlicense",
    licenseUrl: "https://github.com/wrkout/exercises.json/blob/master/LICENSE.md",
  },
};
```

Do not reuse one generic pose for multiple exercises unless the image accurately demonstrates every linked variation.

- [ ] **Step 4: Expand the exercise data to 60 records**

Add 30 non-duplicate entries across:

- barbell squat, front squat, step-up, walking lunge, leg press;
- conventional deadlift, kettlebell deadlift, hip thrust, hamstring curl;
- barbell bench press, cable chest press, chest fly;
- pull-up, chest-supported row, face pull;
- landmine press, machine shoulder press, rear-delt fly;
- hammer curl, cable triceps press-down;
- kettlebell carry, suitcase carry;
- hollow hold, reverse crunch, cable chop;
- shoulder wall slide, 90/90 hip switch, calf mobility, child’s-pose reach, deep squat hold.

Update `Exercise` to include `media: CatalogueMedia`, add `secondaryMuscles` where materially useful, and assign every record `media: exerciseMedia[slug]`.

- [ ] **Step 5: Run exercise tests and verify GREEN**

Run: `npm.cmd run test:unit -- tests/unit/fitness-domain.test.ts`

Run: `node --test tests/phase-6-fitness.test.js`

Expected: PASS with exactly 60 exercises and no missing assets.

- [ ] **Step 6: Record the changed files without committing**

Run: `git status --short`

Expected: catalogue, manifest, tests, and exercise WebP files are listed.

---

### Task 3: Render curated exercise media on cards and details

**Files:**
- Modify: `src/features/fitness/exercise-library.tsx`
- Modify: `src/app/(product)/exercises/[slug]/page.tsx`
- Modify: `tests/component/exercise-library.test.tsx`

**Interfaces:**
- Consumes: `Exercise.media`, `CatalogueImage`
- Produces: exercise card and detail media presentation

- [ ] **Step 1: Write failing card rendering tests**

```tsx
it("renders a useful image for every curated exercise card", () => {
  render(<ExerciseLibrary exercises={exercises.slice(0, 3)} locale="en" />);
  expect(screen.getByAltText(/bodyweight squat/i)).toBeInTheDocument();
  expect(screen.getAllByTestId("exercise-card-media")).toHaveLength(3);
});
```

Mock `next/image` as a plain `img` in the existing test setup and retain the current discovery-fetch mocks.

- [ ] **Step 2: Run and verify RED**

Run: `npm.cmd run test:unit -- tests/component/exercise-library.test.tsx`

Expected: FAIL because cards still render `movement-mark`.

- [ ] **Step 3: Replace abstract marks with media**

In each curated card render:

```tsx
<CatalogueImage
  media={catalogueMediaForDisplay(exercise.media, locale)}
  fallback={fallbackKindForMedia({ kind: "exercise", category: exercise.movementPattern })}
  sizes="(max-width: 48rem) 100vw, (max-width: 72rem) 50vw, 33vw"
  className="exercise-card-media"
/>
```

Keep the movement pattern as a small textual badge inside the content region. Do not overlay metadata on the athlete.

In the detail route, replace `movement-hero` with `CatalogueImage`, set `showAttribution`, and use a size hint matching the two-column layout.

- [ ] **Step 4: Run exercise component tests**

Run: `npm.cmd run test:unit -- tests/component/exercise-library.test.tsx tests/component/catalogue-image.test.tsx`

Expected: PASS.

- [ ] **Step 5: Record the changed files without committing**

Run: `git status --short`

Expected: the library, detail route, and test are listed.

---

### Task 4: Preserve safe connected exercise imagery

**Files:**
- Modify: `src/features/discovery/types.ts`
- Modify: `src/features/discovery/schemas.ts`
- Modify: `src/features/fitness/providers/wrkout.ts`
- Modify: `src/features/fitness/providers/wger.ts`
- Modify: `tests/unit/exercise-providers.test.ts`
- Modify: `tests/unit/discovery-schemas.test.ts`

**Interfaces:**
- Produces:

```ts
export type DiscoveryMedia = {
  type: "image" | "video";
  url: string;
  width: number | null;
  height: number | null;
  alt: string | null;
  attribution: string;
  license: CommercialExerciseLicense | null;
};
```

- [ ] **Step 1: Write failing provider normalization tests**

```ts
it("normalizes wrkout public-domain image paths", () => {
  const result = normalizeWrkoutExercise({
    name: "Barbell Curl",
    images: ["Barbell_Curl/0.jpg"],
  }, "Barbell_Curl");
  expect(result.media[0]).toMatchObject({
    type: "image",
    url: "https://raw.githubusercontent.com/wrkout/exercises.json/master/exercises/Barbell_Curl/images/0.jpg",
    attribution: expect.stringContaining("wrkout"),
  });
});

it("drops an unlicensed wger image without dropping the exercise", () => {
  const result = normalizeWgerExercise(wgerFixtureWithUnlicensedImage);
  expect(result?.media).toEqual([]);
});
```

Add schema tests that reject missing attribution and non-HTTPS provider media.

- [ ] **Step 2: Run provider/schema tests and verify RED**

Run: `npm.cmd run test:unit -- tests/unit/exercise-providers.test.ts tests/unit/discovery-schemas.test.ts`

Expected: FAIL because media is discarded and the schema has the old shape.

- [ ] **Step 3: Implement `DiscoveryMedia` and schema validation**

Change `DiscoveryExercise.media` from the inline `{ type; url }[]` shape to `DiscoveryMedia[]`. Require `url`, `type`, and `attribution`; permit nullable dimensions, alt, and licence.

- [ ] **Step 4: Normalize wrkout imagery**

Map `images` through `safeProviderUrl`. Build raw URLs using:

```ts
const url = `https://raw.githubusercontent.com/wrkout/exercises.json/master/exercises/${encodeURIComponent(externalId)}/images/${encodeURIComponent(fileName)}`;
```

Retain only `.jpg`, `.jpeg`, `.png`, or `.webp` paths that resolve to the approved raw GitHub host. Attach the exercise’s Unlicense metadata to each item.

- [ ] **Step 5: Normalize individually licensed wger imagery**

Extend the wger response type for its `images` collection. For each image:

- normalize its own licence;
- require commercial-use approval;
- validate the `wger.de` URL;
- retain its author attribution;
- discard only the invalid media item.

Do not inherit the exercise text licence when the image supplies a different licence.

- [ ] **Step 6: Run provider/schema tests**

Run: `npm.cmd run test:unit -- tests/unit/exercise-providers.test.ts tests/unit/discovery-schemas.test.ts`

Expected: PASS.

- [ ] **Step 7: Render connected exercise thumbnails**

Modify `exercise-library.tsx` so provider cards render the first permitted image through `CatalogueImage` using an adapter from `DiscoveryMedia` to display props. The review sheet lists the media attribution and licence link. Cards without permitted media render the exercise-pattern fallback.

- [ ] **Step 8: Run the exercise library suite**

Run: `npm.cmd run test:unit -- tests/component/exercise-library.test.tsx tests/unit/exercise-providers.test.ts`

Expected: PASS.

---

### Task 5: Expand and validate the curated recipe catalogue

**Files:**
- Modify: `src/features/nutrition/recipe-types.ts`
- Create: `src/features/nutrition/recipe-media.ts`
- Modify: `src/features/nutrition/recipe-catalogue.ts`
- Modify: `tests/unit/nutrition-domain.test.ts`
- Modify: `tests/phase-5-nutrition-planning.test.js`
- Add: `public/media/recipes/*.webp`

**Interfaces:**
- Consumes: `CatalogueMedia`, `validateCatalogueMedia`
- Produces:
  - `recipeMedia: Record<string, CatalogueMedia>`
  - `Recipe.media: CatalogueMedia`
  - exactly 40 `Recipe` records in a 10/10/12/8 meal distribution

- [ ] **Step 1: Add failing recipe catalogue tests**

```ts
import { recipeCatalogue } from "@/features/nutrition/recipe-catalogue";
import { validateCatalogueMedia } from "@/features/media/catalogue-media";

it("ships forty unique curated recipes with approved media", () => {
  expect(recipeCatalogue).toHaveLength(40);
  expect(new Set(recipeCatalogue.map((item) => item.slug)).size).toBe(40);
  expect(recipeCatalogue.every((item) => validateCatalogueMedia(item.media))).toBe(true);
});

it("keeps the approved meal distribution", () => {
  const count = (meal: string) => recipeCatalogue.filter((item) => item.meal === meal).length;
  expect({
    breakfast: count("breakfast"),
    lunch: count("lunch"),
    dinner: count("dinner"),
    snack: count("snack"),
  }).toEqual({ breakfast: 10, lunch: 10, dinner: 12, snack: 8 });
});
```

- [ ] **Step 2: Run the recipe tests and verify RED**

Run: `npm.cmd run test:unit -- tests/unit/nutrition-domain.test.ts`

Expected: FAIL because there are 24 recipes and no media.

- [ ] **Step 3: Create sixteen additional recipe records**

Add:

- five breakfasts: vegetable omelette, cottage-cheese berry bowl, peanut-butter chia oats, tomato feta breakfast pita, and yoghurt fruit smoothie;
- five lunches: chicken hummus grain bowl, chickpea pasta salad, salmon cucumber wrap, tofu rice bowl, and bean sweet-potato bowl;
- four dinners: lentil shepherd’s pie, chicken tomato pasta, cod vegetable tray bake, and tofu peanut stir-fry;
- two snacks: apple cottage-cheese plate and roasted chickpea cup.

Each record requires recipe-specific ingredients, instructions, timing, nutrition estimate, dietary tags, and useful summary. Do not reuse the generic three-step copy when the preparation differs materially.

- [ ] **Step 4: Produce the reviewed recipe media set**

Create one recipe-specific 4:3 image for each of the 40 recipes:

- use original/generated imagery or a verified public-domain/commercially reusable photograph;
- export to `public/media/recipes/<slug>.webp`;
- use at least 1200×900 source dimensions;
- avoid embedded text, logos, hands obscuring food, or misleading ingredients;
- record actual source, creator, licence, dimensions, focal point, and localized alt text in `recipe-media.ts`.

Example:

```ts
export const recipeMedia: Record<string, CatalogueMedia> = {
  "lemon-chicken-potatoes": {
    src: "/media/recipes/lemon-chicken-potatoes.webp",
    alt: {
      en: "Roasted lemon chicken with baby potatoes and green beans",
      mk: "Roasted lemon chicken with baby potatoes and green beans",
    },
    width: 1200,
    height: 900,
    focalPoint: "50% 48%",
    sourceName: "B Fit & Healthy",
    licenseName: "Original",
  },
};
```

- [ ] **Step 5: Attach media and run recipe tests**

Add `media: CatalogueMedia` to `Recipe`, assign `media: recipeMedia[seed.slug]` in the catalogue mapper, then run:

Run: `npm.cmd run test:unit -- tests/unit/nutrition-domain.test.ts`

Run: `node --test tests/phase-5-nutrition-planning.test.js`

Expected: PASS with exactly 40 recipes, the approved distribution, and no missing assets.

- [ ] **Step 6: Record the changed files without committing**

Run: `git status --short`

Expected: recipe types, catalogue, manifest, tests, and 40 WebP files are listed.

---

### Task 6: Render recipe imagery on cards, details, and local discovery

**Files:**
- Modify: `src/features/nutrition/recipe-library.tsx`
- Modify: `src/app/(product)/recipes/[slug]/page.tsx`
- Modify: `src/features/discovery/local.ts`
- Modify: `tests/component/recipe-library.test.tsx`
- Modify: `tests/unit/recipe-discovery.test.ts`

**Interfaces:**
- Consumes: `Recipe.media`, `CatalogueImage`
- Produces: curated recipe image presentation and local discovery `imageUrl`

- [ ] **Step 1: Write failing recipe card tests**

```tsx
it("renders recipe-specific images with useful alt text", () => {
  render(<RecipeLibrary recipes={recipeCatalogue.slice(0, 3)} locale="en" />);
  expect(screen.getByAltText(/oat.*banana/i)).toBeInTheDocument();
  expect(screen.getAllByTestId("recipe-card-media")).toHaveLength(3);
});
```

Add a local discovery assertion:

```ts
expect(localDiscoveryRecipes.every((item) => item.imageUrl?.startsWith("/media/recipes/"))).toBe(true);
```

- [ ] **Step 2: Run and verify RED**

Run: `npm.cmd run test:unit -- tests/component/recipe-library.test.tsx tests/unit/recipe-discovery.test.ts`

Expected: FAIL because curated cards have no image and local discovery sets `imageUrl: null`.

- [ ] **Step 3: Render curated recipe card images**

Add `CatalogueImage` above `recipe-card-topline`:

```tsx
<CatalogueImage
  media={catalogueMediaForDisplay(recipe.media, locale)}
  fallback={fallbackKindForMedia({ kind: "recipe", category: recipe.meal })}
  sizes="(max-width: 48rem) 100vw, (max-width: 72rem) 50vw, 33vw"
  className="recipe-card-media"
/>
```

Do not overlay nutritional text on the photograph.

- [ ] **Step 4: Render detail media and attribution**

Add `CatalogueImage` to the recipe detail header with `showAttribution`, preserve the existing save/planner actions, and keep ingredients/method readable independently of the image.

- [ ] **Step 5: Carry local recipe images into discovery**

Set:

```ts
imageUrl: recipe.media.src,
```

Local relative URLs bypass provider-host validation but must still pass `validateCatalogueMedia` through catalogue contracts.

- [ ] **Step 6: Run recipe component and discovery tests**

Run: `npm.cmd run test:unit -- tests/component/recipe-library.test.tsx tests/unit/recipe-discovery.test.ts`

Expected: PASS.

---

### Task 7: Enforce connected recipe media policy

**Files:**
- Modify: `src/features/nutrition/providers/themealdb.ts`
- Modify: `src/app/api/discovery/recipes/route.ts`
- Modify: `src/features/nutrition/recipe-library.tsx`
- Modify: `tests/unit/recipe-provider.test.ts`
- Modify: `tests/component/recipe-library.test.tsx`

**Interfaces:**
- Produces:
  - `mealDbMediaEnabled(): boolean`
  - connected recipe cards that use permitted images or local fallbacks

- [ ] **Step 1: Write failing policy tests**

```ts
it("does not expose TheMealDB images with the public test key in production", () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("THEMEALDB_API_KEY", "1");
  expect(normalizeMealDbRecipe(mealFixture).imageUrl).toBeNull();
});

it("retains a safe thumbnail for non-production review", () => {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("THEMEALDB_API_KEY", "1");
  expect(normalizeMealDbRecipe(mealFixture).imageUrl).toMatch(/^https:\/\/www\.themealdb\.com\//);
});
```

- [ ] **Step 2: Run and verify RED**

Run: `npm.cmd run test:unit -- tests/unit/recipe-provider.test.ts`

Expected: FAIL because image policy does not inspect the environment/access tier.

- [ ] **Step 3: Implement the production gate**

Implement:

```ts
export function mealDbMediaEnabled() {
  const key = process.env.THEMEALDB_API_KEY?.trim();
  return process.env.NODE_ENV !== "production" || Boolean(key && key !== "1");
}
```

Normalize `imageUrl` only when the gate is true. Keep recipe text results available when imagery is disabled.

- [ ] **Step 4: Render connected recipe media**

Connected recipe cards use the safe `imageUrl` with provider attribution. If null or failed, use the meal-category fallback. The review sheet shows TheMealDB as the source and links to the provider record when supplied.

- [ ] **Step 5: Run provider and component tests**

Run: `npm.cmd run test:unit -- tests/unit/recipe-provider.test.ts tests/component/recipe-library.test.tsx`

Expected: PASS.

---

### Task 8: Harden remote image security and Next.js configuration

**Files:**
- Modify: `src/features/discovery/safe-url.ts`
- Modify: `next.config.mjs`
- Modify: `tests/unit/discovery-safe-url.test.ts`
- Modify: `tests/production-foundation.test.js`

**Interfaces:**
- Produces:
  - `safeProviderUrl` coverage for the exact approved hosts
  - matching `images.remotePatterns`
  - matching CSP `img-src`

- [ ] **Step 1: Write failing URL and configuration tests**

```ts
it("allows approved provider image hosts and rejects lookalikes", () => {
  expect(safeProviderUrl("https://raw.githubusercontent.com/wrkout/exercises.json/master/a.jpg", "wrkout")).toBeTruthy();
  expect(safeProviderUrl("https://raw.githubusercontent.com.evil.test/a.jpg", "wrkout")).toBeNull();
  expect(safeProviderUrl("http://wger.de/media/a.jpg", "wger")).toBeNull();
});
```

Add production contract checks that `next.config.mjs` contains `images.remotePatterns` and that each remote image hostname also appears in the CSP `img-src`.

- [ ] **Step 2: Run and verify RED**

Run: `npm.cmd run test:unit -- tests/unit/discovery-safe-url.test.ts`

Run: `node --test tests/production-foundation.test.js`

Expected: contract test FAIL because Next image patterns and CSP image hosts are absent.

- [ ] **Step 3: Add minimal image host configuration**

Add remote patterns only for:

- `raw.githubusercontent.com` with the wrkout repository pathname;
- `wger.de` for permitted wger media;
- `www.themealdb.com` for development and properly credentialed production use.

Extend CSP from:

```js
"img-src 'self' data: blob:"
```

to the same exact HTTPS hosts. Do not add wildcards.

- [ ] **Step 4: Run security/configuration tests**

Run: `npm.cmd run test:unit -- tests/unit/discovery-safe-url.test.ts`

Run: `node --test tests/production-foundation.test.js`

Expected: PASS.

---

### Task 9: Responsive visual styling and accessibility polish

**Files:**
- Modify: `src/styles/product.css`
- Modify: `tests/e2e/responsive-layout.spec.ts`
- Modify: `tests/e2e/accessibility.spec.ts`

**Interfaces:**
- Consumes: card/detail media class names from Tasks 3 and 6
- Produces: responsive 4:3 cards, stable detail compositions, visible focus, and readable credits

- [ ] **Step 1: Add failing browser assertions**

Add authenticated checks for `/exercises`, `/recipes`, and one representative detail route:

```ts
for (const width of [320, 375, 480, 768, 1024, 1280, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto("/exercises");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator(".exercise-card-media").first()).toBeVisible();
}
```

Add an accessibility assertion that media credits with links are keyboard focusable and card images have non-empty alt text.

- [ ] **Step 2: Run focused E2E and verify RED**

Run: `node --env-file-if-exists=.env.local ./node_modules/@playwright/test/cli.js test tests/e2e/responsive-layout.spec.ts tests/e2e/accessibility.spec.ts --project=chromium-desktop`

Expected: FAIL because media classes/layouts do not yet have the required responsive styling.

- [ ] **Step 3: Implement card media styling**

Required rules:

```css
.catalogue-image-frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: var(--surface-raised);
}

.catalogue-image-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.catalogue-media-credit {
  display: block;
  color: var(--foreground-muted);
  font-size: var(--text-xs);
  line-height: 1.45;
}
```

Update card grids to one column below 48rem, two columns from 48–72rem, and three columns above 72rem. Preserve current spacing tokens.

- [ ] **Step 4: Implement exercise-specific presentation**

- use a neutral/mineral background behind instructional images;
- use `object-fit: contain` when the media metadata marks a full-body demonstration;
- keep movement badges in content, not on the body;
- detail media must not crop hands, feet, or equipment.

- [ ] **Step 5: Implement recipe-specific presentation**

- use `object-fit: cover`;
- keep category treatment outside the photograph;
- retain sufficient title/body contrast in both themes;
- do not add gradient text or image overlays.

- [ ] **Step 6: Run focused E2E**

Run: `node --env-file-if-exists=.env.local ./node_modules/@playwright/test/cli.js test tests/e2e/responsive-layout.spec.ts tests/e2e/accessibility.spec.ts --project=chromium-desktop`

Expected: PASS when authenticated test credentials are valid. If authentication fails, record the external credential blocker and run the equivalent authenticated routes manually in the local browser.

---

### Task 10: Full regression, production, and visual verification

**Files:**
- Modify only files required by failures found during verification.

**Interfaces:**
- Consumes: all preceding deliverables
- Produces: a verified uncommitted implementation

- [ ] **Step 1: Run focused media and catalogue tests**

Run:

```powershell
npm.cmd run test:unit -- tests/unit/catalogue-media.test.ts tests/component/catalogue-image.test.tsx tests/unit/fitness-domain.test.ts tests/component/exercise-library.test.tsx tests/unit/exercise-providers.test.ts tests/unit/nutrition-domain.test.ts tests/component/recipe-library.test.tsx tests/unit/recipe-provider.test.ts tests/unit/discovery-safe-url.test.ts tests/unit/discovery-schemas.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run all contract tests**

Run: `npm.cmd run test:contracts`

Expected: PASS.

- [ ] **Step 3: Run all unit/component tests**

Run: `npm.cmd run test:unit`

Expected: PASS.

- [ ] **Step 4: Run typecheck and lint**

Run: `npm.cmd run typecheck`

Run: `npm.cmd run lint`

Expected: PASS with no avoidable warnings. Do not include generated `tsconfig.tsbuildinfo` in the user’s eventual commit.

- [ ] **Step 5: Build production**

Run: `npm.cmd run build`

Expected: Next.js production build completes successfully.

- [ ] **Step 6: Start the production server on port 3000**

Run:

```powershell
Start-Process -FilePath "npm.cmd" -ArgumentList "run","start" -WorkingDirectory (Get-Location) -WindowStyle Hidden
```

Verify: `Invoke-WebRequest -UseBasicParsing http://localhost:3000/recipes`

Expected: HTTP 200 or the expected authentication redirect.

- [ ] **Step 7: Perform visual browser review**

Inspect:

- `/recipes`;
- one breakfast, lunch, dinner, and snack detail;
- `/exercises`;
- one push, pull, leg, core, and mobility detail;
- connected recipe and exercise search states;
- image-error fallbacks;
- light and dark themes;
- 320, 375, 480, 768, 1024, 1280, and 1440 px widths.

Confirm:

- no broken images;
- no horizontal overflow;
- useful crops;
- stable card heights;
- readable attribution;
- no exercise bodies cropped;
- no food images that contradict the recipe;
- no console CSP or image optimizer errors.

- [ ] **Step 8: Check navigation responsiveness**

Measure representative client-side transitions between `/recipes`, a recipe detail, `/exercises`, and an exercise detail. Confirm media loading does not block navigation and that images load progressively after route content.

- [ ] **Step 9: Review the final diff**

Run:

```powershell
git diff --check
git status --short
git diff --stat
```

Expected: no whitespace errors, no secrets, no `.env.example`, no accidental build artefacts, and no commits.

- [ ] **Step 10: Hand off for user review**

Report:

- catalogue counts and distribution;
- image sources and licence policy;
- files changed;
- automated checks;
- manual visual checks;
- any provider or credential limitations;
- confirmation that changes remain uncommitted.
