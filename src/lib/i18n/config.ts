export const locales = ["en", "mk"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "en";

export const dictionaries = {
  en: {
    skip: "Skip to content",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    navHome: "Home",
    navStates: "System states",
    phase: "Production foundation",
    heroTitle: "A healthier day, designed as one connected system.",
    heroBody: "The approved B Fit & Healthy experience is moving into a secure, accessible and installable production foundation.",
    heroAction: "Review foundation states",
    heroNote: "Phase 1 establishes the product shell. Tracking features arrive only after their approval gates.",
    builtFor: "Built for daily clarity",
    featureOne: "One calm Sage Dusk system across both themes.",
    featureTwo: "Server-first architecture with private data boundaries.",
    featureThree: "Keyboard, touch and reduced-motion behavior from day one.",
    statesTitle: "Foundation states",
    statesBody: "Shared feedback patterns for every feature phase.",
    ready: "Ready",
    loading: "Loading your daily context",
    empty: "Nothing logged yet",
    emptyBody: "A useful next action will appear here when this feature is connected.",
    warning: "Configuration attention",
    warningBody: "External services remain visibly unavailable until their health checks pass.",
    offlineTitle: "You are offline",
    offlineBody: "The public shell is available. Private records are never served from an unsafe shared cache.",
    retry: "Try again",
    notFound: "Page not found",
    notFoundBody: "This foundation route does not exist.",
    backHome: "Back to home",
    errorTitle: "Something interrupted this page",
    errorBody: "Your data was not changed. Try rendering the page again.",
    footer: "General health education only — not medical advice."
  },
  mk: {
    skip: "Прескокни до содржината",
    language: "Јазик",
    theme: "Тема",
    light: "Светла",
    dark: "Темна",
    system: "Системска",
    navHome: "Почетна",
    navStates: "Системски состојби",
    phase: "Продукциска основа",
    heroTitle: "Поздрав ден, осмислен како еден поврзан систем.",
    heroBody: "Одобреното искуство B Fit & Healthy преминува во безбедна, пристапна и инсталирачка продукциска основа.",
    heroAction: "Прегледај ги состојбите",
    heroNote: "Фаза 1 ја воспоставува обвивката на производот. Следењето доаѓа по соодветните одобрувања.",
    builtFor: "Создадено за дневна јасност",
    featureOne: "Еден смирен Sage Dusk систем во двете теми.",
    featureTwo: "Серверска архитектура со граници за приватните податоци.",
    featureThree: "Тастатура, допир и намалено движење уште од првиот ден.",
    statesTitle: "Основни состојби",
    statesBody: "Заеднички повратни информации за секоја следна функција.",
    ready: "Подготвено",
    loading: "Се вчитува дневниот контекст",
    empty: "Сè уште нема записи",
    emptyBody: "Овде ќе се појави корисен следен чекор кога функцијата ќе се поврзе.",
    warning: "Потребна е конфигурација",
    warningBody: "Надворешните услуги остануваат јасно недостапни додека не поминат проверка.",
    offlineTitle: "Немате интернет врска",
    offlineBody: "Јавната обвивка е достапна. Приватните записи никогаш не се вчитуваат од небезбеден заеднички кеш.",
    retry: "Обиди се повторно",
    notFound: "Страницата не е пронајдена",
    notFoundBody: "Оваа основна рута не постои.",
    backHome: "Назад на почетна",
    errorTitle: "Нешто ја прекина страницата",
    errorBody: "Вашите податоци не се променети. Обидете се повторно да ја прикажете страницата.",
    footer: "Само општа здравствена едукација — не е медицински совет."
  }
} as const;

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getDictionary(locale: Locale = defaultLocale) {
  return dictionaries[locale];
}
