import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/today", "/nutrition", "/meals", "/train", "/workouts", "/progress", "/assistant", "/me", "/settings", "/auth/", "/sign-in", "/sign-up", "/api/"] }, sitemap: new URL("/sitemap.xml", siteUrl).href };
}
