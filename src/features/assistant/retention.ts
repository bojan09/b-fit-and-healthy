const RETENTION_DAYS = 30;

export function conversationExpiry(from = new Date()) {
  return new Date(from.getTime() + RETENTION_DAYS * 86_400_000).toISOString();
}

export function isConversationActive(expiresAt: string, now = new Date()) {
  return new Date(expiresAt).getTime() > now.getTime();
}

export function conversationTitle(message: string) {
  const normalized = message.trim().replace(/\s+/g, " ");
  return (normalized || "New conversation").slice(0, 80);
}

