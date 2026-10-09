"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { getAuthContent } from "@/features/auth/content";
import { initialAuthState } from "@/features/auth/types";
import { completeOnboardingAction } from "@/features/onboarding/actions";
import { priorities } from "@/features/onboarding/priorities";
import type { Locale } from "@/lib/i18n/config";

export function OnboardingFlow({ locale, email, initialName, next }: { locale: Locale; email: string; initialName: string; next: string }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [state, action, pending] = useActionState(completeOnboardingAction, initialAuthState);
  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", []);
  const timezones = useMemo(() => {
    const supported = typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : [];
    return supported.includes(timezone) ? supported : [timezone, ...supported];
  }, [timezone]);
  const formRef = useRef<HTMLFormElement>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    // Move focus to the new step's heading so keyboard and screen-reader users follow along.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepHeading.current?.focus();
  }, [step]);
  const goNext = () => {
    const fields = formRef.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-step="1"] input:not([disabled]), [data-step="1"] select');
    if (fields && !Array.from(fields).every((field) => field.reportValidity())) return;
    setStep(2);
  };
  const copy = getAuthContent(locale).onboarding;
  const toggle = (id: string) => setSelected((items) =>
    items.includes(id) ? items.filter((item) => item !== id) : items.length < 3 ? [...items, id] : items);

  return (
    <main id="main-content" className="onboarding-shell">
      <div className="onboarding-card">
        <header>
          <p className="eyebrow">{copy.step(step)}</p>
          <div className="step-track" aria-hidden="true">
            <span aria-current={step === 1 ? "step" : undefined}>1</span>
            <i data-filled={step === 2 || undefined} />
            <span aria-current={step === 2 ? "step" : undefined}>2</span>
          </div>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </header>
        <form action={action} ref={formRef}>
          <input type="hidden" name="next" value={next} />
          <input type="hidden" name="locale" value={locale} />
          <section hidden={step !== 1} aria-labelledby="profile-step" data-step="1">
            <h2 id="profile-step" tabIndex={-1} ref={step === 1 ? stepHeading : undefined}>{copy.profile}</h2>
            <div className="auth-fields">
              <Field label={copy.name}><input name="displayName" defaultValue={initialName} autoComplete="name" required minLength={2} /></Field>
              <Field label={copy.email}><input value={email} readOnly aria-readonly="true" /></Field>
              <Field label={copy.units}>
                <select name="units" defaultValue="metric">
                  <option value="metric">{copy.metric}</option>
                  <option value="imperial">{copy.imperial}</option>
                </select>
              </Field>
              <Field label={copy.timezone}><select name="timezone" defaultValue={timezone}>{timezones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}</select></Field>
            </div>
          </section>
          <section hidden={step !== 2} aria-labelledby="priority-step" data-step="2">
            <h2 id="priority-step" tabIndex={-1} ref={step === 2 ? stepHeading : undefined}>{copy.priorities}</h2>
            <p className="selection-hint" id="priority-hint">{copy.hint}</p>
            <div className="priority-grid" role="group" aria-describedby="priority-hint">
              {priorities.map(({ id, label, icon: Icon }) => (
                <label key={id} className={selected.includes(id) ? "priority-card selected" : "priority-card"}>
                  <input type="checkbox" name="priorities" value={id} checked={selected.includes(id)} onChange={() => toggle(id)} />
                  <Icon aria-hidden="true" />
                  <span>{label[locale]}</span>
                </label>
              ))}
            </div>
          </section>
          {step === 2 && selected.length < 1 && <p className="selection-hint" id="finish-hint">{copy.needPriority}</p>}
          {state.message && <p className="form-notice error" role="alert">{state.message}</p>}
          <div className="onboarding-actions">
            {step === 2 && <Button type="button" variant="secondary" onClick={() => setStep(1)}><ArrowLeft aria-hidden="true" />{copy.back}</Button>}
            {step === 1
              ? <Button type="button" onClick={goNext}>{copy.next}<ArrowRight aria-hidden="true" /></Button>
              : <Button type="submit" disabled={pending || selected.length < 1} aria-describedby={selected.length < 1 ? "finish-hint" : undefined}>{pending ? copy.saving : copy.finish}<ArrowRight aria-hidden="true" /></Button>}
          </div>
        </form>
      </div>
    </main>
  );
}
