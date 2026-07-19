# Phase 3 Authentication and Onboarding Design

Date: 2026-07-19
Status: Approved design direction, awaiting written-spec review

## Objective

Deliver complete, production-oriented authentication and a required two-step onboarding flow on top of the existing Supabase SSR foundation. Users can register, authenticate, recover access, restore sessions, sign out, complete basic preferences and priorities, and enter an honest protected workspace at `/today`.

Phase 3 does not implement the Guided Daily Canvas, nutrition logging, workouts, measurements, notifications, or AI. Those remain later phase gates.

## Architecture

Authentication is server-first:

- Server Components authorize initial page access and redirect inappropriate sessions.
- Server Actions own password, Magic Link, OAuth initiation, recovery, reset, onboarding, and sign-out mutations.
- `/auth/callback` is a Route Handler that exchanges Supabase PKCE codes for cookie-backed sessions.
- Client Components are limited to interaction that requires local state, including password visibility, pending form feedback, goal selection, and timezone suggestion.
- Supabase RLS and server-side user verification remain the final private-data boundaries. Proxy redirects are convenience, not authorization.

The implementation will follow existing Supabase server/browser clients, semantic tokens, bilingual content, and Next.js route-group conventions.

## Routes

### Authentication

- `/sign-in`: email/password and Google sign-in, with links to Magic Link, registration, and recovery.
- `/sign-up`: display name, email, password, confirmation guidance, Google sign-up, and sign-in link.
- `/magic-link`: passwordless email request with a non-enumerating success state.
- `/forgot-password`: password-reset request with a non-enumerating success state.
- `/reset-password`: authenticated recovery-session form for setting a new password.
- `/auth/callback`: PKCE exchange, safe destination resolution, and onboarding redirect.

Authenticated users visiting ordinary auth pages are redirected to `/onboarding` when incomplete and `/today` when complete. `/reset-password` is exempt while a recovery session is active.

### Protected experience

- `/onboarding`: required two-step onboarding.
- `/today`: an honest workspace-ready page with sign-out and account context. It does not display fabricated tracking data.

The protected layout provides the authenticated shell, brand destination, theme/locale controls, and account/sign-out affordance. It does not expose unfinished product navigation.

## Redirect Safety

`sanitizeNextPath(value, fallback)` accepts only same-origin application paths beginning with one `/`. It rejects absolute URLs, protocol-relative paths, backslashes, control characters, authentication-loop destinations, and malformed encoded input.

The requested destination survives sign-in, registration confirmation, Magic Link, and OAuth when safe. After session establishment:

1. incomplete onboarding always redirects to `/onboarding` while retaining the eventual safe destination;
2. completed onboarding redirects to the safe destination or `/today`;
3. unsafe or missing destinations fall back to `/today`.

## Authentication Flows

### Email and password

Sign-in validates normalized email and a non-empty password, calls Supabase password authentication, and returns a friendly generic error for invalid credentials. Successful sessions follow onboarding-aware routing.

Sign-up validates display name, normalized email, password length and confirmation. It passes display name and locale as user metadata so the existing database trigger can bootstrap the profile. If email confirmation is required, the user sees a check-email success state. If Supabase returns an immediate session, the user enters onboarding.

### Magic Link

The request validates email and calls `signInWithOtp` with a callback URL containing the sanitized destination. The visible response is identical whether or not the address is registered.

### Google OAuth

The server initiates `signInWithOAuth` using provider `google`, a PKCE callback URL, and the sanitized destination. The returned provider URL is the only external redirect allowed from this action.

### Recovery and reset

Forgot-password requests use the callback route with `/reset-password` as the safe destination. The request result does not reveal whether an account exists. The reset page requires a valid recovery session, validates password confirmation, calls `auth.updateUser`, and redirects to onboarding or today.

### Sign out

The authenticated action calls `auth.signOut`, clears the session through Supabase SSR cookies, and redirects to `/sign-in`. Failure returns a useful retry state without exposing internal details.

## Onboarding

Onboarding is required and consists of two focused steps.

### Step 1: Profile and preferences

- Display name: trimmed, 2–60 characters.
- Locale: `en` or `mk`; English remains the default.
- Units: `metric` or `imperial`.
- Timezone: valid IANA timezone, initially suggested through `Intl.DateTimeFormat().resolvedOptions().timeZone`, with `UTC` fallback.

### Step 2: Priorities

Users select one to three stable priority IDs:

- `movement`
- `strength`
- `nutrition`
- `consistency`
- `education`

Priorities are stored as active `goals` rows with null numeric targets. The action queries existing equivalent active rows before inserting, making retries idempotent. `onboarding_complete` is set only after profile, settings, and priorities succeed.

No body measurements, calorie prescriptions, medical information, reminder permissions, or diagnosis-oriented questions are collected.

## UI and Content

Authentication uses a Sage Dusk split composition on wider screens and one focused column on mobile:

- brand and concise benefit context;
- a bounded form area with visible labels;
- Deep Teal primary and Warm Sand secondary actions;
- Google provider action separated from email methods;
- password visibility controls with accessible names;
- field-level errors plus a form summary where appropriate;
- pending buttons that preserve width and communicate progress;
- success panels for email-based flows;
- links that retain the safe `next` destination.

Onboarding uses a focused step canvas with progress text, semantic fieldsets, large priority controls, Back/Continue actions, and a final completion action. Essential information never depends on animation or color.

All new user-facing content has English and Macedonian variants. Error messages remain helpful but do not reveal account existence or provider internals.

## Data and Types

The existing foundation migration already creates `profiles`, `user_settings`, `goals`, `daily_targets`, bootstrap triggers, and ownership policies. Phase 3 will use an additive migration only if implementation discovers a database-level requirement that cannot be met safely through the current schema.

The currently empty database type stub must be replaced with types covering the existing foundation tables and onboarding operations. Types must match migrations and remain suitable for later Supabase CLI regeneration.

No service-role client is added. All writes execute as the authenticated user under RLS.

## Failure Handling

- Missing Supabase configuration renders a controlled service-unavailable state instead of exposing raw validation errors.
- Invalid credentials return a generic authentication message.
- Email request flows use non-enumerating success copy.
- Expired or invalid callback codes redirect to sign-in with a safe, human-readable error code.
- OAuth cancellation returns to sign-in without losing the safe destination.
- Missing bootstrap rows are repaired idempotently for the current user before onboarding writes.
- Partial onboarding never marks the profile complete; retries reuse existing priority rows.
- Invalid or unavailable timezones fall back to `UTC` and remain editable.

## Security

- Normalize and validate all form input with shared Zod schemas on the server.
- Derive ownership exclusively from `auth.getUser()`.
- Never accept a submitted user ID.
- Use PKCE and cookie-backed Supabase SSR sessions.
- Keep auth responses private and no-store.
- Sanitize every post-auth destination.
- Do not reveal account existence in Magic Link or recovery flows.
- Do not log passwords, tokens, callback codes, cookies, or local environment values.
- Keep RLS enabled and test owner/second-user isolation where local Supabase is available.

## Accessibility and Responsive Behavior

- One `h1` per page and semantic landmarks.
- Persistent visible labels and linked descriptions/errors.
- Error summaries receive focus after failed submission where appropriate.
- Password toggles communicate state and remain keyboard accessible.
- Provider and form controls meet the 44px target minimum.
- Onboarding priorities use checkbox semantics and do not rely only on color.
- Focus order follows reading order.
- Forms remain usable at 320px, 200% zoom, and with an on-screen keyboard.
- Pending and success messages use scoped live regions.
- Motion is limited to small CSS feedback and respects reduced motion.

## External Supabase Configuration

Implementation will document but not remotely mutate:

- application Site URL;
- local callback `http://localhost:3000/auth/callback`;
- Vercel production and preview callback patterns;
- Google provider client ID and secret configuration;
- email confirmation and recovery templates.

Real Google and email-delivery acceptance requires the corresponding Supabase dashboard configuration. Local automated tests will use controlled adapters/mocks and will not send real email.

## Testing and Acceptance

Automated coverage:

- safe destination sanitizer edge cases;
- authentication and onboarding Zod schemas;
- auth-page redirect decisions;
- password, Magic Link, OAuth, callback, recovery, reset, and sign-out action contracts;
- onboarding step validation and retry idempotency;
- protected route and incomplete-onboarding routing;
- bilingual control parity;
- production repository contracts;
- full tests, typecheck, ESLint, and production build.

Live review at `http://localhost:3000` must cover mobile, tablet, laptop, desktop, light/dark themes, keyboard navigation, validation errors, loading states, callback failures, protected redirects, onboarding, and sign-out. Real provider success flows remain conditional on Supabase provider configuration and must be disclosed if unavailable.

## Completion Boundary

Phase 3 is complete when all specified routes and flows are implemented, protected reads authorize server-side, onboarding persists safely, verification passes, external configuration is documented, and the phase report is presented. Work then stops for explicit approval before Phase 4.

## Self-Review

- No unresolved or temporary requirements remain.
- The route, security, data, and redirect rules are internally consistent.
- The design does not claim Phase 4 dashboard functionality.
- The required onboarding choice matches the approved recommendation.
- External provider dependencies and non-destructive boundaries are explicit.
- The scope is cohesive enough for one implementation plan with independently testable tasks.
