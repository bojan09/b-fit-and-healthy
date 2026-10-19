"use client";

import {
  BookOpen,
  Bot,
  CalendarDays,
  ChevronDown,
  Dumbbell,
  Flag,
  History,
  ListChecks,
  Repeat2,
  Soup,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useEffect, useRef } from "react";
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
  { href: "/exercises", key: "exercises", icon: Dumbbell },
  { href: "/workout-history", key: "history", icon: History },
  { href: "/personal-records", key: "records", icon: Trophy },
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
    exercises: "Exercises",
    history: "Workout history",
    records: "Personal records",
    more: "More",
    navLabel: "Product navigation",
    mobileNavLabel: "Mobile product navigation",
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
    exercises: "Вежби",
    history: "Историја на тренинзи",
    records: "Лични рекорди",
    more: "Повеќе",
    navLabel: "Навигација на производот",
    mobileNavLabel: "Мобилна навигација на производот",
  },
} as const;

function current(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ProductNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const { locale } = useLocale();
  const text = labels[locale];
  const moreRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    // Close the More menu after navigating, on outside taps, and on Escape.
    const menu = moreRef.current;
    if (menu) menu.open = false;
    const onPointerDown = (event: PointerEvent) => {
      if (menu?.open && !menu.contains(event.target as Node)) menu.open = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu?.open) {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pathname]);
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
      aria-label={mobile ? text.mobileNavLabel : text.navLabel}
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
      <details ref={moreRef} className={mobile ? "mobile-more-nav" : "product-more-nav"}>
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
