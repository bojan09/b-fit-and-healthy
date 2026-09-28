import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/config";

export const metadata = { title: "Offline", robots: { index: false, follow: false } };
// Precached by the service worker, so it must not depend on request cookies.
export const dynamic = "force-static";

export default function OfflinePage() {
  const en = getDictionary("en");
  const mk = getDictionary("mk");
  return (
    <main className="centered-state" id="main-content" tabIndex={-1}>
      <WifiOff size={34} aria-hidden="true" />
      <h1>{en.offlineTitle}</h1>
      <p>{en.offlineBody}</p>
      <p lang="mk">{mk.offlineTitle}. {mk.offlineBody}</p>
      <Button asChild><Link href="/">{en.backHome}</Link></Button>
    </main>
  );
}
