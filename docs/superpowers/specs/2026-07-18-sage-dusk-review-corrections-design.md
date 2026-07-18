# Sage Dusk Review Corrections Design

**Status:** Approved visually on 18 July 2026

## Objective

Correct the reviewed contrast, branding, anatomy, article-spacing, and cross-theme inconsistencies without replacing the approved page composition or vanilla HTML/CSS/JavaScript architecture.

## Confirmed Problems

- The light hero button uses the dark logo-body token for text, producing weak contrast on deep sage.
- The dark hero button uses the light logo-body token for text, producing weak contrast on bright sage.
- The 30-pixel brand mark is visually undersized inside the 64-pixel app bar.
- A hard-coded dark-mode logo override changes the mark into an unrelated pale shape.
- Light mode and the Active Dusk palette use different base hue families, so switching modes feels like changing brands.
- The compact Training anatomy preview has segmented, robotic geometry rather than believable human proportions.
- Article-level stack spacing is too small between the summary, disclaimer, related-post heading, related-post card, and return action.
- Paragraph groups need more vertical separation without making the reading column excessively long or loose.

## Approved Visual Direction

The selected cross-theme direction is **Sage Dusk**. The selected anatomy direction is **Athletic Anatomy**.

### Shared Hue Families

Both themes use the same semantic color families at different lightness values:

| Role | Light mode | Dark mode |
| --- | --- | --- |
| Page background | warm off-white sage `#F4F4EE` | deep forest `#14211C` |
| Surface | soft white `#FCFCF8` | forest slate `#202E27` |
| Raised surface | pale sage `#E9EFE8` | lifted forest `#2A3A31` |
| Brand | deep sage `#397458` | fresh sage `#88C69D` |
| Brand hover | forest `#2D6048` | light sage `#A0D5AF` |
| Ochre accent | `#A8783C` | `#D6AA68` |
| Mineral accent | `#587987` | `#82AEB9` |
| Clay/anatomy | `#A95F55` | `#D98B7D` |

Feature surfaces remain paired by hue:

- Training: `#DCEBE1` light and `#254438` dark.
- Nutrition: `#F0E5D5` light and `#433726` dark.
- Blog: `#E8E3ED` light and `#373142` dark.
- Assistant: `#DDE8EB` light and `#263A40` dark.

Light mode does not embed near-black hero or balance cards. The Today hero uses a pale sage gradient. Dark mode uses a deeper sage gradient. Dark page atmosphere uses broad, low-opacity forest, mineral, and ochre fields over a deep forest foundation; it does not use the cobalt/violet Active Dusk base.

## Button Contrast

Primary buttons use semantic foreground roles rather than logo tokens:

- Light: `#397458` background with white `#FFFFFF` text.
- Dark: `#88C69D` background with deep forest `#10231A` text.
- Hover states use `--brand-hover` in both modes.
- Hero, CTA, form, and ordinary primary buttons share the same foreground pairing.
- Icons inherit the button text color.
- Focus indicators remain visible outside the button boundary.

## Logo and App Bar

- Increase the app-bar brand mark from 30 to 38 pixels on tablet and desktop.
- Use 34 pixels on narrow mobile screens to protect navigation space.
- Keep the wordmark at the current readable scale; the larger mark provides the needed emphasis.
- Light logo: deep sage apple, ochre leaf, white “B”.
- Dark logo: fresh sage apple, lighter ochre leaf, deep forest “B”.
- Remove the selector that hard-codes the first SVG path to pale gray in dark mode.
- Retain the same apple silhouette and leaf geometry in both modes.

## Athletic Anatomy Preview

The compact Training preview becomes a recognizably human athletic illustration:

- Approximately 7–7.5 head body proportions.
- Broader but believable shoulders, tapered ribcage, narrower waist, defined pelvis, natural thigh and calf widths.
- Arms reach approximately mid-thigh; hands and feet are shaped rather than rectangular caps.
- The outer body reads as a continuous silhouette even when regions remain separate SVG paths.
- Deltoids, pectorals, abdominals, quadriceps, and calves receive defined overlays.
- Central and bilateral landmark lines provide anatomical structure without a clinical diagram’s density.
- Light mode uses pale body surfaces with deep-sage outlines and mid-sage muscles.
- Dark mode uses deep body surfaces with fresh-sage/mineral muscle highlights.
- The entire preview remains one accessible link to `#/anatomy?view=front`.
- Decorative SVG geometry remains hidden from assistive technology.
- The compact module remains independent from the full Anatomy explorer so a future Three.js model can replace it cleanly.

## Blog Reading Rhythm

The article column remains capped near `68ch`, but spacing becomes section-aware:

- Standfirst to takeaways: 32 pixels.
- Takeaways to first section: 40 pixels.
- Between main editorial sections: 48 pixels.
- Between paragraphs inside a section: 20–24 pixels.
- Section heading to first paragraph: 16 pixels.
- Article body to educational disclaimer: 40 pixels.
- Disclaimer to related-post section: 40 pixels.
- Related heading to related-post card: 16 pixels.
- Related card to “Back to blog”: 24 pixels.

The article renderer receives a dedicated reading-layout class instead of relying only on the generic `stack-5` composition. On mobile, external section gaps reduce modestly while paragraph separation remains readable. Cards retain balanced internal padding and do not touch adjacent headings or actions.

## Scope and Preservation

- Preserve all routes, filters, search, bookmarks, form behavior, mobile navigation, and full Anatomy explorer interactions.
- Do not add Three.js, GSAP, frameworks, packages, or build tooling.
- Do not redesign Today, Blog, Training, Nutrition, or Assistant compositions beyond the reviewed corrections.
- Keep English as the default and preserve Macedonian content.
- Do not create commits; changes remain in the isolated worktree for user review.

## Verification

- Add test-first contracts for Sage Dusk tokens, paired feature surfaces, button foreground roles, logo sizing, removal of the hard-coded logo override, article rhythm classes, and Athletic Anatomy geometry.
- Run all Node tests and parse every JavaScript file.
- Run `git diff --check`.
- Verify primary button color pairs meet WCAG AA contrast.
- Review Today, Training, Blog, and a full Blog post in both modes at 320, 375, 480, 768, 1024, 1280, and 1440 pixels when a controllable browser is available.
- Keep all implementation changes uncommitted for user review.

