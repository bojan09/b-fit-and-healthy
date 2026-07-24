import Link from "next/link";
import { ArrowRight, BookOpen, Dumbbell } from "lucide-react";
import { exercises } from "@/features/fitness/catalogue";
import { resolveRelatedMuscles, type MuscleSummary } from "@/features/anatomy/data";
import type { Article } from "@/lib/content/article-schema";
import type { Locale } from "@/lib/i18n/config";

export function AnatomyRelatedContent({muscle,locale,articles}:{muscle:MuscleSummary;locale:Locale;articles:Article[]}) {
  const exerciseSlugs=[...new Set([...muscle.beginnerExercises,...muscle.advancedExercises])];
  const relatedExercises=exerciseSlugs.map(slug=>exercises.find(item=>item.slug===slug)).filter((item):item is NonNullable<typeof item>=>Boolean(item));
  const relatedArticles=muscle.relatedArticles.map(slug=>articles.find(item=>item.slug===slug)).filter((item):item is Article=>Boolean(item));
  const relatedMuscles=resolveRelatedMuscles(muscle);
  return <section className="anatomy-relations" aria-labelledby="continue-anatomy"><header><p className="eyebrow">{locale==="en"?"Connected learning":"Поврзано учење"}</p><h2 id="continue-anatomy">{locale==="en"?"Continue from this muscle":"Продолжи од овој мускул"}</h2></header><div className="anatomy-relation-grid"><div><h3><Dumbbell aria-hidden="true"/>{locale==="en"?"Related exercises":"Поврзани вежби"}</h3>{relatedExercises.map(item=><Link href={`/exercises/${item.slug}`} key={item.slug}><span><strong>{locale==="en"?item.titleEn:item.titleMk}</strong><small>{item.equipment.join(" · ")}</small></span><ArrowRight/></Link>)}</div><div><h3>{locale==="en"?"Related muscles":"Поврзани мускули"}</h3>{relatedMuscles.map(item=><Link href={`/anatomy/${item.id}`} key={item.id}><span><strong>{item.name[locale]}</strong><small>{item.scientific}</small></span><ArrowRight/></Link>)}</div><div><h3><BookOpen aria-hidden="true"/>{locale==="en"?"Related guides":"Поврзани водичи"}</h3>{relatedArticles.map(item=><Link href={`/blog/${item.slug}`} key={item.slug}><span><strong>{item.title}</strong><small>{item.readingTime} min</small></span><ArrowRight/></Link>)}</div></div></section>;
}
