"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
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
      {mode === "sign-up" && <Field label={c.displayName} error={state.fieldErrors?.displayName?.[0]}><input name="displayName" autoComplete="name" required minLength={2} /></Field>}
      <Field label={c.email} error={state.fieldErrors?.email?.[0]}><input name="email" type="email" autoComplete="email" required /></Field>
      {!emailOnly && <Field label={c.password} description={mode === "sign-up" ? c.passwordHint : undefined} error={state.fieldErrors?.password?.[0]}><input name="password" type="password" autoComplete={mode === "sign-up" ? "new-password" : "current-password"} required minLength={mode === "sign-up" ? 10 : 1} /></Field>}
      {mode === "sign-up" && <><Field label={c.confirmPassword} error={state.fieldErrors?.confirmPassword?.[0]}><input name="confirmPassword" type="password" autoComplete="new-password" required minLength={10} /></Field><input type="hidden" name="locale" value={locale} /></>}
      {state.message && <p className={`form-notice ${state.status}`} role="status" aria-live="polite">{state.message}</p>}
      <Button type="submit" size="lg" className="auth-wide" disabled={pending}>{pending ? c.wait : submit}<ArrowRight aria-hidden="true" /></Button>
    </form>
    <nav className="auth-links" aria-label={c.accountHelp}>
      {mode === "sign-in" && <><Link href={`/magic-link?next=${encodeURIComponent(next)}`}>{c.magic}</Link><Link href={`/forgot-password?next=${encodeURIComponent(next)}`}>{c.forgot}</Link><Link href={`/sign-up?next=${encodeURIComponent(next)}`}>{c.noAccount}</Link></>}
      {mode !== "sign-in" && <Link href={`/sign-in?next=${encodeURIComponent(next)}`}>{mode === "sign-up" ? c.haveAccount : c.back}</Link>}
    </nav>
  </div>;
}
