import { InformationPage } from "@/components/content/information-page";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
export const metadata=publicMetadata("About B Fit & Healthy","Why B Fit & Healthy is being built as a connected, trustworthy health education and tracking system.","/about");
export default async function AboutPage(){const c=getPublicContent(await getLocale()).about;return <InformationPage eyebrow={c.eyebrow} title={c.title} intro={c.intro}><section><h2>{c.principleTitle}</h2><p>{c.principleBody}</p></section><section><h2>{c.claimsTitle}</h2><p>{c.claimsBody}</p></section></InformationPage>}
