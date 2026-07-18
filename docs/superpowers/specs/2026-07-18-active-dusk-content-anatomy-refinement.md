# Active Dusk, Editorial Blog, and Anatomy Preview Refinement

**Status:** Approved on 18 July 2026

## Objective

Polish the approved B Fit & Healthy visual direction without replacing its layout system. Correct the light-mode discoloration, make dark mode more lively through an Active Dusk palette, turn Blog posts into useful and readable editorial pages, and replace the Training page's balloon-like anatomy shortcut with a recognizable lightweight human figure.

## Constraints

- Keep the existing HTML, CSS, and vanilla JavaScript architecture.
- Do not add React, Three.js, GSAP, a build system, or third-party UI libraries.
- English remains the primary language; Macedonian translations retain exact key parity.
- Preserve existing routes, search, filters, bookmarks, Training links, and Anatomy explorer behavior.
- Use gradients as atmospheric page and feature treatments, not on every control or card.
- Respect keyboard navigation, touch targets, reduced motion, and existing responsive breakpoints.

## Active Dusk Dark Theme

Dark mode moves from nearly monochromatic pine surfaces to a coordinated cobalt-led system:

- Base background: deep cobalt `#0D1830`.
- Background gradient: large cyan/teal field at the upper-right, restrained burnt-orange field at the lower-left, and a cobalt-to-violet linear foundation.
- Primary surface: midnight cobalt `#17274A`.
- Raised surface: blue slate `#1B2B50`.
- Training surface: deep emerald `#16453F`.
- Nutrition surface: burnt umber `#4A2B25`.
- Blog surface: dark violet `#2C2858`.
- Assistant surface: deep cyan `#143E51`.
- Primary action: fresh mint `#5EE6A8`.
- Supporting accents: cyan `#56C9E8`, warm orange `#F5A258`, coral `#F27C75`, violet `#B59CF2`.

Text remains near-white and secondary text remains cool blue-gray. The saturated colors identify product areas and important states; routine cards retain stable, readable surfaces. Shadows use blue-black rather than neutral black, and borders become cool translucent blue.

The page background gradient is static. The existing pointer halo may softly shift the atmospheric field, but it must not create a spotlight, obscure text, or remain enabled for coarse pointers or reduced motion.

## Light-Mode Compositing Cleanup

The light palette remains Warm Sage. The muddy discoloration is treated as a compositing defect rather than a reason to replace the palette.

- Remove the hero card's independent radial bloom in light mode.
- Reduce the pointer halo's light-mode saturation, opacity, and blur footprint.
- Keep the pointer halo behind all page content and disable it for reduced motion and coarse pointers.
- Give status chips opaque or near-opaque pale surfaces with dark semantic text; avoid neon text on translucent gray-green.
- Retain one subtle sage-to-mineral hero surface transition only where contrast remains stable.

## Blog Information Architecture

The Blog index keeps its lead-story and supporting-story composition. Individual posts become structured editorial pages rather than short paragraph stacks.

Each article record gains structured sections while retaining its existing title, category, excerpt, read time, and bilingual content. The renderer supports:

- a short standfirst;
- a three-item key-takeaway panel;
- multiple titled sections;
- paragraphs and concise bullet lists;
- an optional practical example or callout;
- a closing summary;
- the existing educational disclaimer, related posts, bookmark action, and return link.

The article column stays approximately `68ch` wide. Body copy uses relaxed line height, headings receive predictable vertical separation, and lists/callouts align to the reading column. On mobile, the bookmark control wraps below metadata, takeaway padding decreases, and no content touches the viewport edge.

The progressive-overload article becomes the reference implementation and explains what overload is, which variables can progress, how to choose one variable, a beginner example, signs progression is premature, and a practical next-session checklist. Other article records receive enough structured content to avoid inconsistent empty-looking pages.

## Training Anatomy Preview

The Training coverage card keeps its role as a compact gateway into the full Anatomy explorer. Its SVG is replaced with a proportioned front-view anatomical schematic:

- recognizable head, neck, shoulder width, ribcage, waist, pelvis, upper/lower arms, thighs, knees, calves, and feet;
- bilateral symmetry with visible muscle divisions rather than one merged body blob;
- individually styled chest, deltoids, abdominals, quadriceps, and lower-leg regions;
- restrained muscle highlighting using Training's emerald/cyan accents;
- an accessible text label and unchanged link to `#/anatomy?view=front`.

The preview is intentionally illustrative, not a simulated 3D model. It remains separate from `anatomy.js` so it can later be replaced without coupling it to the interactive explorer. The full Anatomy explorer retains its front/back controls, keyboard selection, touch use, muscle details, and exercise links.

## Feature Surface Mapping

In dark mode, major feature containers receive stable semantic classes:

- Training: emerald-tinted surfaces and cyan detail accents.
- Nutrition: umber-tinted surfaces and warm-orange detail accents.
- Blog: violet-tinted surfaces and lavender detail accents.
- Assistant: cyan-tinted surfaces and coral/mint conversational accents.

Color supplements labels and icons; it never becomes the sole carrier of meaning. Buttons, fields, borders, typography, spacing, and focus behavior remain shared across all features.

## Responsive and Accessibility Requirements

- No horizontal scrolling at 320, 375, 480, 768, 1024, 1280, or 1440 pixels.
- Article content, takeaway panels, and anatomy preview stack cleanly below tablet width.
- Interactive controls retain a minimum 44-pixel target where practical.
- Focus indicators remain visible against every feature surface.
- Text and interactive color pairings meet WCAG AA contrast.
- Decorative SVG geometry is hidden from assistive technology; the Training link provides the accessible name.
- Reduced-motion mode removes pointer-following motion and shortens transitions.

## Verification

- Contract tests verify the Active Dusk tokens, page gradient, light-mode bloom removal, semantic feature surfaces, structured article schema/renderer, and multi-part Training anatomy SVG.
- Existing UI and anatomy data tests remain green.
- Every JavaScript file parses successfully.
- A browser viewport audit checks all primary routes at the seven target widths and both color modes.
- Visual review confirms the light hero has no muddy bloom, dark surfaces are differentiated without neon overload, Blog posts have readable depth, and the Training figure is recognizably human.
