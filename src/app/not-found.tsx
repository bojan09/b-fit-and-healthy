import Link from "next/link";
import { MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/lib/i18n/server";

export default async function NotFound() {
  const m = await getMessages();
  return <main className="centered-state" id="main-content" tabIndex={-1}><MapPinOff size={34} aria-hidden="true" /><h1>{m.notFound}</h1><p>{m.notFoundBody}</p><Button asChild><Link href="/">{m.backHome}</Link></Button></main>;
}
