# Phase 5 — Nutrition and planning design

## Outcome

Add a complete nutrition workflow to the authenticated product without turning the dashboard into a dense analytics screen. A member can search or create food, log it to a meal, understand daily totals, browse practical recipes, arrange a week, and turn planned recipes into a grocery list.

## Experience direction

- Keep Sage Dusk and Guided Daily Canvas: warm neutral surfaces, evergreen structure, mineral-blue information, ochre planning accents, and restrained berry error states.
- Use bars and concise numeric summaries instead of repeated rings.
- Prefer generous two-column desktop layouts and stacked mobile records; never force a calendar table to overflow horizontally.
- Empty states explain the next useful action and never invent user progress.
- English remains primary and Macedonian has matching interface coverage.

## Information architecture

- `/nutrition`: date controls, energy and macro summary, food search, meal sections, recent/favourite/custom food access.
- `/recipes`: searchable recipe library with readable cards and no random stock photography.
- `/recipes/[slug]`: ingredients, steps, time, servings, nutrition estimate, save and plan actions.
- `/meal-planner`: seven stacked day lanes containing breakfast, lunch, dinner and snack slots.
- `/grocery-list`: active list, grouped checkable items, manual additions, and plan-to-list generation.

Desktop product navigation exposes Today, Nutrition, Planner, Progress, Habits and Goals. The compact mobile navigation exposes the most frequent destinations and keeps every remaining area reachable from page-level links.

## Data model and privacy

- `foods` stores local, USDA, and user-created foods. Public/catalogue records are readable by authenticated users; custom records belong to their creator.
- `food_favourites` records private user favourites.
- `meal_entries` stores the selected food name and nutrient snapshot so historical logs do not change when catalogue data changes.
- `recipes`, `recipe_ingredients`, and `recipe_steps` provide the curated recipe catalogue. `saved_recipes` is private.
- `meal_plan_items` stores a private dated slot and optional recipe reference.
- `grocery_items` stores private generated or manual items with a checked state.
- Every private table uses owner-based RLS, foreign-key checks, bounded text, non-negative nutrient checks, indexes, and updated timestamps where applicable.

## FoodData Central adapter

The server calls USDA FoodData Central `/foods/search` only when `USDA_FDC_API_KEY` exists. The key never enters client code. Results are reduced to the fields the UI needs and nutrient values are mapped by nutrient number/name with defensive fallbacks. Failure or missing configuration returns a clear availability state while local and custom food remain usable. The UI credits USDA FoodData Central as the external source.

## Interaction and validation

- Food queries require two characters and are submitted explicitly to avoid wasteful requests.
- Logging requires a valid date, meal slot, positive quantity, and bounded nutrient values.
- Meal and grocery mutations use server actions, authenticated ownership checks, Zod validation, redirects/revalidation, and visible form feedback.
- Grocery generation aggregates exact normalized ingredient/unit pairs. It does not guess conversions between incompatible units.
- Touch targets are at least 44px; all controls have labels and keyboard focus states.

## Responsive behaviour

- At wide sizes the nutrition page uses a main log column and a narrower summary/search rail.
- At tablet and mobile sizes summaries become compact rows, meal cards stack, action rows wrap, and the planner becomes a vertical seven-day agenda.
- Search results and grocery rows wrap their metadata without truncating essential values.

## Testing and completion

- Contract tests cover routes, migration/RLS, navigation, environment isolation and attribution.
- Unit tests cover nutrient normalization, totals, planner dates and grocery aggregation.
- Component tests cover empty/populated summary rendering.
- Type checking, linting, all tests and a production build must pass before phase handoff.

## Deliberate exclusions

Barcode scanning, clinical dietary advice, automated calorie prescriptions, collaborative lists, recipe authoring, payments, Three.js and GSAP are not part of this phase.
