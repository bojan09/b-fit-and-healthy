# Phase 4 Dashboard and Core Tracking Design

## Purpose

Phase 4 turns the protected shell into a useful daily product without crossing into nutrition logging, workout planning, or AI. It implements the approved **Guided Daily Canvas** and real user-owned tracking for goals, water, weight, habits, progress, and notifications.

The dashboard must never fabricate health data. Until later phases create meal and workout records, energy, macro, meal, and workout regions are omitted or described as future connections rather than rendered with demo values.

## Product approach

The selected approach is a server-rendered daily ledger with small client interaction islands. Two alternatives were rejected:

- An analytics dashboard would overemphasize charts, fragment the day into cards, and repeat the rejected ring-based composition.
- A client-side local-first dashboard would duplicate Supabase ownership and make server authorization, cross-device state, and recovery harder.

The Guided Daily Canvas provides one next useful action, one consolidated Daily Balance, a time-aware rhythm rail, and a contextual guidance panel. “Guidance” is deterministic product copy based only on persisted user data; it is not presented as AI or medical advice.

## Scope

Included routes:

- `/today` — daily canvas and real summary
- `/habits` — create, complete, skip, archive, and review daily habits
- `/progress` — weight history, habit consistency, and goal status
- `/goals` — create, pause, resume, and complete personal goals
- `/notifications` — user-owned notification inbox and read state

Nutrition, meals, exercises, workout sessions, AI, reminders delivery, scheduled jobs, GSAP, and Three.js remain out of scope.

## Application shell

The product shell gains a focused desktop navigation and a mobile bottom bar. Only implemented destinations are primary: Today, Progress, Habits, and Goals. Notifications remain a labelled header destination. Anatomy and Knowledge are secondary public resources. The account context, theme, locale, and sign-out controls remain available.

Navigation uses semantic links, visible active states, 44px minimum targets, and a safe mobile layout that never covers the final page content. The shell continues to authorize on the server and uses private, no-store responses.

## Guided Daily Canvas

The `/today` hierarchy is:

1. Greeting, local date, and a short status sentence.
2. A low-contrast sage next-action panel determined from real state: log water when below target, complete the first pending habit, review an active goal, or acknowledge a completed day.
3. Daily Balance with labelled linear rows for water, habits, and active goals. Weight appears as current context, not a progress target. Every visual meter includes text values and a screen-reader description.
4. A rhythm rail grouping today’s water entries and habits into completed, current, and remaining states.
5. A contextual guidance panel explaining one useful action and linking to the relevant implemented page.

Desktop uses a broad primary canvas and one restrained secondary column. Mobile orders next action, Daily Balance, rhythm, then guidance. No circular KPI rings, nested card stacks, or dark inverted cards appear in light mode.

## Data model

All private records use UUID primary keys, `user_id` ownership, timestamps, validation constraints, indexes, foreign keys, and RLS.

### `water_logs`

- `id`, `user_id`, `amount_ml`, `logged_at`, `created_at`
- Amount is 50–5000 ml per entry.
- Daily totals are calculated in the user’s stored timezone.

### `body_measurements`

- `id`, `user_id`, `recorded_on`, `weight_kg`, optional `note`, timestamps
- One weight record per user per calendar date.
- Weight is stored canonically in kilograms and converted for imperial display.

### `habits`

- `id`, `user_id`, `title`, `position`, `is_archived`, timestamps
- Phase 4 supports daily habits only; future cadence complexity is intentionally deferred.

### `habit_checkins`

- `id`, `user_id`, `habit_id`, `checkin_on`, `status`, timestamps
- Status is `complete` or `skipped`.
- One check-in per habit per date.

### `notifications`

- `id`, `user_id`, `kind`, `title`, `body`, optional `href`, `read_at`, `created_at`
- Phase 4 implements the inbox and read state, not scheduled delivery or push notifications.

The existing `goals` and `daily_targets` tables remain canonical. Goals use existing kinds, optional numeric targets and units, dates, and active/paused/complete status. Daily targets provide the water target; when absent, the interface asks the user to set one instead of assuming a clinical recommendation.

## Data access and mutation

Server Components load authenticated user data through focused repository functions. Server Actions validate all mutations with Zod, call `auth.getUser()`, derive ownership from that session, and revalidate affected routes. Client input never supplies a trusted user ID.

Pure summary utilities calculate local dates, unit conversions, daily totals, completion ratios, and next-action decisions. These functions receive plain records and are covered by unit tests. Supabase adapters return typed empty arrays for no-data states and surface generic retryable errors without exposing database messages.

Habit toggles and notification read actions are idempotent. Daily weight uses an upsert keyed by user and date. Water additions create immutable log entries; deletion is available from the day ledger to correct mistakes.

## Forms and feedback

Compact dialogs are avoided until a shared accessible dialog primitive exists. Add-water, add-weight, add-goal, and add-habit forms use responsive inline panels or dedicated sections with visible labels, units, descriptions, validation messages, pending states, and success feedback through refreshed server state.

Buttons never communicate state by color alone. Habit completion uses a native checkbox visual, status text, and `aria-pressed` or checked semantics. Destructive/archive actions require clear wording and remain recoverable where practical.

## Progress presentation

Progress prioritizes current weight and recent history, seven-day habit consistency, and active goals. Weight history uses a lightweight accessible SVG line visualization paired with a textual record list. With fewer than two measurements it presents a useful empty/starting state instead of a misleading chart.

Habit consistency is described as completed check-ins divided by expected active habit-days within the displayed seven-day period. Skipped days are shown explicitly and are not counted as completed. Goals show status and target context without claiming progress when no measured source is connected.

## Notifications

The notification route supports empty, unread, read, mark-one-read, and mark-all-read states. Notifications are never fabricated for presentation. The header badge appears only when the server reports a real unread count.

## Locale, units, and time

English remains primary and Macedonian has parity for all controls, headings, statuses, validation, and empty states. Dates and numbers use the active locale. The stored user timezone defines “today.” Metric users see kilograms and millilitres; imperial users see pounds and fluid ounces while canonical storage remains kilograms and millilitres.

## Accessibility and responsive behavior

- Semantic headings, landmarks, lists, forms, labels, and status regions
- Keyboard-operable navigation, check-ins, and actions
- Text equivalents for meters and the weight chart
- Visible focus and non-color state indicators
- 44px touch targets and no hover-only behavior
- Mobile checks at 320, 375, and 480px; tablet at 768px; desktop at 1024, 1280, and 1440+px
- Reduced-motion support inherited from the global system
- No horizontal overflow or content hidden behind the bottom navigation

## Security and performance

RLS limits every record to its owner. Indexes support user/date queries, and uniqueness constraints prevent duplicate daily state. Pages are dynamic and private. Queries select only required fields and cap history windows. No private responses enter service-worker caches. No new runtime dependency is required.

## Testing and acceptance

Automated coverage includes pure summaries and unit conversion, action validation, Phase 4 route/schema contracts, and key interactive components. Database SQL tests verify anonymous denial and cross-user isolation where the local Supabase test environment is available.

Acceptance requires:

- Real, user-owned water, weight, habits, goals, and notification state
- Guided Daily Canvas with no fabricated nutrition/workout/AI values
- Useful empty, pending, error, and completed states
- Correct timezone and unit handling
- Responsive bilingual layouts and accessible interactions
- Passing repository tests, TypeScript, lint, and production build
- Manual route and redirect smoke checks on port 3000

Remote database migrations and real authenticated browser acceptance remain explicit deployment steps; no remote Supabase reset or destructive operation is performed by the implementation agent.
