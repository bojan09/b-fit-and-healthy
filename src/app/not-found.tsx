import Link from "next/link";
import { MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/config";

// Part of every route's boundary tree, so it must not read cookies: that would
// opt every page (including prerendered public pages) into dynamic rendering.
export default function NotFound() {
  const en = getDictionary("en");
  const mk = getDictionary("mk");
  return (
    <main className="centered-state" id="main-content" tabIndex={-1}>
      <MapPinOff size={34} aria-hidden="true" />
      <h1>{en.notFound}</h1>
      <p>{en.notFoundBody}</p>
      <p lang="mk">{mk.notFound}. {mk.notFoundBody}</p>
      <Button asChild><Link href="/">{en.backHome}</Link></Button>
    </main>
  );
}
