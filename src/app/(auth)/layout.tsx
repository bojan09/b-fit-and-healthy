import type { ReactNode } from "react";
import { AuthShell } from "@/features/auth/auth-shell";
import { getLocale } from "@/lib/i18n/server";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return <AuthShell locale={locale}>{children}</AuthShell>;
}
