import { describe, expect, it } from "vitest";
import { parseArticleSource } from "@/lib/content/article-schema";
import { resolveArticleRelationships } from "@/lib/content/article-relationships";

const source=(references:string)=>`---
id: test-guide
locale: en
title: A useful test guide
slug: useful-test-guide
excerpt: A sufficiently descriptive excerpt for a useful test guide.
category: Training
tags: strength, basics
author: B Fit Editorial
publishedAt: 2026-07-01
updatedAt: 2026-07-02
readingTime: 4
seoTitle: A useful test guide for training
seoDescription: A sufficiently descriptive search description for this useful training guide.
related: another-guide, missing-guide
relatedMuscles: pectorals
relatedExercises: push-up
references: ${references}
---
## Useful heading
Safe body text.`;

describe("article relationships",()=>{
  it("validates HTTPS references and creates deterministic headings",async()=>{const article=await parseArticleSource(source("WHO physical activity|https://www.who.int/health-topics/physical-activity"),"en");expect(article.references[0].label).toBe("WHO physical activity");expect(article.headings).toEqual([{id:"useful-heading",label:"Useful heading"}]);});
  it("rejects unsafe reference protocols",async()=>{await expect(parseArticleSource(source("Unsafe|javascript:alert(1)"),"en")).rejects.toThrow();});
  it("omits missing related article slugs",async()=>{const article=await parseArticleSource(source("WHO|https://www.who.int"),"en");const other={...article,slug:"another-guide",id:"another"};expect(resolveArticleRelationships(article,[article,other]).articles.map(item=>item.slug)).toEqual(["another-guide"]);});
});
