import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { locales, type Locale } from "@/lib/i18n/config";

const csv = z.string().default("").transform((value) => value.split(",").map((item) => item.trim()).filter(Boolean));
const isoDate = z.preprocess((value) => value instanceof Date ? value.toISOString().slice(0, 10) : value, z.string().regex(/^\d{4}-\d{2}-\d{2}$/));
const referenceItem = z.object({ label: z.string().min(3), url: z.url().refine((value) => value.startsWith("https://"), "References must use HTTPS") });
const references = z.string().default("").transform((value) => value.split(";").map((item) => item.trim()).filter(Boolean).map((item) => {
  const separator=item.lastIndexOf("|");return {label:item.slice(0,separator).trim(),url:item.slice(separator+1).trim()};
})).pipe(z.array(referenceItem).max(12));

const frontmatterSchema = z.object({
  id: z.string().min(2),
  locale: z.enum(locales),
  title: z.string().min(5),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().min(20),
  category: z.string().min(3),
  tags: csv,
  author: z.string().min(3),
  publishedAt: isoDate,
  updatedAt: isoDate,
  readingTime: z.coerce.number().int().positive(),
  seoTitle: z.string().min(10).max(70),
  seoDescription: z.string().min(20).max(170),
  related: csv,
  relatedMuscles: csv,
  relatedExercises: csv,
  references,
  featuredImage: z.string().trim().optional()
});

export type Article = z.infer<typeof frontmatterSchema> & {
  html: string;
  headings: { id: string; label: string }[];
};

const allowedTags = [
  "p", "h2", "h3", "strong", "em", "ul", "ol", "li", "blockquote", "a", "code"
];

export async function parseArticleSource(source: string, expectedLocale: Locale): Promise<Article> {
  const { data, content } = matter(source);
  const metadata = frontmatterSchema.parse(data);
  if (metadata.locale !== expectedLocale) {
    throw new Error(`Article locale ${metadata.locale} does not match ${expectedLocale}`);
  }
  const rendered = await marked.parse(content, { gfm: true });
  const safeHtml = sanitizeHtml(rendered, {
    allowedTags,
    allowedAttributes: { a: ["href", "title"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true)
    }
  });
  const headings: { id: string; label: string }[] = [];
  const html = safeHtml.replace(/<h2>(.*?)<\/h2>/g, (_, inner: string) => {
    const label = inner.replace(/<[^>]+>/g, "").trim();
    const id = label.toLocaleLowerCase("en").normalize("NFKD")
      .replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
    headings.push({ id, label });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { ...metadata, html, headings };
}
