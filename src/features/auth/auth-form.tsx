"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { forgotPasswordAction, googleOAuthAction, magicLinkAction, signInAction, signUpAction } from "@/features/auth/actions";
import { initialAuthState } from "@/features/auth/types";
import type { Locale } from "@/lib/i18n/config";
import { getAuthContent } from "@/features/auth/content";

type Mode = "sign-in" | "sign-up" | "magic-link" | "forgot-password";
function GoogleMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.36Z" />
    <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z" />
    <path fill="#FBBC05" d="M6.41 13.92a6 6 0 0 1 0-3.84V7.49H3.07a10 10 0 0 0 0 9.02l3.34-2.59Z" />
    <path fill="#EA4335" d="M12 5.96c1.47 0 2.79.51 3.83 1.51L18.7 4.6A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.93 5.49l3.34 2.59C7.2 7.72 9.4 5.96 12 5.96Z" />
  </svg>;
}

const actions = { "sign-in": signInAction, "sign-up": signUpAction, "magic-link": magicLinkAction, "forgot-password": forgotPasswordAction };

export function AuthForm({ mode, locale, next = "/today" }: { mode: Mode; locale: Locale; next?: string }) {
  const c = getAuthContent(locale);
  const [state, action, pending] = useActionState(actions[mode], initialAuthState);
  const title = mode === "sign-in" ? c.welcome : mode === "sign-up" ? c.signUp : mode === "magic-link" ? c.magic : c.forgot;
  const submit = mode === "sign-in" ? c.signIn : mode === "sign-up" ? c.signUp : mode === "magic-link" ? c.magic : c.sendReset;
  const emailOnly = mode === "magic-link" || mode === "forgot-password";

  return <div className="auth-card">
    <header><p className="eyebrow">B Fit &amp; Healthy</p><h2>{title}</h2><p>{mode === "sign-in" ? c.signInIntro : c.secureIntro}</p></header>
    {(mode === "sign-in" || mode === "sign-up") && <form action={googleOAuthAction}><input type="hidden" name="next" value={next} /><Button type="submit" variant="secondary" className="auth-wide"><GoogleMark />{c.google}</Button></form>}
    {(mode === "sign-in" || mode === "sign-up") && <div className="auth-divider"><span>{c.or}</span></div>}
    <form action={action} className="auth-fields">
      <input type="hidden" name="next" value={next} />
      {mode === "sign-up" && <Field label={c.displayName} error={state.fieldErrors?.displayName?.[0]}><input name="displayName" autoComplete="name" required minLength={2} /></Field>}
      <Field label={c.email} error={state.fieldErrors?.email?.[0]}><input name="email" type="email" autoComplete="email" required /></Field>
      {!emailOnly && <Field label={c.password} description={mode === "sign-up" ? c.passwordHint : undefined} error={state.fieldErrors?.password?.[0]}><input name="password" type="password" autoComplete={mode === "sign-up" ? "new-password" : "current-password"} required minLength={mode === "sign-up" ? 10 : 1} /></Field>}
      {mode === "sign-up" && <><Field label={c.confirmPassword} error={state.fieldErrors?.confirmPassword?.[0]}><input name="confirmPassword" type="password" autoComplete="new-password" required minLength={10} /></Field><input type="hidden" name="locale" value={locale} /></>}
      {mode === "sign-up" && <p className="auth-consent">{c.consentPrefix} <Link href="/terms">{c.terms}</Link> {c.consentAnd} <Link href="/privacy">{c.privacy}</Link>.</p>}
      {state.message && <p className={`form-notice ${state.status}`} role="status" aria-live="polite">{state.message}</p>}
      <Button type="submit" size="lg" className="auth-wide" disabled={pending}>{pending ? c.wait : submit}<ArrowRight aria-hidden="true" /></Button>
    </form>
    <nav className="auth-links" aria-label={c.accountHelp}>
      {mode === "sign-in" && <><Link href={`/magic-link?next=${encodeURIComponent(next)}`}>{c.magic}</Link><Link href={`/forgot-password?next=${encodeURIComponent(next)}`}>{c.forgot}</Link><Link href={`/sign-up?next=${encodeURIComponent(next)}`}>{c.noAccount}</Link></>}
      {mode !== "sign-in" && <Link href={`/sign-in?next=${encodeURIComponent(next)}`}>{mode === "sign-up" ? c.haveAccount : c.back}</Link>}
    </nav>
  </div>;
}
