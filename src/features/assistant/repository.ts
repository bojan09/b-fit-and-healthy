import "server-only";

import type { Locale } from "@/lib/i18n/config";
import { createClient } from "@/lib/appwrite/server";
import type { AssistantDraft } from "@/features/assistant/types";
import { conversationExpiry, conversationTitle } from "@/features/assistant/retention";

export async function listConversations(userId: string) {
  const appwrite = await createClient();
  const result = await appwrite.table("ai_conversations").select("*")
    .eq("user_id", userId).gt("expires_at", new Date().toISOString())
    .order("last_message_at", { ascending: false }).limit(30);
  if (result.error) throw new Error("ASSISTANT_HISTORY_UNAVAILABLE");
  return result.data ?? [];
}

export async function getConversation(userId: string, id: string) {
  const appwrite = await createClient();
  const [conversation, messages] = await Promise.all([
    appwrite.table("ai_conversations").select("*").eq("id", id).eq("user_id", userId)
      .gt("expires_at", new Date().toISOString()).maybeSingle(),
    appwrite.table("ai_messages").select("*").eq("conversation_id", id).eq("user_id", userId)
      .order("created_at"),
  ]);
  if (conversation.error || messages.error) throw new Error("ASSISTANT_HISTORY_UNAVAILABLE");
  if (!conversation.data) return null;
  return { ...conversation.data, messages: messages.data ?? [] };
}

export async function createConversation(userId: string, locale: Locale, firstMessage: string) {
  const appwrite = await createClient();
  const result = await appwrite.table("ai_conversations").insert({
    user_id: userId,
    locale,
    title: conversationTitle(firstMessage),
    expires_at: conversationExpiry(),
  }).select("*").single();
  if (result.error || !result.data) throw new Error("ASSISTANT_STORAGE_FAILED");
  return result.data;
}

export async function appendMessage(input: {
  conversationId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  draft?: AssistantDraft | null;
  status?: "complete" | "aborted" | "failed";
}) {
  const appwrite = await createClient();
  const result = await appwrite.table("ai_messages").insert({
    conversation_id: input.conversationId,
    user_id: input.userId,
    role: input.role,
    content: input.content,
    draft: input.draft ?? null,
    status: input.status ?? "complete",
  }).select("*").single();
  if (result.error || !result.data) throw new Error("ASSISTANT_STORAGE_FAILED");
  await appwrite.table("ai_conversations").update({
    last_message_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", input.conversationId).eq("user_id", input.userId);
  return result.data;
}

export async function deleteConversation(userId: string, id: string) {
  const appwrite = await createClient();
  for (;;) {
    const messages = await appwrite.table("ai_messages").select("id").eq("conversation_id", id).eq("user_id", userId).limit(100);
    if (messages.error) throw new Error("ASSISTANT_DELETE_FAILED");
    const ids = (messages.data ?? []).map((row) => row.id);
    if (!ids.length) break;
    const removed = await appwrite.table("ai_messages").delete().in("id", ids).eq("user_id", userId);
    if (removed.error) throw new Error("ASSISTANT_DELETE_FAILED");
  }
  const result = await appwrite.table("ai_conversations").delete().eq("id", id).eq("user_id", userId);
  if (result.error) throw new Error("ASSISTANT_DELETE_FAILED");
}

export async function getOwnedDraftMessage(userId: string, messageId: string) {
  const appwrite = await createClient();
  const result = await appwrite.table("ai_messages").select("id,draft,status,conversation_id,applied_at")
    .eq("id", messageId).eq("user_id", userId).eq("role", "assistant").eq("status", "complete").maybeSingle();
  if (result.error) throw new Error("ASSISTANT_HISTORY_UNAVAILABLE");
  return result.data;
}

export async function claimDraftApplication(userId: string, messageId: string) {
  const appwrite = await createClient();
  const result = await appwrite.table("ai_messages").update({ applied_at: new Date().toISOString() })
    .eq("id", messageId).eq("user_id", userId).is("applied_at", null).select("id").maybeSingle();
  if (result.error) throw new Error("ASSISTANT_DRAFT_APPLY_FAILED");
  return Boolean(result.data);
}

export async function releaseDraftApplication(userId: string, messageId: string) {
  const appwrite = await createClient();
  await appwrite.table("ai_messages").update({ applied_at: null }).eq("id", messageId).eq("user_id", userId);
}

export async function dismissDraft(userId: string, messageId: string) {
  const appwrite = await createClient();
  const result = await appwrite.table("ai_messages").update({ draft: null })
    .eq("id", messageId).eq("user_id", userId).eq("role", "assistant").is("applied_at", null);
  if (result.error) throw new Error("ASSISTANT_DRAFT_DISMISS_FAILED");
}
