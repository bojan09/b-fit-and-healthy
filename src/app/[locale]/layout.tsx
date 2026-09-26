import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { locales } from "@/lib/i18n/config";
import { localeFromParams } from "@/lib/i18n/server";

// Public pages are prerendered once per locale. The proxy rewrites /blog to
// /en/blog or /mk/blog from the locale cookie, so visible URLs never change.
export const dynamicParams = false;
// Fail the build if anything in the public tree starts reading request data.
export const dynamic = "error";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await localeFromParams(params);
  return <LocaleProvider key={locale} locale={locale}>{children}</LocaleProvider>;
}
