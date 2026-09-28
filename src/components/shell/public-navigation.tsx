"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { getPublicContent } from "@/lib/i18n/public-content";

export function PublicNavigation() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const { locale } = useLocale();
  const { nav } = getPublicContent(locale);
  const links = [
    ["/", nav.home], ["/features", nav.features], ["/anatomy", nav.anatomy], ["/blog", nav.blog], ["/about", nav.about]
  ] as const;
  const current = (href: string) => href === "/" ? pathname === href : pathname.startsWith(href);

  // The layout persists across client navigations, so close the menu when the route changes.
  useEffect(() => {
    menuRef.current?.removeAttribute("open");
  }, [pathname]);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !menu.open) return;
      menu.open = false;
      menu.querySelector("summary")?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const list = (className: string, label: string, includeAccount = false) => (
    <nav className={className} aria-label={label}>
      {links.map(([href, text]) => <Link key={href} href={href} aria-current={current(href) ? "page" : undefined}>{text}</Link>)}
      {includeAccount && <div className="mobile-account-links"><Link href="/sign-in">{nav.signIn}</Link><Link href="/sign-up">{nav.getStarted}</Link></div>}
    </nav>
  );
  return <>
    {list("header-nav", locale === "mk" ? "Главна навигација" : "Main")}
    <details ref={menuRef} className="mobile-nav" data-motion-menu>
      <summary aria-label={nav.menu}><Menu aria-hidden="true" size={20} /></summary>
      {list("mobile-nav-panel", locale === "mk" ? "Мобилна навигација" : "Mobile", true)}
    </details>
  </>;
}
