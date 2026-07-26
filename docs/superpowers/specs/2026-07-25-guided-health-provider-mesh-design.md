# Guided Health Path and Provider Mesh Design

Date: 2026-07-25  
Status: Approved design, awaiting implementation-plan approval

## Purpose

Improve two connected parts of B Fit & Healthy:

1. Replace the landing-page orbit graphic with a clearer Guided Health Path and reduce the visual weight of authenticated navbar utilities.
2. Expand food, recipe, exercise, and workout discovery through multiple external providers without making the product slow, fragile, or dependent on any single service.

The implementation must preserve the current Next.js architecture, remain fast when providers are unavailable, and require explicit user confirmation before saving external content.

## Goals

- Make the landing visual explain the product rather than decorate the page.
- Keep account controls compact and understandable.
- Blend curated and external results into one ranked discovery experience.
- Provide more useful food, recipe, exercise, and workout options.
- Keep navigation and local discovery fast.
- Preserve the exact data a user reviewed by importing a private snapshot on confirmation.
- Expose data provenance and completeness without cluttering the interface.
- Degrade gracefully when credentials, quotas, or providers are unavailable.

## Non-goals

- Mirroring complete external datasets.
- Requiring paid providers for core functionality.
- Estimating or inventing missing nutrition values.
- Automatically writing external results to a user's records.
- Replacing the clinical SVG anatomy atlas.
- Building provider-specific user interfaces.
- Proxying or permanently storing external media unless provider terms explicitly allow it.

## Landing Experience

### Guided Health Path

Replace the concentric orbit visual and floating Fuel, Move, and Learn pills with a compact three-step product path:

1. **Fuel** — nutrition and recipe discovery.
2. **Move** — training, workouts, exercises, and anatomy.
3. **Learn** — evidence-aware health knowledge.

The path uses a restrained connector and three clearly ordered steps. One step is visually emphasized as the next useful action. Each step links directly to its destination.

Interaction is purposeful:

- Hover and keyboard focus slightly lift or advance a step.
- The connector may reveal progressively as the section enters the viewport.
- Reduced-motion users receive the final static state.
- Mobile layouts stack the steps vertically with the same reading order.
- The visual never blocks navigation or waits for JavaScript before becoming useful.

### Compact Navbar Utilities

Keep the primary navigation unchanged in meaning while reducing the visual weight of utilities:

- Notification, language, and theme are compact icon or icon-label controls.
- Controls do not use large outlined button boxes.
- The account avatar opens a menu containing the signed-in name, Profile, Settings, and Sign out.
- Sign out is no longer a persistent oversized navbar button.
- Focus, hover, open, and active states remain visually distinct.
- The menu closes on Escape, outside click, route changes, and item activation.
- Touch targets remain at least 44 by 44 CSS pixels even when the visible glyph is smaller.

## Provider Strategy

Use a provider mesh with a curated local catalogue as the dependable base.

### Foods

- **Local catalogue:** instant, curated results and fallback.
- **USDA FoodData Central:** general foods and verified nutrient data.
- **Open Food Facts:** packaged-food barcode lookup and deliberate branded-product searches.

Open Food Facts must not power search-as-you-type because its search limits are unsuitable for that interaction. Barcode lookup is direct and explicit.

### Recipes

- **Local catalogue:** reviewed recipes with complete presentation and known product behavior.
- **TheMealDB:** broader recipe inspiration, ingredients, cuisine, and instructions.

The development key may be used only during development. Public production integration requires a supporter key. Provider recipes without nutrition data must state that nutrition is unavailable.

### Exercises and Workouts

- **Local catalogue:** clinically written exercises, starter workout ideas, and full fallback.
- **wger:** public exercise discovery and metadata.
- **MuscleWiki:** optional richer exercise instructions and video demonstrations when an eligible paid key is configured.

The application must not depend on MuscleWiki. Its direct production and workout endpoints depend on paid tiers. Initial workout ideas remain locally authored and may use normalized exercises from the combined exercise catalogue. Provider workout templates can be added later through the same contract.

## Domain Contracts

Provider-specific response shapes never reach UI components. Server-side adapters normalize them into shared domain models.

Every normalized item contains:

- Internal composite ID.
- Provider name and external ID.
- Item type.
- Display title and normalized title.
- Relevant structured attributes.
- Source URL when available.
- Attribution text.
- Completeness flags.
- Retrieval timestamp.
- Optional media references.
- Optional provider-specific quality metadata.

Type-specific fields include:

- **Food:** brand, serving amount and unit, calories, protein, carbohydrate, fat, fibre, barcode, and nutrient basis.
- **Recipe:** cuisine, category, ingredients, measures, instructions, servings, preparation time when known, image, and nutrition availability.
- **Exercise:** muscles, equipment, difficulty, movement pattern, instructions, safety notes, and media availability.
- **Workout:** goal, duration, difficulty, equipment, exercise prescriptions, and exercise count.

Missing values remain `null` or an explicit unavailable state. Normalizers do not infer health data.

## Search Data Flow

1. Validate, trim, and normalize the query.
2. Search the local catalogue immediately.
3. Select eligible providers based on item type, query kind, and configured credentials.
4. Query eligible providers concurrently with independent abort signals and short timeouts.
5. Normalize successful responses.
6. Deduplicate the combined set.
7. Rank results.
8. Return local results and any external results that completed successfully.
9. Cache the normalized response according to provider and query type.
10. Create a private snapshot only after explicit confirmation.

The browser communicates only with B Fit & Healthy API routes. Provider credentials never enter client bundles.

## Deduplication and Ranking

Deduplication uses the strongest available identifiers:

1. Provider and external ID.
2. Barcode for packaged foods.
3. Normalized title plus brand.
4. Normalized title plus material structured attributes, such as ingredients or equipment and muscles.

Ranking prioritizes:

1. Exact title match.
2. Prefix match.
3. Compatibility with user goals, preferences, equipment, and difficulty.
4. Data completeness.
5. Curated local content.
6. Frequently or recently selected user items.
7. Provider reliability.
8. Approximate text matches.

Ranking must remain deterministic for the same input and context. Provider ordering alone must not determine relevance.

## Performance and Caching

- Require at least two meaningful characters for general external search.
- Debounce client input by approximately 250 to 300 milliseconds.
- Abort obsolete requests when the query changes.
- Render local results before external discovery finishes.
- Query providers concurrently rather than sequentially.
- Give each provider an independent timeout and failure boundary.
- Cache normalized search responses briefly.
- Cache stable provider metadata, such as exercise filters, for longer periods.
- Permit stale cached results during temporary provider failures where safe.
- Lazy-load exercise media only when a user opens the detail view.
- Never call providers during ordinary page navigation.
- Preserve Next.js route prefetching for frequent authenticated destinations.

Open Food Facts search is used only after an explicit branded-product action. Its barcode detail endpoint may be used directly.

## Discovery Interface

Food, recipe, exercise, and workout discovery share one interaction model:

- One primary search field.
- Context-appropriate filters.
- One blended ranked result list.
- Compact source and completeness labels.
- A clear type-specific action.
- Progressive status messaging that does not block local results.

Result summaries expose only information needed for a decision:

- **Food:** name, brand, serving, calories, protein, and source.
- **Recipe:** image where permitted, preparation time, cuisine, ingredient summary, and nutrition availability.
- **Exercise:** target muscles, equipment, difficulty, short instruction summary, and media availability.
- **Workout:** goal, duration, difficulty, equipment, and exercise count.

Labels use consistent meanings:

- **Curated:** reviewed B Fit & Healthy content.
- **Verified nutrition:** nutrient values from an authoritative source.
- **Community data:** externally contributed data that may be incomplete.
- **External media:** media governed by provider terms.
- **Nutrition unavailable:** no supported nutrient data exists.

## Review and Confirmation

Selecting a result opens a compact review sheet or panel. Users can adjust relevant values before confirming:

- Food serving and quantity.
- Recipe portions.
- Exercise sets, repetitions, load, or duration.
- Workout placement and editable exercise prescriptions.

No external result changes user records without explicit confirmation.

On confirmation, the application saves a private snapshot containing:

- Normalized content shown to the user.
- Provider and external ID.
- Source URL and attribution.
- Retrieval timestamp.
- User adjustments.
- Snapshot schema version.

Historical logs reference the snapshot rather than live provider data. Later provider changes therefore do not alter past meals, workouts, or plans.

## Failure Handling

- A failed provider never removes successful local or external results.
- Missing credentials disable only the affected adapter.
- Timeouts and server errors produce a small partial-results notice.
- Rate-limit responses respect `Retry-After` where available.
- Repeated provider failures may temporarily open a circuit breaker.
- Cached data may be served with a freshness label when appropriate.
- Empty searches offer related terms, relevant categories, and local options.
- Client errors never expose provider credentials or raw provider internals.
- Logging records provider, operation, status, latency, and a correlation ID without recording sensitive health queries unnecessarily.

## Accessibility

- Search results use semantic list or grid structures.
- Keyboard users can move through results and activate all actions.
- Loading, partial failure, and result-count changes use restrained live-region announcements.
- Review sheets trap focus only while open and restore focus when closed.
- Source and quality meaning is communicated through text, not color alone.
- Touch targets remain usable on mobile.
- Motion honors `prefers-reduced-motion`.
- The Guided Health Path retains logical DOM order without relying on its visual connector.

## Security and Privacy

- Provider keys remain in server-only environment variables.
- No environment example file is added.
- Query inputs are length-limited and validated.
- API routes require authentication where they access personal context or create snapshots.
- External URLs and media references are validated against provider allowlists.
- User-specific ranking context stays inside B Fit & Healthy infrastructure.
- Snapshot data follows the existing 30-day retention and privacy rules where applicable.

## Testing

### Unit tests

- Provider normalization for valid, partial, and malformed responses.
- Deduplication across identifiers and normalized fields.
- Deterministic ranking.
- Snapshot construction and schema versioning.
- Credential and provider-eligibility decisions.

### Integration tests

- Local-first blended search.
- Provider timeout and partial-success behavior.
- Missing credentials.
- Rate-limit handling.
- Barcode lookup.
- Import-on-confirm and historical stability.
- Authentication and input validation.

### UI tests

- Search debounce and stale-request cancellation.
- Keyboard navigation.
- Filters and empty states.
- Review and confirmation flows.
- Source and completeness labels.
- Compact navbar menu behavior.
- Guided Health Path links and reduced-motion behavior.
- Responsive behavior at common mobile, tablet, and desktop widths.

### Regression checks

- Existing nutrition logging still works.
- Existing workout creation and logging still work.
- Existing recipes and exercises remain available without network access.
- No external call occurs during standard navigation.
- Production build, type checking, linting, contract tests, unit tests, and public Playwright tests pass.

## Implementation Boundaries

Implementation should proceed in small, reviewable groups:

1. Landing Guided Health Path and compact account controls.
2. Shared provider contracts, request utilities, caching, and provenance.
3. Food provider mesh and import flow.
4. Recipe provider mesh and import flow.
5. Exercise provider mesh and workout enrichment.
6. Cross-surface performance, accessibility, and regression hardening.

The work must not be committed automatically. The user will review and commit the changes.
