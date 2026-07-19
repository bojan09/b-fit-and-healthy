import { AlertTriangle, CheckCircle2, Inbox, LoaderCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getMessages } from "@/lib/i18n/server";

export const metadata = { title: "Foundation states" };

export default async function StatesPage() {
  const m = await getMessages();
  return (
    <main className="shell page-stack" id="main-content" tabIndex={-1}>
      <header className="page-header"><p className="eyebrow">{m.phase}</p><h1>{m.statesTitle}</h1><p>{m.statesBody}</p></header>
      <div className="state-grid">
        <Card className="state-card"><CheckCircle2 aria-hidden="true" /><div><h2>{m.ready}</h2><p>{m.featureOne}</p></div></Card>
        <Card className="state-card"><LoaderCircle className="motion-safe:animate-spin" aria-hidden="true" /><div><h2>{m.loading}</h2><div className="skeleton-line" /></div></Card>
        <Card className="state-card"><Inbox aria-hidden="true" /><div><h2>{m.empty}</h2><p>{m.emptyBody}</p></div></Card>
        <Card className="state-card warning-state"><AlertTriangle aria-hidden="true" /><div><h2>{m.warning}</h2><p>{m.warningBody}</p></div></Card>
      </div>
    </main>
  );
}
