const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(/\/$/, "");
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.APPWRITE_DATABASE_ID || "bfit-health";
const apiKey = process.env.APPWRITE_API_KEY;
if (!endpoint || !projectId || !databaseId || !apiKey) throw new Error("Set Appwrite endpoint, project, database, and server API key before running retention cleanup.");
const headers = { "X-Appwrite-Project": projectId, "X-Appwrite-Key": apiKey, "Content-Type": "application/json" };
async function call(route, method = "GET") {
  const response = await fetch(endpoint + route, { method, headers, cache: "no-store" });
  const raw = await response.text(); const body = raw ? JSON.parse(raw) : null;
  if (!response.ok) throw new Error(`Appwrite ${method} failed (${response.status}): ${body?.message || response.statusText}`);
  return body;
}
async function expiredConversations() {
  const found = []; const filter = JSON.stringify({ method: "lessThan", attribute: "expires_at", values: [new Date().toISOString()] });
  for (let offset = 0; ; offset += 100) {
    const query = new URLSearchParams(); query.append("queries[]", filter); query.append("queries[]", JSON.stringify({ method: "limit", values: [100] })); query.append("queries[]", JSON.stringify({ method: "offset", values: [offset] }));
    const page = await call(`/tablesdb/${encodeURIComponent(databaseId)}/tables/ai_conversations/rows?${query}`); found.push(...page.rows); if (found.length >= page.total || !page.rows.length) return found;
  }
}
async function deleteConversationMessages(conversationId) {
  let deleted = 0; const filter = JSON.stringify({ method: "equal", attribute: "conversation_id", values: [conversationId] });
  for (;;) {
    const query = new URLSearchParams(); query.append("queries[]", filter); query.append("queries[]", JSON.stringify({ method: "limit", values: [100] }));
    const page = await call(`/tablesdb/${encodeURIComponent(databaseId)}/tables/ai_messages/rows?${query}`);
    if (!page.rows.length) return deleted;
    for (const row of page.rows) { await call(`/tablesdb/${encodeURIComponent(databaseId)}/tables/ai_messages/rows/${encodeURIComponent(row.$id)}`, "DELETE"); deleted += 1; }
  }
}
const conversations = await expiredConversations();
for (const conversation of conversations) { await deleteConversationMessages(conversation.$id); await call(`/tablesdb/${encodeURIComponent(databaseId)}/tables/ai_conversations/rows/${encodeURIComponent(conversation.$id)}`, "DELETE"); }
console.log(`Removed ${conversations.length} expired assistant conversations and their messages.`);
