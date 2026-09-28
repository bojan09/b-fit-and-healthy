import Link from "next/link";
import { Brand } from "@/components/shell/brand";
import { LocaleSwitcher } from "@/components/shell/locale-switcher";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { PublicNavigation } from "@/components/shell/public-navigation";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import { getPublicContent } from "@/lib/i18n/public-content";

export function PublicHeader({ locale }: { locale: Locale }) {
  const c = getPublicContent(locale);
  return <header className="site-header"><div className="shell header-inner"><Brand /><PublicNavigation /><div className="public-account-actions"><Button asChild variant="quiet"><Link href="/sign-in">{c.nav.signIn}</Link></Button><Button asChild><Link href="/sign-up">{c.nav.getStarted}</Link></Button></div><div className="header-actions"><LocaleSwitcher /><ThemeToggle /></div></div></header>;
}
