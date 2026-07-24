# Phase 8 AI Coach and Personalization Design

## Status

Approved for implementation on 23 July 2026.

## Objective

Build a private, bilingual Groq-powered AI Coach that turns the user’s current goals, preferences, today’s records, and summarized 30-day trends into educational guidance and reviewable drafts. The coach must never diagnose, prescribe treatment, or silently modify application data.

## Approved Product Decisions

- Use the **Guided Coach Canvas**: a focused conversation, compact context rail, and visible draft cards.
- Save conversations automatically and delete them after 30 days.
- Allow users to delete a conversation immediately.
- The coach prepares drafts only. Every application change requires explicit user review and confirmation.
- Context is limited to profile, goals, preferences, today’s records, and summarized trends from the preceding 30 days.
- Phase 8 includes educational Q&A, meal and recipe suggestions, workout-session suggestions, habit suggestions, weekly summaries, and reviewed draft application.
- Complete multi-week program generation and autonomous coaching are deferred.
- English is primary; the coach follows the active English or Macedonian application locale.

## Experience

The protected `/assistant` route uses a two-column desktop composition and a single-column mobile composition.

### Conversation canvas

- Welcome copy and starter prompts reflect the active locale and available context.
- Messages are clearly attributed to the user or coach.
- Assistant text streams progressively and exposes stop and retry controls.
- The composer remains reachable without covering conversation content.
- Draft cards are visually distinct from conversational guidance.
- Each draft exposes review, edit, confirm, and discard controls.
- Confirming a draft invokes a separate authenticated application mutation.
- Empty, loading, offline, unavailable, rate-limited, aborted, and failed states use useful copy rather than technical errors.

### Context rail

- Shows the context categories used, not raw private records.
- Summarizes today’s available nutrition, movement, and habit context.
- Names active goals and preference categories when present.
- Shows the conversation expiry date.
- Provides new-conversation and delete-conversation controls.

### History

- Recent conversations are ordered by most recent activity.
- Titles are generated from the first user request with a deterministic fallback.
- History is private, keyboard reachable, and usable from a mobile drawer.
- Expired conversations are excluded even before physical cleanup runs.

## Architecture

### Provider boundary

`src/features/assistant/groq.ts` is server-only. It calls Groq’s OpenAI-compatible Chat Completions endpoint using `fetch`, avoiding a new SDK dependency. The model identifier is isolated in server configuration and defaults to a current production model. The API key never reaches client code, logs, stored messages, or error payloads.

Normal guidance uses server-sent event streaming. Draft generation uses JSON-schema structured output followed by local Zod validation. No Groq built-in browsing, remote tools, code execution, or arbitrary tool execution is enabled.

### Application boundary

- `context.ts` loads and minimizes approved application data.
- `safety.ts` classifies requests that require a health-information boundary.
- `schemas.ts` owns message, provider, draft, and action schemas.
- `repository.ts` owns conversation persistence and retention filtering.
- `rate-limit.ts` enforces a bounded per-user in-memory request window suitable for a single Vercel instance and returns explicit retry information.
- `stream.ts` orchestrates authentication, limits, context, provider calls, persistence, and SSE events.
- `draft-actions.ts` applies only validated user-confirmed drafts through owner-scoped Supabase mutations.

The model may propose one of these draft types:

- `meal`: a meal-plan item with date, meal slot, label, and servings.
- `workout`: a workout template with a name, duration, and known exercise slugs.
- `habit`: a habit title.
- `recipe`: an educational recipe proposal saved as a custom private recipe.
- `summary`: a non-mutating weekly progress summary.

Unknown exercise slugs, invalid dates, unsafe quantities, excessive text, and unsupported draft kinds are rejected before review or application.

## Data Model and Retention

### `ai_conversations`

- `id uuid`
- `user_id uuid`
- `locale en|mk`
- `title text`
- `expires_at timestamptz`, defaulting to 30 days after creation
- `last_message_at timestamptz`
- `created_at`, `updated_at`

### `ai_messages`

- `id uuid`
- `conversation_id uuid`
- `user_id uuid`
- `role user|assistant`
- `content text`
- `draft jsonb`, nullable
- `status complete|aborted|failed`
- `created_at`

Row Level Security restricts both tables to `auth.uid() = user_id`. Messages cascade when conversations are deleted. Database constraints limit content size and validate roles/statuses. A security-definer cleanup function deletes expired conversations, and ordinary reads also require `expires_at > now()` so expired data is inaccessible before scheduled cleanup.

The application does not persist:

- Full context snapshots.
- Model reasoning or hidden chain-of-thought.
- API keys or provider metadata containing secrets.
- Raw rate-limit payloads.
- Unconfirmed application records.

## Safety

- The server prompt defines the coach as an educational fitness, nutrition, and habit assistant.
- It must not diagnose conditions, prescribe treatment, interpret emergencies, recommend medication changes, or promote extreme restriction or unsafe training.
- High-risk requests receive a short, calm limitation statement and appropriate professional or urgent-care direction without fabricating local contact details.
- User records are wrapped as untrusted data and cannot override system instructions.
- User input is limited to 2,000 characters; stored assistant content is limited to 12,000 characters.
- Provider output is capped, time-bounded, and abortable.
- One generation may run per conversation in the client, and the server enforces per-user request limits.
- Provider errors are normalized; raw upstream bodies are never returned to the browser.

## Rate Limits and Resilience

- Default local limit: 10 requests per user per 60 seconds.
- Provider `429` responses return a retryable application event using Groq’s `retry-after` header when available.
- Timeouts, aborts, malformed output, missing configuration, authentication failures, and storage failures have distinct safe error codes.
- If Groq is unavailable, existing application tracking remains unaffected and the coach displays a useful unavailable state.
- The model ID is configurable through `GROQ_MODEL` while `GROQ_API_KEY` remains required only when the assistant is used.

## Accessibility and Responsive Behavior

- Conversation updates use a polite live region without announcing every token.
- Send, stop, retry, review, confirm, discard, delete, and history controls have explicit accessible names.
- Focus moves predictably when a draft opens or a conversation is deleted.
- Draft review uses semantic forms and visible labels.
- Touch targets are at least 44 CSS pixels.
- Mobile history uses a viewport-safe drawer; the context rail moves below the conversation.
- Motion is limited to existing CSS transitions and respects reduced motion.

## Verification

- Contract tests cover routes, protected navigation, server-only provider access, migration constraints, RLS, retention, and cleanup.
- Unit tests cover schemas, context minimization, safety classification, rate limits, SSE formatting, and provider error normalization.
- Component tests cover welcome prompts, streaming, cancellation, draft cards, review/application, deletion, keyboard behavior, and error states.
- Existing Phase 1–7 tests must remain green.
- TypeScript, lint, unit tests, contract tests, and the optimized production build must pass.
- Runtime probes cover `/assistant` authentication protection and safe API behavior.

## Deferred

- Multi-week autonomous programs.
- Automatic writes or background coaching actions.
- Web search and remote tools.
- Voice input/output.
- Semantic vector memory.
- Conversation retention longer than 30 days.
- Cross-instance distributed rate limiting; production hardening may move the limiter to a shared store if traffic requires it.
- GSAP and Three.js, which remain Phase 9 work.

