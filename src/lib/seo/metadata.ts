import type { Metadata } from "next";

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:53271");

export function publicMetadata(title: string, description: string, pathname: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: { title, description, url: pathname, siteName: "B Fit & Healthy", type: "website" },
    twitter: { card: "summary_large_image", title, description }
  };
}
