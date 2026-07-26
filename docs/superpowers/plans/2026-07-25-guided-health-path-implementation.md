# Guided Health Path Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the landing orbit with the approved Guided Health Path and consolidate authenticated account utilities into a compact, accessible menu.

**Architecture:** Keep the landing visual as a focused client component with semantic links and existing motion preferences. Keep the product header server-rendered, but delegate account-menu disclosure behavior to one small client component; use one account settings route with Profile and Preferences anchors.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS, Lucide icons, Vitest, Testing Library, Playwright.

## Global Constraints

- Do not create commits; the user will review and commit.
- Do not add dependencies.
- Do not add `.env.example`.
- Preserve English as the primary language and Macedonian support.
- Preserve the current editorial visual identity, sky-blue accent system, and reduced-motion support.
- Keep visible navbar controls compact while preserving minimum 44 by 44 CSS-pixel touch targets.
- Do not change the clinical SVG anatomy atlas.

## File Structure

- Create `src/features/landing/guided-health-path.tsx`: semantic Fuel → Move → Learn path.
- Delete `src/features/landing/system-constellation.tsx`: superseded orbit implementation.
- Modify `src/app/(marketing)/page.tsx`: render the new path.
- Modify `src/styles/public.css`: path layout and interaction.
- Modify `src/styles/responsive.css`: vertical mobile path.
- Create `src/components/shell/account-menu.tsx`: compact account disclosure and sign-out form.
- Modify `src/components/shell/product-header.tsx`: use compact utilities and account menu.
- Modify `src/components/shell/locale-switcher.tsx`: expose a compact header treatment.
- Modify `src/components/shell/theme-toggle.tsx`: expose a compact header treatment.
- Create `src/app/(product)/settings/page.tsx`: account destination with Profile and Preferences anchors.
- Create `src/features/account/account-settings-form.tsx`: editable display name, units, and timezone.
- Create `src/features/account/actions.ts`: authenticated settings update.
- Create `src/features/account/repository.ts`: settings loader.
- Modify `src/styles/shell.css`: compact header controls and menu.
- Modify `src/styles/product.css`: settings page form.
- Replace `tests/component/system-constellation.test.tsx` with `tests/component/guided-health-path.test.tsx`.
- Create `tests/component/account-menu.test.tsx`.
- Create `tests/unit/account-settings.test.ts`.
- Modify `tests/e2e/public-interactions.spec.ts` and `tests/e2e/authenticated-smoke.spec.ts`.

---

### Task 1: Guided Health Path semantics

**Files:**
- Create: `src/features/landing/guided-health-path.tsx`
- Modify: `src/app/(marketing)/page.tsx`
- Delete: `src/features/landing/system-constellation.tsx`
- Create: `tests/component/guided-health-path.test.tsx`
- Delete: `tests/component/system-constellation.test.tsx`

**Interfaces:**
- Consumes: `Locale` and `useMotionProfile()`.
- Produces: `GuidedHealthPath({ locale }: { locale: Locale })`.

- [ ] **Step 1: Write the failing component tests**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GuidedHealthPath } from "@/features/landing/guided-health-path";

describe("GuidedHealthPath", () => {
  it("presents Fuel, Move, and Learn in a semantic ordered path", () => {
    render(<GuidedHealthPath locale="en" />);
    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(
      expect.arrayContaining(["FuelMake food information useful", "MoveTrain with purpose", "LearnUnderstand your next step"]),
    );
    expect(screen.getByRole("link", { name: /fuel/i })).toHaveAttribute("href", "/features/nutrition");
    expect(screen.getByRole("link", { name: /move/i })).toHaveAttribute("href", "/features/training");
    expect(screen.getByRole("link", { name: /learn/i })).toHaveAttribute("href", "/blog");
  });

  it("marks Fuel as the next useful action", () => {
    render(<GuidedHealthPath locale="en" />);
    expect(screen.getByText("Next useful step")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run: `npx vitest run tests/component/guided-health-path.test.tsx`  
Expected: FAIL because `guided-health-path.tsx` does not exist.

- [ ] **Step 3: Implement the semantic path and update the landing page**

Use an ordered list, not decorative orbit nodes:

```tsx
"use client";

import Link from "next/link";
import { Apple, BookOpen, Dumbbell, type LucideIcon } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { useMotionProfile } from "@/features/motion/use-motion-profile";

type PathStep = { id: string; href: string; label: string; detail: string; Icon: LucideIcon };

export function GuidedHealthPath({ locale }: { locale: Locale }) {
  const motion = useMotionProfile();
  const steps: PathStep[] = locale === "en"
    ? [
        { id: "fuel", href: "/features/nutrition", label: "Fuel", detail: "Make food information useful", Icon: Apple },
        { id: "move", href: "/features/training", label: "Move", detail: "Train with purpose", Icon: Dumbbell },
        { id: "learn", href: "/blog", label: "Learn", detail: "Understand your next step", Icon: BookOpen },
      ]
    : [
        { id: "fuel", href: "/features/nutrition", label: "Гориво", detail: "Корисни информации за исхрана", Icon: Apple },
        { id: "move", href: "/features/training", label: "Движење", detail: "Тренирајте со цел", Icon: Dumbbell },
        { id: "learn", href: "/blog", label: "Учење", detail: "Разберете го следниот чекор", Icon: BookOpen },
      ];

  return (
    <nav className="guided-health-path" aria-label={locale === "en" ? "Connected health path" : "Поврзан пат за здравје"} data-motion={motion}>
      <ol>
        {steps.map(({ id, href, label, detail, Icon }, index) => (
          <li key={id} className={index === 0 ? "is-next" : undefined}>
            <Link href={href}>
              <span className="path-index">0{index + 1}</span>
              <Icon aria-hidden="true" />
              <span><strong>{label}</strong><small>{detail}</small></span>
              {index === 0 ? <em>{locale === "en" ? "Next useful step" : "Следен корисен чекор"}</em> : null}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

Replace the `SystemConstellation` import and JSX in `src/app/(marketing)/page.tsx`, then delete the old file and test.

- [ ] **Step 4: Run focused tests**

Run: `npx vitest run tests/component/guided-health-path.test.tsx tests/component/landing-motion.test.tsx`  
Expected: PASS.

- [ ] **Step 5: Review checkpoint**

Confirm the landing page has three working links without JavaScript and leave changes uncommitted.

### Task 2: Guided path visual and responsive behavior

**Files:**
- Modify: `src/styles/public.css`
- Modify: `src/styles/responsive.css`
- Modify: `tests/e2e/public-interactions.spec.ts`
- Modify: `tests/e2e/responsive-layout.spec.ts`

**Interfaces:**
- Consumes: `.guided-health-path`, `[data-motion]`, `.is-next`.
- Produces: horizontal desktop path, vertical mobile path, restrained hover/focus behavior.

- [ ] **Step 1: Add failing browser assertions**

Add a landing test that verifies the path is visible, links are clickable, and its document width does not overflow at 375px:

```ts
test("guided health path remains usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const path = page.getByRole("navigation", { name: "Connected health path" });
  await expect(path).toBeVisible();
  await expect(path.getByRole("link")).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
```

- [ ] **Step 2: Run the focused public test**

Run: `npx playwright test tests/e2e/public-interactions.spec.ts --project=chromium-mobile --grep "guided health path"`  
Expected: FAIL until styling and final accessible name are present.

- [ ] **Step 3: Add reusable path styles**

Implement:

```css
.guided-health-path {
  align-self: center;
  width: min(100%, 34rem);
}
.guided-health-path ol {
  position: relative;
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
.guided-health-path ol::before {
  content: "";
  position: absolute;
  inset: 2.75rem auto 2.75rem 1.55rem;
  width: 1px;
  background: linear-gradient(var(--color-accent), var(--color-border), transparent);
}
.guided-health-path a {
  position: relative;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: var(--space-3);
  min-height: 5.75rem;
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--color-surface) 92%, transparent);
  transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
}
.guided-health-path a:is(:hover, :focus-visible) {
  transform: translateX(0.35rem);
  border-color: var(--color-accent);
}
.guided-health-path .is-next a {
  background: color-mix(in srgb, var(--color-accent) 10%, var(--color-surface));
}
@media (prefers-reduced-motion: reduce) {
  .guided-health-path a { transition: none; }
  .guided-health-path a:is(:hover, :focus-visible) { transform: none; }
}
```

Use existing token names from `tokens.css`; if an example token differs, map it to the existing semantic token rather than adding a duplicate.

- [ ] **Step 4: Add mobile rules and rerun the tests**

At the existing mobile breakpoint, reduce card padding and keep the connector inside the first column. Run:

`npx playwright test tests/e2e/public-interactions.spec.ts tests/e2e/responsive-layout.spec.ts --project=chromium-mobile`

Expected: PASS with no horizontal overflow.

- [ ] **Step 5: Review checkpoint**

Inspect light/dark mode at 375px and 1440px; leave changes uncommitted.

### Task 3: Compact account menu

**Files:**
- Create: `src/components/shell/account-menu.tsx`
- Modify: `src/components/shell/product-header.tsx`
- Modify: `src/components/shell/locale-switcher.tsx`
- Modify: `src/components/shell/theme-toggle.tsx`
- Modify: `src/styles/shell.css`
- Create: `tests/component/account-menu.test.tsx`

**Interfaces:**
- Consumes: `signOutAction`, `name`, `locale`.
- Produces: `AccountMenu({ name, locale })`.

- [ ] **Step 1: Write menu behavior tests**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AccountMenu } from "@/components/shell/account-menu";

describe("AccountMenu", () => {
  it("keeps account actions behind one compact disclosure", () => {
    render(<AccountMenu name="Stan" locale="en" />);
    expect(screen.queryByRole("link", { name: "Profile" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open account menu for Stan" }));
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/settings#profile");
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute("href", "/settings#preferences");
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });

  it("closes on Escape", () => {
    render(<AccountMenu name="Stan" locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: "Open account menu for Stan" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("link", { name: "Profile" })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Verify the test fails**

Run: `npx vitest run tests/component/account-menu.test.tsx`  
Expected: FAIL because the component is missing.

- [ ] **Step 3: Implement the menu and header integration**

Use a button with `aria-expanded`, a positioned menu with `role="menu"`, document-level Escape/outside-click handlers, and the existing server action:

```tsx
<button className="account-menu-trigger" aria-expanded={open} aria-haspopup="menu" aria-label={`Open account menu for ${name}`} onClick={() => setOpen((value) => !value)}>
  <span aria-hidden="true">{name.trim().charAt(0).toUpperCase()}</span>
</button>
```

Menu content must include the signed-in name, `/settings#profile`, `/settings#preferences`, and:

```tsx
<form action={signOutAction}>
  <button role="menuitem" type="submit"><LogOut aria-hidden="true" />Sign out</button>
</form>
```

Replace `.account-context` and the persistent `SignOutButton` in `ProductHeader`. Add a `compact` boolean prop to `LocaleSwitcher` and `ThemeToggle`, applying `header-utility` without changing their accessible names.

- [ ] **Step 4: Add compact styles and run tests**

Visible controls should have no large persistent outline box. Use transparent backgrounds, a 2.5rem visible footprint, 44px hit area through padding/pseudo area, and a subtle accent wash only on hover/focus/open.

Run: `npx vitest run tests/component/account-menu.test.tsx tests/unit/i18n.test.ts`  
Expected: PASS.

- [ ] **Step 5: Review checkpoint**

Keyboard-check Tab, Enter, Escape, outside click, and sign-out form presence; leave changes uncommitted.

### Task 4: Account settings destination

**Files:**
- Create: `src/app/(product)/settings/page.tsx`
- Create: `src/features/account/account-settings-form.tsx`
- Create: `src/features/account/actions.ts`
- Create: `src/features/account/repository.ts`
- Modify: `src/styles/product.css`
- Create: `tests/unit/account-settings.test.ts`
- Modify: `tests/e2e/authenticated-smoke.spec.ts`

**Interfaces:**
- Produces: `loadAccountSettings(userId)`, `updateAccountSettingsAction(previous, formData)`.
- Consumes: existing `profiles` and `user_settings` tables.

- [ ] **Step 1: Test validation**

```ts
import { describe, expect, it } from "vitest";
import { accountSettingsSchema } from "@/features/account/actions";

it("accepts a compact account update", () => {
  expect(accountSettingsSchema.parse({
    displayName: "Stan",
    units: "metric",
    timezone: "Europe/Skopje",
  })).toEqual({ displayName: "Stan", units: "metric", timezone: "Europe/Skopje" });
});
```

- [ ] **Step 2: Verify failure**

Run: `npx vitest run tests/unit/account-settings.test.ts`  
Expected: FAIL because the account feature is missing.

- [ ] **Step 3: Implement repository, action, form, and route**

The action validates:

```ts
export const accountSettingsSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  units: z.enum(["metric", "imperial"]),
  timezone: z.string().trim().min(1).max(80),
});
```

It updates `profiles.display_name` and `user_settings.units/timezone` for the authenticated user, revalidates `/settings`, `/today`, and `/progress`, and returns `AuthActionState`.

The route renders one page with:

```tsx
<section id="profile" aria-labelledby="profile-title">...</section>
<section id="preferences" aria-labelledby="preferences-title">...</section>
```

The form includes visible labels and one primary Save button.

- [ ] **Step 4: Run unit and authenticated smoke tests**

Run:

```powershell
npx vitest run tests/unit/account-settings.test.ts
npx playwright test tests/e2e/authenticated-smoke.spec.ts --project=chromium-desktop --grep settings
```

Expected: unit PASS; Playwright PASS when dedicated E2E credentials exist, otherwise documented skip.

- [ ] **Step 5: Review checkpoint**

Confirm both menu anchors land correctly and leave changes uncommitted.

### Task 5: Full UI verification

**Files:**
- Modify only files required by failures found in this task.

- [ ] **Step 1: Run component and unit tests**

Run: `npm run test:unit`  
Expected: all Vitest suites PASS.

- [ ] **Step 2: Run contracts, type checking, and lint**

Run:

```powershell
npm run test:contracts
npm run typecheck
npm run lint
```

Expected: all commands exit 0.

- [ ] **Step 3: Run the production build**

Run: `npm run build`  
Expected: Next.js production build succeeds.

- [ ] **Step 4: Run focused browser coverage**

Run:

```powershell
npx playwright test tests/e2e/public-interactions.spec.ts tests/e2e/responsive-layout.spec.ts --project=chromium-desktop --project=chromium-mobile
```

Expected: all relevant tests PASS.

- [ ] **Step 5: Manual visual review**

Review `/` and the authenticated product header at 375px, 768px, 1280px, and 1440px in light and dark mode. Confirm no overflow, restrained hover motion, compact controls, visible focus, and working account anchors. Do not commit.
