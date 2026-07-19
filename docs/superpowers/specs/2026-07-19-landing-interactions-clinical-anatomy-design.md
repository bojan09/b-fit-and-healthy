# Landing Interactions and Clinical Anatomy Design

Date: 2026-07-19
Status: Approved design direction, awaiting written-spec review

## Objective

Polish the existing Sage Dusk public experience without replacing its visual identity. The work will make the landing-page system graphic useful and interactive, harmonize button behavior across light and dark themes, make brand navigation session-aware, add a restrained pointer-responsive background, and replace the simplified anatomy illustration with a recognizable clinical-atlas SVG.

## Scope

This change covers:

- the public landing-page system orbit;
- global ambient pointer feedback;
- shared button color and interaction states;
- the shared brand link destination;
- front and back anatomy figures and their interactive muscle regions;
- accessibility, responsive behavior, and automated regression coverage for those areas.

It does not introduce Three.js, GSAP, a new visual identity, new application routes, or unrelated page redesigns.

## 1. Interactive Landing Constellation

The current Fuel, Move, and Learn labels become real links:

- Fuel links to `/features/nutrition`.
- Move links to `/features/training`.
- Learn links to `/blog`.

Each node supports hover, keyboard focus, and touch. Activating a node visually emphasizes its associated orbit and changes the center icon, title, and concise supporting line. The center remains a stable summary rather than becoming a separate navigation target.

Pointer-capable devices receive a small, bounded parallax response. The graphic must never chase the cursor, rotate continuously, or shift far enough to affect reading or targeting. Keyboard focus receives the same informational state as hover. Touch users select nodes without depending on hover.

The implementation will isolate state and behavior in a client component while keeping landing-page content and links explicit. The graphic remains understandable with JavaScript unavailable because all three links and their labels remain visible.

## 2. Ambient Pointer Halo

A single fixed, non-interactive presentation layer sits behind page content. It combines low-opacity radial fields from the existing Sage Dusk families:

- sage for the primary field;
- mineral blue for secondary depth;
- restrained ochre for warmth.

Pointer coordinates are exposed through CSS custom properties and updated at most once per animation frame. The halo is broad and low contrast; it must not resemble a spotlight or reduce text contrast. Light and dark modes use the same hue families with different opacity and luminance.

The effect is disabled when `prefers-reduced-motion: reduce` is active, when the primary pointer is coarse, and when pointer tracking is not useful. It uses no GSAP or Three.js dependency.

## 3. Button System

Shared button variants keep their existing structure while receiving coordinated theme tokens.

### Light theme

- Primary: deep forest surface with warm ivory text.
- Primary hover: slightly darker forest with modest elevation.
- Secondary: warm mineral surface, dark ink text, and visible sage-gray border.

### Dark theme

- Primary: fresh sage surface with deep ink text.
- Primary hover: slightly brighter sage, not a different hue.
- Secondary: raised mineral-sage surface with soft light text and a visible border.

All variants retain visible focus rings, a subtle pressed translation, disabled opacity, and at least a 44px target. Color is not the sole indicator of state. The light and dark themes share semantic roles and hue families rather than using unrelated palettes.

## 4. Session-Aware Brand Navigation

The brand links to:

- `/` for unauthenticated visitors;
- `/today` for authenticated users.

These are the application’s existing canonical landing and dashboard routes, so no `/homepage` or `/dashboard` aliases will be added.

Destination resolution belongs in a server-safe helper or server wrapper using the existing Supabase session infrastructure. The presentational Brand component receives the resolved destination and remains reusable in the public header and footer. If authentication cannot be resolved, the safe fallback is `/`.

## 5. Clinical Atlas Anatomy

The current balloon-like silhouette and broad polygonal muscle blocks will be replaced with a purpose-built front and back SVG atlas. The figure should read as a real adult human at first glance while remaining educational rather than graphic.

### Proportions and structure

- approximately 7.5-head adult proportions;
- recognizable skull, jaw, neck, clavicle, rib-cage, waist, pelvis, knees, ankles, hands, and feet;
- natural shoulder-to-hip relationship and continuous limb contours;
- subtle center lines and anatomical landmarks for orientation.

### Muscle rendering

Muscles use paired, anatomically shaped paths where appropriate. The atlas distinguishes pectoral divisions, deltoid caps, upper-arm groups, segmented rectus abdominis, quadriceps masses, tibialis, trapezius, latissimus, triceps, gluteal groups, hamstrings, and gastrocnemius/soleus regions. Regions currently represented by the data model remain the selectable units, even when composed of several SVG paths.

Base muscle colors use muted anatomical terracotta and rose derived to coexist with Sage Dusk. Selected regions use a clearer warm accent with a strong outline; hover and focus use restrained luminance changes. The body ground remains neutral in both themes. No realistic skin texture, gore, or diagnostic claims are introduced.

### Interaction and architecture

The existing anatomy data records, selection API, front/back switcher, information panel, muscle URLs, and keyboard interaction remain intact. Only the visual path definitions and closely related anatomy presentation styles change.

SVG regions remain semantic button-like groups with accessible names, `aria-pressed`, Enter/Space activation, visible focus, and sufficiently forgiving pointer geometry. The layout continues to stack on smaller screens. The SVG renderer stays isolated so it can later be replaced by a Three.js view without changing muscle records or the information panel contract.

## 6. Responsive and Accessibility Behavior

- The constellation scales without clipping at 320px and above.
- Orbit nodes retain 44px minimum interactive targets and do not overlap.
- Pointer effects never create horizontal overflow.
- The anatomy figure preserves aspect ratio and readable selectable regions on mobile.
- Every hover state has a focus-visible equivalent.
- Reduced-motion mode removes parallax and animated halo movement.
- Foreground/background and button contrast meet WCAG AA for normal text.
- Decorative layers are hidden from assistive technology and cannot intercept input.

## 7. Failure Handling

- Missing or unavailable session configuration falls back to the public `/` brand destination.
- An unknown anatomy selection falls back to the first valid muscle for the active view.
- Switching views selects a valid region in that view rather than leaving an invisible selection active.
- Pointer-enhancement failure leaves the static Sage Dusk background fully usable.

## 8. Verification

Implementation verification will include:

- unit coverage for brand-destination resolution;
- interaction tests for constellation links and center-state changes;
- keyboard tests for anatomy selection and view switching;
- checks for reduced-motion and coarse-pointer fallbacks;
- responsive visual inspection at 320, 375, 768, 1024, and 1440px;
- light/dark contrast and hover/focus inspection;
- lint, typecheck, test, and production build;
- browser-console and horizontal-overflow checks on the landing and anatomy pages.

## Self-Review

- No placeholders or unresolved implementation choices remain.
- The design preserves Sage Dusk and the existing canonical routes.
- Motion is progressive enhancement and does not require new animation dependencies.
- Anatomy realism is increased within maintainable SVG scope, while the existing data and interaction contracts remain stable.
- The scope is limited to the user-identified landing, navigation, button, background, and anatomy concerns.
