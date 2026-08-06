import { Apple } from "lucide-react";
import { FeaturePage } from "@/components/content/feature-page";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";

export const metadata = publicMetadata("Nutrition with useful context", "Understand meals, energy, protein, hydration, and food patterns without moral labels.", "/features/nutrition");
export default async function NutritionFeaturePage() { const content = getPublicContent(await getLocale()); const c = content.featuresNutrition; const shared = content.featuresShared; return <FeaturePage eyebrow={c.eyebrow} title={c.title} body={c.body} Icon={Apple} principles={c.principles} workflow={c.workflow} destination={{href:"/blog/protein-without-the-myths",label:c.destinationLabel}} labels={shared} />; }
