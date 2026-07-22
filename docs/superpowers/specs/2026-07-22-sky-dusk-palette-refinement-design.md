# Sky Dusk palette refinement

## Decision

Adopt the approved **A — Sky Dusk** palette shown in the visual comparison. This is a shared-token refinement, not a component or layout redesign.

## Light mode

- Use a softly cooled neutral background (`#f3f6f8`) with near-white blue-neutral surfaces.
- Set the primary brand to natural sky blue (`#287eac`) and the primary action to the deeper accessible blue (`#176b95`).
- Replace cream/yellow secondary controls with mineral-blue surfaces (`#e5eef3`), blue-grey borders, and deep blue-grey text.
- Shift supporting borders, muted text, focus, logo, shadows, pointer halos, and the page gradient into the same sky/slate family.

## Dark mode

- Use blue-charcoal backgrounds and surfaces (`#13232d` and `#1e333f`) rather than green-black.
- Use a brighter sky accent (`#75c5e9`) and a pale cyan primary action with dark text.
- Use slate-blue secondary controls with cool borders and near-white text.
- Keep the dark background lively through restrained sky and mineral radial gradients.

## Supporting accents

- Ochre remains available only for chart, warning, or planning context.
- Secondary buttons must never use ochre, cream, tan, or yellow-toned tokens.
- Clay remains a small complementary status/data accent, and anatomy muscle colors remain distinct from the brand.

## Scope and accessibility

- Modify only shared color tokens and palette documentation.
- Preserve typography, spacing, layout, content, routes, responsive behaviour, and functionality.
- Maintain clear focus visibility and WCAG AA contrast for button text.
- Do not add dependencies or perform Git operations.

## Verification

- A contract test asserts the approved light/dark brand and secondary-button tokens.
- Run all tests, TypeScript, lint, and the production build.
- Restart the production server on port 3000 and verify public/protected route behaviour.
