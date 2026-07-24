import type { Locale } from "@/lib/i18n/config";

const content = {
  en: {
    eyebrow: "Private AI coach",
    title: "What would make today easier?",
    subtitle: "Ask about food, training, habits, recovery, or your recent progress.",
    prompts: ["Plan dinner", "Adapt my workout", "Review my week"],
    composer: "Message your coach",
    placeholder: "Ask a focused question…",
    send: "Send",
    stop: "Stop generation",
    newConversation: "New conversation",
    history: "Recent conversations",
    noHistory: "Your recent conversations will appear here.",
    context: "Context used",
    today: "Today",
    trends: "30-day trends",
    privacy: "Private by design",
    retention: "Deletes after 30 days",
    limitations: "General education only—not medical diagnosis or treatment.",
    thinking: "Coach is preparing a response…",
    user: "You",
    assistant: "B Coach",
    delete: "Delete conversation",
  },
  mk: {
    eyebrow: "Приватен AI тренер",
    title: "Што би го олеснило денешниот ден?",
    subtitle: "Прашајте за храна, тренинг, навики, опоравување или неодамнешниот напредок.",
    prompts: ["Планирај вечера", "Прилагоди го тренингот", "Прегледај ја неделата"],
    composer: "Порака до тренерот",
    placeholder: "Поставете јасно прашање…",
    send: "Испрати",
    stop: "Прекини го генерирањето",
    newConversation: "Нов разговор",
    history: "Неодамнешни разговори",
    noHistory: "Вашите неодамнешни разговори ќе се појават тука.",
    context: "Користен контекст",
    today: "Денес",
    trends: "Трендови за 30 дена",
    privacy: "Приватност по дизајн",
    retention: "Се брише по 30 дена",
    limitations: "Само општа едукација — не медицинска дијагноза или третман.",
    thinking: "Тренерот подготвува одговор…",
    user: "Вие",
    assistant: "Б Тренер",
    delete: "Избриши разговор",
  },
} as const;

export function getAssistantContent(locale: Locale) {
  return content[locale];
}

