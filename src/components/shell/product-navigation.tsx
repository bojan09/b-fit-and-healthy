"use client";

import {
  BookOpen,
  Bot,
  CalendarDays,
  ChevronDown,
  Dumbbell,
  Flag,
  ListChecks,
  Repeat2,
  Soup,
  TrendingUp,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { NavigationIntent } from "@/components/shell/navigation-intent";
import { useLocale } from "@/components/providers/locale-provider";

const primaryDestinations = [
  { href: "/today", key: "today", icon: CalendarDays },
  { href: "/nutrition", key: "nutrition", icon: Soup },
  { href: "/training", key: "training", icon: Dumbbell },
  { href: "/progress", key: "progress", icon: TrendingUp },
  { href: "/assistant", key: "coach", icon: Bot },
] as const;

const moreDestinations = [
  { href: "/meal-planner", key: "planner", icon: CalendarDays },
  { href: "/recipes", key: "recipes", icon: BookOpen },
  { href: "/grocery-list", key: "groceries", icon: ListChecks },
  { href: "/habits", key: "habits", icon: Repeat2 },
  { href: "/goals", key: "goals", icon: Flag },
] as const;

const labels = {
  en: {
    today: "Today",
    nutrition: "Nutrition",
    training: "Training",
    planner: "Meal planner",
    progress: "Progress",
    coach: "Coach",
    recipes: "Recipes",
    groceries: "Groceries",
    habits: "Habits",
    goals: "Goals",
    more: "More",
  },
  mk: {
    today: "Денес",
    nutrition: "Исхрана",
    training: "Тренинг",
    planner: "Планер за оброци",
    progress: "Напредок",
    coach: "Тренер",
    recipes: "Рецепти",
    groceries: "Намирници",
    habits: "Навики",
    goals: "Цели",
    more: "Повеќе",
  },
} as const;

function current(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ProductNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const { locale } = useLocale();
  const text = labels[locale];
  const visiblePrimary = mobile
    ? primaryDestinations.slice(0, 3)
    : primaryDestinations;
  const mobileMore = [
    ...primaryDestinations.slice(3),
    ...moreDestinations,
  ];

  return (
    <nav
      className={mobile ? "mobile-product-nav" : "product-nav"}
      aria-label={mobile ? "Mobile product navigation" : "Product navigation"}
    >
      {visiblePrimary.map(({ href, key, icon: Icon }) => (
        <NavigationIntent
          key={href}
          href={href}
          aria-current={current(pathname, href) ? "page" : undefined}
        >
          <Icon aria-hidden="true" />
          <span>{text[key]}</span>
        </NavigationIntent>
      ))}
      <details className={mobile ? "mobile-more-nav" : "product-more-nav"}>
        <summary>
          <ChevronDown aria-hidden="true" />
          <span>{text.more}</span>
        </summary>
        <div>
          {(mobile ? mobileMore : moreDestinations).map(
            ({ href, key, icon: Icon }) => (
              <NavigationIntent
                key={href}
                href={href}
                aria-current={current(pathname, href) ? "page" : undefined}
              >
                <Icon aria-hidden="true" />
                <span>{text[key]}</span>
              </NavigationIntent>
            ),
          )}
        </div>
      </details>
    </nav>
  );
}
