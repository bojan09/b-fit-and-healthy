import Link from "next/link";
import { Brand } from "@/components/shell/brand";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";

export async function PublicFooter() {
  const locale = await getLocale();
  const c = getPublicContent(locale);
  return <footer className="site-footer">
    <div className="shell footer-grid">
      <div className="footer-brand"><Brand /><p>{c.common.educational}</p></div>
      <div><strong>{c.nav.features}</strong><Link href="/features">{c.nav.features}</Link><Link href="/features/nutrition">{c.nav.nutrition}</Link><Link href="/features/training">{c.nav.training}</Link></div>
      <div><strong>{c.nav.blog}</strong><Link href="/blog">{c.nav.blog}</Link><Link href="/anatomy">{c.nav.anatomy}</Link><Link href="/about">{c.nav.about}</Link></div>
      <div><strong>{c.nav.information}</strong><Link href="/contact">{c.nav.contact}</Link><Link href="/privacy">{c.nav.privacy}</Link><Link href="/terms">{c.nav.terms}</Link></div>
    </div>
    <div className="shell footer-bottom"><span>© 2026 B Fit & Healthy</span><span>{c.common.educational}</span></div>
  </footer>;
}
