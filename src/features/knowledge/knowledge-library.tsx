"use client";

import { ArrowUpRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";

export type KnowledgeSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: number;
  updatedAt: string;
};

export function KnowledgeLibrary({
  locale,
  articles,
}: {
  locale: Locale;
  articles: KnowledgeSummary[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = useMemo(
    () => [...new Set(articles.map((item) => item.category))].sort(),
    [articles],
  );
  const results = useMemo(
    () =>
      articles.filter(
        (item) =>
          (category === "all" || item.category === category) &&
          (!query ||
            `${item.title} ${item.excerpt} ${item.category}`
              .toLocaleLowerCase(locale)
              .includes(query.toLocaleLowerCase(locale))),
      ),
    [articles, category, locale, query],
  );
  const clear = () => {
    setQuery("");
    setCategory("all");
  };
  const isEnglish = locale === "en";

  return (
    <div className="knowledge-library">
      <section
        aria-label={isEnglish ? "Find a guide" : "Најди водич"}
        className="knowledge-tools"
        role="search"
      >
        <label className="knowledge-search">
          <span>{isEnglish ? "Search the library" : "Пребарај ја библиотеката"}</span>
          <span className="knowledge-search-control">
            <Search aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                isEnglish
                  ? "Topic, question, or category"
                  : "Тема, прашање или категорија"
              }
            />
          </span>
        </label>
        <div
          className="knowledge-categories"
          role="group"
          aria-label={isEnglish ? "Article topics" : "Теми на статии"}
        >
          <button
            type="button"
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
          >
            {isEnglish ? "All topics" : "Сите теми"}
          </button>
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="knowledge-tool-status">
          <p aria-live="polite">
            {results.length} {isEnglish ? "guides" : "водичи"}
          </p>
          {(query || category !== "all") && (
            <button className="text-action" type="button" onClick={clear}>
              <X aria-hidden="true" />
              {isEnglish ? "Clear filters" : "Исчисти филтри"}
            </button>
          )}
        </div>
      </section>

      {results.length ? (
        <div className="knowledge-grid">
          {results.map((article) => (
            <article className="knowledge-card" key={article.slug}>
              <div className="knowledge-card-meta">
                <span>{article.category}</span>
                <span>
                  {article.readingTime} {isEnglish ? "min read" : "мин читање"}
                </span>
              </div>
              <h3>
                <Link href={`/blog/${article.slug}`}>{article.title}</Link>
              </h3>
              <p>{article.excerpt}</p>
              <footer>
                <time dateTime={article.updatedAt}>
                  {isEnglish ? "Updated" : "Обновено"} {article.updatedAt}
                </time>
                <Link
                  href={`/blog/${article.slug}`}
                  aria-label={`${isEnglish ? "Read guide" : "Прочитај водич"}: ${article.title}`}
                >
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className="knowledge-empty">
          <h3>
            {isEnglish
              ? "No guides match those filters."
              : "Нема водичи за овие филтри."}
          </h3>
          <p>
            {isEnglish
              ? "Try a broader search or clear the selected topic."
              : "Пробај пошироко пребарување или исчисти ја темата."}
          </p>
          <button type="button" onClick={clear}>
            {isEnglish ? "Clear filters" : "Исчисти филтри"}
          </button>
        </div>
      )}
    </div>
  );
}
