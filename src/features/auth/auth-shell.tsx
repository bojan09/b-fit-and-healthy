import type { ReactNode } from "react";
import { Activity, BookOpen, HeartPulse } from "lucide-react";
import { Brand } from "@/components/shell/brand";
import { getAuthContent } from "@/features/auth/content";
import type { Locale } from "@/lib/i18n/config";

const icons = [HeartPulse, Activity, BookOpen];

export function AuthShell({ children, locale = "en" }: { children: ReactNode; locale?: Locale }) {
  const c = getAuthContent(locale);
  return (
    <main id="main-content" className="auth-shell">
      <section className="auth-story" aria-label="B Fit & Healthy">
        <div className="auth-brand"><Brand /></div>
        <div>
          <p className="eyebrow">{c.eyebrow}</p>
          <h1>{c.storyTitle}</h1>
          <p>{c.storyBody}</p>
        </div>
        <ul>
          {c.storyPoints.map((point, index) => {
            const Icon = icons[index];
            return <li key={point}><Icon aria-hidden="true" /> {point}</li>;
          })}
        </ul>
      </section>
      <section className="auth-form-pane">{children}</section>
    </main>
  );
}
