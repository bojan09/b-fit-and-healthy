"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/providers/locale-provider";
import { getPublicContent } from "@/lib/i18n/public-content";

export function PublicNavigation() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const { nav } = getPublicContent(locale);
  const links = [
    ["/", nav.home], ["/features", nav.features], ["/anatomy", nav.anatomy], ["/blog", nav.blog], ["/about", nav.about]
  ] as const;
  const current = (href: string) => href === "/" ? pathname === href : pathname.startsWith(href);
  const list = (className: string, includeAccount = false) => (
    <nav className={className} aria-label="Primary">
      {links.map(([href, label]) => <Link key={href} href={href} aria-current={current(href) ? "page" : undefined}>{label}</Link>)}
      {includeAccount && <div className="mobile-account-links"><Link href="/sign-in">{nav.signIn}</Link><Link href="/sign-up">{nav.getStarted}</Link></div>}
    </nav>
  );
  return <>
    {list("header-nav")}
    <details className="mobile-nav">
      <summary aria-label={nav.menu}><Menu aria-hidden="true" size={20} /></summary>
      {list("mobile-nav-panel", true)}
    </details>
  </>;
}
