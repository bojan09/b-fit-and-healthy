import type { ReactNode } from "react";
import { PublicHeader } from "@/components/shell/public-header";
import { PublicFooter } from "@/components/shell/public-footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-frame">
      <PublicHeader />
      {children}
      <PublicFooter />
    </div>
  );
}
