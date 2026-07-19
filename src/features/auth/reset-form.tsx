"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { resetPasswordAction } from "@/features/auth/actions";
import { getAuthContent } from "@/features/auth/content";
import { initialAuthState } from "@/features/auth/types";
import type { Locale } from "@/lib/i18n/config";

export function ResetForm({ locale, next }: { locale: Locale; next: string }) {
  const c = getAuthContent(locale);
  const [state, action, pending] = useActionState(resetPasswordAction, initialAuthState);
  return <div className="auth-card"><header><p className="eyebrow">Account recovery</p><h2>{c.reset}</h2><p>Choose a unique password with at least 10 characters.</p></header><form action={action} className="auth-fields"><input type="hidden" name="next" value={next} /><label>{c.password}<input name="password" type="password" autoComplete="new-password" minLength={10} required /></label><label>{c.confirmPassword}<input name="confirmPassword" type="password" autoComplete="new-password" minLength={10} required /></label>{state.message && <p className={`form-notice ${state.status}`} role="status">{state.message}</p>}<Button type="submit" size="lg" disabled={pending}>{pending ? "Please wait…" : c.reset}</Button></form></div>;
}
