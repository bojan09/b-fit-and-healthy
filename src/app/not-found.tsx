import Link from "next/link";
import { MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/config";

// Part of every route's boundary tree, so it must not read cookies: that would
// opt every page (including prerendered public pages) into dynamic rendering.
// The locale is unknown here, so both languages are shown as two equal blocks.
const recovery = {
  en: [["/features", "Features"], ["/blog", "Blog"], ["/demo/today", "Try the demo"]],
  mk: [["/features", "Функции"], ["/blog", "Блог"], ["/demo/today", "Пробај демо"]]
} as const;

export default function NotFound() {
  const en = getDictionary("en");
  const mk = getDictionary("mk");
  return (
    <main className="centered-state not-found" id="main-content" tabIndex={-1}>
      <MapPinOff size={34} aria-hidden="true" />
      <h1>{en.notFound}</h1>
      <p>{en.notFoundBody}</p>
      <nav aria-label="Where to go next" className="not-found-links">
        {recovery.en.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <Button asChild><Link href="/">{en.backHome}</Link></Button>
      <section lang="mk" aria-label={mk.notFound} className="not-found-mk">
        <h2>{mk.notFound}</h2>
        <p>{mk.notFoundBody}</p>
        <nav aria-label="Каде понатаму" className="not-found-links">
          {recovery.mk.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          <Link href="/">{mk.backHome}</Link>
        </nav>
      </section>
    </main>
  );
}
