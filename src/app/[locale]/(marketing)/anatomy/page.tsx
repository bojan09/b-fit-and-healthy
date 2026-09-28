import { Activity } from "lucide-react";
import { AnatomyExplorer } from "@/features/anatomy/anatomy-explorer";
import { localeFromParams } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";

export const metadata = publicMetadata("Interactive athletic anatomy", "Explore major muscle groups, understand their function, and discover practical training guidance.", "/anatomy");
export default async function AnatomyPage({ params }: { params: Promise<{ locale: string }> }) { const locale = await localeFromParams(params); const c = getPublicContent(locale).anatomy; return <main id="main-content" tabIndex={-1}><section className="shell page-hero anatomy-hero"><div><p className="eyebrow"><Activity aria-hidden="true" size={18} />{c.eyebrow}</p><h1>{c.title}</h1><p className="lede">{c.lede}</p></div></section><section className="shell anatomy-section"><AnatomyExplorer locale={locale} /></section><section className="shell health-disclaimer"><strong>{c.disclaimerTitle}</strong><p>{c.disclaimerBody}</p></section></main>; }
