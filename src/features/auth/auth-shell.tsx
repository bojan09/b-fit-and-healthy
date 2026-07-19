import type { ReactNode } from "react";
import { Activity, BookOpen, HeartPulse } from "lucide-react";
import { Brand } from "@/components/shell/brand";

export function AuthShell({ children, eyebrow }: { children: ReactNode; eyebrow: string }) {
  return (
    <main id="main-content" className="auth-shell">
      <section className="auth-story" aria-label="B Fit & Healthy">
        <div className="auth-brand"><Brand /></div>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>One calm place for your next healthy choice.</h1>
          <p>Move with purpose, eat with context, and learn what helps—without turning wellbeing into noise.</p>
        </div>
        <ul><li><HeartPulse /> Daily context</li><li><Activity /> Practical training</li><li><BookOpen /> Trusted knowledge</li></ul>
      </section>
      <section className="auth-form-pane">{children}</section>
    </main>
  );
}
