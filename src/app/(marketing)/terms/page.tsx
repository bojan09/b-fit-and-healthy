import { InformationPage } from "@/components/content/information-page";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
export const metadata=publicMetadata("Terms foundation","Educational-use and product-status terms for the B Fit & Healthy public foundation.","/terms");
export default async function TermsPage(){const c=getPublicContent(await getLocale()).terms;return <InformationPage eyebrow={c.eyebrow} title={c.title} intro={c.intro}><section><h2>{c.useTitle}</h2><p>{c.useBody}</p></section><section><h2>{c.statusTitle}</h2><p>{c.statusBody}</p></section></InformationPage>}
