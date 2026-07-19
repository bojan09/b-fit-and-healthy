import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/content/article-schema";

export function ArticleCard({ article, minutes, readLabel }: { article: Article; minutes: string; readLabel: string }) {
  return <article className="article-card">
    <div className="article-meta"><span>{article.category}</span><span>{article.readingTime} {minutes}</span></div>
    <h2><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2>
    <p>{article.excerpt}</p>
    <Link className="text-link" href={`/blog/${article.slug}`} aria-label={`${readLabel}: ${article.title}`}><span>{readLabel}</span><ArrowUpRight aria-hidden="true" size={18} /></Link>
  </article>;
}
