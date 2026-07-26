import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Dumbbell,
  ExternalLink,
} from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/content/article-card";
import { ArticleJsonLd } from "@/components/seo/json-ld";
import { getMuscle } from "@/features/anatomy/data";
import { exercises } from "@/features/fitness/catalogue";
import { resolveArticleRelationships } from "@/lib/content/article-relationships";
import {
  getArticle,
  getArticles,
  getArticleSlugs,
} from "@/lib/content/articles";
import { getLocale } from "@/lib/i18n/server";
import { siteUrl } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getArticleSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocale();
  const { slug } = await params;
  const article = await getArticle(locale, slug);
  if (!article) return {};

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: article.seoTitle,
      description: article.seoDescription,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      url: `/blog/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const locale = await getLocale();
  const { slug } = await params;
  const article = await getArticle(locale, slug);
  if (!article) notFound();

  const all = await getArticles(locale);
  const related = resolveArticleRelationships(article, all);
  const muscles = related.muscles
    .map(getMuscle)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedExercises = related.exercises
    .map((id) => exercises.find((item) => item.slug === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const dateLocale = locale === "mk" ? "mk-MK" : "en-GB";
  const mk = locale === "mk";

  return (
    <main id="main-content" tabIndex={-1}>
      <ArticleJsonLd
        value={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          author: { "@type": "Organization", name: article.author },
          publisher: { "@type": "Organization", name: "B Fit & Healthy" },
          mainEntityOfPage: new URL(
            `/blog/${article.slug}`,
            siteUrl,
          ).href,
        }}
      />
      <article className="article-layout shell">
        <aside className="article-rail">
          <Link className="back-link" href="/blog">
            <ArrowLeft aria-hidden="true" />
            {mk ? "Библиотека" : "Knowledge library"}
          </Link>
          <nav aria-label={mk ? "На оваа страница" : "On this page"}>
            <strong>{mk ? "Во овој водич" : "In this guide"}</strong>
            {article.headings.map((heading) => (
              <a key={heading.id} href={`#${heading.id}`}>
                {heading.label}
              </a>
            ))}
            {article.references.length > 0 && (
              <a href="#references">{mk ? "Извори" : "References"}</a>
            )}
          </nav>
        </aside>

        <div className="article-main">
          <div className="article-reading-column">
            <header className="article-header">
              <p className="eyebrow">{article.category}</p>
              <h1>{article.title}</h1>
              <p className="article-deck">{article.excerpt}</p>
              <div className="article-byline">
                <span>{article.author}</span>
                <span>
                  <Clock aria-hidden="true" />
                  {article.readingTime} min
                </span>
                <span>
                  {mk ? "Објавено" : "Published"}{" "}
                  <time dateTime={article.publishedAt}>
                    {new Intl.DateTimeFormat(dateLocale, {
                      dateStyle: "medium",
                    }).format(new Date(article.publishedAt))}
                  </time>
                </span>
                <span>
                  {mk ? "Обновено" : "Updated"}{" "}
                  <time dateTime={article.updatedAt}>
                    {new Intl.DateTimeFormat(dateLocale, {
                      dateStyle: "medium",
                    }).format(new Date(article.updatedAt))}
                  </time>
                </span>
              </div>
            </header>
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />
          </div>

          <div className="article-supporting-content">
            {article.references.length > 0 && (
              <section id="references" className="article-references">
                <p className="eyebrow">{mk ? "Извори" : "References"}</p>
                <h2>{mk ? "Понатамошно читање" : "Further reading"}</h2>
                <ol>
                  {article.references.map((reference) => (
                    <li key={reference.url}>
                      <a
                        href={reference.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {reference.label}
                        <ExternalLink aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}
            <aside className="health-disclaimer">
              <strong>
                {mk ? "Користи го како едукација" : "Use this as education"}
              </strong>
              <p>
                {mk
                  ? "Оваа содржина не поставува дијагноза и не заменува совет или проценка од квалификувано стручно лице."
                  : "This content does not diagnose conditions or replace advice or assessment from a qualified professional."}
              </p>
            </aside>
          </div>
        </div>
      </article>

      {(muscles.length > 0 || relatedExercises.length > 0) && (
        <section className="shell article-connections">
          <header>
            <p className="eyebrow">
              {mk ? "Поврзи го знаењето" : "Connect the knowledge"}
            </p>
            <h2>
              {mk ? "Од разбирање до движење" : "From understanding to movement"}
            </h2>
          </header>
          <div>
            {muscles.length > 0 && (
              <section>
                <h3>
                  <BookOpen aria-hidden="true" />
                  {mk ? "Анатомија" : "Anatomy"}
                </h3>
                {muscles.map((item) => (
                  <Link href={`/anatomy/${item.id}`} key={item.id}>
                    {item.name[locale]}
                    <span>{item.scientific}</span>
                  </Link>
                ))}
              </section>
            )}
            {relatedExercises.length > 0 && (
              <section>
                <h3>
                  <Dumbbell aria-hidden="true" />
                  {mk ? "Вежби" : "Exercises"}
                </h3>
                {relatedExercises.map((item) => (
                  <Link href={`/exercises/${item.slug}`} key={item.slug}>
                    {mk ? item.titleMk : item.titleEn}
                    <span>{item.equipment.join(" · ")}</span>
                  </Link>
                ))}
              </section>
            )}
          </div>
        </section>
      )}

      {related.articles.length > 0 && (
        <section className="shell related-section">
          <p className="eyebrow">
            {mk ? "Продолжи со учење" : "Continue learning"}
          </p>
          <h2>{mk ? "Поврзани водичи" : "Related guides"}</h2>
          <div className="article-grid compact-grid">
            {related.articles.map((item) => (
              <ArticleCard
                key={item.id}
                article={item}
                minutes="min"
                readLabel={mk ? "Прочитај" : "Read guide"}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
