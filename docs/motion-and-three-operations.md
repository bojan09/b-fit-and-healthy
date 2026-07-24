# Motion and Three.js Operations

## Current production state

Phase 9 uses GSAP for restrained, client-only sequences. The accessible SVG atlas remains the active Anatomy renderer because the repository has no commercially licensed clinical 3D model. Three.js is installed and isolated behind a dormant renderer boundary; it is not requested by the browser while the asset manifest is `null`.

Do not replace the null manifest with a guessed URL, procedural body, sample mannequin, or asset whose commercial rights are unclear.

## Motion profiles

The motion layer resolves one of three profiles:

- `full`: fine pointer, visible document, no data saver or reduced-motion preference, and no known low-power hint.
- `limited`: coarse pointer, data saver, hidden document, fewer than four logical processors, or known device memory below four GiB.
- `reduced`: `prefers-reduced-motion: reduce`; this always overrides other signals.

CSS retains ordinary hover and focus feedback. GSAP is dynamically imported only by coordinated motion boundaries. Every boundary must revert its match-media scope on unmount.

## Enabling a future clinical model

A model can be evaluated only after all of the following are available:

1. A `.glb` or `.gltf` file served from a root-relative path or HTTPS URL.
2. A licence that explicitly permits commercial product use.
3. A stable licence URL and required attribution.
4. Named meshes for each supported muscle group.
5. A mapping from existing application muscle IDs to unique model mesh names.
6. A model version that can be pinned and audited.

The manifest must validate through `anatomyAssetManifestSchema`. Unknown muscle IDs, duplicate mesh ownership, missing attribution, non-model URLs, or any value other than literal `commercialUseAllowed: true` must fail closed to SVG.

Before activating a manifest, review polygon count, texture dimensions, compressed transfer size, decoded memory, mobile load time, visual accuracy, mesh naming, front/back selection, and the licence record.

## Renderer behavior

Three.js eligibility requires a validated licensed manifest, full motion capability, WebGL2, and a visible document. Reduced motion, coarse pointer, data saver, known low-power conditions, or any loader failure retain SVG without exposing raw errors.

Future WebGL implementation must:

- Cap device-pixel ratio at 1.75 on desktop and 1.25 on mobile.
- Pause the animation loop when hidden or offscreen.
- Call `renderer.setAnimationLoop(null)` before teardown.
- Dispose unique geometries, materials, textures, skeletons, render targets, controls, render lists, and the renderer.
- Remove resize, pointer, visibility, and observer subscriptions.
- Keep HTML search, filters, muscle directory, detail panel, and keyboard controls authoritative.

## Verification

Without a manifest:

1. Open browser developer tools on `/anatomy`.
2. Filter Network requests for `three`, `.glb`, and `.gltf`.
3. Reload and interact with front/back and muscle selection.
4. Confirm the SVG remains interactive and no Three.js or model request occurs.

For motion cleanup, navigate repeatedly between Landing, Anatomy, Blog, and feature pages. Repeat with both themes, both locales, reduced motion, and a coarse pointer. Confirm there are no console errors, hydration warnings, duplicate sequences, stale inline transforms, hidden content, or delayed links.

If a future renderer fails, leave the manifest disabled, verify SVG operation, inspect the development-only diagnostic, and correct the asset or mapping before attempting reactivation.
