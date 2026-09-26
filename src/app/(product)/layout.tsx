import { Suspense, type ReactNode } from "react";
import { MobileProductNavigation } from "@/components/shell/mobile-product-navigation";
import {
  NotificationLink,
  ProductHeader,
} from "@/components/shell/product-header";
import { getCurrentProfile, requireUser } from "@/features/auth/session";
import { ProductPageMotion } from "@/features/motion/product-page-motion";
import { loadUnreadNotificationCount } from "@/features/tracking/repository";
import { getLocale } from "@/lib/i18n/server";
import { LocaleProvider } from "@/components/providers/locale-provider";

async function ProductNotifications({
  userId,
  locale,
}: {
  userId: string;
  locale: Awaited<ReturnType<typeof getLocale>>;
}) {
  const unreadCount = await loadUnreadNotificationCount(userId);
  return <NotificationLink locale={locale} unreadCount={unreadCount} />;
}

export default async function ProductLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();
  const [profile, locale] = await Promise.all([
    getCurrentProfile(user.id),
    getLocale(),
  ]);
  const name =
    profile?.display_name ||
    user.email ||
    (locale === "mk" ? "Сметка" : "Account");

  return (
    <LocaleProvider key={locale} locale={locale}>
    <div className="product-frame">
      <ProductHeader
        locale={locale}
        name={name}
        notifications={
          <Suspense
            fallback={<NotificationLink locale={locale} unreadCount={0} />}
          >
            <ProductNotifications userId={user.id} locale={locale} />
          </Suspense>
        }
      />
      <div className="product-content">
        <ProductPageMotion>{children}</ProductPageMotion>
      </div>
      <MobileProductNavigation />
    </div>
    </LocaleProvider>
  );
}
