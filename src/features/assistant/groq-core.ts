import { z } from "zod";
import { assistantDraftSchema } from "@/features/assistant/schemas";
import type { AssistantDraft } from "@/features/assistant/types";

type ProviderMessage = { role: "user" | "assistant"; content: string };
type CompletionInput = { systemPrompt: string; messages: ProviderMessage[]; signal?: AbortSignal };
type ProviderConfig = {
  apiKey: string;
  model: string;
  fetcher?: typeof fetch;
  timeoutMs?: number;
  endpoint?: string;
};

type ErrorCode = "NOT_CONFIGURED" | "RATE_LIMITED" | "TIMEOUT" | "ABORTED" | "UPSTREAM_UNAVAILABLE" | "INVALID_RESPONSE";

export class GroqProviderError extends Error {
  constructor(public code: ErrorCode, public retryAfter?: number) {
    super(code);
    this.name = "GroqProviderError";
  }
}

const completionSchema = z.object({
  choices: z.array(z.object({ message: z.object({ content: z.string() }) })).min(1),
});

function requestSignal(external: AbortSignal | undefined, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), timeoutMs);
  const abort = () => controller.abort("external");
  external?.addEventListener("abort", abort, { once: true });
  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      external?.removeEventListener("abort", abort);
    },
    reason: () => controller.signal.reason,
  };
}

async function normalizeResponse(response: Response) {
  if (response.ok) return response;
  const retry = Number(response.headers.get("retry-after") ?? "0");
  if (response.status === 429) throw new GroqProviderError("RATE_LIMITED", Number.isFinite(retry) && retry > 0 ? retry : 60);
  throw new GroqProviderError("UPSTREAM_UNAVAILABLE");
}

function normalizeCaught(error: unknown, reason?: unknown): never {
  if (error instanceof GroqProviderError) throw error;
  if (error instanceof DOMException && error.name === "AbortError") {
    throw new GroqProviderError(reason === "timeout" ? "TIMEOUT" : "ABORTED");
  }
  throw new GroqProviderError("UPSTREAM_UNAVAILABLE");
}

export function createGroqProvider(config: ProviderConfig) {
  const fetcher = config.fetcher ?? fetch;
  const endpoint = config.endpoint ?? "https://api.groq.com/openai/v1/chat/completions";
  const headers = { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" };
  const timeoutMs = config.timeoutMs ?? 20_000;

  return {
    async *stream(input: CompletionInput): AsyncGenerator<string> {
      const request = requestSignal(input.signal, timeoutMs);
      try {
        const response = await normalizeResponse(await fetcher(endpoint, {
          method: "POST",
          headers,
          signal: request.signal,
          body: JSON.stringify({
            model: config.model,
            messages: [{ role: "system", content: input.systemPrompt }, ...input.messages],
            temperature: 0.35,
            max_completion_tokens: 900,
            stream: true,
          }),
        }));
        if (!response.body) throw new GroqProviderError("INVALID_RESPONSE");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          buffer += decoder.decode(value, { stream: !done });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";
          for (const event of events) {
            for (const line of event.split("\n")) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6);
              if (data === "[DONE]") return;
              try {
                const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
                const token = parsed.choices?.[0]?.delta?.content;
                if (token) yield token;
              } catch {
                throw new GroqProviderError("INVALID_RESPONSE");
              }
            }
          }
          if (done) break;
        }
      } catch (error) {
        normalizeCaught(error, request.reason());
      } finally {
        request.cleanup();
      }
    },

    async draft(input: CompletionInput): Promise<AssistantDraft> {
      const request = requestSignal(input.signal, timeoutMs);
      try {
        const response = await normalizeResponse(await fetcher(endpoint, {
          method: "POST",
          headers,
          signal: request.signal,
          body: JSON.stringify({
            model: config.model,
            messages: [{ role: "system", content: input.systemPrompt }, ...input.messages],
            temperature: 0.2,
            max_completion_tokens: 1200,
            response_format: {
              type: "json_schema",
              json_schema: { name: "assistant_draft", strict: true, schema: z.toJSONSchema(assistantDraftSchema) },
            },
          }),
        }));
        const payload = completionSchema.safeParse(await response.json());
        if (!payload.success) throw new GroqProviderError("INVALID_RESPONSE");
        const draft = assistantDraftSchema.safeParse(JSON.parse(payload.data.choices[0].message.content));
        if (!draft.success) throw new GroqProviderError("INVALID_RESPONSE");
        return draft.data;
      } catch (error) {
        normalizeCaught(error, request.reason());
      } finally {
        request.cleanup();
      }
    },
  };
}

