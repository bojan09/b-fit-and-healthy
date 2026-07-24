# AI Coach operations

## Configuration

The coach reads `GROQ_API_KEY` only from the server environment. `GROQ_MODEL` is optional and defaults to the production model isolated in `src/features/assistant/groq.ts`. Do not prefix either variable with `NEXT_PUBLIC_`. A missing key leaves the rest of the application operational and returns a safe unavailable state from the coach.

The application uses Groq’s OpenAI-compatible Chat Completions endpoint directly through server-side `fetch`; no browser bundle contains provider credentials.

## Data and 30-day retention

Apply `supabase/migrations/202607230001_ai_coach.sql` before enabling the route in production. Conversations expire 30 days after creation. Row Level Security excludes expired conversations immediately, while `public.cleanup_expired_ai_conversations()` physically removes them and their cascading messages.

The cleanup function is intentionally unavailable to ordinary authenticated and anonymous users. Schedule it from a trusted Supabase cron or administrator context once per day:

```sql
select public.cleanup_expired_ai_conversations();
```

Users can delete an active conversation immediately from the context rail. Verify deletion by confirming both the `ai_conversations` row and its cascading `ai_messages` rows are absent.

## Safety boundary

The coach provides general education and planning support. It does not diagnose conditions, provide medical treatment, change medication, assess emergencies, or support extreme restriction. High-risk requests receive a limitation response and direction toward qualified or urgent help. The system never guesses local emergency telephone numbers.

Application records are treated as untrusted context. The provider receives a compact summary of approved categories, not raw record rows or identifiers. Model reasoning is neither requested nor stored.

## Drafts

Meal, workout, habit, and recipe proposals are stored as reviewable drafts. The browser submits only the owner’s assistant-message identifier. The server reloads and validates the stored draft, claims it against duplicate application, and then writes through owner-scoped Supabase operations. Summary cards are informational and never mutate records.

## Limits and failures

The application allows ten assistant requests per authenticated user per 60-second window on each application instance. Groq rate limits, timeout, abort, malformed output, missing configuration, and upstream failure are normalized into safe UI messages. Raw provider error bodies are not returned.

The in-memory application limiter is suitable for the current deployment scale but is not distributed across Vercel instances. Move it to a shared store during production hardening if real traffic requires a global quota.

## Model replacement

Before changing `GROQ_MODEL`, verify that the replacement is a current Groq production model supporting streaming Chat Completions and JSON-schema structured output. Run provider tests, the full test suite, and the optimized production build after any model change.

