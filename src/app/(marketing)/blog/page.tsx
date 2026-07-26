import { BookOpen, Search } from "lucide-react";
import Link from "next/link";
import { MotionKnowledgeLibrary as KnowledgeLibrary } from "@/features/knowledge/motion-knowledge-library";
import { getArticles } from "@/lib/content/articles";
import { getLocale } from "@/lib/i18n/server";
import { publicMetadata } from "@/lib/seo/metadata";

export const metadata = publicMetadata(
  "Knowledge for healthier decisions",
  "Readable guides about nutrition, training, recovery, habits, and anatomy.",
  "/blog",
);

export default async function BlogPage() {
  const locale = await getLocale();
  const articles = await getArticles(locale);
  const featured = articles[0];
  const isEnglish = locale === "en";

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="shell page-hero blog-hero">
        <div>
          <p className="eyebrow">
            <BookOpen aria-hidden="true" />
            {isEnglish ? "Knowledge library" : "Библиотека на знаење"}
          </p>
          <h1>
            {isEnglish
              ? "Understand more. Choose with confidence."
              : "Разбери повеќе. Избери со сигурност."}
          </h1>
          <p className="lede">
            {isEnglish
              ? "Reviewed starter guides connect training, nutrition, recovery, habits, and anatomy without miracle claims or unnecessary jargon."
              : "Прегледани почетни водичи ги поврзуваат тренингот, исхраната, опоравувањето, навиките и анатомијата без чудесни тврдења и непотребен жаргон."}
          </p>
        </div>
        <div className="library-signal">
          <Search aria-hidden="true" />
          <span>{articles.length}</span>
          <small>
            {isEnglish
              ? "reviewed bilingual guides"
              : "прегледани двојазични водичи"}
          </small>
        </div>
      </section>

      {featured && (
        <section className="shell featured-article">
          <div>
            <p className="eyebrow">
              {isEnglish ? "Editor’s starting point" : "Избор на уредникот"}
            </p>
            <h2>
              <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <p>{featured.excerpt}</p>
            <div className="article-meta">
              <span>{featured.category}</span>
              <span>
                {featured.readingTime} {isEnglish ? "min read" : "мин читање"}
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
            <p className="eyebrow">
              {isEnglish ? "Browse by question" : "Истражи по прашање"}
            </p>
            <h2 id="article-library">
              {isEnglish
                ? "Build understanding one useful topic at a time."
                : "Гради разбирање, една корисна тема по една."}
            </h2>
          </div>
          <p>
            {isEnglish
              ? "Search by a question or narrow the full reviewed collection by topic."
              : "Пребарај по прашање или филтрирај ја целата прегледана колекција по тема."}
          </p>
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
        <strong>
          {isEnglish
            ? "A note about health content"
            : "Белешка за здравствената содржина"}
        </strong>
        <p>
          {isEnglish
            ? "This library provides general education, not diagnosis or individualized care. Persistent symptoms or personal health concerns deserve qualified professional assessment."
            : "Оваа библиотека нуди општа едукација, а не дијагноза или индивидуална грижа. Постојаните симптоми и личните здравствени грижи заслужуваат стручна проценка."}
        </p>
      </section>
    </main>
  );
}
