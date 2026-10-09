"use client";

import { useActionState } from "react";
import { ActionFeedback } from "@/features/motion/action-feedback";
import { updateDailyTargetsAction } from "@/features/account/actions";
import type { AuthActionState } from "@/features/auth/types";
import type { Locale } from "@/lib/i18n/config";

const initialState: AuthActionState = { status: "idle" };

const copy = {
  en: { energy: "Energy (kcal)", water: "Water (ml)", protein: "Protein (g)", save: "Save targets", saving: "Saving…" },
  mk: { energy: "Енергија (kcal)", water: "Вода (ml)", protein: "Протеини (g)", save: "Зачувај цели", saving: "Се зачувува…" },
} as const;

export function DailyTargetsForm({
  energyKcal,
  waterMl,
  proteinG,
  locale,
}: {
  energyKcal: number | null;
  waterMl: number | null;
  proteinG: number | null;
  locale: Locale;
}) {
  const [state, action, pending] = useActionState(updateDailyTargetsAction, initialState);
  const t = copy[locale];
  return (
    <form action={action} className="account-settings-form" aria-labelledby="targets-title">
      <label>
        <span>{t.energy}</span>
        <input name="energyKcal" type="number" inputMode="numeric" min="0" max="20000" step="50" defaultValue={energyKcal ?? ""} />
      </label>
      <label>
        <span>{t.water}</span>
        <input name="waterMl" type="number" inputMode="numeric" min="0" max="20000" step="100" defaultValue={waterMl ?? ""} />
      </label>
      <label>
        <span>{t.protein}</span>
        <input name="proteinG" type="number" inputMode="numeric" min="0" max="2000" defaultValue={proteinG ?? ""} />
      </label>
      <button className="ui-button ui-button-primary" disabled={pending}>
        {pending ? t.saving : t.save}
      </button>
      {state.message ? <ActionFeedback className="form-status" status={state.status} message={state.message} /> : null}
    </form>
  );
}
