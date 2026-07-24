"use client";

import { Bot, UserRound } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { AssistantDraft, AssistantUiMessage } from "@/features/assistant/types";
import { getAssistantContent } from "@/features/assistant/content";
import { DraftCard } from "@/features/assistant/draft-card";

export function MessageList({ locale, messages, pending, onRequestChanges }: {
  locale: Locale;
  messages: AssistantUiMessage[];
  pending: boolean;
  onRequestChanges: (draft: AssistantDraft) => void;
}) {
  const c = getAssistantContent(locale);
  return <div className="assistant-messages" aria-live="polite" aria-busy={pending}>
    {messages.map((message) => <article key={message.id} className={`assistant-message ${message.role}`}>
      <div className="assistant-message-author">{message.role === "user" ? <UserRound /> : <Bot />}<span>{message.role === "user" ? c.user : c.assistant}</span></div>
      <p>{message.content}</p>
      {message.draft && <DraftCard locale={locale} draft={message.draft} messageId={message.id} applied={Boolean(message.appliedAt)} onRequestChanges={onRequestChanges} />}
    </article>)}
    {pending && <p className="assistant-thinking" role="status">{c.thinking}</p>}
  </div>;
}

