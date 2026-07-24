# Phase 8 AI Coach Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a private bilingual Groq AI Coach with minimized 30-day context, streaming guidance, reviewable drafts, owner-only history, and automatic 30-day retention.

**Architecture:** A protected Next.js route renders the Guided Coach Canvas. Server-only modules isolate context loading, safety, persistence, rate limiting, Groq streaming, and draft application; Supabase RLS protects history and Zod validates every model and mutation boundary.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, Supabase/PostgreSQL, Groq Chat Completions over server-side `fetch`, Zod 4, CSS, Vitest, Testing Library, Node contract tests.

## Global Constraints

- Do not perform Git operations.
- Do not expose, rewrite, or create environment credential files.
- Keep `GROQ_API_KEY` server-only and add no client-readable AI secret.
- Store conversations for 30 days and permit immediate owner deletion.
- Use only profile, goals, preferences, today’s records, and summarized preceding-30-day trends as model context.
- All meal, recipe, workout, and habit changes remain drafts until explicit confirmation.
- English is primary and Macedonian follows the active application locale.
- Do not add autonomous coaching, medical diagnosis, remote tools, browsing, GSAP, or Three.js.

---

### Task 1: Phase 8 contracts and domain schemas

**Files:**
- Create: `tests/phase-8-ai-coach.test.js`
- Create: `tests/unit/assistant-domain.test.ts`
- Create: `src/features/assistant/schemas.ts`
- Create: `src/features/assistant/types.ts`

**Interfaces:**
- Produces: `assistantRequestSchema`, `assistantDraftSchema`, `mealDraftSchema`, `workoutDraftSchema`, `habitDraftSchema`, `recipeDraftSchema`, `AssistantDraft`, `AssistantContext`, and `AssistantStreamEvent`.

- [ ] Write contract tests asserting `/assistant`, `/api/assistant`, migration tables/RLS/cleanup, protected navigation, server-only Groq access, and no AI secrets in client modules.
- [ ] Write unit tests for a 2,000-character message boundary, UUID conversation identifiers, all five draft types, known meal slots, valid dates, bounded servings/durations, and rejected unknown draft types.
- [ ] Run `node --test tests/phase-8-ai-coach.test.js` and `npm run test:unit -- tests/unit/assistant-domain.test.ts`; verify missing files/exports fail.
- [ ] Implement the Zod schemas and serializable domain types with exact discriminated unions.
- [ ] Rerun the focused tests and verify they pass.

### Task 2: Owner-only storage and retention

**Files:**
- Create: `supabase/migrations/202607230001_ai_coach.sql`
- Modify: `src/types/database.ts`
- Create: `src/features/assistant/repository.ts`
- Create: `tests/unit/assistant-retention.test.ts`

**Interfaces:**
- Consumes: `AssistantDraft`.
- Produces: `listConversations(userId)`, `getConversation(userId, id)`, `createConversation(userId, locale, title)`, `appendMessage(input)`, `deleteConversation(userId, id)`, `conversationExpiry(from)`.

- [ ] Write retention tests proving expiry is exactly 30 days, expired records are filtered, and titles are deterministically trimmed.
- [ ] Add `ai_conversations` and `ai_messages`, checks, indexes, cascading foreign keys, owner RLS, grants, and `cleanup_expired_ai_conversations()` to the migration.
- [ ] Extend the checked-in database types with exact Row/Insert/Update fields.
- [ ] Implement repository operations with owner filters and non-expired reads.
- [ ] Run retention tests and the Phase 8 contract tests.

### Task 3: Context minimization and safety boundary

**Files:**
- Create: `src/features/assistant/context.ts`
- Create: `src/features/assistant/safety.ts`
- Create: `tests/unit/assistant-context.test.ts`
- Create: `tests/unit/assistant-safety.test.ts`

**Interfaces:**
- Produces: `buildAssistantContext(userId, locale, now?)`, `summarizeAssistantContext(raw, locale)`, `classifySafety(input)`, and `buildSystemPrompt(locale, contextSummary)`.

- [ ] Write tests proving only approved categories survive context minimization and individual raw records are reduced to totals, completion rates, or recent trend ranges.
- [ ] Write tests for diagnostic, medication, eating-disorder/extreme-restriction, acute-injury, and emergency language plus ordinary nutrition/training questions.
- [ ] Implement bounded Supabase queries for profile/settings/targets, active goals, today’s meals/water/habits/training, and preceding-30-day aggregate inputs.
- [ ] Implement deterministic, length-bounded English/Macedonian summaries that label database content as untrusted.
- [ ] Implement safety classification and locale-aware system prompts with education-only boundaries.
- [ ] Run the focused context and safety tests.

### Task 4: Rate limiting and Groq provider

**Files:**
- Create: `src/features/assistant/rate-limit.ts`
- Create: `src/features/assistant/groq.ts`
- Modify: `src/lib/env/server-schema.ts`
- Modify: `src/lib/env/server.ts`
- Create: `tests/unit/assistant-rate-limit.test.ts`
- Create: `tests/unit/assistant-provider.test.ts`

**Interfaces:**
- Produces: `consumeAssistantLimit(key, now?)`, `resetAssistantLimits()`, `streamCoachCompletion(input)`, `generateStructuredDraft(input)`, and `AssistantProviderError`.

- [ ] Write fake-clock tests for 10 requests per 60 seconds, isolation by user, reset after the window, and retry-after calculation.
- [ ] Write mocked-fetch tests for authorization headers, configured model selection, SSE token extraction, aborts, `429`, timeouts, malformed JSON, and redacted upstream failures.
- [ ] Add optional `GROQ_MODEL` validation with the documented production default; keep the key optional at application boot and required only inside the provider.
- [ ] Implement the in-memory limiter with bounded stale-entry cleanup.
- [ ] Implement server-only Groq calls using `fetch`, an abort timeout, streaming chat completions, JSON-schema draft generation, and normalized safe errors.
- [ ] Run provider and limiter tests.

### Task 5: Assistant orchestration API

**Files:**
- Create: `src/features/assistant/stream.ts`
- Create: `src/app/api/assistant/route.ts`
- Create: `tests/unit/assistant-stream.test.ts`

**Interfaces:**
- Consumes: schemas, repository, context, safety, limiter, and provider.
- Produces: `POST /api/assistant` as `text/event-stream` with `meta`, `token`, `draft`, `done`, and `error` events.

- [ ] Write tests for unauthorized requests, invalid input, rate limits, safe-boundary responses, new/existing conversations, persisted complete responses, aborted status, and provider failure redaction.
- [ ] Implement an SSE encoder and heartbeat-free stream lifecycle compatible with Vercel.
- [ ] Authenticate with Supabase, validate ownership, consume the rate limit, build minimized context, and persist the user message.
- [ ] Stream safe boundary text locally or provider tokens remotely; generate a structured draft only for the five approved intents.
- [ ] Persist only final visible assistant text and validated draft metadata.
- [ ] Return `Cache-Control: no-store` and safe application error codes.
- [ ] Run stream tests and Phase 8 contracts.

### Task 6: Draft confirmation actions

**Files:**
- Create: `src/features/assistant/draft-actions.ts`
- Create: `tests/unit/assistant-draft-actions.test.ts`

**Interfaces:**
- Produces: `applyAssistantDraftAction(previousState, formData)` and `deleteAssistantConversationAction(formData)`.

- [ ] Write tests proving unauthenticated calls are rejected, ownership is checked, discarded or altered payloads fail validation, and each approved mutable draft maps to an owner-scoped insert.
- [ ] Implement signed server-side draft lookup from the owner’s stored assistant message instead of trusting a client-submitted draft body.
- [ ] Apply meal drafts to `meal_plan_items`, workout drafts to `workout_templates` and known catalogue exercises, habit drafts to `habits`, and recipe drafts to private `recipes` plus ingredients/steps.
- [ ] Treat summary drafts as non-mutating and return a clear status.
- [ ] Revalidate only affected product routes and return bilingual-safe action results.
- [ ] Run focused draft-action tests.

### Task 7: Guided Coach Canvas

**Files:**
- Create: `src/app/(product)/assistant/page.tsx`
- Create: `src/features/assistant/assistant-canvas.tsx`
- Create: `src/features/assistant/conversation-list.tsx`
- Create: `src/features/assistant/message-list.tsx`
- Create: `src/features/assistant/draft-card.tsx`
- Create: `src/features/assistant/content.ts`
- Create: `tests/component/assistant-canvas.test.tsx`
- Create: `tests/component/assistant-draft-card.test.tsx`

**Interfaces:**
- Consumes: conversation/message records, stream events, application actions, and localized content.

- [ ] Write component tests for welcome prompts, composer limits, streaming tokens, stop/retry, live-region status, history selection, context disclosure, expiry, deletion, all draft cards, review/confirm/discard, keyboard focus, and safe error messages.
- [ ] Build the server page that loads the owner’s non-expired history and selected conversation.
- [ ] Build the client canvas with an `AbortController`, SSE event parsing, one active generation, optimistic user message, and final reconciliation.
- [ ] Build semantic message, history, context, and draft components without rendering model HTML.
- [ ] Implement explicit review forms and confirmation feedback.
- [ ] Add empty, offline, unavailable, rate-limited, aborted, and failed states.
- [ ] Run component tests.

### Task 8: Navigation, responsive styling, and documentation

**Files:**
- Modify: `src/components/shell/product-navigation.tsx`
- Modify: `src/features/dashboard/guidance-panel.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/lib/supabase/proxy.ts`
- Modify: `src/app/robots.ts`
- Create: `docs/ai-coach-operations.md`

**Interfaces:**
- Makes `/assistant` reachable from desktop/mobile product navigation and the dashboard while remaining protected and excluded from indexing.

- [ ] Add bilingual Coach navigation with a distinct but coordinated Sky Dusk active state.
- [ ] Link the dashboard guidance panel to the real coach and pass no private context through the URL.
- [ ] Add responsive Guided Coach Canvas styles, 44-pixel targets, viewport-safe mobile history, visible focus, streaming/draft states, and reduced-motion parity.
- [ ] Document Groq configuration, model replacement, 30-day retention cleanup scheduling, rate-limit limitations, provider failure behavior, safety boundaries, and deletion verification without creating an example environment file.
- [ ] Run contracts, component tests, lint, and typecheck.

### Task 9: Full verification and runtime handoff

**Files:**
- Modify only files required by failures discovered during verification.

- [ ] Run `npm run typecheck`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run test`.
- [ ] Run `npm run build`.
- [ ] Restart the production server on port 3000 using the exact repository process.
- [ ] Probe `/assistant` for authentication protection and `/api/assistant` for safe unauthorized/invalid behavior.
- [ ] Verify `dist` and `.env.example` remain absent and no environment secret was modified.
- [ ] Report migrations requiring user application, provider/runtime limitations, exact test counts, routes checked, and deferred Phase 9 work without Git operations.

