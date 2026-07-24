# Phase 9 Motion and Three.js Architecture Design

**Status:** Approved  
**Date:** 2026-07-23  
**Direction:** Progressive Motion Architecture  

## Purpose

Phase 9 adds purposeful motion to the existing Sky Dusk product and prepares a production-safe Three.js anatomy boundary without replacing the accessible SVG atlas. The experience should feel athletic, calm, responsive, and premium. Motion must clarify hierarchy or confirm an action; it must not delay navigation, obscure content, or turn the product into a cinematic demo.

The repository does not contain a commercially licensed clinical anatomy model. Therefore, the SVG atlas remains the only active Anatomy renderer in this phase. Phase 9 must not create a procedural mannequin, download an unlicensed model, or show an empty WebGL canvas.

## Approved Scope

Phase 9 includes:

- GSAP 3.15.0 for a small set of coordinated sequences.
- Three.js 0.185.1 and matching types for an isolated, dormant renderer integration boundary.
- A shared motion-preference and capability layer.
- Landing-page hero and major-section choreography.
- Refined navigation and mobile-menu motion.
- Anatomy front/back, muscle-selection, directory-focus, and information-panel transitions.
- Small completion confirmations for user-initiated tracking actions.
- Restrained entrance polish for training and nutrition planners.
- Minimal article-card and reading-aid motion on the Knowledge pages.
- Performance budgets, cleanup contracts, reduced-motion parity, and automated tests.

Phase 9 excludes:

- A live 3D anatomy model or procedural substitute.
- Changes to anatomy URLs, muscle IDs, educational copy, search, filters, or relationships.
- Continuous WebGL decoration, background particle scenes, physics, shader effects, or audio.
- Scroll-jacking, pinned long-form sections, delayed route navigation, and repeated entrance animations.
- Autonomous animation of private health data.
- Phase 10 security, accessibility, content, SEO, PWA, or full device audit work except where required to keep Phase 9 safe.

## Design Principles

1. **HTML and SVG are complete before enhancement.** Content, controls, and anatomy information render and work without GSAP or Three.js.
2. **CSS owns ordinary feedback.** Hover, focus, pressed, disabled, and simple state transitions remain CSS.
3. **GSAP owns coordinated sequences only.** It is used when several elements need a shared timeline or when selection changes require synchronized staging.
4. **Three.js is conditional infrastructure.** It is never imported merely because the Anatomy page renders.
5. **Reduced motion is a first-class experience.** It receives immediate state changes, not missing content.
6. **Every animation cleans up.** Route changes, media-query changes, and component unmounts must revert timelines, listeners, observers, and inline transforms.

## Architecture

### Motion preference and capability layer

`src/features/motion/preferences.ts` contains pure capability decisions. It consumes a snapshot rather than browser globals so it can be tested:

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

export function resolveMotionProfile(snapshot: MotionCapabilitySnapshot): MotionProfile;
export function canUseThreeRenderer(snapshot: MotionCapabilitySnapshot, hasLicensedAsset: boolean): boolean;
```

`src/features/motion/use-motion-profile.ts` reads media queries, network hints, document visibility, and capability information. It subscribes to changes and exposes one stable profile. Reduced motion always wins. Save-data, coarse-pointer, hidden-document, or low-capability conditions select the limited profile.

### GSAP motion boundary

`src/features/motion/use-gsap-scope.ts` dynamically imports GSAP inside a client effect. The hook receives a root ref and setup callback. It uses `gsap.matchMedia()` for full, limited, and reduced profiles and calls `revert()` during cleanup. Components never import GSAP at module scope.

Each sequence:

- Starts from visible, usable server-rendered markup.
- Uses transforms and opacity rather than layout properties.
- Avoids `from()` states that could leave content hidden if loading fails.
- Runs once unless directly triggered by a new user action.
- Stops when the document becomes hidden.
- Keeps focus on the initiating control or selected Anatomy region.

### Anatomy renderer boundary

The renderer-neutral state stays in `AnatomyExplorer`:

```ts
export type AnatomyRendererProps = {
  view: "front" | "back";
  selectedMuscleId: string;
  locale: Locale;
  onSelectMuscle: (muscleId: string) => void;
};
```

`SvgAnatomyRenderer` wraps the existing `AnatomyFigure` and remains the default.

`ThreeAnatomyBoundary` owns future renderer eligibility. It accepts an optional validated asset manifest. When the manifest is absent or capability checks fail, it renders `SvgAnatomyRenderer` without importing the Three.js implementation.

The dormant `ThreeAnatomyRenderer` infrastructure defines:

- Scene/camera/renderer lifecycle.
- Resize and visibility handling.
- Stable muscle ID to mesh-name mapping.
- Raycast-selection interface.
- Resource-disposal utilities.
- Renderer status callbacks for loading, ready, failed, and disposed states.

It does not construct a scene in this phase because no licensed asset is present.

### Future clinical asset manifest

A future model can be enabled only with a validated manifest containing:

```ts
export type AnatomyAssetManifest = {
  assetUrl: string;
  licenseName: string;
  licenseUrl: string;
  attribution: string;
  commercialUseAllowed: true;
  modelVersion: string;
  muscleMeshes: Record<string, readonly string[]>;
};
```

Every `muscleMeshes` key must match a stable application muscle ID. Unknown, missing, or duplicate mappings fail validation and retain the SVG renderer.

## Motion Coverage

### Landing

- Hero eyebrow, heading, supporting copy, and actions enter as one short timeline.
- The connected-health visual receives restrained orbit and pointer response.
- Major sections reveal once when entering the viewport.
- Motion never changes the final layout or delays primary actions.

### Navigation

- Active indicators move with a short transform.
- Mobile navigation opens with a coordinated panel and item sequence.
- Route navigation begins immediately; exit animations do not block links.

### Anatomy

- Front/back changes use a short crossfade with slight directional movement.
- Muscle selection emphasizes the region and coordinates the information-panel update.
- Directory selection scrolls and focuses the atlas stage only when it is outside the viewport.
- The live region announces the final selected muscle once, after the state update.
- Keyboard and touch behavior remains identical to the current SVG implementation.

### Dashboard, nutrition, and training

- Successful water, habit, meal, and workout actions receive a small confirmation pulse or check transition.
- Planner panels can use a one-time entrance sequence.
- Numeric values do not count up, bounce, or animate automatically.
- Failed actions never play success motion.

### Knowledge

- Article cards may use a restrained hover lift and one-time entrance.
- Article paragraphs, headings, references, and reading position remain stable.

### Ambient pointer

The current ambient pointer remains CSS-driven. Phase 9 tunes its color and movement response but does not move it into GSAP. It stays disabled for reduced motion and coarse pointers.

## Motion Tokens

CSS custom properties remain the source of timing and easing:

```css
:root {
  --motion-fast: 160ms;
  --motion-control: 220ms;
  --motion-panel: 360ms;
  --motion-sequence: 560ms;
  --ease-standard: cubic-bezier(.2, .8, .2, 1);
  --ease-emphasized: cubic-bezier(.16, 1, .3, 1);
}
```

No ordinary sequence exceeds 700ms. Staggers are at most 70ms per item and are capped so long lists do not create long waits.

## Accessibility

- `prefers-reduced-motion: reduce` produces immediate content and state updates with no spatial movement.
- Hidden content is never required to start an animation.
- Focus remains visible and is never moved merely for decoration.
- Anatomy continues to provide HTML search, filters, directory controls, selected-state semantics, and text details.
- A future canvas remains `aria-hidden` from the interaction model; synchronized HTML controls remain authoritative.
- Animations do not communicate success, selection, or status without accompanying text, iconography, or semantic state.
- Touch targets remain at least 44 by 44 CSS pixels.

## Performance Budgets

- GSAP is dynamically imported only by routes/components that register an approved sequence.
- Three.js is not requested while the clinical asset manifest is absent.
- Landing content is visible before the GSAP chunk resolves.
- Animation uses compositor-friendly transforms and opacity.
- Intersection observers disconnect after one-time reveals.
- No persistent animation loop runs on Landing, Blog, Dashboard, Nutrition, or Training.
- Future WebGL rendering pauses when hidden or offscreen, caps device-pixel ratio at 1.75 desktop and 1.25 mobile, and uses `renderer.setAnimationLoop(null)` before disposal.
- Future cleanup disposes renderer, geometries, materials, textures, render targets, controls, observers, and event listeners.
- Phase 9 must not regress Cumulative Layout Shift beyond 0.1 in the tested landing and Anatomy viewports.

## Error and Fallback Behaviour

- Failure to load GSAP leaves the already-visible static interface intact.
- Unsupported browser capability selects the reduced or limited profile without showing an error.
- Missing, invalid, unlicensed, or failed Anatomy assets keep the SVG renderer active.
- A future Three.js runtime failure records a safe development diagnostic, disposes partial resources, and swaps back to SVG.
- No raw loader, shader, model-path, or browser capability error is shown to users.

## Testing and Verification

Automated tests cover:

- Motion-profile decisions and reduced-motion precedence.
- Three.js eligibility with and without a licensed manifest.
- GSAP dynamic loading and cleanup.
- One-time reveal observation and teardown.
- Anatomy selection/view continuity across the SVG renderer boundary.
- Missing and invalid asset fallback.
- No module-scope GSAP or Three.js imports in server components.
- No Three.js request when the manifest is absent.
- Existing keyboard, locale, theme, and component behavior.

Runtime review covers:

- Landing, Anatomy, Dashboard, Nutrition, Training, Knowledge, and an article.
- 320, 375, 768, 1024, 1280, and 1440 pixel widths.
- Light and dark themes.
- English and Macedonian.
- Keyboard-only navigation.
- Reduced motion, coarse pointer, and data-saver emulation.
- Console errors, hydration warnings, stale inline transforms, and duplicate listeners after navigation.

The final gate runs typecheck, lint, all tests, the optimized production build, and runtime probes. The report lists any untested authenticated visual paths or external configuration blockers.

## Dependencies and Operational Notes

- Pin `gsap` to `3.15.0`.
- Pin `three` and `@types/three` to `0.185.1`.
- Keep these libraries out of Server Components and shared server modules.
- The implementation follows Next.js client-side dynamic-import guidance, GSAP match-media cleanup, and Three.js explicit GPU-resource disposal.
- Do not create or edit environment-example files.
- Do not perform Git commits; the user owns review and commits.

## Acceptance Criteria

Phase 9 is accepted when:

- Approved sequences enhance the selected pages without blocking content or navigation.
- Reduced-motion users receive equivalent information and functionality.
- GSAP timelines and observers fully clean up across route changes.
- The SVG Anatomy atlas remains the active, accessible renderer.
- Three.js is isolated behind a validated manifest and capability boundary and is not downloaded without a licensed asset.
- Stable muscle IDs and all existing Anatomy interactions remain intact.
- Light/dark and English/Macedonian parity remain intact.
- Performance budgets and responsive checks pass.
- Typecheck, lint, tests, and production build pass.
- No Git operation or credential-file modification occurs.
