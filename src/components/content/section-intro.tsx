import type { ReactNode } from "react";

export function SectionIntro({ eyebrow, title, body, action }: { eyebrow: string; title: string; body: string; action?: ReactNode }) {
  return <div className="section-intro">
    <p className="eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
    <p>{body}</p>
    {action}
  </div>;
}
