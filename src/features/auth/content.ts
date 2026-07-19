import type { Locale } from "@/lib/i18n/config";

const content = {
  en: {
    eyebrow: "Your health, connected",
    welcome: "Welcome back",
    signInIntro: "Sign in to continue building a healthier day.",
    email: "Email address", password: "Password", confirmPassword: "Confirm password",
    displayName: "Display name", signIn: "Sign in", signUp: "Create account",
    google: "Continue with Google", magic: "Email me a magic link",
    forgot: "Forgot password?", noAccount: "New here? Create an account",
    haveAccount: "Already have an account? Sign in", back: "Back to sign in",
    checkEmail: "Check your email to continue.", reset: "Set a new password",
    sendReset: "Send reset link", continue: "Continue", finish: "Finish setup",
  },
  mk: {
    eyebrow: "Вашето здравје, поврзано",
    welcome: "Добредојдовте повторно",
    signInIntro: "Најавете се за да продолжите со поздрав ден.",
    email: "Е-пошта", password: "Лозинка", confirmPassword: "Потврдете лозинка",
    displayName: "Име за приказ", signIn: "Најави се", signUp: "Создај сметка",
    google: "Продолжи со Google", magic: "Испрати ми магична врска",
    forgot: "Ја заборавивте лозинката?", noAccount: "Нови сте? Создајте сметка",
    haveAccount: "Имате сметка? Најавете се", back: "Назад кон најава",
    checkEmail: "Проверете ја е-поштата за да продолжите.", reset: "Поставете нова лозинка",
    sendReset: "Испрати врска за ресетирање", continue: "Продолжи", finish: "Заврши поставување",
  },
} as const;

export function getAuthContent(locale: Locale) {
  return content[locale];
}
