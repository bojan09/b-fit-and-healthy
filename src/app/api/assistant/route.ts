import { NextResponse } from "next/server";
import { assistantRequestSchema } from "@/features/assistant/schemas";
import { appendMessage, createConversation, getConversation } from "@/features/assistant/repository";
import { buildAssistantContext } from "@/features/assistant/context";
import { buildSafetyResponse, buildSystemPrompt, classifySafety } from "@/features/assistant/safety";
import { consumeAssistantLimit } from "@/features/assistant/rate-limit";
import { generateStructuredDraft, streamCoachCompletion } from "@/features/assistant/groq";
import { encodeAssistantEvent, inferDraftKind, safeAssistantError } from "@/features/assistant/stream-domain";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/server";
import type { AssistantDraft, AssistantStreamEvent } from "@/features/assistant/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const encoder = new TextEncoder();
const headers = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-store, no-cache, must-revalidate",
  Connection: "keep-alive",
};

function streamResponse(run: (emit: (event: AssistantStreamEvent) => void) => Promise<void>) {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: AssistantStreamEvent) => controller.enqueue(encoder.encode(encodeAssistantEvent(event)));
      try {
        await run(emit);
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }
  const parsed = assistantRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });

  const limit = consumeAssistantLimit(user.id);
  if (!limit.allowed) {
    return NextResponse.json({ error: "RATE_LIMITED", retryAfter: limit.retryAfter }, {
      status: 429,
      headers: { "Retry-After": String(limit.retryAfter), "Cache-Control": "no-store" },
    });
  }

  const locale = await getLocale();
  return streamResponse(async (emit) => {
    let conversationId = parsed.data.conversationId;
    let expiresAt = "";
    try {
      if (conversationId) {
        const existing = await getConversation(user.id, conversationId);
        if (!existing) {
          emit({ type: "error", code: "CONVERSATION_NOT_FOUND", message: locale === "mk" ? "Разговорот не е пронајден." : "Conversation not found." });
          return;
        }
        expiresAt = existing.expires_at;
      } else {
        const created = await createConversation(user.id, locale, parsed.data.message);
        conversationId = created.id;
        expiresAt = created.expires_at;
      }
      emit({ type: "meta", conversationId, expiresAt });
      await appendMessage({ conversationId, userId: user.id, role: "user", content: parsed.data.message });

      const category = classifySafety(parsed.data.message);
      if (category !== "general") {
        const content = buildSafetyResponse(category, locale);
        emit({ type: "token", value: content });
        const saved = await appendMessage({ conversationId, userId: user.id, role: "assistant", content });
        emit({ type: "done", messageId: saved.id });
        return;
      }

      const [context, conversation] = await Promise.all([
        buildAssistantContext(user.id, locale),
        getConversation(user.id, conversationId),
      ]);
      const systemPrompt = buildSystemPrompt(locale, context);
      const history = (conversation?.messages ?? []).slice(-12).map((message) => ({
        role: message.role as "user" | "assistant",
        content: message.content,
      }));
      let content = "";
      for await (const token of streamCoachCompletion({ systemPrompt, messages: history, signal: request.signal })) {
        content += token;
        emit({ type: "token", value: token });
      }

      const expectedKind = inferDraftKind(parsed.data.message);
      let draft: AssistantDraft | null = null;
      if (expectedKind) {
        const generated = await generateStructuredDraft({
          systemPrompt: `${systemPrompt}\nReturn exactly one ${expectedKind} draft. It remains uncommitted until review.`,
          messages: history,
          signal: request.signal,
        });
        if (generated.kind === expectedKind) draft = generated;
      }
      const visibleContent = content.trim() || (locale === "mk" ? "Подготвив предлог за преглед." : "I prepared a proposal for review.");
      const saved = await appendMessage({
        conversationId,
        userId: user.id,
        role: "assistant",
        content: visibleContent,
        draft,
      });
      if (draft) emit({ type: "draft", value: draft, messageId: saved.id });
      emit({ type: "done", messageId: saved.id });
    } catch (error) {
      emit(safeAssistantError(error, locale));
      if (conversationId) {
        const message = locale === "mk" ? "Одговорот не можеше да се заврши." : "The response could not be completed.";
        try {
          await appendMessage({
            conversationId,
            userId: user.id,
            role: "assistant",
            content: message,
            status: request.signal.aborted ? "aborted" : "failed",
          });
        } catch {
          // The visible stream error remains the source of truth when persistence is unavailable.
        }
      }
    }
  });
}

