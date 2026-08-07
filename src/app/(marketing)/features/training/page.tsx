import { Dumbbell } from "lucide-react";
import { FeaturePage } from "@/components/content/feature-page";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";

export const metadata = publicMetadata("Training you can understand", "Connect plans, exercises, muscle groups, and gradual progression in one training system.", "/features/training");
export default async function TrainingFeaturePage() { const content = getPublicContent(await getLocale()); const c = content.featuresTraining; const shared = content.featuresShared; return <FeaturePage eyebrow={c.eyebrow} title={c.title} body={c.body} Icon={Dumbbell} principles={c.principles} workflow={c.workflow} destination={{href:"/anatomy",label:c.destinationLabel}} labels={shared} />; }
