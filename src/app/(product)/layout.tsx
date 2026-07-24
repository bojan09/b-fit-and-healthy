import type { ReactNode } from "react";
import { MobileProductNavigation } from "@/components/shell/mobile-product-navigation";
import { ProductHeader } from "@/components/shell/product-header";
import { getCurrentProfile, requireUser } from "@/features/auth/session";
import { loadUnreadNotificationCount } from "@/features/tracking/repository";
import { getLocale } from "@/lib/i18n/server";
import { ProductPageMotion } from "@/features/motion/product-page-motion";

export const dynamic = "force-dynamic";

export default async function ProductLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const [profile, locale, unreadCount] = await Promise.all([getCurrentProfile(user.id), getLocale(), loadUnreadNotificationCount(user.id)]);
  return <div className="product-frame"><ProductHeader locale={locale} name={profile?.display_name || user.email || (locale === "mk" ? "Сметка" : "Account")} unreadCount={unreadCount} /><div className="product-content"><ProductPageMotion>{children}</ProductPageMotion></div><MobileProductNavigation /></div>;
}
