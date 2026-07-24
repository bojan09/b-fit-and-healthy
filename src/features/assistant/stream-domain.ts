import type { Locale } from "@/lib/i18n/config";
import type { AssistantDraft, AssistantStreamEvent } from "@/features/assistant/types";
import { GroqProviderError } from "@/features/assistant/groq-core";

export function encodeAssistantEvent(event: AssistantStreamEvent) {
  return `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
}

export function inferDraftKind(input: string): AssistantDraft["kind"] | null {
  const text = input.toLocaleLowerCase();
  if (/\b(review|summari[sz]e|recap).{0,20}\b(week|progress)\b|преглед.{0,20}недел|резиме/.test(text)) return "summary";
  if (/\b(recipe|cook|meal idea)\b|рецепт|готв/.test(text)) return "recipe";
  if (/\b(workout|training session|exercise session)\b|тренинг|вежба/.test(text)) return "workout";
  if (/\b(habit|routine|consistency)\b|навик|рутин/.test(text)) return "habit";
  if (/\b(meal|dinner|lunch|breakfast|snack)\b|оброк|вечер|ручек|појадок/.test(text)) return "meal";
  return null;
}

const messages: Record<Locale, Record<string, string>> = {
  en: {
    RATE_LIMITED: "The coach is receiving many requests. Please wait a moment and try again.",
    TIMEOUT: "The coach took too long to respond. Please try again.",
    ABORTED: "Generation stopped.",
    NOT_CONFIGURED: "The coach is not configured yet.",
    ASSISTANT_UNAVAILABLE: "The coach is temporarily unavailable. Your other records are unaffected.",
  },
  mk: {
    RATE_LIMITED: "Тренерот прима многу барања. Почекајте малку и обидете се повторно.",
    TIMEOUT: "На тренерот му требаше предолго да одговори. Обидете се повторно.",
    ABORTED: "Генерирањето е прекинато.",
    NOT_CONFIGURED: "Тренерот сè уште не е конфигуриран.",
    ASSISTANT_UNAVAILABLE: "Тренерот е привремено недостапен. Вашите други записи не се засегнати.",
  },
};

export function safeAssistantError(error: unknown, locale: Locale): Extract<AssistantStreamEvent, { type: "error" }> {
  if (error instanceof GroqProviderError) {
    const code = ["RATE_LIMITED", "TIMEOUT", "ABORTED"].includes(error.code) ? error.code : "ASSISTANT_UNAVAILABLE";
    return { type: "error", code, message: messages[locale][code], ...(error.retryAfter ? { retryAfter: error.retryAfter } : {}) };
  }
  const code = error instanceof Error && error.message === "ASSISTANT_NOT_CONFIGURED" ? "NOT_CONFIGURED" : "ASSISTANT_UNAVAILABLE";
  return { type: "error", code, message: messages[locale][code] };
}

