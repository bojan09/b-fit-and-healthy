"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, ChevronDown, Flag, ListChecks, Repeat2, Soup, TrendingUp } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";

const primaryDestinations = [
  { href: "/today", key: "today", icon: CalendarDays },
  { href: "/nutrition", key: "nutrition", icon: Soup },
  { href: "/meal-planner", key: "planner", icon: CalendarDays },
  { href: "/progress", key: "progress", icon: TrendingUp },
] as const;

const moreDestinations = [
  { href: "/recipes", key: "recipes", icon: BookOpen },
  { href: "/grocery-list", key: "groceries", icon: ListChecks },
  { href: "/habits", key: "habits", icon: Repeat2 },
  { href: "/goals", key: "goals", icon: Flag },
] as const;

const labels = {
  en: { today: "Today", nutrition: "Nutrition", planner: "Planner", progress: "Progress", recipes: "Recipes", groceries: "Groceries", habits: "Habits", goals: "Goals", more: "More" },
  mk: { today: "Денес", nutrition: "Исхрана", planner: "Планер", progress: "Напредок", recipes: "Рецепти", groceries: "Намирници", habits: "Навики", goals: "Цели", more: "Повеќе" },
} as const;

export function ProductNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname(); const { locale } = useLocale(); const text = labels[locale];
  const links = mobile ? [...primaryDestinations, moreDestinations[0]] : primaryDestinations;
  return <nav className={mobile ? "mobile-product-nav" : "product-nav"} aria-label={mobile ? "Mobile product navigation" : "Product navigation"}>{links.map(({ href, key, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}><Icon aria-hidden="true" /><span>{text[key]}</span></Link>)}{!mobile && <details className="product-more-nav"><summary><ChevronDown aria-hidden="true" /><span>{text.more}</span></summary><div>{moreDestinations.map(({ href, key, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}><Icon aria-hidden="true" /><span>{text[key]}</span></Link>)}</div></details>}</nav>;
}
