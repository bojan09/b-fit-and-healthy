import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { AuthShell } from "@/features/auth/auth-shell";
import { getLocale } from "@/lib/i18n/server";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return <LocaleProvider key={locale} locale={locale}><AuthShell locale={locale}>{children}</AuthShell></LocaleProvider>;
}
