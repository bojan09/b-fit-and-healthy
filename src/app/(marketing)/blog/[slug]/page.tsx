import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Bookmark, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/content/article-card";
import { ArticleJsonLd } from "@/components/seo/json-ld";
import { getArticle, getArticles, getArticleSlugs } from "@/lib/content/articles";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { siteUrl } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() { return (await getArticleSlugs()).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocale(); const { slug } = await params; const article = await getArticle(locale, slug);
  if (!article) return {};
  return { title: article.seoTitle, description: article.seoDescription, alternates: { canonical: `/blog/${slug}` }, openGraph: { title: article.seoTitle, description: article.seoDescription, type: "article", publishedTime: article.publishedAt, modifiedTime: article.updatedAt, url: `/blog/${slug}` } };
}

export default async function ArticlePage({ params }: Props) {
  const locale = await getLocale(); const c = getPublicContent(locale); const { slug } = await params; const article = await getArticle(locale, slug);
  if (!article) notFound();
  const all = await getArticles(locale); const related = article.related.map((item) => all.find((candidate) => candidate.slug === item)).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const dateLocale = locale === "mk" ? "mk-MK" : "en-GB";
  return <main id="main-content" tabIndex={-1}>
    <ArticleJsonLd value={{ "@context":"https://schema.org", "@type":"Article", headline:article.title, description:article.excerpt, datePublished:article.publishedAt, dateModified:article.updatedAt, author:{"@type":"Organization",name:article.author}, publisher:{"@type":"Organization",name:"B Fit & Healthy"}, mainEntityOfPage:new URL(`/blog/${article.slug}`,siteUrl).href }} />
    <ArticleJsonLd value={{ "@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:[{"@type":"ListItem",position:1,name:"Blog",item:new URL("/blog",siteUrl).href},{"@type":"ListItem",position:2,name:article.title,item:new URL(`/blog/${article.slug}`,siteUrl).href}] }} />
    <article className="article-layout shell">
      <aside className="article-rail"><Link className="back-link" href="/blog"><ArrowLeft aria-hidden="true" size={17} />{locale === "en" ? "Knowledge library" : "Библиотека"}</Link><nav aria-label={locale === "en" ? "On this page" : "На оваа страница"}><strong>{locale === "en" ? "In this guide" : "Во овој водич"}</strong>{article.headings.map((heading) => <a key={heading.id} href={`#${heading.id}`}>{heading.label}</a>)}</nav></aside>
      <div className="article-main"><header className="article-header"><p className="eyebrow">{article.category}</p><h1>{article.title}</h1><p className="article-deck">{article.excerpt}</p><div className="article-byline"><span>{article.author}</span><span><Clock aria-hidden="true" size={16} />{article.readingTime} {c.common.minutes}</span><time dateTime={article.publishedAt}>{new Intl.DateTimeFormat(dateLocale,{dateStyle:"long"}).format(new Date(article.publishedAt))}</time><span className="save-preview" aria-label={locale === "en" ? "Saving arrives with accounts" : "Зачувувањето доаѓа со профилите"}><Bookmark aria-hidden="true" size={16} />{locale === "en" ? "Saving arrives in Phase 3" : "Зачувување во Фаза 3"}</span></div></header><div className="article-body" dangerouslySetInnerHTML={{__html:article.html}} /><aside className="health-disclaimer"><strong>{locale === "en" ? "Use this as education" : "Користи го ова како едукација"}</strong><p>{c.common.educational}</p></aside></div>
    </article>
    {related.length > 0 && <section className="shell related-section"><p className="eyebrow">{locale === "en" ? "Continue learning" : "Продолжи со учење"}</p><h2>{locale === "en" ? "Related guides" : "Поврзани водичи"}</h2><div className="article-grid compact-grid">{related.map((item) => <ArticleCard key={item.id} article={item} minutes={c.common.minutes} readLabel={c.common.readArticle} />)}</div></section>}
  </main>;
}
