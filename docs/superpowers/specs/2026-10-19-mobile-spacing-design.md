# Mobile spacing and product UI audit

## Goal
Make the current experience easier to scan and operate on phones while preserving the dark/lime identity and existing functionality. The user approved proceeding on 19 October 2026.

## Verified findings
- High: global mobile ordering on .daily-balance moves the demo summary below the habit list. Scope the ordering to the signed-in Today layout.
- High: fitness .planner-day rules collide with meal-planner day cards. Scope training styles to .fitness-page and define the meal planner explicitly.
- Medium: at 390px the demo banner consumes 128.8px, the header sign-up text wraps, and navigation labels disappear. Keep one mobile sign-up action, shorten the banner, and show labels below icons.
- Medium: .product-content and individual page wrappers both add vertical padding. Give page wrappers ownership of page padding and reserve outer bottom padding for mobile navigation.
- Medium: responsive and compact product styles load before older feature styles, which overwrite them. Load product refinements and responsive rules after the base feature styles.
- Medium: demo nutrition inherits marketing presentation and training inherits a tilted marketing card. Use flat, compact product cards.
- Medium: the progress plot has no visible numeric scale or date context and stretches vertically on phones. Add localized latest-measurement context, visible range/date labels, and a bounded plot height.

## Design decisions
Keep 16px phone gutters, 24px section spacing, 16–20px card padding and at least 44px interaction targets. Application headings use sentence case and a restrained 28–40px scale. Completed habits use icons and a soft background inside one grouped card. Demo Today shows summary before habits; desktop uses two columns. Nutrition groups totals/macros separately from meals. Charts show values and dates without interpreting weight change as good or bad.

## Scope and limits
Visually inspect all four demo pages at 390px and 1280px, then check 320px, 768px, light/dark themes, and Macedonian. Apply shared layout fixes to signed-in Today, habits, goals, nutrition, meal planning, training, and progress. Private pages are inspected structurally; do not create live user health records to test layout. Keep auth and Appwrite unchanged.

## Acceptance
No horizontal document overflow; readable navigation labels; banner under 100px at 390px; both Today cards enter the first 844px; no tilted interactive training card; localized chart labels and history remain available. Check existing component behavior, typecheck, lint and the full test suite. Save before/after browser captures in ignored test-results/ui-audit.

## Verification results
- Production build: passed with the configured Google Fonts downloaded. Screenshots use the production server and real font assets.
- Unit/component tests: 369 passed; contract tests: 71 passed; typecheck and lint passed.
- Browser checks: 64 scenarios across the four demo routes, 320/390/768/1280px, English/Macedonian, light/dark. No horizontal overflow or runtime errors. Eight WCAG A/AA scans (four routes in both themes) reported no violations.
- At 390px in English, banner height changed from 128.8px to 69px. Heading top moved from 269px to 183.6px, showing useful content about 85px earlier. Both Today cards enter the initial viewport.
- Planner CSS fixture checks passed at 320/768/1000/1280px, including tablet rows, desktop meal columns, training isolation, outer padding and four mobile navigation columns. These are class/layout fixtures, not authenticated end-to-end tests with personal records.
- Independent diff review: no actionable findings.
- Scope limit: protected workflows were inspected structurally and with layout fixtures; no live personal health records were created.
- Public/auth regression smoke checks: 15 passed across home, blog, anatomy, nutrition feature and sign-in at 320/768/1280px, without horizontal overflow.
