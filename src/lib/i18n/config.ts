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
    offlineTitle: "You are offline",
    offlineBody: "The public shell is available. Private records are never served from an unsafe shared cache.",
    retry: "Try again",
    notFound: "Page not found",
    notFoundBody: "This foundation route does not exist.",
    backHome: "Back to home",
    errorTitle: "Something interrupted this page",
    errorBody: "Your data was not changed. Try rendering the page again."
  },
  mk: {
    skip: "Прескокни до содржината",
    language: "Јазик",
    theme: "Тема",
    light: "Светла",
    dark: "Темна",
    system: "Системска",
    offlineTitle: "Немате интернет врска",
    offlineBody: "Јавната обвивка е достапна. Приватните записи никогаш не се вчитуваат од небезбеден заеднички кеш.",
    retry: "Обиди се повторно",
    notFound: "Страницата не е пронајдена",
    notFoundBody: "Оваа основна рута не постои.",
    backHome: "Назад на почетна",
    errorTitle: "Нешто ја прекина страницата",
    errorBody: "Вашите податоци не се променети. Обидете се повторно да ја прикажете страницата."
  }
} as const;

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getDictionary(locale: Locale = defaultLocale) {
  return dictionaries[locale];
}
