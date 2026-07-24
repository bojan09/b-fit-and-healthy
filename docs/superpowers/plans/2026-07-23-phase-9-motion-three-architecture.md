# Phase 9 Motion and Three.js Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add restrained, accessible GSAP motion across approved product surfaces and establish a dormant, licensed-asset-gated Three.js Anatomy renderer while keeping the SVG atlas active.

**Architecture:** Pure motion/capability functions decide full, limited, or reduced enhancement. Client-only GSAP scopes dynamically import the library and revert every animation on unmount. Anatomy state remains renderer-neutral; a validated licensed-asset manifest and capability gate are both required before the dormant Three.js renderer can load, so the current SVG renderer stays authoritative.

**Tech Stack:** Next.js 16.2.10 App Router, React 19.2.7, TypeScript 6.0.3, GSAP 3.15.0, Three.js 0.185.1, `@types/three` 0.185.1, CSS, Vitest 4.1.10, Testing Library.

## Global Constraints

- Do not perform Git operations; the user reviews and commits.
- Do not create, expose, or modify environment credential files.
- Retain the current Sky Dusk visual identity, English-first bilingual behavior, and existing routes.
- Keep the SVG Anatomy atlas active until a commercially licensed clinical model with named muscle meshes is supplied.
- Do not build a procedural body, empty canvas, decorative WebGL scene, physics effect, or particle background.
- Do not import GSAP or Three.js from Server Components or shared server modules.
- Keep all content and controls visible and usable before motion enhancement loads.
- CSS owns ordinary hover, focus, pressed, and disabled feedback.
- Reduced motion always wins over every other capability decision.
- Every timeline, media-query subscription, observer, event listener, animation loop, and GPU resource must be cleaned up.
- Do not block route navigation or delay mutations for animation.
- Preserve 44-pixel touch targets and current keyboard behavior.

---

### Task 1: Phase 9 contracts and pinned dependencies

**Files:**
- Create: `tests/phase-9-motion-three.test.js`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces repository-level contracts for dependencies, dynamic loading, SVG fallback, reduced motion, and cleanup.

- [ ] **Step 1: Write failing repository contracts**

Add Node tests that assert:

```js
test("Phase 9 pins approved motion dependencies", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.dependencies.gsap, "3.15.0");
  assert.equal(pkg.dependencies.three, "0.185.1");
  assert.equal(pkg.devDependencies["@types/three"], "0.185.1");
});

test("motion libraries stay behind client-only dynamic boundaries", () => {
  assert.match(read("src/features/motion/gsap-loader.ts"), /import\("gsap"\)/);
  assert.doesNotMatch(read("src/app/(marketing)/page.tsx"), /from ["']gsap["']/);
  assert.match(read("src/features/anatomy/three-anatomy-boundary.tsx"), /import\(".+three-anatomy-renderer"\)/);
});

test("SVG remains the default Anatomy renderer", () => {
  const boundary = read("src/features/anatomy/anatomy-renderer.tsx");
  assert.match(boundary, /SvgAnatomyRenderer/);
  assert.match(boundary, /manifest/);
  assert.match(boundary, /canUseThreeRenderer/);
});
```

Also assert that `globals.css` retains `prefers-reduced-motion`, no canvas is added to the server Anatomy page, and no checked-in asset manifest claims a model exists.

- [ ] **Step 2: Run the contract test and witness the expected failure**

Run:

```powershell
node --test tests/phase-9-motion-three.test.js
```

Expected: failures for missing packages and missing motion/renderer modules.

- [ ] **Step 3: Install exact dependencies**

Run:

```powershell
npm.cmd install --save-exact gsap@3.15.0 three@0.185.1
npm.cmd install --save-dev --save-exact @types/three@0.185.1
```

Verify `package.json` and `package-lock.json` contain the exact versions and no unrelated package was introduced.

- [ ] **Step 4: Rerun the contract test**

Expected: the dependency assertion passes; architectural assertions remain red until their tasks are complete.

---

### Task 2: Pure motion profiles and Three.js eligibility

**Files:**
- Create: `src/features/motion/preferences.ts`
- Create: `src/features/motion/use-motion-profile.ts`
- Create: `tests/unit/motion-preferences.test.ts`

**Interfaces:**
- Produces `MotionCapabilitySnapshot`, `MotionProfile`, `resolveMotionProfile(snapshot)`, `canUseThreeRenderer(snapshot, hasLicensedAsset)`, and `useMotionProfile()`.

- [ ] **Step 1: Write failing pure-domain tests**

Cover the full decision table:

```ts
expect(resolveMotionProfile(fullDesktop)).toBe("full");
expect(resolveMotionProfile({ ...fullDesktop, coarsePointer: true })).toBe("limited");
expect(resolveMotionProfile({ ...fullDesktop, saveData: true })).toBe("limited");
expect(resolveMotionProfile({ ...fullDesktop, documentVisible: false })).toBe("limited");
expect(resolveMotionProfile({ ...fullDesktop, hardwareConcurrency: 2 })).toBe("limited");
expect(resolveMotionProfile({ ...fullDesktop, reducedMotion: true })).toBe("reduced");

expect(canUseThreeRenderer(fullDesktop, false)).toBe(false);
expect(canUseThreeRenderer(fullDesktop, true)).toBe(true);
expect(canUseThreeRenderer({ ...fullDesktop, webgl2: false }, true)).toBe(false);
expect(canUseThreeRenderer({ ...fullDesktop, reducedMotion: true }, true)).toBe(false);
```

Test null browser hints as unknown rather than automatically low-powered.

- [ ] **Step 2: Run the focused test and witness missing exports**

Run:

```powershell
npm.cmd run test:unit -- tests/unit/motion-preferences.test.ts
```

Expected: module-not-found failure.

- [ ] **Step 3: Implement the pure decision module**

Use an exact snapshot shape:

```ts
export type MotionCapabilitySnapshot = {
  reducedMotion: boolean;
  coarsePointer: boolean;
  saveData: boolean;
  documentVisible: boolean;
  hardwareConcurrency: number | null;
  deviceMemory: number | null;
  webgl2: boolean;
};

export type MotionProfile = "full" | "limited" | "reduced";
```

Return `reduced` first. Return `limited` for save-data, coarse pointer, hidden documents, fewer than four logical processors, or known memory below four GiB. Three.js additionally requires full motion, WebGL2, visible document, and a licensed asset.

- [ ] **Step 4: Implement the browser hook**

Use `matchMedia("(prefers-reduced-motion: reduce)")`, `matchMedia("(pointer: coarse)")`, visibility events, safe `navigator.connection?.saveData`, hardware hints, and a temporary canvas for WebGL2 detection. Remove all listeners on cleanup and never retain the probe canvas.

- [ ] **Step 5: Run focused tests, typecheck, and lint**

Run:

```powershell
npm.cmd run test:unit -- tests/unit/motion-preferences.test.ts
npm.cmd run typecheck
npm.cmd run lint
```

Expected: all pass.

---

### Task 3: Scoped GSAP loader and one-time reveal primitive

**Files:**
- Create: `src/features/motion/gsap-loader.ts`
- Create: `src/features/motion/use-gsap-scope.ts`
- Create: `src/features/motion/motion-reveal.tsx`
- Create: `tests/unit/gsap-loader.test.ts`
- Create: `tests/component/motion-reveal.test.tsx`

**Interfaces:**
- Consumes `MotionProfile`.
- Produces `loadGsap()`, `useGsapScope(rootRef, setup, dependencies)`, and `<MotionReveal>` with `data-motion-state`.

- [ ] **Step 1: Write failing loader and component tests**

Test that:

- `loadGsap()` caches one dynamic import promise.
- `useGsapScope` does not load GSAP for the reduced profile.
- Full and limited profiles create a match-media scope.
- Unmount calls `revert()` exactly once.
- `MotionReveal` content is visible before enhancement.
- IntersectionObserver starts the entrance once, then disconnects.
- Missing GSAP leaves `data-motion-state="static"` without hiding children.

- [ ] **Step 2: Run focused tests and witness missing modules**

Run:

```powershell
npm.cmd run test:unit -- tests/unit/gsap-loader.test.ts tests/component/motion-reveal.test.tsx
```

- [ ] **Step 3: Implement a cached dynamic loader**

`gsap-loader.ts` must contain no top-level package import:

```ts
let pending: Promise<typeof import("gsap")> | null = null;

export function loadGsap() {
  pending ??= import("gsap");
  return pending;
}
```

Expose a test-only reset function only from the loader module; do not attach it to browser globals.

- [ ] **Step 4: Implement scoped setup and cleanup**

`useGsapScope` dynamically loads GSAP inside `useEffect`, aborts late setup after unmount, creates `gsap.matchMedia()`, registers full/limited/reduced conditions, and calls `revert()` in cleanup. Setup receives the resolved `gsap` object, root element, and active profile.

- [ ] **Step 5: Implement the one-time reveal**

Render visible markup first. An IntersectionObserver adds enhancement only after intersection. Animate opacity from `0.84` and `y: 18` for full motion, `y: 8` for limited motion, and immediately settle for reduced motion. Disconnect after the first reveal.

- [ ] **Step 6: Run focused tests and static quality gates**

Run:

```powershell
npm.cmd run test:unit -- tests/unit/gsap-loader.test.ts tests/component/motion-reveal.test.tsx
npm.cmd run typecheck
npm.cmd run lint
```

---

### Task 4: Landing and public-navigation choreography

**Files:**
- Create: `src/features/landing/landing-motion.tsx`
- Modify: `src/app/(marketing)/page.tsx`
- Modify: `src/features/landing/system-constellation.tsx`
- Modify: `src/components/shell/public-navigation.tsx`
- Create: `tests/component/landing-motion.test.tsx`
- Create: `tests/component/public-navigation-motion.test.tsx`

**Interfaces:**
- Consumes `useGsapScope`, `MotionReveal`, and existing server-rendered Landing children.
- Produces a scoped `<LandingMotion>` wrapper and animated-but-immediate public navigation.

- [ ] **Step 1: Write failing interaction tests**

Assert:

- Hero heading and both account actions are present before GSAP resolves.
- Landing scope identifies hero eyebrow, title, body, actions, note, and constellation without querying outside its root.
- Reduced motion performs no transform animation.
- Full motion registers one hero timeline and one-time section reveals.
- Constellation pointer response remains disabled on coarse/reduced profiles.
- Opening the native mobile menu exposes all links immediately.
- Mobile-menu enhancement animates the panel/items after open and reverts on close/unmount.
- Link activation is never delayed by an exit timeline.

- [ ] **Step 2: Run the focused component tests and witness failures**

Run:

```powershell
npm.cmd run test:unit -- tests/component/landing-motion.test.tsx tests/component/public-navigation-motion.test.tsx
```

- [ ] **Step 3: Implement `LandingMotion`**

Wrap the existing Landing sections with a client component carrying a root ref. Use explicit `data-motion-hero` and `data-motion-section` markers. Register one 560ms hero timeline with a maximum 60ms stagger. Keep section markup visible and use `MotionReveal` for one-time entrances.

- [ ] **Step 4: Integrate the landing page without changing copy or layout**

Preserve all existing Server Component data loading, metadata, links, cards, and structured data. Add only the wrapper and motion markers.

- [ ] **Step 5: Refine constellation and menu motion**

Use the shared profile instead of local media-query assumptions. Keep pointer variables CSS-driven. Enhance the native `<details>` menu after it opens; do not replace native semantics with a modal or block navigation.

- [ ] **Step 6: Run component tests and quality gates**

Run:

```powershell
npm.cmd run test:unit -- tests/component/landing-motion.test.tsx tests/component/public-navigation-motion.test.tsx
npm.cmd run typecheck
npm.cmd run lint
```

---

### Task 5: Renderer-neutral Anatomy and dormant Three.js boundary

**Files:**
- Create: `src/features/anatomy/anatomy-renderer-types.ts`
- Create: `src/features/anatomy/anatomy-asset-manifest.ts`
- Create: `src/features/anatomy/svg-anatomy-renderer.tsx`
- Create: `src/features/anatomy/anatomy-renderer.tsx`
- Create: `src/features/anatomy/three-anatomy-boundary.tsx`
- Create: `src/features/anatomy/three-resource-disposer.ts`
- Create: `src/features/anatomy/three-anatomy-renderer.tsx`
- Modify: `src/features/anatomy/anatomy-explorer.tsx`
- Modify: `src/features/anatomy/anatomy-figure.tsx`
- Create: `tests/unit/anatomy-asset-manifest.test.ts`
- Create: `tests/unit/three-resource-disposer.test.ts`
- Create: `tests/component/anatomy-renderer.test.tsx`
- Modify: `tests/component/anatomy-directory.test.tsx`

**Interfaces:**
- Produces `AnatomyRendererProps`, `AnatomyAssetManifest`, `anatomyAssetManifestSchema`, `getAnatomyAssetManifest()`, `SvgAnatomyRenderer`, `AnatomyRenderer`, `ThreeAnatomyBoundary`, and `disposeThreeResources(root, renderer)`.

- [ ] **Step 1: Write failing manifest and fallback tests**

Validate that a manifest requires:

- HTTPS or root-relative `.glb`/`.gltf` URL.
- Non-empty license name, URL, attribution, and model version.
- Literal `commercialUseAllowed: true`.
- Only known application muscle IDs.
- At least one unique mesh name per mapped muscle.
- No mesh name assigned to two different muscle IDs.

Assert `getAnatomyAssetManifest()` returns `null` in this phase.

- [ ] **Step 2: Write failing renderer component tests**

Assert:

- No manifest renders the SVG renderer.
- Invalid manifest renders the SVG renderer.
- Reduced/limited capability renders SVG even with a valid test manifest.
- Full capability plus a valid manifest invokes the Three renderer loader.
- Loader rejection returns to SVG with no raw error in the UI.
- View, selected muscle, locale, keyboard activation, and `onSelectMuscle` remain identical.

- [ ] **Step 3: Write failing resource cleanup tests**

Use mocked scene nodes/materials/textures/render targets and assert each unique disposable is called once. Assert `setAnimationLoop(null)`, renderer disposal, control disposal, listener cleanup, and observer disconnection.

- [ ] **Step 4: Run focused tests and witness missing modules**

Run:

```powershell
npm.cmd run test:unit -- tests/unit/anatomy-asset-manifest.test.ts tests/unit/three-resource-disposer.test.ts tests/component/anatomy-renderer.test.tsx
```

- [ ] **Step 5: Implement the manifest and renderer types**

Use Zod for the manifest boundary and the existing `muscles` collection for allowed IDs. Keep the checked-in getter explicitly `null`; do not create a fake URL or license.

- [ ] **Step 6: Extract the SVG wrapper**

Move no path data and change no SVG semantics. `SvgAnatomyRenderer` delegates to `AnatomyFigure` using the renderer-neutral prop names.

- [ ] **Step 7: Implement the conditional Three boundary**

Call the Three module loader only when both a validated manifest exists and `canUseThreeRenderer` returns true. Render SVG during loading and after any error. Do not render a blank canvas in this phase.

- [ ] **Step 8: Implement dormant lifecycle infrastructure**

`three-anatomy-renderer.tsx` defines the client-only scene lifecycle and typed mesh-selection contract but returns the synchronized SVG fallback until a real asset is present. Keep all `three` imports inside this dynamically loaded module and its client-only disposer. Cap future pixel ratio as approved and dispose every tracked resource.

- [ ] **Step 9: Integrate `AnatomyExplorer`**

Keep search, region filters, selected state, URL links, live-region content, and directory behavior unchanged. Replace the direct `AnatomyFigure` call with `AnatomyRenderer`.

- [ ] **Step 10: Run focused and existing Anatomy tests**

Run:

```powershell
npm.cmd run test:unit -- tests/unit/anatomy-asset-manifest.test.ts tests/unit/three-resource-disposer.test.ts tests/component/anatomy-renderer.test.tsx tests/component/anatomy-directory.test.tsx
npm.cmd run typecheck
npm.cmd run lint
```

---

### Task 6: Anatomy selection and view choreography

**Files:**
- Create: `src/features/anatomy/anatomy-motion.ts`
- Modify: `src/features/anatomy/anatomy-explorer.tsx`
- Modify: `src/app/globals.css`
- Create: `tests/component/anatomy-motion.test.tsx`

**Interfaces:**
- Consumes `useGsapScope`, Anatomy renderer state, stage/panel refs, and motion profile.
- Produces `useAnatomyMotion({ rootRef, view, selectedMuscleId })`.

- [ ] **Step 1: Write failing interaction tests**

Test front/back crossfade, selected-region emphasis, synchronized panel transition, one final live-region announcement, reduced-motion immediacy, focus preservation, offscreen-only stage scrolling, and cleanup across repeated selection changes.

- [ ] **Step 2: Run the test and witness the missing hook**

Run:

```powershell
npm.cmd run test:unit -- tests/component/anatomy-motion.test.tsx
```

- [ ] **Step 3: Implement scoped Anatomy timelines**

Use a 360ms view sequence and 220ms selection sequence. Limit selectors to the explorer root. Do not animate SVG path geometry. Animate the renderer container and information-panel children with transforms/opacity, then clear inline properties.

- [ ] **Step 4: Preserve focus and announce final state**

Do not shift focus on atlas clicks. Directory activation may use `scrollIntoView({ block: "nearest" })` only when the stage is outside the viewport; keep focus on the directory button. Update the polite live region after selected state settles, with immediate updates for reduced motion.

- [ ] **Step 5: Add motion-state CSS**

Add stable base states, `will-change` only during active sequences, reduced-motion parity, and no hidden no-JavaScript state.

- [ ] **Step 6: Run Anatomy tests and static quality gates**

Run:

```powershell
npm.cmd run test:unit -- tests/component/anatomy-motion.test.tsx tests/component/anatomy-renderer.test.tsx tests/component/anatomy-directory.test.tsx
npm.cmd run typecheck
npm.cmd run lint
```

---

### Task 7: Success feedback for tracking, nutrition, and fitness

**Files:**
- Create: `src/features/motion/action-feedback.tsx`
- Modify: `src/features/tracking/tracking-form.tsx`
- Modify: `src/features/tracking/habit-actions.tsx`
- Modify: `src/features/nutrition/nutrition-forms.tsx`
- Modify: `src/features/fitness/session-logger.tsx`
- Modify: `src/app/globals.css`
- Create: `tests/component/action-feedback.test.tsx`
- Modify: relevant existing tracking, nutrition, and fitness component tests where selectors change.

**Interfaces:**
- Produces `<ActionFeedback status message children>` and `data-action-status`.

- [ ] **Step 1: Write failing feedback tests**

Assert:

- Idle and pending states do not play success motion.
- Success triggers one short check/pulse sequence and retains visible status text.
- Errors never use success color or motion.
- Repeated identical success requires a new action transition before replaying.
- Reduced motion shows the same semantic status immediately.
- Forms remain enabled/disabled according to their existing pending state.

- [ ] **Step 2: Run the focused test and witness the missing component**

Run:

```powershell
npm.cmd run test:unit -- tests/component/action-feedback.test.tsx
```

- [ ] **Step 3: Implement semantic action feedback**

Wrap existing status text rather than replacing it. Use `role="status"` and `aria-live="polite"`. Animate only a small icon and container border/background accent for at most 360ms.

- [ ] **Step 4: Integrate forms with existing mutation behavior**

Integrate existing `useActionState` forms directly. For habit and session controls without returned state, animate only their immediate client-side checked/completed state; do not infer server success before the server response or navigation refresh.

- [ ] **Step 5: Add restrained CSS fallback**

Provide clear static success/error styling. Keep GSAP enhancement optional and remove `will-change` after completion.

- [ ] **Step 6: Run focused and feature tests**

Run:

```powershell
npm.cmd run test:unit -- tests/component/action-feedback.test.tsx
npm.cmd run test:unit -- tests/unit/tracking-domain.test.ts tests/unit/nutrition-domain.test.ts tests/unit/fitness-domain.test.ts
npm.cmd run typecheck
npm.cmd run lint
```

---

### Task 8: Motion tokens, responsive polish, and operational documentation

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/effects/ambient-pointer.tsx`
- Create: `docs/motion-and-three-operations.md`
- Modify: `README.md`

**Interfaces:**
- Establishes global timing/easing tokens, responsive/reduced-motion behavior, asset enablement rules, and troubleshooting steps.

- [ ] **Step 1: Add exact motion tokens**

Add:

```css
--motion-fast: 160ms;
--motion-control: 220ms;
--motion-panel: 360ms;
--motion-sequence: 560ms;
--ease-standard: cubic-bezier(.2, .8, .2, 1);
--ease-emphasized: cubic-bezier(.16, 1, .3, 1);
```

Replace conflicting ad hoc durations only in Phase 9-touched components. Do not globally increase animation.

- [ ] **Step 2: Harden ambient pointer behavior**

Use the shared reduced/coarse profile, pause updates while hidden, retain one animation frame at a time, and remove pointer/visibility listeners during cleanup. Keep the effect CSS-based.

- [ ] **Step 3: Document operations**

Document:

- Why SVG remains active.
- Exact manifest and license requirements.
- Stable muscle ID and unique mesh-name rules.
- Capability and reduced-motion gates.
- How to enable a future licensed asset.
- Required model optimization and size review before activation.
- Pixel-ratio, visibility, and disposal behavior.
- How to verify no Three.js network request occurs without a manifest.
- How to diagnose and safely fall back from renderer errors.

- [ ] **Step 4: Update README status**

Mark Phases 5–8 accurately and describe Phase 9 as motion polish plus dormant Three.js architecture, not a live 3D model.

- [ ] **Step 5: Run documentation and contract checks**

Run:

```powershell
rg -n -i "TBD|TODO|placeholder|implement later" docs/motion-and-three-operations.md
node --test tests/phase-9-motion-three.test.js
npm.cmd run typecheck
npm.cmd run lint
```

Expected: no placeholder matches and all checks pass.

---

### Task 9: Full verification and runtime review

**Files:**
- Modify only files required by failures discovered during verification.

**Interfaces:**
- Produces the Phase 9 acceptance report and a production server on port 3000.

- [ ] **Step 1: Run the full automated gate**

Run:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test
npm.cmd run build
```

Expected: zero type errors, lint errors, test failures, or build failures.

- [ ] **Step 2: Restart the exact repository production process**

Resolve the listener on port 3000, verify its command belongs to this repository, stop only that PID, and start:

```powershell
npm.cmd run start -- --port 3000
```

Use a hidden window and verify the new listener command.

- [ ] **Step 3: Run public route probes**

Probe `/`, `/anatomy`, `/blog`, one article, `/features/nutrition`, and `/features/training`. Verify HTTP 200 and no unexpected redirect.

- [ ] **Step 4: Run protected route probes**

Probe `/today`, `/nutrition`, `/training`, and `/assistant` without a session. Verify each redirects to `/sign-in` with a safe `next` parameter.

- [ ] **Step 5: Perform browser interaction review**

Review Landing, Anatomy, Blog/article, Nutrition feature, Training feature, and authenticated product surfaces when a test session is available. Check 320, 375, 768, 1024, 1280, and 1440 widths in both themes, keyboard navigation, reduced motion, coarse pointer, and data-saver.

Record:

- Console and hydration output.
- Focus continuity.
- Animation cleanup after repeated navigation.
- No content flash or hidden controls before GSAP loads.
- No horizontal overflow.
- No Three.js request without a manifest.
- Cumulative Layout Shift at or below 0.1 on Landing and Anatomy.

- [ ] **Step 6: Verify repository hygiene**

Confirm:

```powershell
Test-Path -LiteralPath "dist"
Test-Path -LiteralPath ".env.example"
```

Both must be `False`. Confirm no credential file was modified and no Git operation occurred.

- [ ] **Step 7: Report exact evidence and stop**

Report test counts, routes/viewports reviewed, runtime limitations, dependency versions, active SVG fallback, dormant Three.js boundary, and any authenticated paths that could not be visually inspected. Do not declare the future clinical 3D model complete.
