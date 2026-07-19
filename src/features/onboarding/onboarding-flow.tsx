"use client";

import { useActionState, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { completeOnboardingAction } from "@/features/onboarding/actions";
import { priorities } from "@/features/onboarding/priorities";
import { initialAuthState } from "@/features/auth/types";
import type { Locale } from "@/lib/i18n/config";

export function OnboardingFlow({ locale, email, initialName, next }: { locale: Locale; email: string; initialName: string; next: string }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [state, action, pending] = useActionState(completeOnboardingAction, initialAuthState);
  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", []);
  const copy = locale === "mk" ? { title: "Да го прилагодиме вашиот простор", intro: "Само основите за корисен почеток.", profile: "Вашите основи", priorities: "Што е најважно сега?", next: "Продолжи", back: "Назад", finish: "Заврши поставување", name: "Име за приказ", units: "Единици", timezone: "Временска зона" } : { title: "Make this space yours", intro: "Only the essentials for a useful start.", profile: "Your basics", priorities: "What matters most right now?", next: "Continue", back: "Back", finish: "Finish setup", name: "Display name", units: "Units", timezone: "Timezone" };
  const toggle = (id: string) => setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : items.length < 3 ? [...items, id] : items);

  return <main id="main-content" className="onboarding-shell"><div className="onboarding-card"><header><p className="eyebrow">Step {step} of 2</p><div className="step-track" aria-label="Setup progress"><span aria-current={step === 1 ? "step" : undefined}>1</span><i /><span aria-current={step === 2 ? "step" : undefined}>2</span></div><h1>{copy.title}</h1><p>{copy.intro}</p></header><form action={action}>
    <input type="hidden" name="next" value={next} /><input type="hidden" name="locale" value={locale} />
    <section hidden={step !== 1} aria-labelledby="profile-step"><h2 id="profile-step">{copy.profile}</h2><div className="auth-fields"><label>{copy.name}<input name="displayName" defaultValue={initialName} autoComplete="name" required minLength={2} /></label><label>Email<input value={email} readOnly disabled /></label><label>{copy.units}<select name="units" defaultValue="metric"><option value="metric">Metric (kg, cm)</option><option value="imperial">Imperial (lb, in)</option></select></label><label>{copy.timezone}<input name="timezone" defaultValue={timezone} required /></label></div></section>
    <section hidden={step !== 2} aria-labelledby="priority-step"><h2 id="priority-step">{copy.priorities}</h2><p className="selection-hint">Choose one to three. You can change these later.</p><div className="priority-grid">{priorities.map(({ id, label, icon: Icon }) => <label key={id} className={selected.includes(id) ? "priority-card selected" : "priority-card"}><input type="checkbox" name="priorities" value={id} checked={selected.includes(id)} onChange={() => toggle(id)} /><Icon aria-hidden="true" /><span>{label[locale]}</span></label>)}</div></section>
    {state.message && <p className="form-notice error" role="alert">{state.message}</p>}
    <div className="onboarding-actions">{step === 2 && <Button type="button" variant="secondary" onClick={() => setStep(1)}><ArrowLeft />{copy.back}</Button>}{step === 1 ? <Button type="button" onClick={() => setStep(2)}>{copy.next}<ArrowRight /></Button> : <Button type="submit" disabled={pending || selected.length < 1}>{pending ? "Saving…" : copy.finish}<ArrowRight /></Button>}</div>
  </form></div></main>;
}
