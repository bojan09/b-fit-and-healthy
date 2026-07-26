import Link from "next/link";
import { Bell } from "lucide-react";
import type { ReactNode } from "react";
import { Brand } from "@/components/shell/brand";
import { LocaleSwitcher } from "@/components/shell/locale-switcher";
import { ProductNavigation } from "@/components/shell/product-navigation";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { AccountMenu } from "@/components/shell/account-menu";
import { signOutAction } from "@/features/auth/actions";
import { getTrackingContent } from "@/features/tracking/content";
import type { Locale } from "@/lib/i18n/config";

export function NotificationLink({
  locale,
  unreadCount,
}: {
  locale: Locale;
  unreadCount: number;
}) {
  const c = getTrackingContent(locale);
  return (
    <Link
      className="notification-link"
      href="/notifications"
      aria-label={`${c.nav.notifications}${unreadCount ? ` (${unreadCount})` : ""}`}
    >
      <Bell aria-hidden="true" />
      {unreadCount > 0 ? (
        <span>{unreadCount > 99 ? "99+" : unreadCount}</span>
      ) : null}
    </Link>
  );
}

export function ProductHeader({
  name,
  locale,
  notifications,
}: {
  name: string;
  locale: Locale;
  notifications?: ReactNode;
}) {
  return (
    <header className="product-header">
      <div className="shell product-header-inner">
        <Brand authenticated />
        <ProductNavigation />
        <div className="product-header-actions">
          {notifications ?? <NotificationLink locale={locale} unreadCount={0} />}
          <LocaleSwitcher compact />
          <ThemeToggle compact />
          <AccountMenu name={name} locale={locale} signOut={signOutAction} />
        </div>
      </div>
    </header>
  );
}
