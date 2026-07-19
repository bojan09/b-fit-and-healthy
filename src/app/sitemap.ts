import type { MetadataRoute } from "next";
import { getArticleSlugs } from "@/lib/content/articles";
import { muscles } from "@/features/anatomy/data";
import { siteUrl } from "@/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/features", "/features/nutrition", "/features/training", "/blog", "/anatomy", "/about", "/contact", "/privacy", "/terms"];
  const articles = (await getArticleSlugs()).map((slug) => `/blog/${slug}`);
  const anatomy = muscles.map((muscle) => `/anatomy/${muscle.id}`);
  return [...staticRoutes, ...articles, ...anatomy].map((pathname) => ({ url: new URL(pathname || "/", siteUrl).href, lastModified: new Date("2026-07-19"), changeFrequency: pathname.startsWith("/blog") ? "weekly" : "monthly", priority: pathname === "" ? 1 : pathname.split("/").length === 2 ? 0.8 : 0.65 }));
}
