import { InformationPage } from "@/components/content/information-page";
import { localeFromParams } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
export const metadata=publicMetadata("Privacy foundation","The current B Fit & Healthy privacy position during the public foundation phase.","/privacy");
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {const c=getPublicContent(await localeFromParams(params)).privacy;return <InformationPage eyebrow={c.eyebrow} title={c.title} intro={c.intro}><section><h2>{c.currentTitle}</h2><p>{c.currentBody}</p></section><section><h2>{c.futureTitle}</h2><p>{c.futureBody}</p></section></InformationPage>}
