"use client";

import { CalendarDays, Dumbbell, Soup, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOptionalLocale } from "@/components/providers/locale-provider";

const destinations = [
  { href: "/demo/today", key: "today", icon: CalendarDays },
  { href: "/demo/nutrition", key: "nutrition", icon: Soup },
  { href: "/demo/training", key: "training", icon: Dumbbell },
  { href: "/demo/progress", key: "progress", icon: TrendingUp }
] as const;

type Labels = { today: string; nutrition: string; training: string; progress: string };

export function DemoNav({ labels }: { labels: Labels }) {
  const pathname = usePathname();
  const locale = useOptionalLocale();
  return (
    <nav className="product-nav demo-nav" aria-label={locale === "mk" ? "Навигација на демо" : "Demo navigation"}>
      {destinations.map(({ href, key, icon: Icon }) => (
        <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>
          <Icon aria-hidden="true" />
          <span>{labels[key]}</span>
        </Link>
      ))}
    </nav>
  );
}
