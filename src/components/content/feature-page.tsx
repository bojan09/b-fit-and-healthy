import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturePage({ eyebrow, title, body, Icon, principles, workflow, destination, labels }: { eyebrow: string; title: string; body: string; Icon: LucideIcon; principles: { title: string; body: string }[]; workflow: string[]; destination: { href: string; label: string }; labels: { connects: string; processTitle: string; continueTitle: string; continueBody: string } }) {
  return <main id="main-content" tabIndex={-1}>
    <section className="shell page-hero compact-hero"><div><p className="eyebrow"><Icon aria-hidden="true" size={18} />{eyebrow}</p><h1>{title}</h1><p className="lede">{body}</p></div><div className="feature-emblem"><Icon aria-hidden="true" /><span>{eyebrow}</span></div></section>
    <section className="shell public-section"><div className="principle-grid">{principles.map((item) => <article key={item.title}><Check aria-hidden="true" /><h2>{item.title}</h2><p>{item.body}</p></article>)}</div></section>
    <section className="shell public-section feature-process"><div><p className="eyebrow">{labels.connects}</p><h2>{labels.processTitle}</h2></div><ol>{workflow.map((item, index) => <li key={item}><span>0{index + 1}</span><p>{item}</p></li>)}</ol></section>
    <section className="shell public-section"><div className="final-cta"><div><h2>{labels.continueTitle}</h2><p>{labels.continueBody}</p></div><Button asChild><Link href={destination.href}>{destination.label}<ArrowRight aria-hidden="true" size={18} /></Link></Button></div></section>
  </main>;
}
