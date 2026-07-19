import type { ReactNode } from "react";

export function InformationPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <main id="main-content" tabIndex={-1}><article className="shell information-page"><header><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="article-deck">{intro}</p></header><div className="information-body">{children}</div></article></main>;
}
