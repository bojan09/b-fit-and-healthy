import "server-only";
import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n/config";
import { parseArticleSource, type Article } from "@/lib/content/article-schema";
export { resolveArticleRelationships } from "@/lib/content/article-relationships";

const contentRoot = path.join(process.cwd(), "content", "articles");

export const getArticleSlugs = cache(async () => {
  const files = await fs.readdir(path.join(contentRoot, "en"));
  return files.filter((file) => file.endsWith(".md")).map((file) => file.slice(0, -3)).sort();
});

export const getArticle = cache(async (locale: Locale, slug: string): Promise<Article | null> => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  try {
    const source = await fs.readFile(path.join(contentRoot, locale, `${slug}.md`), "utf8");
    return await parseArticleSource(source, locale);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
});

export const getArticles = cache(async (locale: Locale): Promise<Article[]> => {
  const slugs = await getArticleSlugs();
  const articles = await Promise.all(slugs.map((slug) => getArticle(locale, slug)));
  return articles.filter((article): article is Article => Boolean(article))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
});

export async function getArticleCategories(locale: Locale) {
  return [...new Set((await getArticles(locale)).map((article) => article.category))].sort();
}
