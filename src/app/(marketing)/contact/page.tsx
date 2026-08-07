import { InformationPage } from "@/components/content/information-page";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
export const metadata=publicMetadata("Contact B Fit & Healthy","Contact information and current support boundaries for B Fit & Healthy.","/contact");
export default async function ContactPage(){const c=getPublicContent(await getLocale()).contact;return <InformationPage eyebrow={c.eyebrow} title={c.title} intro={c.intro}><section><h2>{c.duringTitle}</h2><p>{c.duringBody}</p></section><section><h2>{c.medicalTitle}</h2><p>{c.medicalBody}</p></section></InformationPage>}
