import { BookOpen, Search } from "lucide-react";
import { ArticleCard } from "@/components/content/article-card";
import { getArticles } from "@/lib/content/articles";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";

export const metadata = publicMetadata("Knowledge for healthier decisions", "Readable guides about nutrition, training, recovery, habits, and anatomy.", "/blog");

export default async function BlogPage() {
  const locale = await getLocale(); const c = getPublicContent(locale); const articles = await getArticles(locale);
  const featured = articles[0];
  return <main id="main-content" tabIndex={-1}>
    <section className="shell page-hero blog-hero"><div><p className="eyebrow"><BookOpen aria-hidden="true" size={18} />{c.nav.blog}</p><h1>{locale === "en" ? "Useful knowledge, written to be used." : "Корисно знаење, напишано за примена."}</h1><p className="lede">{locale === "en" ? "Clear explanations, practical next steps, and honest limits—without miracle claims or unnecessary jargon." : "Јасни објаснувања, практични следни чекори и искрени граници—без чудесни тврдења и непотребен жаргон."}</p></div><div className="library-signal"><Search aria-hidden="true" /><span>{articles.length}</span><small>{locale === "en" ? "reviewed starter guides" : "прегледани почетни водичи"}</small></div></section>
    {featured && <section className="shell featured-article"><div><p className="eyebrow">{locale === "en" ? "Start here" : "Почни тука"}</p><h2><a href={`/blog/${featured.slug}`}>{featured.title}</a></h2><p>{featured.excerpt}</p><div className="article-meta"><span>{featured.category}</span><span>{featured.readingTime} {c.common.minutes}</span></div></div><div className="featured-mark" aria-hidden="true"><BookOpen /></div></section>}
    <section className="shell public-section" aria-labelledby="article-library"><div className="library-heading"><div><p className="eyebrow">{locale === "en" ? "Browse the library" : "Истражи ја библиотеката"}</p><h2 id="article-library">{locale === "en" ? "Build understanding one useful topic at a time." : "Гради разбирање, една корисна тема одеднаш."}</h2></div><p>{locale === "en" ? "Fitness · Nutrition · Recovery · Habits · Anatomy" : "Фитнес · Исхрана · Опоравување · Навики · Анатомија"}</p></div><div className="article-grid">{articles.map((article) => <ArticleCard key={article.id} article={article} minutes={c.common.minutes} readLabel={c.common.readArticle} />)}</div></section>
    <section className="shell health-disclaimer"><strong>{locale === "en" ? "A note about health content" : "Белешка за здравствената содржина"}</strong><p>{c.common.educational} {locale === "en" ? "Persistent symptoms or individual health concerns deserve qualified professional care." : "Постојаните симптоми и личните здравствени грижи заслужуваат стручна помош."}</p></section>
  </main>;
}
