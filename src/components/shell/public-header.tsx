import { Brand } from "@/components/shell/brand";
import { LocaleSwitcher } from "@/components/shell/locale-switcher";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { PublicNavigation } from "@/components/shell/public-navigation";

export function PublicHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Brand />
        <PublicNavigation />
        <div className="header-actions"><LocaleSwitcher /><ThemeToggle /></div>
      </div>
    </header>
  );
}
