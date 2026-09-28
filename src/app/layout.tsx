import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PwaRegister } from "@/components/pwa/pwa-register";
import "./globals.css";
import { siteUrl } from "@/lib/seo/metadata";

const sans = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans", display: "swap" });
const display = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
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
    { media: "(prefers-color-scheme: light)", color: "#F3F4F1" },
    { media: "(prefers-color-scheme: dark)", color: "#10161A" }
  ]
};

// Sets <html lang> from the locale cookie before paint. The root layout reads no
// request data so public pages stay static; area layouts provide LocaleProvider.
const langScript = `try{var m=document.cookie.match(/(?:^|; )bfit-locale=(en|mk)/);if(m)document.documentElement.lang=m[1]}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
      </head>
      <body className={`${sans.variable} ${display.variable} ${mono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="ambient-field" aria-hidden="true" />
          {children}
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
