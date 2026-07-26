"use client";

import { useActionState } from "react";
import { ActionFeedback } from "@/features/motion/action-feedback";
import { updateAccountSettingsAction } from "@/features/account/actions";
import type { AuthActionState } from "@/features/auth/types";
import type { Locale } from "@/lib/i18n/config";

const initialState: AuthActionState = { status: "idle" };

export function AccountSettingsForm({
  displayName,
  units,
  timezone,
  locale,
}: {
  displayName: string;
  units: "metric" | "imperial";
  timezone: string;
  locale: Locale;
}) {
  const [state, action, pending] = useActionState(
    updateAccountSettingsAction,
    initialState,
  );
  const copy =
    locale === "en"
      ? {
          name: "Display name",
          units: "Units",
          timezone: "Timezone",
          metric: "Metric (kg, cm)",
          imperial: "Imperial (lb, in)",
          save: "Save changes",
          saving: "Saving…",
        }
      : {
          name: "Име за приказ",
          units: "Единици",
          timezone: "Временска зона",
          metric: "Метрички (kg, cm)",
          imperial: "Империјални (lb, in)",
          save: "Зачувај промени",
          saving: "Се зачувува…",
        };

  return (
    <form action={action} className="account-settings-form">
      <label>
        <span>{copy.name}</span>
        <input
          name="displayName"
          defaultValue={displayName}
          minLength={2}
          maxLength={80}
          autoComplete="name"
          required
        />
      </label>
      <label>
        <span>{copy.units}</span>
        <select name="units" defaultValue={units}>
          <option value="metric">{copy.metric}</option>
          <option value="imperial">{copy.imperial}</option>
        </select>
      </label>
      <label>
        <span>{copy.timezone}</span>
        <input
          name="timezone"
          defaultValue={timezone}
          maxLength={80}
          required
        />
      </label>
      <button className="ui-button ui-button-primary" disabled={pending}>
        {pending ? copy.saving : copy.save}
      </button>
      {state.message ? (
        <ActionFeedback
          className="form-status"
          status={state.status}
          message={state.message}
        />
      ) : null}
    </form>
  );
}
