"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { forgotPasswordAction, googleOAuthAction, magicLinkAction, signInAction, signUpAction } from "@/features/auth/actions";
import { initialAuthState } from "@/features/auth/types";
import type { Locale } from "@/lib/i18n/config";
import { getAuthContent } from "@/features/auth/content";

type Mode = "sign-in" | "sign-up" | "magic-link" | "forgot-password";
const actions = { "sign-in": signInAction, "sign-up": signUpAction, "magic-link": magicLinkAction, "forgot-password": forgotPasswordAction };

export function AuthForm({ mode, locale, next = "/today" }: { mode: Mode; locale: Locale; next?: string }) {
  const c = getAuthContent(locale);
  const [state, action, pending] = useActionState(actions[mode], initialAuthState);
  const title = mode === "sign-in" ? c.welcome : mode === "sign-up" ? c.signUp : mode === "magic-link" ? c.magic : c.forgot;
  const submit = mode === "sign-in" ? c.signIn : mode === "sign-up" ? c.signUp : mode === "magic-link" ? c.magic : c.sendReset;
  const emailOnly = mode === "magic-link" || mode === "forgot-password";

  return <div className="auth-card">
    <header><p className="eyebrow">B Fit &amp; Healthy</p><h2>{title}</h2><p>{mode === "sign-in" ? c.signInIntro : "A secure, focused step back into your health workspace."}</p></header>
    {mode === "sign-in" && <form action={googleOAuthAction}><input type="hidden" name="next" value={next} /><Button type="submit" variant="secondary" className="auth-wide"><CircleUserRound aria-hidden="true" />{c.google}</Button></form>}
    {mode === "sign-in" && <div className="auth-divider"><span>or</span></div>}
    <form action={action} className="auth-fields">
      <input type="hidden" name="next" value={next} />
      {mode === "sign-up" && <label>{c.displayName}<input name="displayName" autoComplete="name" required minLength={2} aria-invalid={Boolean(state.fieldErrors?.displayName)} /></label>}
      <label>{c.email}<input name="email" type="email" autoComplete="email" required aria-invalid={Boolean(state.fieldErrors?.email)} /></label>
      {!emailOnly && <label>{c.password}<input name="password" type="password" autoComplete={mode === "sign-up" ? "new-password" : "current-password"} required minLength={mode === "sign-up" ? 10 : 1} aria-invalid={Boolean(state.fieldErrors?.password)} /></label>}
      {mode === "sign-up" && <><label>{c.confirmPassword}<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={10} aria-invalid={Boolean(state.fieldErrors?.confirmPassword)} /></label><input type="hidden" name="locale" value={locale} /></>}
      {state.message && <p className={`form-notice ${state.status}`} role="status" aria-live="polite">{state.message}</p>}
      <Button type="submit" size="lg" className="auth-wide" disabled={pending}>{pending ? "Please wait…" : submit}<ArrowRight aria-hidden="true" /></Button>
    </form>
    <nav className="auth-links" aria-label="Account help">
      {mode === "sign-in" && <><Link href={`/magic-link?next=${encodeURIComponent(next)}`}>{c.magic}</Link><Link href={`/forgot-password?next=${encodeURIComponent(next)}`}>{c.forgot}</Link><Link href={`/sign-up?next=${encodeURIComponent(next)}`}>{c.noAccount}</Link></>}
      {mode !== "sign-in" && <Link href={`/sign-in?next=${encodeURIComponent(next)}`}>{mode === "sign-up" ? c.haveAccount : c.back}</Link>}
    </nav>
  </div>;
}
