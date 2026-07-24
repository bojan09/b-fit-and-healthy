import { AssistantCanvas } from "@/features/assistant/assistant-canvas";
import { assistantDraftSchema } from "@/features/assistant/schemas";
import { buildAssistantContext } from "@/features/assistant/context";
import { getConversation, listConversations } from "@/features/assistant/repository";
import { requireUser } from "@/features/auth/session";
import { getLocale } from "@/lib/i18n/server";
import type { AssistantConversationDetail, AssistantConversationSummary } from "@/features/assistant/types";

export default async function AssistantPage({ searchParams }: { searchParams: Promise<{ conversation?: string }> }) {
  const user = await requireUser();
  const locale = await getLocale();
  const selectedId = (await searchParams).conversation;
  const [historyResult, contextResult] = await Promise.allSettled([
    listConversations(user.id),
    buildAssistantContext(user.id, locale),
  ]);
  const conversations: AssistantConversationSummary[] = historyResult.status === "fulfilled"
    ? historyResult.value.map((item) => ({ id: item.id, title: item.title, locale: item.locale, expiresAt: item.expires_at, lastMessageAt: item.last_message_at }))
    : [];
  let initialConversation: AssistantConversationDetail | null = null;
  if (selectedId) {
    try {
      const found = await getConversation(user.id, selectedId);
      if (found) initialConversation = {
        id: found.id,
        title: found.title,
        locale: found.locale,
        expiresAt: found.expires_at,
        lastMessageAt: found.last_message_at,
        messages: found.messages.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          draft: assistantDraftSchema.safeParse(message.draft).success ? assistantDraftSchema.parse(message.draft) : null,
          status: message.status,
          appliedAt: message.applied_at,
        })),
      };
    } catch {
      initialConversation = null;
    }
  }
  return <AssistantCanvas locale={locale} conversations={conversations} initialConversation={initialConversation} context={contextResult.status === "fulfilled" ? contextResult.value : null} />;
}

