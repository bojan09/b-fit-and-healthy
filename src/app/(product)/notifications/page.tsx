import Link from "next/link";
import { Bell } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { requireUser } from "@/features/auth/session";
import {
  MarkAllNotificationsRead,
  MarkNotificationRead,
} from "@/features/tracking/notification-actions";
import { getTrackingContent } from "@/features/tracking/content";
import { loadNotifications } from "@/features/tracking/repository";
import { getLocale } from "@/lib/i18n/server";

export default async function NotificationsPage() {
  const user = await requireUser();
  const [notifications, locale] = await Promise.all([
    loadNotifications(user.id),
    getLocale(),
  ]);
  const c = getTrackingContent(locale);
  const language = locale === "mk" ? "mk-MK" : "en-GB";
  const unread = notifications.filter((item) => !item.read_at);

  return (
    <main id="main-content" className="shell tracking-page">
      <header className="tracking-page-header split">
        <div>
          <p className="eyebrow">{c.nav.today}</p>
          <h1>{c.pages.notifications}</h1>
          <p>{c.pages.notificationsIntro}</p>
        </div>
        {unread.length > 0 && (
          <MarkAllNotificationsRead label={c.forms.markAllRead} />
        )}
      </header>

      {notifications.length ? (
        <ul className="notification-list">
          {notifications.map((item) => (
            <li key={item.id} className={item.read_at ? "read" : "unread"}>
              <div>
                <span className="status-pill">
                  {item.read_at ? c.status.read : c.status.unread}
                </span>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
                <time dateTime={item.created_at}>
                  {new Intl.DateTimeFormat(language, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(item.created_at))}
                </time>
                {item.href && (
                  <Link className="text-link" href={item.href}>
                    {locale === "mk" ? "Отвори" : "Open"}
                  </Link>
                )}
              </div>
              {!item.read_at && (
                <MarkNotificationRead
                  id={item.id}
                  label={c.forms.markRead}
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={Bell}
          title={c.empty.notifications}
          description={
            locale === "mk"
              ? "Кога нешто бара внимание, ќе се појави овде."
              : "When something genuinely needs your attention, it will appear here."
          }
        />
      )}
    </main>
  );
}
