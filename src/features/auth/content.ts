import type { Locale } from "@/lib/i18n/config";

const content = {
  en: {
    eyebrow: "Your health, connected",
    welcome: "Welcome back",
    signInIntro: "Sign in to continue building a healthier day.",
    email: "Email address", password: "Password", confirmPassword: "Confirm password",
    displayName: "Display name", signIn: "Sign in", signUp: "Create account",
    secureIntro: "A secure, focused step into your health workspace.", or: "or",
    consentPrefix: "By creating an account you agree to the", terms: "Terms", privacy: "Privacy Policy", consentAnd: "and",
    google: "Continue with Google", magic: "Email me a magic link",
    forgot: "Forgot password?", noAccount: "New here? Create an account",
    haveAccount: "Already have an account? Sign in", back: "Back to sign in",
    checkEmail: "Check your email to continue.", reset: "Set a new password",
    sendReset: "Send reset link", continue: "Continue", finish: "Finish setup",
    storyTitle: "One calm place for your next healthy choice.",
    storyBody: "Move with purpose, eat with context, and learn what helps, without turning wellbeing into noise.",
    storyPoints: ["Daily context", "Practical training", "Trusted knowledge"],
    passwordHint: "Use at least 10 characters.", wait: "Please wait…", accountHelp: "Account help", recovery: "Account recovery",
    onboarding: { needPriority: "Choose at least one priority to finish.", title: "Make this space yours", intro: "Only the essentials for a useful start.", step: (n: number) => `Step ${n} of 2`, progress: "Setup progress", profile: "Your basics", priorities: "What matters most right now?", hint: "Choose one to three. You can change these later.", next: "Continue", back: "Back", finish: "Finish setup", saving: "Saving…", name: "Display name", units: "Units", metric: "Metric (kg, cm)", imperial: "Imperial (lb, in)", timezone: "Timezone", email: "Email" },
    onboardingErrors: { invalid: "Review your details and choose one to three priorities.", profile: "We could not save your profile. Please try again.", settings: "We could not save your preferences. Please try again.", goals: "We could not save your priorities. Please try again.", complete: "Your details were saved, but setup could not be completed. Try again." },
  },
  mk: {
    eyebrow: "Вашето здравје, поврзано",
    welcome: "Добредојдовте повторно",
    signInIntro: "Најавете се за да продолжите со поздрав ден.",
    email: "Е-пошта", password: "Лозинка", confirmPassword: "Потврдете лозинка",
    displayName: "Име за приказ", signIn: "Најави се", signUp: "Создај сметка",
    secureIntro: "Безбеден и фокусиран чекор кон вашиот здравствен простор.", or: "или",
    consentPrefix: "Со создавање сметка се согласувате со", terms: "Условите", privacy: "Политиката за приватност", consentAnd: "и",
    google: "Продолжи со Google", magic: "Испрати ми магична врска",
    forgot: "Ја заборавивте лозинката?", noAccount: "Нови сте? Создајте сметка",
    haveAccount: "Имате сметка? Најавете се", back: "Назад кон најава",
    checkEmail: "Проверете ја е-поштата за да продолжите.", reset: "Поставете нова лозинка",
    sendReset: "Испрати врска за ресетирање", continue: "Продолжи", finish: "Заврши поставување",
    storyTitle: "Едно смирено место за вашиот следен здрав избор.",
    storyBody: "Движете се со цел, јадете со контекст и учете што помага, без велнесот да стане бучава.",
    storyPoints: ["Дневен контекст", "Практичен тренинг", "Доверливо знаење"],
    passwordHint: "Користете најмалку 10 знаци.", wait: "Ве молиме почекајте…", accountHelp: "Помош за сметка", recovery: "Обнова на сметка",
    onboarding: { needPriority: "Изберете барем еден приоритет за да завршите.", title: "Да го прилагодиме вашиот простор", intro: "Само основите за корисен почеток.", step: (n: number) => `Чекор ${n} од 2`, progress: "Напредок на поставувањето", profile: "Вашите основи", priorities: "Што е најважно сега?", hint: "Изберете од една до три. Може да ги промените подоцна.", next: "Продолжи", back: "Назад", finish: "Заврши поставување", saving: "Се зачувува…", name: "Име за приказ", units: "Единици", metric: "Метрички (kg, cm)", imperial: "Империјални (lb, in)", timezone: "Временска зона", email: "Е-пошта" },
    onboardingErrors: { invalid: "Проверете ги податоците и изберете од еден до три приоритети.", profile: "Не можевме да го зачуваме профилот. Обидете се повторно.", settings: "Не можевме да ги зачуваме поставките. Обидете се повторно.", goals: "Не можевме да ги зачуваме приоритетите. Обидете се повторно.", complete: "Податоците се зачувани, но поставувањето не заврши. Обидете се пак." },
  },
} as const;

export function getAuthContent(locale: Locale) {
  return content[locale];
}
