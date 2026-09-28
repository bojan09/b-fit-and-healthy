import type { ReactNode } from "react";
import { PublicHeader } from "@/components/shell/public-header";
import { PublicFooter } from "@/components/shell/public-footer";
import { localeFromParams } from "@/lib/i18n/server";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await localeFromParams(params);
  return (
    <div className="site-frame">
      <PublicHeader locale={locale} />
      {children}
      <PublicFooter locale={locale} />
    </div>
  );
}
