import type { ReactNode } from "react";
import Link from "next/link";
import { Brand } from "@/components/shell/brand";
import { Button } from "@/components/ui/button";
import { DemoNav } from "@/components/shell/demo-nav";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";

export default async function DemoLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const c = getPublicContent(locale).demo;
  return (
    <LocaleProvider key={locale} locale={locale}>
    <div className="demo-shell">
      <header className="demo-header">
        <div className="shell demo-header-inner">
          <Brand authenticated={false} />
          <DemoNav labels={c.nav} />
          <Button asChild>
            <Link href="/sign-up">{c.banner.signUp}</Link>
          </Button>
        </div>
      </header>
      <div className="demo-banner">
        <p>{c.banner.message}</p>
        <Button asChild variant="secondary">
          <Link href="/sign-up">{c.banner.cta}</Link>
        </Button>
      </div>
      <main id="main-content" tabIndex={-1} className="shell demo-main">
        {children}
      </main>
    </div>
    </LocaleProvider>
  );
}
