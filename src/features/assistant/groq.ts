import "server-only";

import { getServerEnv } from "@/lib/env/server";
import { createGroqProvider } from "@/features/assistant/groq-core";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-20b";

function provider() {
  const env = getServerEnv();
  if (!env.GROQ_API_KEY) throw new Error("ASSISTANT_NOT_CONFIGURED");
  return createGroqProvider({
    apiKey: env.GROQ_API_KEY,
    model: env.GROQ_MODEL ?? DEFAULT_MODEL,
    endpoint: GROQ_ENDPOINT,
  });
}

export function streamCoachCompletion(input: Parameters<ReturnType<typeof createGroqProvider>["stream"]>[0]) {
  return provider().stream(input);
}

export function generateStructuredDraft(input: Parameters<ReturnType<typeof createGroqProvider>["draft"]>[0]) {
  return provider().draft(input);
}
