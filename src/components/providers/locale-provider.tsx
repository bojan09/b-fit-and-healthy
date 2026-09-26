"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SkipLink } from "@/components/shell/skip-link";
import { dictionaries, type Locale } from "@/lib/i18n/config";

type LocaleContextValue = {
  locale: Locale;
  messages: typeof dictionaries.en | typeof dictionaries.mk;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Locale context for a subtree. The root layout never reads cookies (so public
 * pages can be static); each area layout provides its own locale instead —
 * from the [locale] route param on public pages, from the cookie in the app.
 * Mount with `key={locale}` so a locale switch resets client state cleanly.
 */
export function LocaleProvider({ locale: initialLocale, children }: { locale: Locale; children: ReactNode }) {
  const router = useRouter();
  const [locale, updateLocale] = useState(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

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

  return (
    <LocaleContext.Provider value={value}>
      <SkipLink label={dictionaries[locale].skip} />
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}

export function useOptionalLocale(): Locale {
  return useContext(LocaleContext)?.locale ?? "en";
}

/** Messages when a provider may be absent (e.g. the root error boundary). */
export function useOptionalMessages() {
  return dictionaries[useOptionalLocale()];
}
