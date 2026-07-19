import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/lib/i18n/server";

export const metadata = { title: "Offline", robots: { index: false, follow: false } };

export default async function OfflinePage() {
  const m = await getMessages();
  return <main className="centered-state" id="main-content" tabIndex={-1}><WifiOff size={34} aria-hidden="true" /><h1>{m.offlineTitle}</h1><p>{m.offlineBody}</p><Button asChild><Link href="/">{m.backHome}</Link></Button></main>;
}
