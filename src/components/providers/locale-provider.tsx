"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { dictionaries, type Locale } from "@/lib/i18n/config";

type LocaleContextValue = {
  locale: Locale;
  messages: typeof dictionaries.en | typeof dictionaries.mk;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ locale: initialLocale, children }: { locale: Locale; children: ReactNode }) {
  const router = useRouter();
  const [locale, updateLocale] = useState(initialLocale);
  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    messages: dictionaries[locale],
    setLocale(nextLocale) {
      document.cookie = `bfit-locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = nextLocale;
      updateLocale(nextLocale);
      router.refresh();
    }
  }), [locale, router]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}
