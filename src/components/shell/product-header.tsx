import Link from "next/link";
import { Bell } from "lucide-react";
import { Brand } from "@/components/shell/brand";
import { LocaleSwitcher } from "@/components/shell/locale-switcher";
import { ProductNavigation } from "@/components/shell/product-navigation";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { getTrackingContent } from "@/features/tracking/content";
import type { Locale } from "@/lib/i18n/config";

export function ProductHeader({ name, locale, unreadCount }: { name: string; locale: Locale; unreadCount: number }) {
  const c = getTrackingContent(locale);
  return <header className="product-header"><div className="shell product-header-inner"><Brand /><ProductNavigation /><div className="product-header-actions"><Link className="notification-link" href="/notifications" aria-label={`${c.nav.notifications}${unreadCount ? ` (${unreadCount})` : ""}`}><Bell aria-hidden="true" />{unreadCount > 0 && <span>{unreadCount > 99 ? "99+" : unreadCount}</span>}</Link><LocaleSwitcher /><ThemeToggle /><div className="account-context"><span>{locale === "mk" ? "Најавени како" : "Signed in as"}</span><strong>{name}</strong></div><SignOutButton label={locale === "mk" ? "Одјави се" : "Sign out"} /></div></div></header>;
}
