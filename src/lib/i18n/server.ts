import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale, type Locale } from "@/lib/i18n/config";

export const localeCookie = "bfit-locale";

// Per-request slot for a locale that comes from the URL ([locale] segment).
// When set, getLocale() never touches cookies, which lets public pages render
// statically. Layouts, pages and generateMetadata each set it because Next.js
// may render them independently.
const requestLocale = cache((): { value: Locale | null } => ({ value: null }));

export function setRequestLocale(locale: Locale) {
  requestLocale().value = locale;
}

/** Validates the [locale] route param, records it for this request, and returns it. */
export async function localeFromParams(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  const resolved = isLocale(locale) ? locale : defaultLocale;
  setRequestLocale(resolved);
  return resolved;
}

export async function getLocale(): Promise<Locale> {
  const fromRoute = requestLocale().value;
  if (fromRoute) return fromRoute;
  const value = (await cookies()).get(localeCookie)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getMessages() {
  return getDictionary(await getLocale());
}
