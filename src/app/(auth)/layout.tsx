import type { ReactNode } from "react";
import { AuthShell } from "@/features/auth/auth-shell";
import { getAuthContent } from "@/features/auth/content";
import { getLocale } from "@/lib/i18n/server";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return <AuthShell eyebrow={getAuthContent(locale).eyebrow}>{children}</AuthShell>;
}
