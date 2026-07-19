import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SkipLink } from "@/components/shell/skip-link";
import { PwaRegister } from "@/components/pwa/pwa-register";
import { AmbientPointer } from "@/components/effects/ambient-pointer";
import { getLocale, getMessages } from "@/lib/i18n/server";
import "./globals.css";
import { siteUrl } from "@/lib/seo/metadata";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "B Fit & Healthy",
  title: { default: "B Fit & Healthy", template: "%s · B Fit & Healthy" },
  description: "A connected system for nutrition, training, habits and practical health education.",
  openGraph: { siteName: "B Fit & Healthy", type: "website" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }]
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "B Fit & Healthy" },
  formatDetection: { telephone: false }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F4EE" },
    { media: "(prefers-color-scheme: dark)", color: "#14211C" }
  ]
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${manrope.variable} ${mono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LocaleProvider locale={locale}>
            <SkipLink label={messages.skip} />
            <AmbientPointer />
            {children}
            <PwaRegister />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
