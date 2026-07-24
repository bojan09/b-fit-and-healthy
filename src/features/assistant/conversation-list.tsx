import Link from "next/link";
import { MessageSquarePlus, MessagesSquare } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { AssistantConversationSummary } from "@/features/assistant/types";
import { getAssistantContent } from "@/features/assistant/content";

export function ConversationList({ locale, conversations, selectedId }: {
  locale: Locale;
  conversations: AssistantConversationSummary[];
  selectedId?: string;
}) {
  const c = getAssistantContent(locale);
  const items = conversations.length === 0 ? <p>{c.noHistory}</p> : <nav>{conversations.map((conversation) =>
    <Link key={conversation.id} href={`/assistant?conversation=${conversation.id}`} aria-current={selectedId === conversation.id ? "page" : undefined}>
      <MessagesSquare aria-hidden="true" /><span>{conversation.title}</span>
    </Link>
  )}</nav>;
  return <>
  <aside className="assistant-history assistant-history-desktop" aria-label={c.history}>
    <Link className="assistant-new-link" href="/assistant"><MessageSquarePlus aria-hidden="true" />{c.newConversation}</Link>
    <h2>{c.history}</h2>
    {items}
  </aside>
  <details className="assistant-history assistant-history-mobile">
    <summary>{c.history}</summary>
    <Link className="assistant-new-link" href="/assistant"><MessageSquarePlus aria-hidden="true" />{c.newConversation}</Link>
    {items}
  </details>
  </>;
}
