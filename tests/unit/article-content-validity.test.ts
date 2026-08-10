import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseArticleSource } from "@/lib/content/article-schema";
import { locales } from "@/lib/i18n/config";

const contentRoot = path.join(process.cwd(), "content", "articles");

describe("every published article parses against the real content schema", () => {
  for (const locale of locales) {
    const files = readdirSync(path.join(contentRoot, locale)).filter((file) => file.endsWith(".md"));

    for (const file of files) {
      it(`${locale}/${file} parses`, async () => {
        const source = readFileSync(path.join(contentRoot, locale, file), "utf8");
        const article = await parseArticleSource(source, locale);
        expect(article.slug).toBe(file.replace(/\.md$/, ""));
        expect(article.html.length).toBeGreaterThan(0);
      });
    }
  }

  it("every en article has a matching mk article with the identical slug", async () => {
    const enFiles = readdirSync(path.join(contentRoot, "en")).filter((file) => file.endsWith(".md"));
    for (const file of enFiles) {
      const enSource = readFileSync(path.join(contentRoot, "en", file), "utf8");
      const mkSource = readFileSync(path.join(contentRoot, "mk", file), "utf8");
      const enArticle = await parseArticleSource(enSource, "en");
      const mkArticle = await parseArticleSource(mkSource, "mk");
      expect(mkArticle.slug).toBe(enArticle.slug);
      expect(mkArticle.id).toBe(enArticle.id);
    }
  });
});
