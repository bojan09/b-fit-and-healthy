import { describe, expect, it } from "vitest";
import { parseArticleSource } from "@/lib/content/article-schema";

const source = `---
id: sample
locale: en
title: Useful article
slug: useful-article
excerpt: A useful summary for the reader.
category: Training
tags: strength, basics
author: B Fit Editorial
publishedAt: 2026-07-01
updatedAt: 2026-07-02
readingTime: 5
seoTitle: Useful article title
seoDescription: A sufficiently clear description for the article metadata.
related: another-article
---

Intro paragraph.

## Clear section

Useful copy.<script>alert("unsafe")</script>
`;

describe("parseArticleSource", () => {
  it("normalizes frontmatter lists and renders safe article HTML", async () => {
    const article = await parseArticleSource(source, "en");
    expect(article.tags).toEqual(["strength", "basics"]);
    expect(article.related).toEqual(["another-article"]);
    expect(article.publishedAt).toBe("2026-07-01");
    expect(article.headings).toEqual([{ id: "clear-section", label: "Clear section" }]);
    expect(article.html).toContain('<h2 id="clear-section">Clear section</h2>');
    expect(article.html).not.toContain("<script");
  });

  it("rejects a locale that does not match its content directory", async () => {
    await expect(parseArticleSource(source, "mk")).rejects.toThrow(/locale/i);
  });
});
