"use client";

import { useActionState } from "react";
import { Check, FilePenLine, Trash2 } from "lucide-react";
import { applyAssistantDraftAction, dismissAssistantDraftAction } from "@/features/assistant/draft-actions";
import type { Locale } from "@/lib/i18n/config";
import type { AssistantDraft } from "@/features/assistant/types";
import { initialAuthState } from "@/features/auth/types";

function details(draft: AssistantDraft) {
  if (draft.kind === "meal") return [`${draft.mealSlot} · ${draft.plannedOn}`, `${draft.servings} serving${draft.servings === 1 ? "" : "s"}`, draft.label];
  if (draft.kind === "workout") return [`${draft.durationMinutes} minutes`, `${draft.exerciseSlugs.length} exercises`, draft.exerciseSlugs.join(" · ")];
  if (draft.kind === "habit") return [draft.habitTitle];
  if (draft.kind === "recipe") return [`${draft.prepMinutes + draft.cookMinutes} minutes`, `${draft.servings} servings`, `${draft.ingredients.length} ingredients`];
  return [draft.body];
}

export function DraftCard({ locale, draft, messageId, onRequestChanges, applied = false }: {
  locale: Locale;
  draft: AssistantDraft;
  messageId: string;
  onRequestChanges: (draft: AssistantDraft) => void;
  applied?: boolean;
}) {
  const [state, action, pending] = useActionState(applyAssistantDraftAction, initialAuthState);
  const mutable = draft.kind !== "summary";
  return <section className="assistant-draft-card" aria-label={locale === "mk" ? "Предлог за преглед" : "Draft for review"}>
    <div className="assistant-draft-heading"><span>{locale === "mk" ? "ПРЕДЛОГ · ПРЕГЛЕДАЈТЕ" : "DRAFT · REVIEW"}</span><strong>{draft.title}</strong></div>
    <ul>{details(draft).map((detail) => <li key={detail}>{detail}</li>)}</ul>
    {state.message && <p className={`form-status ${state.status}`} role="status">{state.message}</p>}
    <div className="assistant-draft-actions">
      {mutable && !applied && <form action={action}><input type="hidden" name="messageId" value={messageId} /><button className="button button-primary" disabled={pending}><Check />{pending ? (locale === "mk" ? "Се зачувува…" : "Saving…") : (locale === "mk" ? "Потврди и зачувај" : "Confirm and save")}</button></form>}
      {!applied && <button type="button" className="button button-secondary" onClick={() => onRequestChanges(draft)}><FilePenLine />{locale === "mk" ? "Побарај промени" : "Ask for changes"}</button>}
      {!applied && <form action={dismissAssistantDraftAction}><input type="hidden" name="messageId" value={messageId} /><button className="button button-ghost" aria-label={locale === "mk" ? "Отфрли го предлогот" : "Discard draft"}><Trash2 />{locale === "mk" ? "Отфрли" : "Discard"}</button></form>}
      {applied && <span className="assistant-draft-applied"><Check />{locale === "mk" ? "Зачувано" : "Saved"}</span>}
    </div>
  </section>;
}

