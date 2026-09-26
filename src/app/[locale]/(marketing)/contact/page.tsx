import { InformationPage } from "@/components/content/information-page";
import { localeFromParams } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
export const metadata=publicMetadata("Contact B Fit & Healthy","Contact information and current support boundaries for B Fit & Healthy.","/contact");
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {const c=getPublicContent(await localeFromParams(params)).contact;return <InformationPage eyebrow={c.eyebrow} title={c.title} intro={c.intro}><section><h2>{c.duringTitle}</h2><p>{c.duringBody}</p></section><section><h2>{c.medicalTitle}</h2><p>{c.medicalBody}</p></section></InformationPage>}
