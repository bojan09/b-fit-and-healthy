import "server-only";

import type { Locale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";
import type { AssistantDraft } from "@/features/assistant/types";
import { conversationExpiry, conversationTitle } from "@/features/assistant/retention";

export async function listConversations(userId: string) {
  const supabase = await createClient();
  const result = await supabase.from("ai_conversations").select("*")
    .eq("user_id", userId).gt("expires_at", new Date().toISOString())
    .order("last_message_at", { ascending: false }).limit(30);
  if (result.error) throw new Error("ASSISTANT_HISTORY_UNAVAILABLE");
  return result.data ?? [];
}

export async function getConversation(userId: string, id: string) {
  const supabase = await createClient();
  const [conversation, messages] = await Promise.all([
    supabase.from("ai_conversations").select("*").eq("id", id).eq("user_id", userId)
      .gt("expires_at", new Date().toISOString()).maybeSingle(),
    supabase.from("ai_messages").select("*").eq("conversation_id", id).eq("user_id", userId)
      .order("created_at"),
  ]);
  if (conversation.error || messages.error) throw new Error("ASSISTANT_HISTORY_UNAVAILABLE");
  if (!conversation.data) return null;
  return { ...conversation.data, messages: messages.data ?? [] };
}

export async function createConversation(userId: string, locale: Locale, firstMessage: string) {
  const supabase = await createClient();
  const result = await supabase.from("ai_conversations").insert({
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
  const supabase = await createClient();
  const result = await supabase.from("ai_messages").insert({
    conversation_id: input.conversationId,
    user_id: input.userId,
    role: input.role,
    content: input.content,
    draft: input.draft ?? null,
    status: input.status ?? "complete",
  }).select("*").single();
  if (result.error || !result.data) throw new Error("ASSISTANT_STORAGE_FAILED");
  await supabase.from("ai_conversations").update({
    last_message_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", input.conversationId).eq("user_id", input.userId);
  return result.data;
}

export async function deleteConversation(userId: string, id: string) {
  const supabase = await createClient();
  const result = await supabase.from("ai_conversations").delete().eq("id", id).eq("user_id", userId);
  if (result.error) throw new Error("ASSISTANT_DELETE_FAILED");
}

export async function getOwnedDraftMessage(userId: string, messageId: string) {
  const supabase = await createClient();
  const result = await supabase.from("ai_messages").select("id,draft,status,conversation_id,applied_at")
    .eq("id", messageId).eq("user_id", userId).eq("role", "assistant").eq("status", "complete").maybeSingle();
  if (result.error) throw new Error("ASSISTANT_HISTORY_UNAVAILABLE");
  return result.data;
}

export async function claimDraftApplication(userId: string, messageId: string) {
  const supabase = await createClient();
  const result = await supabase.from("ai_messages").update({ applied_at: new Date().toISOString() })
    .eq("id", messageId).eq("user_id", userId).is("applied_at", null).select("id").maybeSingle();
  if (result.error) throw new Error("ASSISTANT_DRAFT_APPLY_FAILED");
  return Boolean(result.data);
}

export async function releaseDraftApplication(userId: string, messageId: string) {
  const supabase = await createClient();
  await supabase.from("ai_messages").update({ applied_at: null }).eq("id", messageId).eq("user_id", userId);
}

export async function dismissDraft(userId: string, messageId: string) {
  const supabase = await createClient();
  const result = await supabase.from("ai_messages").update({ draft: null })
    .eq("id", messageId).eq("user_id", userId).eq("role", "assistant").is("applied_at", null);
  if (result.error) throw new Error("ASSISTANT_DRAFT_DISMISS_FAILED");
}
