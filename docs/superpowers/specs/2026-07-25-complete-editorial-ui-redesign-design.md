# B Fit & Healthy Complete Editorial UI Redesign

**Status:** Design approved in browser review; consolidated specification pending final approval  
**Date:** 2026-07-25  
**Direction:** Balanced Daily Canvas  
**Primary language:** English  
**Technology:** Existing Next.js application and current backend architecture

## 1. Purpose

This redesign brings every public, authentication, knowledge, anatomy, and signed-in product route into one coherent system. It resolves the current oversized interface, excessive blue dark mode, inconsistent spacing, bloated dashboards, slow-feeling navigation, weak discovery pages, and uneven responsive behaviour.

The redesign is systemic rather than a replacement template. Existing product capabilities, data ownership, authentication, tracking, planning, and AI-draft safeguards remain intact.

## 2. Approved Experience Principles

1. **Balanced Daily Canvas:** the primary task owns the page; supporting context is quieter and spatially subordinate.
2. **Expressive editorial character everywhere:** confident typography and concise language apply to dashboards, forms, tables, navigation, articles, and public pages—not only marketing.
3. **Controlled physical scale:** editorial does not mean oversized. Product H1s, controls, cards, and page padding are reduced from the current implementation.
4. **Neutral foundations with restrained sky blue:** sky blue communicates action, selection, progress, focus, and a small amount of atmosphere. It does not tint every surface.
5. **Theme parity:** light and dark modes use matching semantic roles, hierarchy, component geometry, and status meanings.
6. **Immediate interaction:** clicks acknowledge within 100 ms, the shell remains stable, and useful loading structure appears before slower data.
7. **Progressive disclosure:** pages reveal useful depth without presenting every tool at equal visual priority.
8. **Accessible baseline first:** semantic HTML, keyboard access, focus visibility, reduced motion, touch usability, and readable contrast are requirements rather than later enhancements.

## 3. Current Problems Being Corrected

- Product headings reach approximately 72 px and some public headings reach approximately 80 px, producing a zoomed-in feeling.
- Large card padding, feature radii, controls, and full-width panels consume excessive vertical space.
- Dark mode is composed from blue-tinted page, card, border, and control surfaces, so hierarchy collapses into one blue field.
- Light and dark modes do not always share comparable semantic color roles.
- Dashboard pages overuse nested panels and side rails.
- Cards, forms, empty states, and buttons differ in size and treatment between feature areas.
- Article pages need stronger reading measure, paragraph spacing, section rhythm, and related-content separation.
- Recipe discovery contains only three local recipes, effectively one per major meal category.
- Training provides exercise and workout-management tools but lacks a useful ready-made workout inspiration layer.
- Route changes can feel frozen for one to two seconds because the product layout and pages repeat account reads, use dynamic rendering broadly, and wait for secondary data.
- Only a global loading state exists, so route-specific transitions lack meaningful structure.
- Several signed-in pages need a consistent skip-link and main-landmark contract.

## 4. Typography

### 4.1 Typeface

Use **Source Sans 3** through `next/font` as the primary UI and editorial family. It preserves the clarity the user likes in Roboto while feeling warmer and less generic.

Retain a monospace family only for compact precision data where alignment materially helps: measurement values, timestamps, set counts, and chart labels. It must not become a general stylistic accent.

### 4.2 Weight and hierarchy

- Display and page H1: weight 500
- Section headings: weight 500 or 600
- Card titles: weight 600
- Body: weight 400
- Navigation, labels, and buttons: weight 600
- Eyebrows and compact status labels: weight 700

### 4.3 Target scale

The precise values may use fluid clamps, but must remain inside these bounds:

| Role | Desktop | Mobile |
|---|---:|---:|
| Public display | 48–64 px | 38–44 px |
| Product page H1 | 36–44 px | 30–36 px |
| Feature heading | 28–36 px | 25–30 px |
| Section H2 | 24–30 px | 22–26 px |
| Card H3 | 17–21 px | 17–19 px |
| Body | 16–18 px | 16 px |
| Supporting copy | 14–16 px | 14–15 px |
| Label/caption | 12–14 px | 12–14 px |

Product headings should normally fit within two lines and should not dominate the first viewport.

### 4.4 Reading rhythm

- Long-form body line-height: approximately 1.7
- Product body line-height: approximately 1.5–1.6
- Article measure: 62–68 characters
- Paragraph-to-paragraph space: one clear body rhythm unit
- Section breaks: visibly larger than paragraph breaks
- Heading margins come from shared flow rules rather than isolated page overrides

## 5. Color and Theme System

Final implementation must use semantic custom properties. Exact contrast-adjusted values can change slightly during QA, but the intended palette is:

### 5.1 Light — Soft Paper

| Token role | Direction |
|---|---|
| Page background | warm neutral `#F3F4F1` |
| Primary surface | soft paper `#FBFCFA` |
| Raised surface | white `#FFFFFF` |
| Primary text | ink `#18221F` |
| Secondary text | muted ink `#5D6964` |
| Border | quiet neutral `#D3D9D5` |
| Strong border | `#B9C3BD` |
| Brand/action | sky `#347FA8` |
| Brand hover | deeper sky `#28698D` |
| Brand soft | `#E2F1F8` |
| Secondary accent | sage `#5E8C76` |
| Warm accent | clay `#B97D4D` |

### 5.2 Dark — Neutral Ink

| Token role | Direction |
|---|---|
| Page background | near-neutral ink `#10161A` |
| Primary surface | charcoal `#161D22` |
| Raised surface | `#1C252C` |
| Primary text | `#EEF3F5` |
| Secondary text | `#AEB8BF` |
| Border | `#303A42` |
| Strong border | `#46545E` |
| Brand/action | sky `#78C9EF` |
| Brand hover | pale sky `#98DBF7` |
| Brand soft | `#1B3441` |
| Secondary accent | muted sage `#83B79B` |
| Warm accent | soft clay `#D19A6B` |

Dark mode is not a blue page. A low-opacity blue radial halo may appear in selected hero or application-shell backgrounds, capped at roughly 8% visual opacity. Neutral surfaces must remain dominant.

### 5.3 Semantic rules

- Primary buttons use sky with dark ink text in both themes when contrast permits.
- Secondary buttons use neutral surfaces and defined borders, never yellow-beige fills.
- Danger, warning, success, and information retain distinct semantic colors.
- Status is communicated by icon, label, or structure in addition to color.
- Hover states change border, surface, or elevation subtly; they do not introduce unrelated hues.
- Focus rings use a high-contrast sky outline with separation from the component edge.

## 6. Geometry and Spacing

### 6.1 Shared tokens

- Content shell: 1180 px maximum
- Marketing reading shell: narrower where appropriate
- Page horizontal edge: 16 px mobile, 24 px tablet, 32 px desktop
- Spacing rhythm: 4, 8, 12, 16, 24, 32, 48, and 64 px
- Standard card radius: 13 px
- Feature container radius: 16–18 px
- Button/input radius: 9 px
- Standard control height: 40 px
- Touch target minimum: 44 by 44 px
- Compact card padding: 16–20 px
- Feature panel padding: 20–28 px

The system should reduce random margins, one-off paddings, excessive pills, and deep card nesting.

### 6.2 Layout principles

- Align page headings, main content, and supporting rails to the same shell grid.
- Use one main content column plus a quieter context rail only when the rail adds immediate value.
- Stack rails into normal document flow below 1024 px unless the content remains comfortably readable.
- Avoid empty full-width panels whose content occupies only a small portion of the container.
- Empty states should be smaller than populated feature panels and always identify the next useful action.

## 7. Shared Components

### 7.1 Navigation

- Public and product logos link to `/` for signed-out users and `/today` for authenticated users.
- Public navigation includes a visible sign-in path and clear paths to features, anatomy, knowledge, and about.
- Product desktop navigation remains in the persistent shell.
- Mobile product navigation prioritizes Today, Nutrition, Training, and More in a compact bottom bar; secondary destinations live in More.
- Active, hover, focus, and pressed states share one pattern.
- Navigation acknowledges activation immediately and remains visible through route transitions.

### 7.2 Buttons

- Primary, secondary, quiet, danger, and icon-button variants share geometry.
- Standard buttons are 40 px high; icon-only touch targets remain at least 44 px.
- Labels use concise action language.
- Disabled states communicate through opacity plus cursor and semantic attributes.
- Icon and text alignment is standardized.

### 7.3 Cards and panels

- A card represents one coherent object or action; it is not a default wrapper for every section.
- Panel hierarchy comes from surface, border, and spacing before shadows.
- Shadows are reserved for overlays and a small number of raised highlights.
- Hover elevation is subtle and used only for interactive cards.

### 7.4 Forms

- Visible labels are required.
- Help, validation, error, and success text occupy predictable positions.
- Search fields have clear submit and clear behaviours.
- Form rows collapse intentionally on mobile.
- Destructive actions require appropriate confirmation.

### 7.5 Tables and data

- Desktop tables use compact rows and aligned numeric values.
- Mobile tables either scroll inside a labelled region or recompose into cards, selected per use case.
- Charts, progress bars, and measurements have textual equivalents.

### 7.6 Empty, loading, and error states

- Empty states explain why the area is empty and provide one useful action.
- Route skeletons resemble the destination rather than generic pulsing blocks.
- Errors preserve existing user input when possible and provide recovery.
- Provider failures never remove the curated core content.

## 8. Page Architecture

### 8.1 Public and account routes

Applies to `/`, `/features`, feature detail pages, `/about`, `/contact`, `/states`, legal pages, sign-in, sign-up, magic link, password recovery, reset, and offline.

- Keep the expressive editorial voice within the approved scale.
- Use shorter, clearer marketing copy and fewer competing calls to action.
- Make sign-in discoverable from the landing navigation.
- Keep theme and language controls compact.
- Auth pages use a focused card or split composition without oversized empty decoration.
- Legal and state pages use a readable document layout rather than marketing cards.

### 8.2 Blog and knowledge

Applies to `/blog` and `/blog/[slug]`.

- Blog landing opens with a useful explanation of what the library covers.
- Provide category, topic, and search discovery without overloading the header.
- Article cards show topic, title, useful summary, and reading time.
- Article pages use a 62–68 character reading measure, strong paragraph rhythm, meaningful subheadings, and visually separated callouts.
- Educational disclaimers remain visible but do not interrupt paragraph flow.
- Related articles appear after the article body with sufficient separation.
- Save, back, and related actions use shared controls.

### 8.3 Anatomy

Applies to `/anatomy` and `/anatomy/[muscle]`, with links from training and exercise education.

- Retain the clinical athletic SVG atlas as the accessible baseline.
- Improve anatomical proportions and muscle contours without pretending the temporary SVG is a 3D medical model.
- Front/back switching remains above the figure.
- Hover, focus, selected, and touch states share one semantic highlight.
- Muscle information includes function, benefit, training guidance, common mistakes, and related exercises.
- On mobile, the information panel follows the figure.
- Keyboard users can select every available muscle region.
- Future Three.js rendering remains an optional progressively enhanced layer and never replaces the SVG fallback.

### 8.4 Today — Balanced Daily Canvas

- Use a compact greeting and date, not a full-viewport display heading.
- Present one next useful action as the primary panel.
- Consolidate remaining energy, protein, movement, and hydration into a compact Daily Balance module.
- Place the day timeline beneath the primary action.
- Limit the context rail to genuinely useful nudges and connected summaries.
- AI Coach is introduced as a clear next action, not a bland advertisement card.
- Empty data does not create large vacant containers.

### 8.5 Nutrition and planning

Applies to `/nutrition`, `/meal-planner`, `/grocery-list`, `/recipes`, and recipe details.

- Nutrition prioritizes daily meals and the food-logging task.
- Meal sections become compact ledger rows/cards rather than large repeated panels.
- Search and custom-food creation share a clear task hierarchy.
- Meal planner uses a scannable week structure that adapts to mobile.
- Grocery list groups items and keeps completion controls touch-friendly.
- Recipe discovery and detail behaviour follows Section 9.

### 8.6 Training

Applies to `/training`, planner, workouts, workout creation/edit/detail, sessions, exercise library/detail, history/detail, and personal records.

- Training opens with the next planned workout or a useful suggested plan.
- The page includes ready-made workout inspiration before management utilities.
- Weekly planner, personal workouts, exercise library, history, and records remain discoverable but visually secondary.
- Builder and session pages prioritize the active set, exercise order, progress, and save state.
- Exercise detail connects movement instructions, safety, anatomy, and suitable workout ideas.
- History and records use compact data presentations rather than oversized empty panels.
- Workout discovery behaviour follows Section 10.

### 8.7 Progress, goals, habits, notifications, onboarding

- Progress presents trends before data-entry forms where data exists.
- Weight entry and history use compact cards and a useful baseline empty state.
- Goals and habits prioritize active items and the next check-in action.
- Notifications use a readable list with clear read/unread status.
- Onboarding uses short steps, visible progress, and reversible choices.

### 8.8 AI Coach

- Preserve the focused conversation with compact context rail and visible draft cards.
- Conversation owns the main column; context is supportive rather than equally dominant.
- Suggested prompts remain compact and contextual.
- Draft changes remain review-only until the user confirms each action.
- Context disclosure continues to show profile, goals, preferences, today’s records, and summarized 30-day trends.
- Composer height, button size, and empty conversation space are reduced.

## 9. Recipe Discovery and Data

### 9.1 Curated core

Increase the authoritative local catalogue from three recipes to approximately 24 initial recipes:

- At least 5 breakfasts
- At least 5 lunches
- At least 6 dinners
- At least 4 snacks
- Remaining entries may cover prep-ahead, plant-forward, or high-protein needs

Every curated recipe includes:

- English title and summary
- Appropriate Macedonian translation or a deliberate English fallback policy
- Meal type and useful tags
- Prep and cook time
- Servings
- Ingredients and method
- Energy, protein, carbohydrate, fat, and fibre values
- Source/provenance and review state

Nutrition values must not be invented casually. Seeded values need a documented derivation or an explicit “estimated” label.

### 9.2 Discovery interface

- Search by title or ingredient
- Filter by meal type, total time, dietary preference, and useful nutrition goal
- Several visible results per category
- Clear total-result and empty-filter states
- Compact cards with time and key nutrition visible without hover
- Recipe details provide save and add-to-planner actions

### 9.3 Provider strategy

Core recipe functionality does not depend on a free external API.

An optional server-side provider adapter may use TheMealDB for inspiration/search only after deployment terms and attribution are accepted. Its development key is not treated as an unrestricted production guarantee, and external recipes are not represented as verified nutrition. Provider content is normalized, labelled, time-limited, cached only as permitted, and removed cleanly when unavailable.

No new `.env.example` file will be added. Actual secrets remain in the existing local and deployment environment configuration.

## 10. Workout Ideas and Exercise Data

### 10.1 Curated workout ideas

Provide approximately 12–16 adaptable workout templates across:

- Beginner full body
- Lower-body foundations
- Push/pull fundamentals
- At-home bodyweight
- Dumbbell-only
- Short 15–20 minute sessions
- Mobility and desk-day movement
- Core and carry
- Low-energy/recovery movement

Every idea includes duration, difficulty, goal, equipment, exercise order, set/rep or time guidance, rest guidance, and safety notes.

Users can preview an idea, add a copy to My Workouts, customize it, and schedule it. Provider records are never inserted directly into an active workout without user review.

### 10.2 Exercise enrichment

The existing local exercise catalogue remains the stable source for app-native anatomy links, translations, safety copy, and workout templates.

The wger public exercise API may extend exercise discovery through a server-side adapter. Its data is normalized, attributed, cached according to its licence and API guidance, and isolated behind timeouts and local fallbacks. The adapter must not make session creation dependent on the external service.

## 11. Performance Architecture

### 11.1 Interaction budgets

- Visible press/active feedback: under 100 ms
- Route-specific loading structure: under 150 ms
- Warm primary route useful content target: approximately 500 ms
- Warm production p75 target: no more than 750 ms for primary signed-in routes under normal conditions
- No blank or visually frozen route transitions

### 11.2 Server and data work

- Remove broad dynamic rendering where it is not required.
- Memoize authentication and profile reads per server request.
- Avoid repeating the same account reads in both product layout and page.
- Fetch independent page repositories in parallel.
- Defer or isolate notifications, trends, and context-rail data when they do not block the primary task.
- Cache stable local catalogues and permitted provider responses.
- Enforce short external-provider timeouts and return curated fallbacks.

### 11.3 Rendering and navigation

- Keep the product shell persistent.
- Add route-group and route-specific `loading.tsx` structures.
- Use Suspense boundaries for secondary page regions.
- Retain server components by default.
- Limit client JavaScript to direct interaction needs.
- Use framework prefetching for primary links and intent-based warming where measurement shows benefit.
- Ensure fonts are loaded through `next/font` and images use appropriately sized, optimized delivery.

### 11.4 Measurement

Instrument client route intent, loading-state visibility, and useful-content completion. Add repeatable navigation checks so perceived regressions are caught before deployment.

## 12. Responsive Behaviour

### 12.1 Breakpoint outcomes

| Width | Required composition |
|---|---|
| 320 / 375 px | Single column, 16 px edge, compact header, bottom primary product nav |
| 480 px | Single column with wider cards and comfortable form controls |
| 768 px | Two-column discovery where useful; side rails enter document flow |
| 1024 px | Full primary navigation and balanced two-column canvas |
| 1280 / 1440+ px | 1180 px maximum content shell; no uncontrolled empty expanses |

### 12.2 Responsive rules

- No horizontal page scrolling.
- Filters may horizontally scroll only inside a labelled filter region when wrapping would be less usable.
- Recipe and workout cards use four columns on wide desktop, two on tablet, and one on phone as content permits.
- Tables intentionally scroll or recompose.
- Modals become safe full-height sheets on small screens.
- Anatomy details stack after the figure.
- AI Coach context and conversation history collapse into accessible drawers or document sections.
- Sticky elements must not cover focused controls or mobile browser UI.

## 13. Motion and Atmosphere

- Ambient pointer halo may operate across page backgrounds only on fine-pointer devices.
- It must be subtle, theme-aware, and never compromise text contrast.
- Standard interface transitions: approximately 140–220 ms.
- Motion reinforces state, hierarchy, or spatial continuity.
- Avoid decorative blocking animation, excessive parallax, and persistent looping motion.
- Reduced-motion mode removes shimmer, parallax, 3D rotation, animated scrolling, and nonessential transforms while preserving instant state changes.

## 14. Accessibility Contract

- Exactly one page H1 and a logical heading sequence.
- A visible-on-focus skip link targets a valid main landmark on every route shell.
- Semantic navigation, main, aside, section, form, table, and list structures.
- Persistent form labels and programmatic error associations.
- Keyboard access for navigation, dialogs, filters, anatomy, builders, and coach draft review.
- Visible focus in both themes.
- WCAG AA text and component contrast.
- Minimum 44 px touch targets where direct touch interaction is expected.
- Textual equivalents for charts, progress, muscle selection, and status.
- Live regions only for meaningful asynchronous changes.
- Reduced-motion support.

## 15. Content and Internationalization

- English remains the primary language.
- Existing Macedonian support remains functional.
- New content must not ship as mojibake or partially corrupted translation text.
- Where an approved Macedonian translation is unavailable, use an explicit fallback strategy rather than malformed content.
- Buttons use direct verbs and avoid vague labels.
- Health and training guidance remains educational and avoids diagnosis or guarantees.

## 16. Implementation Boundaries

- Preserve Next.js, TypeScript, Supabase, and the current production architecture.
- Do not replace the application with an unrelated template.
- Do not remove working routes or tracking functionality.
- Do not add a dependency merely for visual styling.
- Three.js remains a progressive anatomy enhancement architecture; the SVG atlas remains required.
- GSAP or other motion tooling is used only if the implemented interaction cannot be delivered cleanly with existing primitives and the dependency cost is justified.
- No commits will be created by Codex; the user will review and commit.
- Do not create `.env.example`.

## 17. Verification

### 17.1 Automated

- Type checking
- Linting
- Production build
- Existing unit/integration tests
- Route and navigation tests
- Accessibility checks for landmarks, names, focus, and contrast-sensitive states
- API adapter timeout and fallback tests
- Recipe/workout normalization tests
- Reduced-motion behaviour tests where practical

### 17.2 Visual and interactive

Review all routes at 320, 375, 480, 768, 1024, 1280, and 1440+ px in both themes. Verify:

- typography scale and paragraph rhythm
- page margins and internal padding
- navigation and active states
- buttons, inputs, cards, tables, dialogs, and empty states
- anatomy front/back, hover, focus, touch, and selection
- recipe search/filter/detail/planning paths
- workout discovery/preview/copy/customize paths
- coach conversation and draft-confirmation flow
- loading, error, offline, and provider-failure states
- browser console and avoidable hydration/runtime errors

### 17.3 Completion criteria

The redesign is complete only when every route uses the shared system, dark mode is predominantly neutral, light/dark roles match, typography is controlled, navigation feels immediate, content remains usable without external providers, and common mobile widths have no overlap or horizontal page scrolling.

## 18. Delivery Sequence

1. Establish tokens, typography, shell geometry, and shared primitives.
2. Correct persistent public/product navigation and route-transition behaviour.
3. Redesign public, authentication, blog, and article routes.
4. Redesign Today and shared product-page structures.
5. Redesign nutrition, meal planning, grocery, and recipe discovery/detail.
6. Redesign training, workout ideas/builders/sessions, exercises, history, and records.
7. Redesign progress, goals, habits, onboarding, notifications, and AI Coach.
8. Refine the SVG anatomy atlas and responsive interaction.
9. Add optional provider adapters and safe fallbacks.
10. Complete cross-route responsive, accessibility, performance, and visual QA.

