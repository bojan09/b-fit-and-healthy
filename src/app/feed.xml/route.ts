import { getArticles } from "@/lib/content/articles";
import { siteUrl } from "@/lib/seo/metadata";

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"})[character] ?? character);

export async function GET() {
  const articles = await getArticles("en");
  const items = articles.map((article) => `<item><title>${escapeXml(article.title)}</title><link>${new URL(`/blog/${article.slug}`,siteUrl).href}</link><guid>${new URL(`/blog/${article.slug}`,siteUrl).href}</guid><description>${escapeXml(article.excerpt)}</description><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate></item>`).join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>B Fit &amp; Healthy Knowledge</title><link>${siteUrl.href}</link><description>Practical nutrition, training, recovery, habit, and anatomy guidance.</description>${items}</channel></rss>`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } });
}
