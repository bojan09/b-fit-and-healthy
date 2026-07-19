# B Fit & Healthy Production PWA Architecture Plan

Status: Proposed — explicit approval required before production implementation  
Date: 2026-07-19

## 1. Executive decision

Build the production application at the repository root with Next.js App Router, TypeScript, Tailwind CSS, customized shadcn/ui components, Supabase, and Serwist PWA support. Three.js and GSAP enter only in their approved phase. Keep prototype/ as the approved visual and interaction reference until production parity is accepted; do not port its HTML-string renderer or localStorage repository into production.

The visual source of truth is Sage Dusk, Guided Daily Canvas, and Athletic Anatomy. English remains the default and Macedonian remains a complete secondary locale. The architecture changes; the approved identity does not.

No Git operation is part of any phase. Every phase ends with live review at http://localhost:53271/, a completion report, and an approval stop.

## 2. Repository audit

Present:

- A build-free reference app with 24 route variants covering public, auth, daily, nutrition, training, Anatomy, Blog, assistant, and account experiences.
- Sage Dusk tokens, responsive layouts, shared controls, CRUD dialogs, charts, locale/theme behavior, reduced motion, and ambient halo.
- Six structured bilingual articles.
- Seventeen stable muscle records with front/back SVG interaction and exercise relationships.
- Local meal, workout, measurement, habit, preference, bookmark, recipe, and session persistence.
- 41 passing contract tests and clean JavaScript parsing at this planning baseline.
- Environment variable names for Supabase, Groq, and USDA FoodData Central.

Missing:

- No package manifest, Next.js app, TypeScript, Tailwind, shadcn registry, React component tree, or lockfile.
- No Supabase client, generated types, migrations, seed, RLS, Storage policies, or authenticated queries.
- No real auth, protected routes, OAuth callback, recovery, or session restoration.
- No manifest, install icons, service worker, offline route, or safe cache policy.
- No Markdown pipeline, sitemap, robots policy, structured data, or production metadata.
- No licensed 3D model, Three.js runtime, GSAP lifecycle layer, E2E suite, or production monitoring.

Supabase variables exist, but a credential-safe anonymous check returned HTTP 401 for REST and no healthy Auth response. No service-role value was used or exposed. The URL and publishable client key must be refreshed before Phase 1 can pass.

## 3. Runtime and dependency baseline

Registry snapshot on 2026-07-19:

| Package | Candidate |
| --- | --- |
| Next.js | 16.2.10 |
| React / React DOM | 19.2.7 |
| TypeScript | 6.0.3 after ecosystem peer verification |
| Tailwind CSS | 4.3.3 |
| shadcn CLI | 4.13.1 |
| Supabase JS | 2.110.7 |
| Supabase SSR | 0.12.3 |
| Serwist | 9.5.11 |
| Three.js | 0.185.1, Phase 9 only |
| GSAP | 3.15.0, Phase 9 only |
| Zod | 4.4.3 |

Use Node 24 LTS. The workstation Node 25 runtime is EOL. Pin exact accepted versions in package-lock.json after Phase 1 type-check, lint, test, and production-build compatibility. Prefer Serwist over the older next-pwa package.

## 4. Architecture

- Server Components by default for layouts, pages, public content, and initial data.
- Client Components only for interactive forms, command search, charts, dialogs, optimistic logging, PWA controls, Anatomy renderers, and animation boundaries.
- Server Actions own authenticated mutations; Route Handlers own callbacks, external API adapters, streamed AI, webhooks, and machine endpoints.
- Next.js proxy.ts refreshes sessions and performs optimistic redirects only. Protected layouts, queries, and writes re-authorize server-side.
- Domain calculations and validation remain independent of React/Supabase adapters where practical.
- Supabase is canonical for authenticated data. URL parameters own shareable filter/search/date/Anatomy state. React local state owns ephemeral UI. Theme and install dismissals may use device storage.
- Do not add a global state library unless a later measured need justifies it.

Proposed structure:

    src/app/(marketing), (auth), (product), api, auth/callback, ~offline
    src/components/ui, shell, data-display, forms, content
    src/features/dashboard, nutrition, meals, recipes, grocery, training,
      workouts, exercises, anatomy, progress, habits, assistant, account
    src/lib/supabase, auth, validation, content, nutrition, security, i18n, seo
    src/styles and src/types
    content/articles/en, content/articles/mk, content/editorial
    public/icons, images, models/anatomy
    supabase/migrations, seed.sql, tests
    tests/unit, component, integration, e2e
    prototype retained as the reference until parity approval

Feature folders gain components, queries, actions, schemas, and pure utilities only when used.

## 5. Route map

Public/shared:

- / — product landing.
- /features, /features/nutrition, /features/training — public ecosystem explanations.
- /anatomy and /anatomy/[muscle] — public educational explorer; personalization requires auth.
- /blog and /blog/[slug] — editorial index and articles.
- /about, /privacy, /terms, /contact — real content before launch, never fake links.
- /~offline — safe PWA fallback.

Auth:

- /sign-in, /sign-up, /magic-link, /forgot-password, /reset-password, /auth/callback, /onboarding.

Protected:

- Daily: /today, /notifications.
- Nutrition: /nutrition, /meals, /meal-planner, /recipes, /recipes/[slug], /grocery-list.
- Training: /train, /workouts, /workouts/new, /workouts/[id], /session/[id], /exercises, /exercises/[slug].
- Personal: /progress, /habits, /me, /settings.
- Coaching: /assistant.

Legacy prototype URLs receive explicit redirects. The five primary areas remain Today, Nutrition, Training, Blog/Knowledge, and Me. Anatomy remains a Training destination while also being publicly readable.

## 6. Components and design system

Shell: PublicHeader/Footer, AppHeader, PrimaryNav, TrainingSubnav, MobileTabBar, MobileDrawer, CommandPalette, NotificationMenu, LocaleSwitcher, ThemeSwitcher.

Customized shadcn primitives: Button, Input, Select, Textarea, Checkbox, RadioGroup, Switch, Dialog, Sheet, Popover, Dropdown, Tooltip, Tabs, Toast, Skeleton, AlertDialog.

Product components: PageHeader, MetricRow, DailyBalance, RecordRow, DateScopeControl, Empty/Error/OfflineState, FormField, ResponsiveDataList, AccessibleChart, ArticleCard, RecipeCard, ExerciseCard, MuscleStatus, HealthDisclaimer.

Translate approved colors into semantic CSS variables and Tailwind v4 theme roles. Preserve Manrope, JetBrains Mono, the 4/8/12/16/24/32/48/64 spacing scale, 8/14/20px radius tiers, 1240px app measure, 760px focused measure, and 68ch reading measure. Light/dark modes use the same hue families. Keep the restrained page atmosphere and sage hero gradient; ordinary cards and controls remain flat. Maintain 44px targets, visible focus, semantic foregrounds, and non-color status.

## 7. Responsive strategy

Mobile-first, with component container queries where useful. Mandatory checks: 320, 375, 480, 768, 1024, 1280, and 1440+ pixels. Mobile is a task flow, not compressed desktop. Tables become labelled records or local scrollers. Dialogs become sheets when keyboard/height constraints require it. Charts preserve summaries and tables. Test both languages, themes, coarse pointer, landscape, on-screen keyboard, reduced motion, and 200% zoom. Never hide page overflow globally to conceal a defect.

## 8. Supabase data plan

Every private table uses UUID keys, user_id referencing auth.users with cascade, timestamps, validation constraints, ownership/date indexes, and RLS.

Identity/preferences:

- profiles, user_settings, goals, daily_targets.

Habits/progress:

- habits, habit_checkins, water_logs, body_measurements, milestones.
- Unique daily habit check-ins and ordered measurement history.

Nutrition/planning:

- foods, food_portions, food_nutrients, food_favorites.
- meal_logs and meal_entries, with nutrient snapshots so history remains stable.
- recipes, recipe_ingredients, recipe_steps, recipe_tags, recipe_tag_links, saved_recipes.
- meal_plans, meal_plan_items, grocery_lists, grocery_items.

Training:

- exercises, exercise_variations, muscles, exercise_muscles.
- workout_templates, workout_template_exercises, programs, program_workouts, scheduled_workouts.
- workout_sessions, workout_session_exercises, workout_sets, personal_records.
- Stable slugs connect URLs, Anatomy, exercises, and content.

Content/AI:

- Blog begins as local Markdown. Later articles, article_tags, article_relations, and saved_articles mirror the same contract for migration.
- ai_conversations and ai_messages appear only if Phase 8 is approved and retention/deletion rules are defined.

Storage:

- Public reviewed media buckets.
- Private user/avatar media with path ownership.
- Validate type, size, and dimensions; reject user SVG uploads.

RLS:

- Private policies require auth.uid() = user_id.
- Public catalogs allow select only when published.
- Ownership comes from the server session, never submitted user_id.
- Child policies validate parent ownership.
- SQL tests use anonymous, owner, and second-user roles.
- Migrations are additive and reviewable. No reset or destructive remote mutation without explicit approval.

## 9. Authentication

Use Supabase SSR with cookie-based PKCE. Support email/password, Magic Link, Google OAuth, callback handling, forgot/reset password, sign out, protected routes, friendly validation, loading/success/error states, and session restoration. Sanitize same-origin next destinations. Redirect signed-in users away from auth pages. Profile creation must be idempotent. Auth responses remain private/no-store. proxy.ts is not the final authorization boundary.

## 10. Data sources and content

Nutrition:

- Use USDA FoodData Central through a server-only adapter after key validation.
- Normalize into an internal schema and record source, external ID, retrieval date, serving basis, and nutrient availability.
- Ship a small reviewed core-food catalog and cache only what source terms permit.
- Never imply missing micronutrients are zero or complete.

Exercises/anatomy:

- Curate owned educational copy and keep a source/license register.
- Do not ingest media or text without verified reuse rights.
- Stable muscle IDs are shared by database, URLs, SVG, Three mesh names, exercises, and articles.
- Anatomy remains educational, not diagnosis or treatment.
- A Three.js model requires a commercial-compatible license and named muscle meshes. Otherwise the accessible SVG remains production.

Blog:

- Paired locale files live under content/articles/en and mk with shared IDs.
- Build-time validated frontmatter includes title, slug, excerpt, category, tags, author, dates, reading time, image, SEO, references, and related IDs.
- Parse non-executable Markdown server-side and sanitize output.
- Generate table of contents, related links, Article/Breadcrumb schema, RSS, sitemap, and canonicals.
- Phase 2 migrates the six approved samples and produces a 30–40 article editorial/topic plan. The full corpus waits for separate approval.

## 11. Anatomy and animation architecture

AnatomyExplorer owns search, region/view state, URL state, selection, and synchronized HTML controls. SvgAnatomyRenderer is the reliable initial and fallback renderer. ThreeAnatomyRenderer is dynamically imported only on Anatomy behind capability, motion, data-saver, and performance checks. Renderer choice never changes URLs, content, keyboard controls, or exercise links.

CSS handles ordinary feedback. GSAP is reserved for coordinated hero, scroll, Anatomy, and completion sequences with scoped cleanup. Three.js is limited to approved meaningful scenes. Pause hidden/offscreen rendering, cap DPR, reduce mobile quality, dispose resources, and preserve reduced-motion parity. Neither library is installed before Phase 9.

## 12. PWA

Use App Router manifest metadata, regular/maskable 192 and 512 icons, Apple metadata, standalone display, theme colors, and an install affordance. Serwist provides the authored service worker and offline document fallback.

Precache only versioned static and safe public shell assets. Auth, Server Actions, Supabase, AI, private HTML, and user records are network-only. Public immutable content may use stale-while-revalidate after review. Show an update-ready prompt; never silently refresh an active workout. Push, background sync, and offline writes remain extension points. A later offline workout outbox requires IndexedDB, idempotency keys, retry, and conflict handling.

## 13. Security

- Shared Zod validation runs on the server; client validation is convenience only.
- Generated Supabase types and parameterized clients.
- Publishable values only in client bundles; service-role, Groq, and USDA keys stay server-only.
- RLS plus server authorization; never trust client user IDs.
- Sanitized Markdown, validated uploads, allow-listed redirects, escaped search, restrictive CSP/security headers.
- Rate-limit auth-adjacent, external data, and AI endpoints.
- AI prompts/tool permissions stay server-side and cannot diagnose or access unrestricted data.
- Add dependency audit, secret-scanning guidance, no-store private responses, and credential rotation.
- Removing a previously tracked secret is not rotation.

## 14. Accessibility, SEO, and performance

Accessibility:

- Semantic landmarks, one h1, skip link, route focus, logical headings, labelled forms.
- Keyboard support for navigation, dialogs, charts, workouts, and Anatomy.
- Visible focus, 44px targets, text/icon status, scoped live regions, linked errors.
- Chart summaries/tables and synchronized HTML Anatomy controls.
- Test contrast, forced colors, zoom, screen-reader names, touch, and reduced motion.

SEO:

- Metadata templates, canonicals, Open Graph/Twitter, locale alternates.
- Sitemap for public content; robots excludes protected/callback/search/private routes.
- Organization/WebSite, Article, Breadcrumb, Recipe, and educational structured data without fake ratings or claims.
- Public server rendering; protected pages are noindex and uncached across users.

Performance:

- Server Components, route splitting, next/image, local/font optimization, explicit media dimensions.
- Pagination and query indexes; explicit public cache invalidation; no shared private caches.
- Lazy Three/GSAP with disposal and bundle analysis.
- Targets: LCP below 2.5s, INP below 200ms, CLS below 0.1 at p75.

## 15. Testing and live review

- Vitest: domain logic, validation, locale parity, URL state, adapters.
- React Testing Library: forms, dialogs, navigation, charts, states.
- Supabase local SQL tests: migrations and two-user RLS isolation.
- Integration tests: Actions/Handlers with mocked external APIs and local Supabase.
- Playwright: auth, redirects, onboarding, logging, settings, Blog, Anatomy, offline/update.
- axe plus manual keyboard, focus, reduced-motion, zoom, and touch review.
- Screenshot baselines in both themes at all seven widths.

Every phase gate requires type-check, ESLint, unit/component/integration tests, production build, relevant E2E, and actual browser interaction at port 53271. The report lists routes/viewports reviewed, console/hydration results, issues fixed, concerns, changed systems, and every acceptance item. Then work stops.

## 16. Phases

Phase 1 — Foundation

Next.js root scaffold; Node/runtime pin; exact lockfile; route groups; Sage Dusk tokens; initial customized shadcn components; fonts; error/loading/not-found; Supabase browser/server clients and proxy; generated-types workflow; initial migration/RLS harness; environment validation; Serwist manifest/offline skeleton; test/lint/type/build tooling; dev server on port 53271.

Acceptance: build passes; root/error/offline/state pages render; themes/locales work; Supabase health plus minimal authenticated server query passes; private cache policy is proven; manifest is valid; no prototype feature is represented as production complete. Report and stop.

Phase 2 — Public experience

Landing, feature pages, navigation/footer, Blog framework with six approved samples, public SVG Anatomy foundation, metadata, sitemap, robots, structured data, and editorial/topic plan. Report and stop.

Phase 3 — Authentication and onboarding

Email/password, Magic Link, Google, callbacks, recovery/reset, sign out, restoration, protected layout, profile bootstrap, and onboarding. Report and stop.

Phase 4 — Dashboard and core tracking

Guided Daily Canvas, Daily Balance, goals, water, measurements, habits, notifications, progress foundation, and real summaries. Report and stop.

Phase 5 — Nutrition and planning

Food/search, USDA adapter, favorites/recent/custom foods, logging, nutrient summaries, recipes, meal planning, groceries, and responsive records. Report and stop.

Phase 6 — Fitness

Exercise library, workout builder/templates/programs, scheduling, mobile active session, journal/history, records, and progress comparison. Report and stop.

Phase 7 — Anatomy and knowledge depth

Complete muscle encyclopedia, source review, relationships, richer SVG, approved article corpus, content QA, and Markdown/Supabase compatibility. Report and stop.

Phase 8 — AI and personalization

Only after explicit approval: Groq coach, scoped tools, streaming, rate limits, retention controls, safety language, suggestions, and summaries. Report and stop.

Phase 9 — Motion and 3D

Only after explicit approval and licensed assets: GSAP sequences, Three.js Anatomy, fallbacks, performance budgets, and reduced-motion parity. Report and stop.

Phase 10 — Production hardening

Accessibility, performance, security, RLS, PWA, SEO, content, device, error/offline, and visual audits with fix cycles until accepted. Report and stop.

## 17. Risks and required decisions

| Risk | Control |
| --- | --- |
| Supabase client configuration currently fails | Refresh URL/publishable key before Phase 1 gate |
| No migrations or known remote schema | Local migrations and read-only inspection first; no destructive remote action |
| No licensed Three model | SVG remains canonical until a licensed named-mesh GLB is approved |
| 30–40 bilingual articles are an editorial product | Approve source/topic/editorial plan before generation |
| Nutrition/exercise licensing and accuracy | Provenance registry, reviewed adapters, editorial checks |
| No controllable browser in this session | A phase cannot be accepted without browser availability or explicit user-run review evidence |
| Deployment target unknown | Confirm Vercel, Node host, or Docker before Phase 1 closes |
| AI scope/retention undecided | No Groq work before Phase 8 approval |
| Workstation Node 25 is EOL | Pin Node 24 LTS |

Approval decisions:

1. Approve this architecture and Phase 1 scope.
2. Confirm deployment target; Vercel is the working assumption.
3. Refresh/confirm Supabase URL and publishable client key.
4. Confirm English-default with full Macedonian parity.
5. Confirm SVG Anatomy remains the baseline until a licensed model is supplied.
6. Keep Groq deferred until the Phase 8 gate.

No production implementation begins until explicit approval.
