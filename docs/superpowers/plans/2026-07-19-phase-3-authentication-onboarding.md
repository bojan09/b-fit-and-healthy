# Phase 3 Authentication and Onboarding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver secure Supabase authentication, account recovery, required onboarding, session-aware routing, sign-out, and an honest protected `/today` workspace.

**Architecture:** Server Components authorize initial access, Server Actions own mutations, and a Route Handler exchanges PKCE callback codes. Pure validation and redirect utilities remain independent of Supabase; protected components always verify the user server-side. Client code is limited to form affordances and onboarding step state.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, Supabase SSR/JS, Zod 4, Tailwind CSS 4, customized UI primitives, Vitest, Testing Library, Node contract tests.

## Global Constraints

- English is primary with Macedonian parity for every new control and message.
- Use `/` for public brand navigation and `/today` for authenticated navigation.
- Do not implement Phase 4 dashboard metrics or fabricated health data.
- Do not inspect secrets or remotely mutate/reset Supabase.
- Keep private responses no-store and derive ownership from `auth.getUser()`.
- Do not add Three.js, GSAP, or unrelated dependencies.
- Use localhost port 3000.
- Do not perform Git operations.

---

### Task 1: Auth domain, schemas, and database types

**Files:**
- Create: `src/features/auth/redirects.ts`
- Create: `src/features/auth/schemas.ts`
- Create: `src/features/auth/types.ts`
- Modify: `src/types/database.ts`
- Test: `tests/unit/auth.test.ts`

**Interfaces:**
- Produces `sanitizeNextPath(value, fallback?)`, sign-in/sign-up/email/reset/onboarding Zod schemas, `AuthActionState`, stable priority IDs, and typed foundation tables.

- [ ] Write failing tests for safe local paths, hostile/loop paths, normalized email, password confirmation, onboarding constraints, timezone fallback, and one-to-three priorities.
- [ ] Run `vitest` and confirm imports fail because the modules are absent.
- [ ] Implement the pure utilities and types with no Supabase dependency.
- [ ] Run the focused tests and confirm they pass.

### Task 2: Session/profile routing service

**Files:**
- Create: `src/features/auth/session.ts`
- Create: `src/features/auth/content.ts`
- Modify: `src/lib/supabase/proxy.ts`
- Test: `tests/unit/auth-routing.test.ts`

**Interfaces:**
- Produces `getAccountDestination(onboardingComplete, next?)`, `requireUser()`, `getCurrentProfile()`, and bilingual auth/onboarding content.

- [ ] Write failing routing-decision tests for signed-out, incomplete, complete, and recovery destinations.
- [ ] Implement pure decisions and server-only session/profile helpers.
- [ ] Extend proxy behavior to preserve sanitized path plus query and redirect signed-in users away from ordinary auth routes without treating proxy as final authorization.
- [ ] Run focused tests.

### Task 3: Authentication layout, forms, and server actions

**Files:**
- Create: `src/app/(auth)/layout.tsx`
- Create: `src/app/(auth)/sign-in/page.tsx`
- Create: `src/app/(auth)/sign-up/page.tsx`
- Create: `src/app/(auth)/magic-link/page.tsx`
- Create: `src/app/(auth)/forgot-password/page.tsx`
- Create: `src/features/auth/actions.ts`
- Create: `src/features/auth/auth-form.tsx`
- Create: `src/features/auth/auth-shell.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/component/auth-form.test.tsx`
- Test: `tests/phase-3-authentication.test.js`

**Interfaces:**
- Consumes shared schemas, content, server client, and safe destinations.
- Produces password, Magic Link, Google OAuth, registration, recovery actions and accessible route compositions.

- [ ] Add failing component and route contracts for labels, provider action, pending state, error live region, success state, bilingual copy, and route existence.
- [ ] Implement server actions with generic user-facing errors, non-enumerating email success, safe callback construction, and onboarding-aware redirects.
- [ ] Implement the split auth shell and focused responsive forms with Deep Teal/Warm Sand controls.
- [ ] Run focused component and contract tests.

### Task 4: Callback and password reset

**Files:**
- Create: `src/app/auth/callback/route.ts`
- Create: `src/app/(auth)/reset-password/page.tsx`
- Create: `src/features/auth/reset-form.tsx`
- Modify: `src/features/auth/actions.ts`
- Test: `tests/unit/auth-callback.test.ts`
- Modify: `tests/phase-3-authentication.test.js`

**Interfaces:**
- Produces callback outcome mapping and password update flow; consumes sanitized destinations and profile routing.

- [ ] Write failing tests for missing, invalid, and successful callback outcomes and reset validation.
- [ ] Implement PKCE exchange, safe error redirects, recovery-session checks, password update, and post-reset routing.
- [ ] Run focused tests.

### Task 5: Required two-step onboarding

**Files:**
- Create: `src/app/(product)/onboarding/page.tsx`
- Create: `src/features/onboarding/onboarding-flow.tsx`
- Create: `src/features/onboarding/actions.ts`
- Create: `src/features/onboarding/priorities.ts`
- Modify: `src/app/globals.css`
- Test: `tests/component/onboarding-flow.test.tsx`
- Modify: `tests/phase-3-authentication.test.js`

**Interfaces:**
- Produces `completeOnboardingAction`, a two-step accessible flow, idempotent goal insertion, bootstrap repair, and final safe redirect.

- [ ] Add failing tests for step order, field labels, one-to-three selections, back/continue behavior, and route authorization contracts.
- [ ] Implement step state, timezone suggestion, semantic priority checkboxes, bilingual copy, and server validation.
- [ ] Implement authenticated profile/settings updates, missing-row repair, equivalent-goal checks, and completion-last ordering.
- [ ] Run focused tests.

### Task 6: Protected shell, today foundation, and sign out

**Files:**
- Create: `src/app/(product)/layout.tsx`
- Create: `src/app/(product)/today/page.tsx`
- Create: `src/components/shell/product-header.tsx`
- Create: `src/features/auth/sign-out-button.tsx`
- Modify: `src/features/auth/actions.ts`
- Modify: `src/app/globals.css`
- Modify: `tests/phase-3-authentication.test.js`

**Interfaces:**
- Produces a server-authorized product layout, workspace-ready `/today`, account context, theme/locale controls, and sign-out action.

- [ ] Add failing contracts for server authorization, incomplete-onboarding redirect, no fabricated metrics, account label, and sign-out.
- [ ] Implement the protected layout and restrained shell using only finished destinations.
- [ ] Implement sign-out with cookie clearing and `/sign-in` redirect.
- [ ] Run focused tests.

### Task 7: Documentation and production verification

**Files:**
- Create: `docs/supabase-auth-configuration.md`
- Modify: `README.md`
- Modify only failure-related implementation files during hardening.

**Interfaces:**
- Documents local/Vercel callback URLs, Google provider, email templates, and manual acceptance limits.

- [ ] Document Site URL, `http://localhost:3000/auth/callback`, Vercel callbacks, Google credentials, email templates, and non-secret environment requirements.
- [ ] Run `npm run test`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- [ ] Run the app at port 3000 and inspect all Phase 3 routes, redirects, form states, themes, mobile/desktop layouts, keyboard flow, and callback errors.
- [ ] Disclose provider flows that cannot complete without remote Supabase configuration; do not claim them as live-tested.
- [ ] Update README phase status and produce the mandatory Phase 3 completion report, then stop for Phase 4 approval.

## Self-Review

- Tasks cover every approved route, flow, security boundary, onboarding field, error state, and verification requirement.
- Pure helpers are testable without Supabase; remote flows remain adapter-bound.
- Function names and route destinations are consistent across tasks.
- No future dashboard, notification, nutrition, training, AI, GSAP, or Three.js work is included.
- Git and remote database mutations are explicitly excluded.
