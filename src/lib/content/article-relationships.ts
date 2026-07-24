import type { Article } from "@/lib/content/article-schema";

export function resolveArticleRelationships(article: Article, allArticles: Article[]) {
  const bySlug=new Map(allArticles.map(item=>[item.slug,item]));
  return {
    articles:article.related.map(slug=>bySlug.get(slug)).filter((item):item is Article=>item!==undefined&&item.slug!==article.slug),
    muscles:article.relatedMuscles,
    exercises:article.relatedExercises
  };
}
