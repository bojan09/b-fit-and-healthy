import { consumeLocalLimit, rateLimits, resetLocalLimits } from "@/lib/rate-limit";

export function consumeAssistantLimit(key: string, now = Date.now()) {
  return consumeLocalLimit("assistant", key, rateLimits.assistant, now);
}

export function resetAssistantLimits() {
  resetLocalLimits();
}
