import { describe, expect, it, vi } from "vitest";
import { createGroqProvider, GroqProviderError } from "@/features/assistant/groq-core";

const provider = (fetcher: typeof fetch) => createGroqProvider({
  apiKey: "secret-key",
  model: "openai/gpt-oss-20b",
  fetcher,
  timeoutMs: 5_000,
});

describe("Groq provider", () => {
  it("streams visible token deltas with server credentials", async () => {
    const body = [
      'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":" Ana"}}]}\n\n',
      "data: [DONE]\n\n",
    ].join("");
    const fetcher = vi.fn(async (_url, init) => {
      expect(init?.headers).toMatchObject({ Authorization: "Bearer secret-key" });
      expect(String(init?.body)).toContain("openai/gpt-oss-20b");
      return new Response(body, { status: 200, headers: { "content-type": "text/event-stream" } });
    }) as unknown as typeof fetch;
    const chunks: string[] = [];
    for await (const token of provider(fetcher).stream({ systemPrompt: "Guide safely", messages: [{ role: "user", content: "Hello" }] })) chunks.push(token);
    expect(chunks.join("")).toBe("Hello Ana");
  });

  it("returns a validated structured draft", async () => {
    const draft = { kind: "habit", title: "Daily walk", habitTitle: "Walk for 10 minutes" };
    const fetcher = vi.fn(async () => new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify(draft) } }],
    }), { status: 200 })) as unknown as typeof fetch;
    await expect(provider(fetcher).draft({
      systemPrompt: "Create a draft", messages: [{ role: "user", content: "Help me walk more" }],
    })).resolves.toEqual(draft);
  });

  it("normalizes rate limits and hides upstream error bodies", async () => {
    const fetcher = vi.fn(async () => new Response("sensitive upstream detail", {
      status: 429,
      headers: { "retry-after": "7" },
    })) as unknown as typeof fetch;
    await expect(provider(fetcher).draft({
      systemPrompt: "Guide safely", messages: [{ role: "user", content: "Hello" }],
    })).rejects.toMatchObject({ code: "RATE_LIMITED", retryAfter: 7 });
    try {
      await provider(fetcher).draft({ systemPrompt: "x", messages: [{ role: "user", content: "x" }] });
    } catch (error) {
      expect(error).toBeInstanceOf(GroqProviderError);
      expect(String(error)).not.toContain("sensitive upstream detail");
    }
  });

  it("rejects malformed structured output", async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({
      choices: [{ message: { content: "{\"kind\":\"diagnosis\"}" } }],
    }), { status: 200 })) as unknown as typeof fetch;
    await expect(provider(fetcher).draft({
      systemPrompt: "Create a draft", messages: [{ role: "user", content: "Diagnose me" }],
    })).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
  });
});
