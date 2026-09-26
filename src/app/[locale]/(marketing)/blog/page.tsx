import { BookOpen, Search } from "lucide-react";
import Link from "next/link";
import { MotionKnowledgeLibrary as KnowledgeLibrary } from "@/features/knowledge/motion-knowledge-library";
import { getArticles } from "@/lib/content/articles";
import { localeFromParams } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";

export const metadata = publicMetadata(
  "Knowledge for healthier decisions",
  "Readable guides about nutrition, training, recovery, habits, and anatomy.",
  "/blog",
);

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeFromParams(params);
  const articles = await getArticles(locale);
  const featured = articles[0];
  const c = getPublicContent(locale).blogIndex;

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="shell page-hero blog-hero">
        <div>
          <p className="eyebrow">
            <BookOpen aria-hidden="true" />
            {c.eyebrow}
          </p>
          <h1>{c.title}</h1>
          <p className="lede">{c.lede}</p>
        </div>
        <div className="library-signal">
          <Search aria-hidden="true" />
          <span>{articles.length}</span>
          <small>{c.signalSuffix}</small>
        </div>
      </section>

      {featured && (
        <section className="shell featured-article">
          <div>
            <p className="eyebrow">{c.featuredEyebrow}</p>
            <h2>
              <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <p>{featured.excerpt}</p>
            <div className="article-meta">
              <span>{featured.category}</span>
              <span>
                {featured.readingTime} {c.minRead}
              </span>
            </div>
          </div>
          <div className="featured-mark">
            <BookOpen aria-hidden="true" />
          </div>
        </section>
      )}

      <section className="shell public-section" aria-labelledby="article-library">
        <div className="library-heading">
          <div>
            <p className="eyebrow">{c.browseEyebrow}</p>
            <h2 id="article-library">{c.browseTitle}</h2>
          </div>
          <p>{c.browseBody}</p>
        </div>
        <KnowledgeLibrary
          locale={locale}
          articles={articles.map(
            ({ slug, title, excerpt, category, readingTime, updatedAt }) => ({
              slug,
              title,
              excerpt,
              category,
              readingTime,
              updatedAt,
            }),
          )}
        />
      </section>

      <section className="shell health-disclaimer">
        <strong>{c.noteTitle}</strong>
        <p>{c.noteBody}</p>
      </section>
    </main>
  );
}
