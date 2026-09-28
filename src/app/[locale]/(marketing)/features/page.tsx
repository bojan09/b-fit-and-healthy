import { Activity, Apple, BookOpen, Dumbbell } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { localeFromParams } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";

export const metadata = publicMetadata("Connected health features", "Explore how nutrition, training, anatomy, and practical knowledge work together.", "/features");

export default async function FeaturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeFromParams(params); const c = getPublicContent(locale);
  const features = [[Apple, c.nav.nutrition, c.features.nutrition, "/features/nutrition"], [Dumbbell, c.nav.training, c.features.training, "/features/training"], [Activity, c.nav.anatomy, c.features.anatomy, "/anatomy"], [BookOpen, c.nav.blog, c.features.knowledge, "/blog"]] as const;
  return <main id="main-content" tabIndex={-1}><section className="shell page-hero"><div><p className="eyebrow">{c.features.eyebrow}</p><h1>{c.features.title}</h1><p className="lede">{c.features.body}</p></div></section><section className="shell public-section"><div className="feature-directory">{features.map(([Icon, title, body, href]) => <Card key={href} className="directory-card"><Icon aria-hidden="true" /><h2>{title}</h2><p>{body}</p><Link className="stretched-link" href={href}>{c.common.explore}: {title}<span aria-hidden="true">→</span></Link></Card>)}</div></section></main>;
}
