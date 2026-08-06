# Voltage Global Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current "Sage Dusk" design tokens, typography, and shared Button/Card
primitives with the approved "Voltage" bold-athletic system (near-black/off-white adaptive base,
constant electric-lime accent `#d4ff2f`, Archivo Black display type, angled-cut shape language),
and delete the dead legacy CSS block this redesign supersedes.

**Architecture:** Same file structure, values only change (plus one new shared property, one new
component prop). `src/styles/tokens.css` keeps its existing custom-property names so no consumer
across `src/styles/*.css` or components needs to change — only `Button`/`Card` get an explicit new
`cut` capability. Font loading in `src/app/layout.tsx` swaps `Source_Sans_3` for `Inter` and adds
`Archivo_Black` for headings; `JetBrains_Mono` is unchanged.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS 4 (CSS custom properties, no config.js),
`next/font/google`, `class-variance-authority`, Vitest + Testing Library for component tests,
`node --test` for repo-wide contract tests.

---

### Task 1: Rewrite design tokens to Voltage

**Files:**
- Modify: `src/styles/tokens.css` (full rewrite of `:root` and `.dark` blocks)
- Modify: `src/app/globals.css:15-129` (delete the dead `@layer legacy { ... }` block)
- Modify: `tests/editorial-design-system.test.js` (existing assertions reference old values)

- [ ] **Step 1: Update the failing contract test first**

Replace the whole file with:

```javascript
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const read = (path) => fs.readFileSync(path, "utf8");

test("Voltage design system is centralized", () => {
  const layout = read("src/app/layout.tsx");
  const tokens = read("src/styles/tokens.css");

  assert.match(layout, /Archivo_Black/);
  assert.match(layout, /Inter/);
  assert.match(tokens, /--shell:\s*73\.75rem/);
  assert.match(tokens, /--control-height:\s*2\.5rem/);
  assert.match(tokens, /--radius-card:\s*0\.8125rem/);
  assert.match(tokens, /--accent:\s*#d4ff2f/);
  assert.match(tokens, /--cut-clip:\s*polygon\(/);
  assert.match(tokens, /\.dark\s*\{[\s\S]*--background:\s*#0a0a0a/i);
  assert.match(tokens, /:root\s*\{[\s\S]*--background:\s*#f4f4f2/i);
});

test("global styles are split by responsibility", () => {
  const globalStyles = read("src/app/globals.css");
  for (const stylesheet of [
    "tokens",
    "base",
    "shell",
    "components",
    "public",
    "product",
    "anatomy",
    "responsive",
  ]) {
    assert.match(
      globalStyles,
      new RegExp(`@import\\s+["']\\.\\./styles/${stylesheet}\\.css["']`),
      `${stylesheet}.css is not imported`,
    );
  }
  assert.doesNotMatch(globalStyles, /@layer legacy/);
});

test("primary product routes expose local loading UI", () => {
  for (const route of [
    "today",
    "nutrition",
    "recipes",
    "training",
    "progress",
    "assistant",
  ]) {
    assert.ok(
      fs.existsSync(`src/app/(product)/${route}/loading.tsx`),
      `${route} loading UI is missing`,
    );
  }
});

test("desktop navigation uses compact controls without shrinking touch targets", () => {
  const shell = read("src/styles/shell.css");

  assert.match(shell, /--nav-control-height:\s*2\.25rem/);
  assert.match(shell, /\.product-nav a,[\s\S]*min-height:\s*var\(--nav-control-height\)/);
  assert.match(shell, /\.product-header-actions[\s\S]*\.ui-button[\s\S]*height:\s*var\(--nav-control-height\)/);
  assert.match(shell, /\.product-header-actions[\s\S]*border-color:\s*transparent/);
  assert.match(shell, /\.public-account-actions \.ui-button,[\s\S]*padding-inline:\s*0\.5rem/);
  assert.match(shell, /@media\s*\(pointer:\s*coarse\)[\s\S]*min-height:\s*var\(--touch-target\)/);
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `node --test tests/editorial-design-system.test.js`
Expected: FAIL — `--accent`, `--cut-clip`, `#0a0a0a`, `#f4f4f2`, `Archivo_Black`, `Inter`, and
`@layer legacy` absence all fail against the current file contents.

- [ ] **Step 3: Rewrite `src/styles/tokens.css`**

```css
:root {
  color-scheme: light;
  --background: #f4f4f2;
  --background-sunken: #e9e9e5;
  --surface: #ffffff;
  --surface-raised: #ffffff;
  --surface-hover: #ececE8;
  --foreground: #0a0a0a;
  --foreground-secondary: #3d3d3a;
  --foreground-muted: #6e6e69;
  --border: #dcdcd7;
  --border-strong: #bcbcb5;
  --control-border: #9a9a92;
  --accent: #d4ff2f;
  --brand: #d4ff2f;
  --brand-hover: #c2ec1c;
  --brand-soft: #eef9c8;
  --on-brand: #0a0a0a;
  --button-primary: #0a0a0a;
  --button-primary-hover: #262626;
  --button-primary-text: #d4ff2f;
  --button-secondary: #ffffff;
  --button-secondary-hover: #f0f0ec;
  --button-secondary-text: #0a0a0a;
  --button-secondary-border: #0a0a0a;
  --sage: #4d5a3a;
  --sage-soft: #eef1e6;
  --mineral: #3a4a52;
  --mineral-soft: #e6ecee;
  --ochre: #7a5a1f;
  --ochre-soft: #f3ecd9;
  --clay: #8a4a2a;
  --anatomy-muscle: #8fa876;
  --anatomy-muscle-hover: #6f8c56;
  --anatomy-muscle-selected: #d4ff2f;
  --anatomy-ground: #efefec;
  --danger: #d13b2e;
  --on-danger: #ffffff;
  --focus: #0a0a0a;
  --logo-body: #0a0a0a;
  --logo-leaf: #d4ff2f;
  --logo-mark: #f4f4f2;
  --page-gradient:
    radial-gradient(circle at 88% 5%, rgb(212 255 47 / 8%), transparent 28rem),
    linear-gradient(145deg, #f4f4f2, #ececE8);
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --control-height: 2.5rem;
  --touch-target: 2.75rem;
  --radius-control: 0.5625rem;
  --radius-card: 0.8125rem;
  --radius-feature: 1.0625rem;
  --card-padding: clamp(1rem, 1.5vw, 1.25rem);
  --shell: 73.75rem;
  --reading-shell: 43rem;
  --shadow-raised: 0 16px 38px rgb(10 10 10 / 12%);
  --halo-sage: rgb(212 255 47 / 10%);
  --halo-mineral: rgb(10 10 10 / 6%);
  --halo-warm: rgb(138 74 42 / 5%);
  --motion-fast: 120ms;
  --motion-control: 160ms;
  --motion-panel: 200ms;
  --motion-sequence: 320ms;
  --ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-emphasized: cubic-bezier(0.34, 1.56, 0.64, 1);
  --cut-clip: polygon(0 0, 100% 0, 92% 100%, 0 100%);
}

.dark {
  color-scheme: dark;
  --background: #0a0a0a;
  --background-sunken: #050505;
  --surface: #141414;
  --surface-raised: #1a1a1a;
  --surface-hover: #202020;
  --foreground: #f4f4f2;
  --foreground-secondary: #c9c9c4;
  --foreground-muted: #8a8a85;
  --border: #2a2a2a;
  --border-strong: #3a3a3a;
  --control-border: #4a4a4a;
  --accent: #d4ff2f;
  --brand: #d4ff2f;
  --brand-hover: #bfe829;
  --brand-soft: #262f0a;
  --on-brand: #0a0a0a;
  --button-primary: #d4ff2f;
  --button-primary-hover: #bfe829;
  --button-primary-text: #0a0a0a;
  --button-secondary: #141414;
  --button-secondary-hover: #1e1e1e;
  --button-secondary-text: #f4f4f2;
  --button-secondary-border: #f4f4f2;
  --sage: #a9c68f;
  --sage-soft: #1c2416;
  --mineral: #7fa3b3;
  --mineral-soft: #17232a;
  --ochre: #d6ab5f;
  --ochre-soft: #2c2416;
  --clay: #d98a5f;
  --anatomy-muscle: #7ea86a;
  --anatomy-muscle-hover: #96c082;
  --anatomy-muscle-selected: #d4ff2f;
  --anatomy-ground: #161616;
  --danger: #e5675a;
  --on-danger: #1a0a08;
  --focus: #d4ff2f;
  --logo-body: #d4ff2f;
  --logo-leaf: #f4f4f2;
  --logo-mark: #0a0a0a;
  --page-gradient:
    radial-gradient(circle at 86% 7%, rgb(212 255 47 / 10%), transparent 30rem),
    linear-gradient(145deg, #0a0a0a, #0f0f0f);
  --shadow-raised: 0 18px 42px rgb(0 0 0 / 40%);
  --halo-sage: rgb(212 255 47 / 10%);
  --halo-mineral: rgb(244 244 242 / 6%);
  --halo-warm: rgb(217 138 95 / 5%);
}
```

- [ ] **Step 4: Delete the dead legacy block in `src/app/globals.css`**

Delete lines 15-129 (the entire `@layer legacy { :root {...} .dark {...} }` block) so the file
goes directly from:

```css
@custom-variant dark (&:is(.dark *));
```

to what is currently line 131:

```css
* { box-sizing: border-box; }
```

- [ ] **Step 5: Run the contract test to confirm it passes**

Run: `node --test tests/editorial-design-system.test.js`
Expected: PASS (the `Archivo_Black`/`Inter` assertion will still fail until Task 2 — run
`node --test tests/editorial-design-system.test.js` again after Task 2 for a full pass).

- [ ] **Step 6: Commit**

```bash
git add src/styles/tokens.css src/app/globals.css tests/editorial-design-system.test.js
git commit -m "feat(design): replace Sage Dusk tokens with Voltage palette"
```

---

### Task 2: Swap typography to Archivo Black / Inter

**Files:**
- Modify: `src/app/layout.tsx:1-14`
- Modify: `src/styles/base.css:15,21-38`

- [ ] **Step 1: Update `src/app/layout.tsx` font imports and variables**

Replace:

```typescript
import { JetBrains_Mono, Source_Sans_3 } from "next/font/google";
```

with:

```typescript
import { Archivo_Black, Inter, JetBrains_Mono } from "next/font/google";
```

Replace:

```typescript
const sans = Source_Sans_3({ subsets: ["latin", "cyrillic"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-mono", display: "swap" });
```

with:

```typescript
const sans = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans", display: "swap" });
const display = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-mono", display: "swap" });
```

Replace the `<body>` className:

```typescript
<body className={`${sans.variable} ${mono.variable}`}>
```

with:

```typescript
<body className={`${sans.variable} ${display.variable} ${mono.variable}`}>
```

Note: `Archivo_Black` only ships a Latin subset on Google Fonts — Cyrillic headings fall back to
`--font-sans` (Inter) via the CSS `font-family` stack in Step 2, so Macedonian headings still
render correctly, just without the display weight. This is expected, not a bug.

- [ ] **Step 2: Apply the display font to headings in `src/styles/base.css`**

Replace:

```css
body {
  min-height: 100vh;
  margin: 0;
  background: var(--page-gradient) fixed;
  color: var(--foreground);
  font-family: var(--font-sans), "Segoe UI", sans-serif;
  font-size: 1rem;
  line-height: 1.58;
  text-rendering: optimizeLegibility;
}

h1,
h2,
h3 {
  margin: 0;
  color: var(--foreground);
  text-wrap: balance;
}

h1 {
  font-weight: 500;
  letter-spacing: -0.04em;
}

h2,
h3 {
  font-weight: 600;
  letter-spacing: -0.025em;
}
```

with:

```css
body {
  min-height: 100vh;
  margin: 0;
  background: var(--page-gradient) fixed;
  color: var(--foreground);
  font-family: var(--font-sans), "Segoe UI", sans-serif;
  font-size: 1rem;
  line-height: 1.58;
  text-rendering: optimizeLegibility;
}

h1,
h2,
h3 {
  margin: 0;
  color: var(--foreground);
  text-wrap: balance;
  font-family: var(--font-display), var(--font-sans), "Segoe UI", sans-serif;
}

h1 {
  font-weight: 400;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

h2,
h3 {
  font-weight: 400;
  letter-spacing: -0.01em;
}
```

`font-weight: 400` is correct here — Archivo Black only ships one weight and it renders visually
black/heavy regardless of the CSS weight requested.

- [ ] **Step 3: Run the full contract test file**

Run: `node --test tests/editorial-design-system.test.js`
Expected: PASS (all four tests, including the `Archivo_Black`/`Inter` assertion added in Task 1).

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/styles/base.css
git commit -m "feat(design): switch headings to Archivo Black, body to Inter"
```

---

### Task 3: Add angled-cut shape to Button

**Files:**
- Modify: `src/components/ui/button.tsx`
- Test: `tests/component/button.test.tsx` (new)

- [ ] **Step 1: Write the failing test**

Create `tests/component/button.test.tsx`:

```typescript
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  afterEach(cleanup);

  it("applies the angled-cut clip-path to primary and secondary variants by default", () => {
    render(
      <>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Primary" }).className).toContain("ui-button-cut");
    expect(screen.getByRole("button", { name: "Secondary" }).className).toContain("ui-button-cut");
  });

  it("keeps quiet and danger variants rectangular", () => {
    render(
      <>
        <Button variant="quiet">Quiet</Button>
        <Button variant="danger">Danger</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Quiet" }).className).not.toContain("ui-button-cut");
    expect(screen.getByRole("button", { name: "Danger" }).className).not.toContain("ui-button-cut");
  });

  it("lets a consumer opt a primary button back to rectangular via cut={false}", () => {
    render(<Button variant="primary" cut={false}>Primary</Button>);
    expect(screen.getByRole("button", { name: "Primary" }).className).not.toContain("ui-button-cut");
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run tests/component/button.test.tsx`
Expected: FAIL — `cut` prop doesn't exist yet, `ui-button-cut` class is never applied.

- [ ] **Step 3: Implement the `cut` prop in `src/components/ui/button.tsx`**

Replace the full file with:

```typescript
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "ui-button inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-control)] px-4 text-[0.9375rem] font-semibold transition-[background-color,color,border-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        primary: "ui-button-primary border bg-[var(--button-primary)] text-[var(--button-primary-text)] hover:-translate-y-0.5 active:translate-y-px",
        secondary: "ui-button-secondary border bg-[var(--button-secondary)] text-[var(--button-secondary-text)] hover:-translate-y-0.5 active:translate-y-px",
        quiet: "text-[var(--foreground-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]",
        danger: "bg-[var(--danger)] text-[var(--on-danger)] hover:brightness-95"
      },
      size: { default: "h-10", sm: "h-9 min-h-9 px-3 text-sm", lg: "h-11 px-5", icon: "size-11 min-h-11 px-0" }
    },
    defaultVariants: { variant: "primary", size: "default" }
  }
);

const cutByVariant: Record<NonNullable<VariantProps<typeof buttonVariants>["variant"]>, boolean> = {
  primary: true,
  secondary: true,
  quiet: false,
  danger: false
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean; cut?: boolean };

export function Button({ className, variant = "primary", size, asChild, cut, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  const applyCut = cut ?? cutByVariant[variant];
  return (
    <Component
      className={cn(
        buttonVariants({ variant, size }),
        applyCut && "ui-button-cut rounded-none [clip-path:var(--cut-clip)]",
        className
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx vitest run tests/component/button.test.tsx`
Expected: PASS, all 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/button.tsx tests/component/button.test.tsx
git commit -m "feat(ui): add angled-cut shape to primary/secondary buttons"
```

---

### Task 4: Add `cut` prop to Card

**Files:**
- Modify: `src/components/ui/card.tsx`
- Test: `tests/component/card.test.tsx` (new)

- [ ] **Step 1: Write the failing test**

Create `tests/component/card.test.tsx`:

```typescript
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Card } from "@/components/ui/card";

describe("Card", () => {
  afterEach(cleanup);

  it("applies the angled-cut clip-path by default", () => {
    render(<Card data-testid="card">content</Card>);
    expect(screen.getByTestId("card").className).toContain("card-cut");
  });

  it("stays rectangular when cut is set to false, for dense data UI", () => {
    render(<Card data-testid="card" cut={false}>content</Card>);
    expect(screen.getByTestId("card").className).not.toContain("card-cut");
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run tests/component/card.test.tsx`
Expected: FAIL — `cut` prop doesn't exist yet.

- [ ] **Step 3: Implement the `cut` prop in `src/components/ui/card.tsx`**

Replace the full file with:

```typescript
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type CardTone = "default" | "raised" | "soft" | "interactive";

const cardToneClasses: Record<CardTone, string> = {
  default: "bg-[var(--surface)]",
  raised: "bg-[var(--surface-raised)] shadow-[var(--shadow-raised)]",
  soft: "bg-[var(--brand-soft)]",
  interactive:
    "bg-[var(--surface)] transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-[var(--surface-hover)]",
};

export function Card({
  className,
  tone = "default",
  cut = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: CardTone; cut?: boolean }) {
  return (
    <div
      className={cn(
        "border border-[var(--border)] p-[var(--card-padding)]",
        cut ? "card-cut rounded-none [clip-path:var(--cut-clip)]" : "rounded-[var(--radius-card)]",
        cardToneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx vitest run tests/component/card.test.tsx`
Expected: PASS, both tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/card.tsx tests/component/card.test.tsx
git commit -m "feat(ui): add cut prop to Card, default on, opt-out for dense data UI"
```

---

### Task 5: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: PASS — this runs `tests/*.test.js` contract tests (Task 1/2 changes) plus the full
Vitest unit+component suite (Task 3/4 new tests, plus every existing test that reads `tokens.css`
or `globals.css` values, to confirm nothing else broke).

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS — `Button`/`Card` prop additions are additive and optional, no type errors
expected elsewhere.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: PASS — confirms `next/font` resolves `Archivo_Black`/`Inter` correctly and no CSS
`@layer` reference to the deleted legacy block remains anywhere.

- [ ] **Step 5: Manual visual check**

Run: `npm run dev`, open `http://localhost:3000`. Confirm: page background/text near-black-on-white
(or inverse in dark mode via the theme toggle), primary "Get started" nav button is lime/black
with an angled top-right corner, headings render in Archivo Black (Latin) with fallback to Inter
for Cyrillic (`?lang=mk` or locale switcher), no visual trace of the old teal/sage palette
anywhere on the homepage.

---

## Self-Review Notes

- **Spec coverage:** tokens (Task 1), typography (Task 2), Button cut shape (Task 3), Card cut
  prop (Task 4) all covered. Shell/nav re-skin required no code change (confirmed: `public-header.tsx`
  and `product-header.tsx` already consume `Button`, so Task 3 propagates automatically). Motion
  spec (kinetic GSAP entrance/hover) and page-by-page rollout (including i18n consolidation) are
  explicitly **out of scope** for this plan — they're a separate, larger plan per the spec's
  rollout order (foundations first, this plan, then page-by-page).
- **Placeholder scan:** none found — every step has complete code and exact commands.
- **Type consistency:** `Button`'s `cut?: boolean` and `Card`'s `cut?: boolean` are both optional
  booleans with the same name and default-resolution pattern (`cut ?? <variant-based default>`
  for Button since default depends on variant; `cut = true` for Card since one default fits all
  tones) — consistent enough that a consumer familiar with one predicts the other correctly.
