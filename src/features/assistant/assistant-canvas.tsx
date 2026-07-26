"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Bot, Send, ShieldCheck, Square, Target, TrendingUp } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { AssistantContext, AssistantConversationDetail, AssistantConversationSummary, AssistantDraft, AssistantStreamEvent, AssistantUiMessage } from "@/features/assistant/types";
import { getAssistantContent } from "@/features/assistant/content";
import { ConversationList } from "@/features/assistant/conversation-list";
import { MessageList } from "@/features/assistant/message-list";
import { deleteAssistantConversationAction } from "@/features/assistant/draft-actions";

function eventPayload(block: string): AssistantStreamEvent | null {
  const line = block.split("\n").find((item) => item.startsWith("data: "));
  if (!line) return null;
  try { return JSON.parse(line.slice(6)) as AssistantStreamEvent; } catch { return null; }
}

export function AssistantCanvas({ locale, conversations, initialConversation, context }: {
  locale: Locale;
  conversations: AssistantConversationSummary[];
  initialConversation: AssistantConversationDetail | null;
  context: AssistantContext | null;
}) {
  const c = getAssistantContent(locale);
  const router = useRouter();
  const [messages, setMessages] = useState<AssistantUiMessage[]>(initialConversation?.messages ?? []);
  const [conversationId, setConversationId] = useState(initialConversation?.id);
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  const composer = useRef<HTMLTextAreaElement | null>(null);

  const requestChanges = (draft: AssistantDraft) => {
    setValue(locale === "mk" ? `Промени го предлогот „${draft.title}“: ` : `Change the “${draft.title}” draft: `);
    composer.current?.focus();
  };

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    const message = value.trim();
    if (!message || pending) return;
    setValue("");
    setError("");
    setPending(true);
    const userId = `local-user-${Date.now()}`;
    const assistantId = `local-assistant-${Date.now()}`;
    setMessages((current) => [...current,
      { id: userId, role: "user", content: message, draft: null, status: "complete", appliedAt: null },
      { id: assistantId, role: "assistant", content: "", draft: null, status: "complete", appliedAt: null },
    ]);
    controller.current = new AbortController();
    let nextConversation = conversationId;
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, ...(conversationId ? { conversationId } : {}) }),
        signal: controller.current.signal,
      });
      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => ({})) as { error?: string; retryAfter?: number };
        throw new Error(payload.error === "RATE_LIMITED" ? (locale === "mk" ? "Почекајте малку и обидете се повторно." : "Please wait a moment and try again.") : (locale === "mk" ? "Тренерот е недостапен." : "The coach is unavailable."));
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value: chunk } = await reader.read();
        buffer += decoder.decode(chunk, { stream: !done });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";
        for (const block of blocks) {
          const payload = eventPayload(block);
          if (!payload) continue;
          if (payload.type === "meta") {
            nextConversation = payload.conversationId;
            setConversationId(payload.conversationId);
          }
          if (payload.type === "token") setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, content: item.content + payload.value } : item));
          if (payload.type === "draft") setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, id: payload.messageId ?? item.id, draft: payload.value } : item));
          if (payload.type === "done") setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, id: payload.messageId } : item));
          if (payload.type === "error") throw new Error(payload.message);
        }
        if (done) break;
      }
      if (nextConversation && !conversationId) router.replace(`/assistant?conversation=${nextConversation}`);
      router.refresh();
    } catch (reason) {
      const stopped = controller.current?.signal.aborted;
      setError(stopped ? (locale === "mk" ? "Генерирањето е прекинато." : "Generation stopped.") : reason instanceof Error ? reason.message : (locale === "mk" ? "Настана грешка." : "Something went wrong."));
      setMessages((current) => current.filter((item) => item.id !== assistantId || item.content));
    } finally {
      setPending(false);
      controller.current = null;
    }
  }

  return <main id="main-content" className="shell assistant-page">
    <ConversationList locale={locale} conversations={conversations} selectedId={conversationId} />
    <section className="assistant-workspace">
      <header className="assistant-page-header"><div className="assistant-orb"><Bot /></div><div><p className="eyebrow">{c.eyebrow}</p><h1>{messages.length ? initialConversation?.title ?? c.title : c.title}</h1><p>{c.subtitle}</p></div></header>
      {messages.length === 0 && <div className="assistant-prompt-row" role="group" aria-label={locale === "mk" ? "Почетни прашања" : "Starter questions"}>{c.prompts.map((prompt) => <button key={prompt} type="button" onClick={() => { setValue(prompt); composer.current?.focus(); }}>{prompt}</button>)}</div>}
      <MessageList locale={locale} messages={messages} pending={pending} onRequestChanges={requestChanges} />
      {error && <p className="assistant-error" role="alert">{error}</p>}
      <form className="assistant-composer" onSubmit={submit}>
        <label htmlFor="assistant-message">{c.composer}</label>
        <div><textarea ref={composer} id="assistant-message" value={value} maxLength={2000} rows={2} placeholder={c.placeholder} onChange={(event) => setValue(event.target.value)} disabled={pending} />
          {pending ? <button type="button" className="button button-secondary" onClick={() => controller.current?.abort()}><Square />{c.stop}</button> : <button type="submit" className="button button-primary" disabled={!value.trim()}><Send />{c.send}</button>}
        </div><span>{value.length} / 2,000</span>
      </form>
      <p className="assistant-limitation"><ShieldCheck />{c.limitations}</p>
    </section>
    <aside className="assistant-context-rail" aria-label={c.context}>
      <section><p className="eyebrow">{c.context}</p><h2>{c.today}</h2>{context ? <dl><div><dt>Energy</dt><dd>{context.today.energyKcal.toLocaleString()} kcal</dd></div><div><dt>Protein</dt><dd>{context.today.proteinG} g</dd></div><div><dt>Water</dt><dd>{context.today.waterMl.toLocaleString()} ml</dd></div><div><dt>Movement</dt><dd>{context.today.movementMinutes} min</dd></div></dl> : <p>{locale === "mk" ? "Нема достапен контекст." : "No context is available yet."}</p>}</section>
      <section><TrendingUp /><h2>{c.trends}</h2>{context ? <p>{context.trends.workoutsCompleted} {locale === "mk" ? "тренинзи ·" : "workouts ·"} {context.trends.habitCompletionRate ?? 0}% {locale === "mk" ? "навики" : "habits"}</p> : <p>—</p>}</section>
      <section><Target /><h2>{locale === "mk" ? "Активни цели" : "Active goals"}</h2><p>{context?.goals.join(" · ") || (locale === "mk" ? "Нема поставени цели" : "No goals set")}</p></section>
      <section className="assistant-privacy-card"><ShieldCheck /><h2>{c.privacy}</h2><p>{c.retention}</p>{initialConversation && <form action={deleteAssistantConversationAction}><input type="hidden" name="conversationId" value={initialConversation.id} /><button className="button button-ghost">{c.delete}</button></form>}</section>
    </aside>
  </main>;
}
