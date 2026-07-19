# Landing Interactions and Clinical Anatomy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a useful interactive landing constellation, restrained ambient pointer response, coordinated button states, session-aware brand routing, and a recognizable clinical-atlas anatomy explorer.

**Architecture:** Progressive enhancements live in isolated client components, while content, canonical routes, and session resolution remain server-owned. Anatomy keeps its existing muscle records and explorer contract; only atlas geometry and presentation change. Shared semantic tokens drive equivalent light and dark theme roles.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, CSS, SVG, Supabase SSR, Vitest, Testing Library, Node test runner.

## Global Constraints

- Preserve the Sage Dusk visual identity and existing content.
- Use `/` for unauthenticated brand navigation and `/today` for authenticated navigation.
- Do not add `/homepage` or `/dashboard` aliases.
- Do not add Three.js, GSAP, or another animation dependency.
- Preserve keyboard, touch, responsive, and reduced-motion support.
- Do not create Git commits; the user will commit after review.

---

### Task 1: Shared brand destination

**Files:**
- Create: `src/components/shell/brand-destination.ts`
- Modify: `src/components/shell/brand.tsx`
- Test: `tests/unit/brand-destination.test.ts`

**Interfaces:**
- Produces: `resolveBrandDestination(authenticated: boolean): "/" | "/today"` and async Brand server rendering.

- [ ] **Step 1: Write a failing unit test** asserting false maps to `/` and true maps to `/today`.
- [ ] **Step 2: Run `npx vitest run tests/unit/brand-destination.test.ts`** and confirm failure because the helper does not exist.
- [ ] **Step 3: Implement the pure resolver and update Brand** to call the existing Supabase server client, use `auth.getUser()`, catch unavailable configuration/session errors, and fall back to `/`.
- [ ] **Step 4: Run the focused test** and expect both cases to pass.

### Task 2: Ambient pointer halo

**Files:**
- Create: `src/components/effects/ambient-pointer.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/component/ambient-pointer.test.tsx`

**Interfaces:**
- Produces: `AmbientPointer`, a decorative client component that writes `--pointer-x` and `--pointer-y` on `document.documentElement` at most once per animation frame.

- [ ] **Step 1: Write a failing component test** confirming the layer is hidden from assistive technology and pointer movement schedules a CSS-variable update.
- [ ] **Step 2: Run `npx vitest run tests/component/ambient-pointer.test.tsx`** and confirm the missing-component failure.
- [ ] **Step 3: Implement AmbientPointer** with `matchMedia` guards for coarse pointers and reduced motion, passive pointer listeners, requestAnimationFrame throttling, and cleanup.
- [ ] **Step 4: Mount the component in the root layout and add the fixed halo CSS** behind `.site-frame`, with light/dark theme opacity tokens and no input interception.
- [ ] **Step 5: Run the focused test** and expect it to pass.

### Task 3: Interactive landing constellation

**Files:**
- Create: `src/features/landing/system-constellation.tsx`
- Modify: `src/app/(marketing)/page.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/component/system-constellation.test.tsx`

**Interfaces:**
- Consumes: locale strings supplied by the page.
- Produces: `SystemConstellation({ locale })`, containing links to `/features/nutrition`, `/features/training`, and `/blog`.

- [ ] **Step 1: Write failing tests** for the three destinations and for hover/focus updating the center label.
- [ ] **Step 2: Run `npx vitest run tests/component/system-constellation.test.tsx`** and verify the missing-component failure.
- [ ] **Step 3: Implement the client component** with explicit module data, pointer/focus state, keyboard-accessible links, and bounded CSS-variable parallax.
- [ ] **Step 4: Replace the static orbit markup on the marketing page** with the component.
- [ ] **Step 5: Add constellation CSS** for active orbit emphasis, node elevation, center transitions, 44px targets, mobile positioning, and reduced-motion fallback.
- [ ] **Step 6: Run the focused test** and expect it to pass.

### Task 4: Harmonized button states

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/ui/button.tsx`
- Test: `tests/phase-2-public-experience.test.js`

**Interfaces:**
- Consumes: existing `primary`, `secondary`, `quiet`, and `danger` variants.
- Produces: stable `--button-primary-*` and `--button-secondary-*` semantic tokens across both themes.

- [ ] **Step 1: Extend the contract test** to require theme-specific semantic button tokens and elevation/focus-compatible shared variants.
- [ ] **Step 2: Run `node --test tests/phase-2-public-experience.test.js`** and verify failure on missing tokens.
- [ ] **Step 3: Add coordinated button tokens** using deep forest/ivory in light mode and fresh sage/deep ink in dark mode.
- [ ] **Step 4: Update button variants** to use the semantic tokens, border, elevation, hover luminance, and pressed state without hue jumps.
- [ ] **Step 5: Run the contract test** and expect it to pass.

### Task 5: Clinical Atlas anatomy geometry

**Files:**
- Create: `src/features/anatomy/atlas-paths.ts`
- Modify: `src/features/anatomy/anatomy-figure.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/phase-2-public-experience.test.js`

**Interfaces:**
- Produces: `atlasViews`, keyed by `front | back`, with silhouette, landmark, and muscle path collections keyed by existing muscle IDs.
- Consumes: `getMusclesForView`, the existing `selected` ID, locale, and `onSelect` callback.

- [ ] **Step 1: Extend the anatomy contract test** to require separated front/back atlas geometry, landmark paths, and existing accessible interaction attributes.
- [ ] **Step 2: Run the contract test** and confirm failure because `atlas-paths.ts` is absent.
- [ ] **Step 3: Build the front atlas** with continuous 7.5-head proportions, recognizable skull/jaw/neck/torso/pelvis/limbs, and layered pectoral, deltoid, biceps, abdominal, quadriceps, and tibialis paths.
- [ ] **Step 4: Build the back atlas** with the same proportions and layered trapezius, latissimus, rear deltoid, triceps, gluteal, hamstring, and calf paths.
- [ ] **Step 5: Refactor AnatomyFigure** to choose view geometry, render neutral body grounds and landmarks, and keep each data muscle as one accessible interactive group.
- [ ] **Step 6: Replace green muscle fills with clinical terracotta/rose tokens** that remain compatible with Sage Dusk; add selected, hover, focus, and dark-theme states.
- [ ] **Step 7: Run the contract test** and expect it to pass.

### Task 6: Integrated verification and hardening

**Files:**
- Modify only files implicated by verification failures.

**Interfaces:**
- Consumes all deliverables above.
- Produces a production-ready, regression-checked implementation.

- [ ] **Step 1: Run `npm run test`** and fix only relevant failures until all contract and unit/component tests pass.
- [ ] **Step 2: Run `npm run typecheck`** and resolve all type errors.
- [ ] **Step 3: Run `npm run lint`** and resolve all lint errors.
- [ ] **Step 4: Run `npm run build`** and confirm the production build completes.
- [ ] **Step 5: Inspect `/` and `/anatomy` at 320, 375, 768, 1024, and 1440px** for overflow, overlap, pointer behavior, light/dark contrast, keyboard focus, and console errors.
- [ ] **Step 6: Verify reduced-motion and coarse-pointer fallbacks** leave both pages fully usable.

## Self-Review

- Every requirement in the approved specification maps to Tasks 1–6.
- Component boundaries keep session handling, ambient effects, landing interaction, and atlas geometry isolated.
- All named routes and function signatures are consistent.
- No new animation or rendering dependency is introduced.
- The plan contains no implementation placeholders and deliberately omits commits.
