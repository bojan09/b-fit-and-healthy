# AI Coach operations

## Configuration

The coach reads `GROQ_API_KEY` only from the server environment. `GROQ_MODEL` is optional and defaults to the production model in `src/features/assistant/groq.ts`. Do not prefix either variable with `NEXT_PUBLIC_`. Without a key, the rest of the application remains available and the coach returns a safe unavailable state.

The application calls Groq's OpenAI-compatible Chat Completions endpoint from the server. Provider credentials are not included in the browser bundle.

## Data and 30-day retention

Apply the Appwrite TablesDB schema in [schema.json](../src/lib/appwrite/schema.json) before production. Conversations are hidden after 30 days. To physically remove expired conversations and their messages, schedule `npm run appwrite:cleanup:assistant` daily on a trusted server. The cleanup deletes messages before their conversation because TablesDB does not provide foreign-key cascades. Keep its server API key private and limit its scopes to the required assistant-table row operations.

Users can delete a conversation from the context rail. The application removes its messages before removing the conversation.

## Safety boundary

The coach provides general education and planning support. It does not diagnose conditions, provide medical treatment, change medication, assess emergencies, or support extreme restriction. High-risk requests receive a limitation response and direction toward qualified or urgent help. The system never guesses local emergency telephone numbers.

Application records are treated as untrusted context. The provider receives a compact summary of approved categories, not raw record rows or identifiers. Model reasoning is neither requested nor stored.

## Drafts

Meal, workout, habit, and recipe proposals are stored as reviewable drafts. The browser submits only the owner's assistant-message identifier. The server reloads and validates the stored draft, claims it against duplicate application, and writes through owner-scoped Appwrite operations. Summary cards are informational and never mutate records.

## Limits and failures

The application allows ten assistant requests per authenticated user per 60-second window on each application instance. Groq rate limits, timeout, abort, malformed output, missing configuration, and upstream failure are normalized into safe UI messages. Raw provider error bodies are not returned.

The in-memory application limiter is not shared across Vercel instances. Use a shared store before relying on a global quota across multiple instances.

## Model replacement

Before changing `GROQ_MODEL`, verify that the replacement is a current Groq production model supporting streaming Chat Completions and JSON-schema structured output. Run provider tests, the full test suite, and the optimized production build after any model change.
