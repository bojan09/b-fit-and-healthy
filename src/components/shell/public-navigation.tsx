"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { getPublicContent } from "@/lib/i18n/public-content";
import { useGsapScope } from "@/features/motion/use-gsap-scope";

export function PublicNavigation() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale } = useLocale();
  const { nav } = getPublicContent(locale);
  const links = [
    ["/", nav.home], ["/features", nav.features], ["/anatomy", nav.anatomy], ["/blog", nav.blog], ["/about", nav.about]
  ] as const;
  const current = (href: string) => href === "/" ? pathname === href : pathname.startsWith(href);
  const setupMenu = useCallback(({ gsap, root }: Parameters<Parameters<typeof useGsapScope>[1]>[0]) => {
    if (!menuOpen) return;
    const panel = root.querySelector(".mobile-nav-panel");
    const items = root.querySelectorAll(".mobile-nav-panel > a, .mobile-account-links a");
    if (panel) gsap.fromTo(panel, { opacity: 0.86, y: -8 }, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out", clearProps: "transform,opacity" });
    if (items.length) gsap.fromTo(items, { opacity: 0.7, x: -6 }, { opacity: 1, x: 0, duration: 0.22, stagger: 0.025, ease: "power2.out", clearProps: "transform,opacity" });
  }, [menuOpen]);
  useGsapScope(menuRef, setupMenu, menuOpen ? "open" : "closed");
  const list = (className: string, includeAccount = false) => (
    <nav className={className} aria-label="Primary">
      {links.map(([href, label]) => <Link key={href} href={href} aria-current={current(href) ? "page" : undefined}>{label}</Link>)}
      {includeAccount && <div className="mobile-account-links"><Link href="/sign-in">{nav.signIn}</Link><Link href="/sign-up">{nav.getStarted}</Link></div>}
    </nav>
  );
  return <>
    {list("header-nav")}
    <details ref={menuRef} className="mobile-nav" data-motion-menu onToggle={(event) => setMenuOpen(event.currentTarget.open)}>
      <summary aria-label={nav.menu}><Menu aria-hidden="true" size={20} /></summary>
      {list("mobile-nav-panel", true)}
    </details>
  </>;
}
