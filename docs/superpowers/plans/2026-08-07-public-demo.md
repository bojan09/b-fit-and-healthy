# Public Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/demo/*` route tree (Today, Nutrition, Training, Progress) that unauthenticated
visitors can use to see realistic example data and interact with the core product patterns,
with a hard guarantee of zero Supabase/real-data coupling, linked from the landing hero.

**Architecture:** New route group `src/app/(demo)/demo/*`, sibling to `(marketing)`/`(product)`/
`(auth)`. Not in `proxy.ts`'s `protectedPrefixes`, so it's public with no middleware changes.
Static fixture data in `src/features/demo/data.ts`. Small interactive widgets are `"use client"`
components seeded from that fixture data via `useState` — no persistence. Two existing pure
presentational components (`DailyBalance`, `WeightChart`) are reused as-is; everything else is
new, purpose-built demo components (existing dashboard/nav components are too entangled with
live-domain types/Supabase-backed actions to reuse safely).

**Tech Stack:** Next.js 16 App Router (Server + Client Components), TypeScript, existing
`public-content.ts` i18n pattern, Vitest + Testing Library, `node --test` contract tests.

---

### Task 1: Demo fixture data and i18n content

**Files:**
- Create: `src/features/demo/data.ts`
- Modify: `src/lib/i18n/public-content.ts`

- [ ] **Step 1: Create the fixture data module**

```typescript
import type { Locale } from "@/lib/i18n/config";

export type LocalizedText = { en: string; mk: string };

export function localized(value: LocalizedText, locale: Locale) {
  return value[locale];
}

export type DemoHabit = { id: string; title: LocalizedText; done: boolean };

export const demoHabits: DemoHabit[] = [
  { id: "water", title: { en: "Drink 2L of water", mk: "Испиј 2Л вода" }, done: true },
  { id: "walk", title: { en: "10-minute walk", mk: "10-минутна прошетка" }, done: true },
  { id: "sleep", title: { en: "Lights out by 11pm", mk: "Легнување до 23ч" }, done: false },
  { id: "stretch", title: { en: "Evening stretch", mk: "Вечерно истегнување" }, done: false }
];

export type DemoMeal = {
  id: string;
  time: string;
  name: LocalizedText;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export const demoMeals: DemoMeal[] = [
  { id: "breakfast", time: "07:40", name: { en: "Oats with berries", mk: "Овес со бобинки" }, kcal: 420, proteinG: 18, carbsG: 62, fatG: 11 },
  { id: "lunch", time: "12:30", name: { en: "Chicken & rice bowl", mk: "Пилешко со ориз" }, kcal: 610, proteinG: 42, carbsG: 70, fatG: 15 },
  { id: "dinner", time: "19:10", name: { en: "Salmon & vegetables", mk: "Лосос со зеленчук" }, kcal: 540, proteinG: 38, carbsG: 28, fatG: 26 }
];

export const demoAddableMeal: DemoMeal = {
  id: "snack",
  time: "16:00",
  name: { en: "Greek yogurt & almonds", mk: "Грчки јогурт со бадеми" },
  kcal: 260,
  proteinG: 16,
  carbsG: 14,
  fatG: 15
};

export type DemoExercise = { id: string; name: LocalizedText; sets: string; done: boolean };

export const demoWorkoutSession: { title: LocalizedText; duration: LocalizedText; exercises: DemoExercise[] } = {
  title: { en: "Full-body strength", mk: "Силов тренинг за цело тело" },
  duration: { en: "38 min", mk: "38 мин" },
  exercises: [
    { id: "squat", name: { en: "Back squat", mk: "Клек со шипка" }, sets: "4 × 6", done: true },
    { id: "bench", name: { en: "Bench press", mk: "Потисок од клупа" }, sets: "4 × 8", done: true },
    { id: "row", name: { en: "Barbell row", mk: "Веслање со шипка" }, sets: "3 × 10", done: false },
    { id: "plank", name: { en: "Plank hold", mk: "Плоча" }, sets: "3 × 45s", done: false }
  ]
};

export const demoWeightPoints: Array<{ date: string; value: number }> = [
  { date: "2026-07-08", value: 82.4 },
  { date: "2026-07-15", value: 81.9 },
  { date: "2026-07-22", value: 81.3 },
  { date: "2026-07-29", value: 80.8 },
  { date: "2026-08-05", value: 80.2 }
];
```

- [ ] **Step 2: Add the `demo` and `tryDemoLabel` content to `public-content.ts`**

In the `en` object, inside `home`, add `tryDemoLabel` right after `carryLabel` (the last key in
`home`, immediately before the closing `},` of `home`). Find:

```typescript
      carryLabel: "Loaded carry",
      exerciseDoneLabel: "Done",
      exercisePendingLabel: "Up next"
    },
```

Replace with:

```typescript
      carryLabel: "Loaded carry",
      exerciseDoneLabel: "Done",
      exercisePendingLabel: "Up next",
      tryDemoLabel: "Try the demo"
    },
```

Then, immediately after the `features` section closes in the `en` object (find the `en` object's
`features` section — it ends with `knowledge: "Readable articles..."` followed by `}`), insert a
new top-level `demo` section as a sibling of `home`/`features`. Find:

```typescript
    features: {
      eyebrow: "The ecosystem",
      title: "Different health goals, one understandable rhythm.",
      body: "Each module is useful on its own and more helpful when it shares context with the rest of your day.",
      nutrition: "Food, meals, hydration, and nutrition knowledge without moral labels.",
      training: "Plans, sessions, exercise education, and steady progression.",
      anatomy: "A visual bridge between muscles, movement, and exercise choices.",
      knowledge: "Readable articles that explain the reasoning behind practical actions."
    },
    about: {
```

Replace with (note the new `demo` block inserted between `features` and `about`):

```typescript
    features: {
      eyebrow: "The ecosystem",
      title: "Different health goals, one understandable rhythm.",
      body: "Each module is useful on its own and more helpful when it shares context with the rest of your day.",
      nutrition: "Food, meals, hydration, and nutrition knowledge without moral labels.",
      training: "Plans, sessions, exercise education, and steady progression.",
      anatomy: "A visual bridge between muscles, movement, and exercise choices.",
      knowledge: "Readable articles that explain the reasoning behind practical actions."
    },
    demo: {
      nav: { today: "Today", nutrition: "Nutrition", training: "Training", progress: "Progress" },
      banner: {
        message: "You're viewing example data — sign up to start tracking your own.",
        cta: "Get started",
        signUp: "Sign up"
      },
      today: {
        greeting: "Good morning, Alex",
        subtitle: "Here's what your day looks like at a glance.",
        habitsTitle: "Today's habits"
      },
      nutrition: {
        title: "Today's meals",
        subtitle: "See how meals and macros add up across the day.",
        addFood: "Add food",
        total: "Today's total"
      },
      training: {
        subtitle: "Today's session, planned and tracked.",
        done: "Done",
        pending: "Up next",
        complete: "complete"
      },
      progress: {
        title: "Weight trend",
        subtitle: "The last few weeks at a glance.",
        history: "History",
        unit: "kg"
      }
    },
    about: {
```

Now apply the same two edits to the `mk` object. Find (inside `mk.home`):

```typescript
      carryLabel: "Носење товар",
      exerciseDoneLabel: "Завршено",
      exercisePendingLabel: "Следно"
    },
```

Replace with:

```typescript
      carryLabel: "Носење товар",
      exerciseDoneLabel: "Завршено",
      exercisePendingLabel: "Следно",
      tryDemoLabel: "Пробај ја демо-верзијата"
    },
```

Find (inside `mk`, between `features` and `about`):

```typescript
    features: {
      eyebrow: "Екосистемот",
      title: "Различни здравствени цели, еден разбирлив ритам.",
      body: "Секој модул е корисен самостојно и уште покорисен кога споделува контекст со остатокот од денот.",
      nutrition: "Храна, оброци, хидратација и знаење без морални етикети.",
      training: "Планови, сесии, едукација за вежби и постепен напредок.",
      anatomy: "Визуелен мост меѓу мускулите, движењето и изборот на вежби.",
      knowledge: "Читливи статии што го објаснуваат размислувањето зад практичните чекори."
    },
    about: {
```

Replace with:

```typescript
    features: {
      eyebrow: "Екосистемот",
      title: "Различни здравствени цели, еден разбирлив ритам.",
      body: "Секој модул е корисен самостојно и уште покорисен кога споделува контекст со остатокот од денот.",
      nutrition: "Храна, оброци, хидратација и знаење без морални етикети.",
      training: "Планови, сесии, едукација за вежби и постепен напредок.",
      anatomy: "Визуелен мост меѓу мускулите, движењето и изборот на вежби.",
      knowledge: "Читливи статии што го објаснуваат размислувањето зад практичните чекори."
    },
    demo: {
      nav: { today: "Денес", nutrition: "Исхрана", training: "Тренинг", progress: "Напредок" },
      banner: {
        message: "Гледаш пример-податоци — регистрирај се за да го следиш своето.",
        cta: "Започни",
        signUp: "Регистрирај се"
      },
      today: {
        greeting: "Добро утро, Алекс",
        subtitle: "Еве како изгледа твојот ден накратко.",
        habitsTitle: "Денешни навики"
      },
      nutrition: {
        title: "Денешни оброци",
        subtitle: "Погледни како оброците и макросите се собираат преку денот.",
        addFood: "Додај храна",
        total: "Денешен вкупен внес"
      },
      training: {
        subtitle: "Денешна сесија, планирана и следена.",
        done: "Завршено",
        pending: "Следно",
        complete: "завршено"
      },
      progress: {
        title: "Тренд на тежина",
        subtitle: "Последните неколку недели накратко.",
        history: "Историја",
        unit: "kg"
      }
    },
    about: {
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS (nothing consumes `data.ts` or the new content keys yet, so no type errors from
unused exports).

- [ ] **Step 4: Commit**

```bash
git add src/features/demo/data.ts src/lib/i18n/public-content.ts
git commit -m "feat(demo): add fixture data and i18n content for public demo"
```

---

### Task 2: Demo shell — layout, nav, banner, isolation contract test

**Files:**
- Create: `src/components/shell/demo-nav.tsx`
- Create: `src/app/(demo)/demo/layout.tsx`
- Create: `src/app/(demo)/demo/page.tsx`
- Create: `src/styles/demo.css`
- Modify: `src/app/globals.css` (add one `@import` line)
- Test: `tests/demo-experience.test.js` (new)

- [ ] **Step 1: Write the failing contract test**

Create `tests/demo-experience.test.js`:

```javascript
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

test("demo route is never listed as a protected prefix", () => {
  const proxy = fs.readFileSync("src/lib/supabase/proxy.ts", "utf8");
  const match = proxy.match(/protectedPrefixes = \[([\s\S]*?)\]/);
  assert.ok(match, "protectedPrefixes array not found in proxy.ts");
  assert.doesNotMatch(match[1], /"\/demo/, "/demo must never be added to protectedPrefixes");
});

test("demo route tree never imports Supabase", () => {
  const roots = ["src/app/(demo)", "src/features/demo"];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const file of walk(root)) {
      if (!/\.(ts|tsx)$/.test(file)) continue;
      const content = fs.readFileSync(file, "utf8");
      assert.doesNotMatch(
        content,
        /@\/lib\/supabase/,
        `${file} must not import Supabase — demo data is fully static`,
      );
    }
  }
});

test("demo pages exist for all four screens", () => {
  for (const route of ["today", "nutrition", "training", "progress"]) {
    assert.ok(
      fs.existsSync(`src/app/(demo)/demo/${route}/page.tsx`),
      `demo/${route} page is missing`,
    );
  }
});

test("demo index redirects rather than duplicating content", () => {
  const content = fs.readFileSync("src/app/(demo)/demo/page.tsx", "utf8");
  assert.match(content, /redirect\(/, "demo index page must redirect to a real screen");
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `node --test tests/demo-experience.test.js`
Expected: FAIL — none of the demo files exist yet.

- [ ] **Step 3: Create `src/components/shell/demo-nav.tsx`**

```typescript
"use client";

import { CalendarDays, Dumbbell, Soup, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const destinations = [
  { href: "/demo/today", key: "today", icon: CalendarDays },
  { href: "/demo/nutrition", key: "nutrition", icon: Soup },
  { href: "/demo/training", key: "training", icon: Dumbbell },
  { href: "/demo/progress", key: "progress", icon: TrendingUp }
] as const;

type Labels = { today: string; nutrition: string; training: string; progress: string };

export function DemoNav({ labels }: { labels: Labels }) {
  const pathname = usePathname();
  return (
    <nav className="product-nav demo-nav" aria-label="Demo navigation">
      {destinations.map(({ href, key, icon: Icon }) => (
        <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>
          <Icon aria-hidden="true" />
          <span>{labels[key]}</span>
        </Link>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: Create `src/app/(demo)/demo/layout.tsx`**

```typescript
import type { ReactNode } from "react";
import Link from "next/link";
import { Brand } from "@/components/shell/brand";
import { Button } from "@/components/ui/button";
import { DemoNav } from "@/components/shell/demo-nav";
import { SkipLink } from "@/components/shell/skip-link";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";

export default async function DemoLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const c = getPublicContent(locale).demo;
  return (
    <div className="demo-shell">
      <SkipLink label={locale === "mk" ? "Прескокни до содржината" : "Skip to content"} />
      <header className="demo-header">
        <div className="shell demo-header-inner">
          <Brand authenticated={false} />
          <DemoNav labels={c.nav} />
          <Button asChild>
            <Link href="/sign-up">{c.banner.signUp}</Link>
          </Button>
        </div>
      </header>
      <div className="demo-banner">
        <p>{c.banner.message}</p>
        <Button asChild variant="secondary">
          <Link href="/sign-up">{c.banner.cta}</Link>
        </Button>
      </div>
      <main id="main-content" tabIndex={-1} className="shell demo-main">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/app/(demo)/demo/page.tsx`**

```typescript
import { redirect } from "next/navigation";

export default function DemoIndexPage() {
  redirect("/demo/today");
}
```

- [ ] **Step 6: Create `src/styles/demo.css`**

```css
.demo-shell { min-height: 100vh; display: flex; flex-direction: column; }
.demo-header { position: sticky; top: 0; z-index: 30; border-bottom: 1px solid var(--border); background: color-mix(in srgb, var(--background) 88%, transparent); backdrop-filter: blur(16px); }
.demo-header-inner { min-height: 4rem; display: flex; align-items: center; gap: var(--space-6); }
.demo-nav { margin-inline-start: auto; }
.demo-banner { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--space-4); background: var(--brand-soft); padding: var(--space-3) var(--space-4); text-align: center; }
.demo-banner p { margin: 0; font-size: 0.875rem; font-weight: 700; color: var(--foreground); }
.demo-main { padding-block: clamp(2rem, 6vw, 4rem); display: grid; gap: var(--space-8); }
.demo-page { display: grid; gap: var(--space-6); }
.demo-today-layout { display: grid; gap: var(--space-6); }
.demo-habit-list ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2); }
.demo-habit-list button { display: flex; align-items: center; gap: var(--space-3); width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-control); padding: var(--space-3) var(--space-4); font: inherit; text-align: left; cursor: pointer; }
.demo-habit-list button svg { color: var(--foreground-muted); }
.demo-habit-list button[aria-pressed="true"] { border-color: var(--brand); }
.demo-habit-list button[aria-pressed="true"] svg { color: var(--brand); }
.demo-nutrition { display: grid; gap: var(--space-5); }
.demo-meal-list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2); }
.demo-meal-list li { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: var(--space-3); border-bottom: 1px solid var(--border); padding-block: var(--space-3); }
.demo-meal-list li span { font-family: var(--font-mono), monospace; font-size: 0.75rem; color: var(--foreground-muted); }
.demo-meal-list li b { font-family: var(--font-mono), monospace; font-size: 0.8125rem; }
.demo-training-visual { max-width: 32rem; }
button.training-row { background: none; border: none; width: 100%; font: inherit; text-align: left; cursor: pointer; }
```

- [ ] **Step 7: Import `demo.css` in `src/app/globals.css`**

Find:

```css
@import "../styles/interaction.css";
```

Replace with:

```css
@import "../styles/interaction.css";
@import "../styles/demo.css";
```

- [ ] **Step 8: Run the contract test to confirm it passes**

Run: `node --test tests/demo-experience.test.js`
Expected: 3 of 4 tests PASS (`/demo` not protected, no Supabase import, index redirects). The
"demo pages exist for all four screens" test still FAILS — that's expected, those pages are
created in Tasks 3-6.

- [ ] **Step 9: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add src/components/shell/demo-nav.tsx "src/app/(demo)" src/styles/demo.css src/app/globals.css tests/demo-experience.test.js
git commit -m "feat(demo): add public demo shell (layout, nav, banner)"
```

---

### Task 3: Today demo page

**Files:**
- Create: `src/features/demo/demo-habit-list.tsx`
- Create: `src/app/(demo)/demo/today/page.tsx`
- Test: `tests/component/demo-habit-list.test.tsx` (new)

- [ ] **Step 1: Write the failing component test**

Create `tests/component/demo-habit-list.test.tsx`:

```typescript
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DemoHabitList } from "@/features/demo/demo-habit-list";

const habits = [
  { id: "water", title: { en: "Drink water", mk: "Пиј вода" }, done: true },
  { id: "walk", title: { en: "Walk", mk: "Прошетка" }, done: false }
];

describe("DemoHabitList", () => {
  afterEach(cleanup);

  it("renders habits in the given locale and reflects initial done state", () => {
    render(<DemoHabitList habits={habits} locale="en" title="Habits" />);
    expect(screen.getByRole("button", { name: /Drink water/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Walk/i })).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles a habit's done state on click, locally", () => {
    render(<DemoHabitList habits={habits} locale="en" title="Habits" />);
    const walkButton = screen.getByRole("button", { name: /Walk/i });
    fireEvent.click(walkButton);
    expect(walkButton).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(walkButton);
    expect(walkButton).toHaveAttribute("aria-pressed", "false");
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run tests/component/demo-habit-list.test.tsx`
Expected: FAIL — `DemoHabitList` doesn't exist yet.

- [ ] **Step 3: Create `src/features/demo/demo-habit-list.tsx`**

```typescript
"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { DemoHabit } from "@/features/demo/data";

export function DemoHabitList({
  habits,
  locale,
  title
}: {
  habits: DemoHabit[];
  locale: Locale;
  title: string;
}) {
  const [state, setState] = useState(habits);
  const toggle = (id: string) =>
    setState((current) =>
      current.map((habit) => (habit.id === id ? { ...habit, done: !habit.done } : habit))
    );

  return (
    <section className="demo-habit-list" aria-labelledby="demo-habits-title">
      <h2 id="demo-habits-title">{title}</h2>
      <ul>
        {state.map((habit) => (
          <li key={habit.id}>
            <button type="button" onClick={() => toggle(habit.id)} aria-pressed={habit.done}>
              {habit.done ? <CheckCircle2 aria-hidden="true" /> : <Circle aria-hidden="true" />}
              <span>{habit.title[locale]}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx vitest run tests/component/demo-habit-list.test.tsx`
Expected: PASS, both tests.

- [ ] **Step 5: Create `src/app/(demo)/demo/today/page.tsx`**

```typescript
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
import { DailyBalance } from "@/features/dashboard/daily-balance";
import { DemoHabitList } from "@/features/demo/demo-habit-list";
import { demoHabits } from "@/features/demo/data";

export const metadata = publicMetadata(
  "Try the demo — Today",
  "See what a day of tracking looks like in B Fit & Healthy.",
  "/demo/today"
);

export default async function DemoTodayPage() {
  const locale = await getLocale();
  const c = getPublicContent(locale).demo;
  const energyLabel = locale === "mk" ? "Енергија" : "Energy";
  const waterLabel = locale === "mk" ? "Вода" : "Water";

  return (
    <div className="demo-page">
      <header className="page-header">
        <p className="eyebrow">{c.nav.today}</p>
        <h1>{c.today.greeting}</h1>
        <p>{c.today.subtitle}</p>
      </header>
      <div className="demo-today-layout">
        <DailyBalance
          title={c.today.habitsTitle}
          rows={[
            { label: energyLabel, value: "1,570 / 2,200 kcal", ratio: 0.71 },
            { label: waterLabel, value: "1.4 / 2.5 L", ratio: 0.56 },
            { label: c.today.habitsTitle, value: "2 / 4", ratio: 0.5 }
          ]}
        />
        <DemoHabitList habits={demoHabits} locale={locale} title={c.today.habitsTitle} />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 7: Manual verification**

Run: `npm run dev`, visit `/demo/today` in both locales. Confirm: banner shows, nav highlights
"Today", energy/water/habits summary rows render with meters, habit list renders 4 items with 2
pre-checked, clicking toggles a habit's icon between filled/outline.

- [ ] **Step 8: Commit**

```bash
git add src/features/demo/demo-habit-list.tsx "src/app/(demo)/demo/today" tests/component/demo-habit-list.test.tsx
git commit -m "feat(demo): add Today demo page"
```

---

### Task 4: Nutrition demo page

**Files:**
- Create: `src/features/demo/demo-meal-tracker.tsx`
- Create: `src/app/(demo)/demo/nutrition/page.tsx`
- Test: `tests/component/demo-meal-tracker.test.tsx` (new)

- [ ] **Step 1: Write the failing component test**

Create `tests/component/demo-meal-tracker.test.tsx`:

```typescript
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DemoMealTracker } from "@/features/demo/demo-meal-tracker";

const meals = [
  { id: "breakfast", time: "07:40", name: { en: "Oats", mk: "Овес" }, kcal: 400, proteinG: 20, carbsG: 60, fatG: 10 }
];
const addableMeal = {
  id: "snack",
  time: "16:00",
  name: { en: "Yogurt", mk: "Јогурт" },
  kcal: 200,
  proteinG: 10,
  carbsG: 15,
  fatG: 8
};
const labels = { addFood: "Add food", total: "Total", protein: "Protein", carbs: "Carbs", fat: "Fat", kcal: "kcal" };

describe("DemoMealTracker", () => {
  afterEach(cleanup);

  it("shows initial totals computed from the meal list", () => {
    render(<DemoMealTracker meals={meals} addableMeal={addableMeal} locale="en" labels={labels} />);
    expect(screen.getByText("400")).toBeInTheDocument();
    expect(screen.getByText("20g")).toBeInTheDocument();
  });

  it("adds the addable meal once and updates totals", () => {
    render(<DemoMealTracker meals={meals} addableMeal={addableMeal} locale="en" labels={labels} />);
    fireEvent.click(screen.getByRole("button", { name: /Add food/i }));
    expect(screen.getByText("600")).toBeInTheDocument();
    expect(screen.getByText("Yogurt")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Add food/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run tests/component/demo-meal-tracker.test.tsx`
Expected: FAIL — `DemoMealTracker` doesn't exist yet.

- [ ] **Step 3: Create `src/features/demo/demo-meal-tracker.tsx`**

```typescript
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import type { DemoMeal } from "@/features/demo/data";

type Labels = { addFood: string; total: string; protein: string; carbs: string; fat: string; kcal: string };

export function DemoMealTracker({
  meals,
  addableMeal,
  locale,
  labels
}: {
  meals: DemoMeal[];
  addableMeal: DemoMeal;
  locale: Locale;
  labels: Labels;
}) {
  const [list, setList] = useState(meals);
  const [added, setAdded] = useState(false);
  const totals = list.reduce(
    (sum, meal) => ({
      kcal: sum.kcal + meal.kcal,
      proteinG: sum.proteinG + meal.proteinG,
      carbsG: sum.carbsG + meal.carbsG,
      fatG: sum.fatG + meal.fatG
    }),
    { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );

  return (
    <div className="demo-nutrition">
      <div className="nutrition-stat">
        <strong>{totals.kcal}</strong>
        <span>{labels.kcal}</span>
      </div>
      <div className="nutrient-lines">
        <div className="nutrient-line"><span>{labels.protein}</span><i /><b>{totals.proteinG}g</b></div>
        <div className="nutrient-line"><span>{labels.carbs}</span><i /><b>{totals.carbsG}g</b></div>
        <div className="nutrient-line"><span>{labels.fat}</span><i /><b>{totals.fatG}g</b></div>
      </div>
      <ul className="demo-meal-list">
        {list.map((meal) => (
          <li key={meal.id}>
            <span>{meal.time}</span>
            <strong>{meal.name[locale]}</strong>
            <b>{meal.kcal} {labels.kcal}</b>
          </li>
        ))}
      </ul>
      {!added && (
        <Button
          variant="secondary"
          onClick={() => {
            setList((current) => [...current, addableMeal]);
            setAdded(true);
          }}
        >
          <Plus aria-hidden="true" />
          {labels.addFood}
        </Button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx vitest run tests/component/demo-meal-tracker.test.tsx`
Expected: PASS, both tests.

- [ ] **Step 5: Create `src/app/(demo)/demo/nutrition/page.tsx`**

```typescript
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
import { DemoMealTracker } from "@/features/demo/demo-meal-tracker";
import { demoMeals, demoAddableMeal } from "@/features/demo/data";

export const metadata = publicMetadata(
  "Try the demo — Nutrition",
  "See how meal and macro tracking works in B Fit & Healthy.",
  "/demo/nutrition"
);

export default async function DemoNutritionPage() {
  const locale = await getLocale();
  const c = getPublicContent(locale).demo;
  const home = getPublicContent(locale).home;

  return (
    <div className="demo-page">
      <header className="page-header">
        <p className="eyebrow">{c.nav.nutrition}</p>
        <h1>{c.nutrition.title}</h1>
        <p>{c.nutrition.subtitle}</p>
      </header>
      <DemoMealTracker
        meals={demoMeals}
        addableMeal={demoAddableMeal}
        locale={locale}
        labels={{
          addFood: c.nutrition.addFood,
          total: c.nutrition.total,
          protein: home.proteinLabel,
          carbs: home.carbsLabel,
          fat: home.fatLabel,
          kcal: home.caloriesUnit
        }}
      />
    </div>
  );
}
```

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 7: Manual verification**

Run: `npm run dev`, visit `/demo/nutrition` in both locales. Confirm: 3 meals listed, totals at
top match the sum, clicking "Add food" appends a 4th meal and updates totals, button disappears
after use.

- [ ] **Step 8: Commit**

```bash
git add src/features/demo/demo-meal-tracker.tsx "src/app/(demo)/demo/nutrition" tests/component/demo-meal-tracker.test.tsx
git commit -m "feat(demo): add Nutrition demo page"
```

---

### Task 5: Training demo page

**Files:**
- Create: `src/features/demo/demo-workout-session.tsx`
- Create: `src/app/(demo)/demo/training/page.tsx`
- Test: `tests/component/demo-workout-session.test.tsx` (new)

- [ ] **Step 1: Write the failing component test**

Create `tests/component/demo-workout-session.test.tsx`:

```typescript
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DemoWorkoutSession } from "@/features/demo/demo-workout-session";

const session = {
  title: { en: "Full-body strength", mk: "Тренинг" },
  duration: { en: "38 min", mk: "38 мин" },
  exercises: [
    { id: "squat", name: { en: "Back squat", mk: "Клек" }, sets: "4 × 6", done: true },
    { id: "row", name: { en: "Barbell row", mk: "Веслање" }, sets: "3 × 10", done: false }
  ]
};
const labels = { done: "Done", pending: "Up next", complete: "complete" };

describe("DemoWorkoutSession", () => {
  afterEach(cleanup);

  it("shows the initial done count", () => {
    render(<DemoWorkoutSession session={session} locale="en" labels={labels} />);
    expect(screen.getByText(/1\/2 complete/)).toBeInTheDocument();
  });

  it("toggling an exercise updates the done count", () => {
    render(<DemoWorkoutSession session={session} locale="en" labels={labels} />);
    fireEvent.click(screen.getByRole("button", { name: /Barbell row/i }));
    expect(screen.getByText(/2\/2 complete/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run tests/component/demo-workout-session.test.tsx`
Expected: FAIL — `DemoWorkoutSession` doesn't exist yet.

- [ ] **Step 3: Create `src/features/demo/demo-workout-session.tsx`**

```typescript
"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { DemoExercise, LocalizedText } from "@/features/demo/data";

type Labels = { done: string; pending: string; complete: string };
type Session = { title: LocalizedText; duration: LocalizedText; exercises: DemoExercise[] };

export function DemoWorkoutSession({
  session,
  locale,
  labels
}: {
  session: Session;
  locale: Locale;
  labels: Labels;
}) {
  const [exercises, setExercises] = useState(session.exercises);
  const toggle = (id: string) =>
    setExercises((current) =>
      current.map((exercise) => (exercise.id === id ? { ...exercise, done: !exercise.done } : exercise))
    );
  const doneCount = exercises.filter((exercise) => exercise.done).length;

  return (
    <div className="feature-visual training-visual demo-training-visual">
      <div className="training-visual-header">
        <strong>{session.title[locale]}</strong>
        <span>{session.duration[locale]} · {doneCount}/{exercises.length} {labels.complete}</span>
      </div>
      {exercises.map((exercise) => (
        <button
          type="button"
          className="training-row"
          data-done={exercise.done}
          key={exercise.id}
          onClick={() => toggle(exercise.id)}
          aria-pressed={exercise.done}
        >
          {exercise.done ? <CheckCircle2 aria-hidden="true" /> : <Circle aria-hidden="true" />}
          <strong>{exercise.name[locale]}</strong>
          <small>{exercise.sets}</small>
          <span className="training-row-status">{exercise.done ? labels.done : labels.pending}</span>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx vitest run tests/component/demo-workout-session.test.tsx`
Expected: PASS, both tests.

- [ ] **Step 5: Create `src/app/(demo)/demo/training/page.tsx`**

```typescript
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
import { DemoWorkoutSession } from "@/features/demo/demo-workout-session";
import { demoWorkoutSession } from "@/features/demo/data";

export const metadata = publicMetadata(
  "Try the demo — Training",
  "See how workout sessions are planned and tracked in B Fit & Healthy.",
  "/demo/training"
);

export default async function DemoTrainingPage() {
  const locale = await getLocale();
  const c = getPublicContent(locale).demo;

  return (
    <div className="demo-page">
      <header className="page-header">
        <p className="eyebrow">{c.nav.training}</p>
        <h1>{demoWorkoutSession.title[locale]}</h1>
        <p>{c.training.subtitle}</p>
      </header>
      <DemoWorkoutSession
        session={demoWorkoutSession}
        locale={locale}
        labels={{ done: c.training.done, pending: c.training.pending, complete: c.training.complete }}
      />
    </div>
  );
}
```

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 7: Manual verification**

Run: `npm run dev`, visit `/demo/training` in both locales. Confirm: session header shows
name/duration/"2/4 complete", 4 exercise rows with 2 pre-checked, clicking a row toggles its
status and updates the counter.

- [ ] **Step 8: Commit**

```bash
git add src/features/demo/demo-workout-session.tsx "src/app/(demo)/demo/training" tests/component/demo-workout-session.test.tsx
git commit -m "feat(demo): add Training demo page"
```

---

### Task 6: Progress demo page

**Files:**
- Create: `src/app/(demo)/demo/progress/page.tsx`

- [ ] **Step 1: Create `src/app/(demo)/demo/progress/page.tsx`**

```typescript
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
import { WeightChart } from "@/features/progress/weight-chart";
import { demoWeightPoints } from "@/features/demo/data";

export const metadata = publicMetadata(
  "Try the demo — Progress",
  "See how weight and consistency trends are tracked in B Fit & Healthy.",
  "/demo/progress"
);

export default async function DemoProgressPage() {
  const locale = await getLocale();
  const c = getPublicContent(locale).demo;

  return (
    <div className="demo-page">
      <header className="page-header">
        <p className="eyebrow">{c.nav.progress}</p>
        <h1>{c.progress.title}</h1>
        <p>{c.progress.subtitle}</p>
      </header>
      <WeightChart
        points={demoWeightPoints}
        unit={c.progress.unit}
        emptyLabel={c.progress.title}
        historyLabel={c.progress.history}
        locale={locale}
      />
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS. `WeightChart`'s `locale` prop is typed `"en" | "mk"`; `getLocale()` returns
`Locale` (`typeof locales[number]`, i.e. `"en" | "mk"`) — these are structurally identical, no
cast needed.

- [ ] **Step 3: Run the full demo contract test**

Run: `node --test tests/demo-experience.test.js`
Expected: PASS, all 4 tests (this was the last of the 4 demo pages — "demo pages exist for all
four screens" now passes).

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, visit `/demo/progress` in both locales. Confirm: line chart renders with 5
points, history list below shows 5 dated entries in descending order, values match the fixture.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(demo)/demo/progress"
git commit -m "feat(demo): add Progress demo page"
```

---

### Task 7: Landing "Try the demo" CTA

**Files:**
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Add the demo CTA to the hero action row**

Replace:

```typescript
        <div className="action-row hero-account-actions"><Button asChild size="lg"><Link href="/sign-up">{c.nav.getStarted}<ArrowRight aria-hidden="true" size={18} /></Link></Button><Button asChild size="lg" variant="secondary"><Link href="/sign-in">{c.nav.signIn}</Link></Button><Link className="text-link" href="/features">{c.common.explore}<MoveRight aria-hidden="true" size={18} /></Link></div>
```

with:

```typescript
        <div className="action-row hero-account-actions"><Button asChild size="lg"><Link href="/sign-up">{c.nav.getStarted}<ArrowRight aria-hidden="true" size={18} /></Link></Button><Button asChild size="lg" variant="quiet"><Link href="/demo/today">{c.home.tryDemoLabel}</Link></Button><Button asChild size="lg" variant="secondary"><Link href="/sign-in">{c.nav.signIn}</Link></Button><Link className="text-link" href="/features">{c.common.explore}<MoveRight aria-hidden="true" size={18} /></Link></div>
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, visit `/` in both locales. Confirm the hero action row now shows 4 actions:
Get started, Try the demo, Sign in, Explore the system — and clicking "Try the demo" navigates to
`/demo/today`.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(marketing)/page.tsx"
git commit -m "feat(landing): add Try the demo CTA to hero"
```

---

### Task 8: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: PASS — contract tests (including all 4 in `tests/demo-experience.test.js`) plus the
full Vitest suite (including the 6 new demo component tests). The pre-existing, unrelated
`tests/component/ambient-pointer.test.tsx` flaky failure is expected and not caused by this work.

- [ ] **Step 2: Typecheck, lint, build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all PASS. Confirm the build output route table includes `/demo`, `/demo/today`,
`/demo/nutrition`, `/demo/training`, `/demo/progress`, all marked static or dynamic as
appropriate (no server errors).

- [ ] **Step 3: Full manual bilingual sweep**

Run: `npm run dev`. Visit `/`, `/demo` (should redirect to `/demo/today`), `/demo/today`,
`/demo/nutrition`, `/demo/training`, `/demo/progress` in both English and Macedonian. Confirm: no
missing/undefined text, no console errors, the demo banner and "Sign up"/"Get started" links work,
demo nav highlights the current page, all three interactive widgets (habit toggle, add food,
exercise toggle) work and reset on reload.

- [ ] **Step 4: Confirm isolation one more time, end to end**

Run: `grep -rn "supabase" "src/app/(demo)" src/features/demo 2>/dev/null` (case-insensitive: add
`-i`). Expected: no output. This is a manual double-check of what
`tests/demo-experience.test.js` already automates — confirming the automation itself is sound by
re-deriving its answer independently.

---

## Self-Review Notes

- **Spec coverage:** architecture (Task 2), shell/banner/nav (Task 2), all 4 screens (Tasks 3-6),
  landing CTA (Task 7), i18n (Task 1, threaded through every page), testing (isolation contract
  test in Task 2, component tests in Tasks 3-5, full verification in Task 8) — all spec sections
  have a corresponding task.
- **Placeholder scan:** none — every step has complete code.
- **Type consistency:** `DemoHabit`, `DemoMeal`, `DemoExercise`, `LocalizedText` are defined once
  in `data.ts` (Task 1) and imported by type in every consuming component (Tasks 3-5) rather than
  redefined — no drift risk. `Labels` prop shapes are consistent per-component (each component
  defines its own narrow `Labels` type matching exactly what it destructures, not a shared
  do-everything type).
- **Deliberate scope note:** `GuidancePanel` (existing dashboard component) was considered for the
  Today page but excluded — it hardcodes a link to `/assistant` (a protected route) which doesn't
  fit the demo's 4-screen scope and would be a confusing dead-end link for a logged-out visitor.
  `DailyBalance` and `WeightChart` were reused because they're pure, fully parameterized, with no
  hardcoded links or Supabase coupling.
