# Phase 5 — Nutrition and planning implementation plan

1. Add failing Phase 5 contract and domain tests for routes, schema/RLS, navigation, USDA isolation, nutrition totals, planner dates and grocery aggregation.
2. Add the additive nutrition migration and matching generated-style TypeScript database types.
3. Implement the pure nutrition domain, bilingual content, local catalogue and server-only USDA adapter/API route.
4. Implement authenticated repositories, schemas and server actions with ownership validation and cache revalidation.
5. Build `/nutrition` with daily summaries, meal records, food search, custom-food entry and useful empty states.
6. Build `/recipes` and `/recipes/[slug]` with readable content, saved state, ingredients and planning entry points.
7. Build `/meal-planner` as a responsive weekly agenda with recipe and manual meal placement.
8. Build `/grocery-list` with plan-derived aggregation, manual additions and accessible completion controls.
9. Integrate desktop/mobile navigation and the shared Sage Dusk component styles.
10. Run focused tests during each slice, then full contracts, unit/component tests, typecheck, lint and production build. Restart the production server on port 3000 without committing.
