# Phase 10A Verification Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Subagent execution is unavailable in this workspace.

**Goal:** Build a repeatable Playwright and axe verification foundation for the local Next.js production server at `http://localhost:3000`.

**Architecture:** Playwright owns browser, device, runtime, route, accessibility, layout, authentication-boundary, and PWA checks under `tests/e2e/`. Shared fixtures keep monitoring and credentials isolated, while the existing contract and Vitest suites continue to verify static architecture and pure logic. The production quality gate builds first, then lets Playwright start and stop `npm run start` on port `3000`.

**Tech Stack:** Next.js 16.2.10, React 19.2.7, TypeScript 6.0.3, Node 24, Playwright Test 1.61.1, `@axe-core/playwright` 4.12.1, Vitest 4.1.10.

## Global Constraints

- Target only the local production server at `http://127.0.0.1:3000`.
- Pin `@playwright/test` to `1.61.1` and `@axe-core/playwright` to `4.12.1`.
- Use Chromium desktop, Chromium tablet, and Chromium mobile as primary projects.
- Use Firefox desktop and WebKit mobile only for `@smoke` coverage.
- Keep authenticated tests read-only and optional.
- Read `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD` from `.env.local` without printing them.
- Never use a personal account.
- Do not create `.env.example`.
- Keep the strict application CSP; do not allow-list Vercel Toolbar scripts.
- Defer Lighthouse score gates and visual snapshot baselines.
- Do not change product behavior unless an executable Phase 10A test exposes a concrete defect.
- Do not hide layout overflow to make tests pass.
- Do not perform Git operations or add commit steps.

---

## File Structure

### Configuration and contracts

- Create `playwright.config.ts` — local production server, reports, artifacts, and browser projects.
- Create `tests/phase-10a-verification.test.js` — static contract for dependencies, scripts, config, ignores, and documentation.
- Modify `package.json` and `package-lock.json` — exact dev dependencies and quality commands.
- Modify `.gitignore` — generated Playwright reports and authentication state.

### Shared E2E support

- Create `tests/e2e/route-inventory.ts` — typed route categories and representative responsive routes.
- Create `tests/e2e/fixtures/runtime-monitor.ts` — page, console, response, and request failure collection.
- Create `tests/e2e/fixtures/auth.ts` — credential detection, safe login, and storage-state path.
- Create `tests/e2e/support/accessibility.ts` — axe analysis and actionable formatting.
- Create `tests/e2e/support/layout.ts` — overflow and viewport offender detection.

### Browser specifications

- Create `tests/e2e/public-routes.spec.ts`
- Create `tests/e2e/accessibility.spec.ts`
- Create `tests/e2e/responsive-layout.spec.ts`
- Create `tests/e2e/public-interactions.spec.ts`
- Create `tests/e2e/auth-boundaries.spec.ts`
- Create `tests/e2e/auth.setup.ts`
- Create `tests/e2e/authenticated-smoke.spec.ts`
- Create `tests/e2e/pwa-smoke.spec.ts`

### Operations

- Create `docs/phase-10a-verification.md`
- Modify `README.md`

---

### Task 1: Lock the Phase 10A Tooling Contract

**Files:**
- Create: `tests/phase-10a-verification.test.js`
- Create: `playwright.config.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: existing `npm run start`, `npm run build`, and port `3000`.
- Produces: Playwright projects named `chromium-desktop`, `chromium-tablet`, `chromium-mobile`, `firefox-desktop`, `webkit-mobile`, `auth-setup`, and `chromium-authenticated`.

- [ ] **Step 1: Write the failing repository contract**

Create `tests/phase-10a-verification.test.js`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("Phase 10A pins browser verification dependencies and commands", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.devDependencies["@playwright/test"], "1.61.1");
  assert.equal(pkg.devDependencies["@axe-core/playwright"], "4.12.1");
  for (const script of [
    "test:e2e:install",
    "test:e2e:smoke",
    "test:e2e",
    "test:e2e:all",
    "verify:production",
  ]) {
    assert.equal(typeof pkg.scripts[script], "string", `${script} is missing`);
  }
});

test("Playwright targets the local production server and approved projects", () => {
  const config = read("playwright.config.ts");
  assert.match(config, /http:\/\/127\.0\.0\.1:3000/);
  assert.match(config, /npm run start/);
  for (const project of [
    "chromium-desktop",
    "chromium-tablet",
    "chromium-mobile",
    "firefox-desktop",
    "webkit-mobile",
    "auth-setup",
    "chromium-authenticated",
  ]) {
    assert.match(config, new RegExp(`name:\\s*["']${project}["']`));
  }
  assert.match(config, /reuseExistingServer:\s*false/);
});

test("Playwright artifacts and authentication state are ignored", () => {
  const ignore = read(".gitignore");
  for (const entry of ["playwright-report/", "test-results/", ".auth/"]) {
    assert.match(ignore, new RegExp(`^${entry.replace(".", "\\.")}$`, "m"));
  }
  assert.doesNotMatch(ignore, /^\.env\.example$/m);
});
```

- [ ] **Step 2: Run the contract and verify the expected failure**

Run:

```powershell
node --test tests/phase-10a-verification.test.js
```

Expected: FAIL because the dependencies, scripts, config, and ignore entries do not exist.

- [ ] **Step 3: Install the exact development dependencies**

Run:

```powershell
npm.cmd install --save-dev --save-exact @playwright/test@1.61.1 @axe-core/playwright@4.12.1
```

Expected: `package.json` and `package-lock.json` contain the exact versions. Do not run `npm audit fix`.

- [ ] **Step 4: Add the approved package scripts**

Add these exact script values to `package.json`:

```json
{
  "test:e2e:install": "playwright install chromium firefox webkit",
  "test:e2e:smoke": "node --env-file-if-exists=.env.local ./node_modules/@playwright/test/cli.js test --grep @smoke --project=chromium-desktop",
  "test:e2e": "node --env-file-if-exists=.env.local ./node_modules/@playwright/test/cli.js test --project=chromium-desktop --project=chromium-tablet --project=chromium-mobile",
  "test:e2e:all": "node --env-file-if-exists=.env.local ./node_modules/@playwright/test/cli.js test",
  "verify:production": "npm run test && npm run typecheck && npm run lint && npm run build && npm run test:e2e:all"
}
```

Node 24 supplies `--env-file-if-exists`; no dotenv dependency is needed.

- [ ] **Step 5: Create the Playwright configuration**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 1,
  workers: 4,
  timeout: 30_000,
  expect: { timeout: 7_500 },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  outputDir: "test-results",
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
    serviceWorkers: "allow",
  },
  webServer: {
    command: "npm run start",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } },
      testIgnore: /authenticated-smoke\.spec\.ts/,
    },
    {
      name: "chromium-tablet",
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } },
      testIgnore: /authenticated-smoke\.spec\.ts/,
    },
    {
      name: "chromium-mobile",
      use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } },
      testIgnore: /authenticated-smoke\.spec\.ts/,
    },
    {
      name: "firefox-desktop",
      grep: /@smoke/,
      use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 1000 } },
      testIgnore: /authenticated-smoke\.spec\.ts/,
    },
    {
      name: "webkit-mobile",
      grep: /@smoke/,
      use: { ...devices["iPhone 13"] },
      testIgnore: /authenticated-smoke\.spec\.ts/,
    },
    {
      name: "auth-setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "chromium-authenticated",
      dependencies: ["auth-setup"],
      testMatch: /authenticated-smoke\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
        storageState: "test-results/.auth/user.json",
      },
    },
  ],
});
```

- [ ] **Step 6: Ignore generated artifacts**

Append to `.gitignore`:

```gitignore
playwright-report/
test-results/
.auth/
```

- [ ] **Step 7: Run static verification**

Run:

```powershell
node --test tests/phase-10a-verification.test.js
npm.cmd run typecheck
npm.cmd run lint
```

Expected: the Phase 10A contract, TypeScript, and ESLint all pass.

---

### Task 2: Add Route Inventory and Runtime Monitoring

**Files:**
- Create: `tests/e2e/route-inventory.ts`
- Create: `tests/e2e/fixtures/runtime-monitor.ts`
- Create: `tests/unit/e2e-runtime-monitor.test.ts`

**Interfaces:**
- Produces:
  - `publicHumanRoutes: readonly string[]`
  - `machineRoutes: readonly string[]`
  - `protectedRoutes: readonly string[]`
  - `responsiveRoutes: readonly string[]`
  - `createRuntimeMonitor(page: Page, baseURL: string): RuntimeMonitor`
  - `RuntimeMonitor.assertClean(): void`
- Consumes: Playwright `Page`, `ConsoleMessage`, `Request`, and `Response`.

- [ ] **Step 1: Write failing unit tests for runtime classification**

Create `tests/unit/e2e-runtime-monitor.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  formatRuntimeIssues,
  isApplicationUrl,
  type RuntimeIssue,
} from "../../tests/e2e/fixtures/runtime-monitor";

describe("Phase 10A runtime monitoring", () => {
  it("classifies only local application URLs", () => {
    expect(isApplicationUrl("http://127.0.0.1:3000/blog", "http://127.0.0.1:3000")).toBe(true);
    expect(isApplicationUrl("https://vercel.live/tool.js", "http://127.0.0.1:3000")).toBe(false);
  });

  it("formats route-scoped failures without request secrets", () => {
    const issues: RuntimeIssue[] = [{
      kind: "console",
      route: "/anatomy",
      message: "Hydration failed",
    }];
    expect(formatRuntimeIssues(issues)).toBe("[console] /anatomy: Hydration failed");
    expect(formatRuntimeIssues(issues)).not.toContain("authorization");
  });
});
```

- [ ] **Step 2: Run the tests and verify the expected module failure**

Run:

```powershell
npx.cmd vitest run tests/unit/e2e-runtime-monitor.test.ts
```

Expected: FAIL because `runtime-monitor.ts` does not exist.

- [ ] **Step 3: Create the route inventory**

Create `tests/e2e/route-inventory.ts`:

```ts
export const publicHumanRoutes = [
  "/", "/features", "/features/nutrition", "/features/training",
  "/anatomy", "/anatomy/pectorals", "/blog", "/about", "/contact",
  "/privacy", "/terms", "/states", "/sign-in", "/sign-up",
  "/magic-link", "/forgot-password", "/reset-password", "/~offline",
] as const;

export const machineRoutes = [
  "/manifest.webmanifest", "/robots.txt", "/sitemap.xml", "/feed.xml", "/sw.js",
] as const;

export const protectedRoutes = [
  "/today", "/nutrition", "/meal-planner", "/recipes", "/grocery-list",
  "/training", "/training/planner", "/workouts", "/exercises",
  "/workout-history", "/personal-records", "/progress", "/goals",
  "/habits", "/notifications", "/assistant",
] as const;

export const responsiveRoutes = [
  "/", "/features", "/anatomy", "/blog",
  "/blog/progressive-overload-for-beginners", "/sign-in", "/~offline",
] as const;
```

- [ ] **Step 4: Implement the runtime monitor**

Create `tests/e2e/fixtures/runtime-monitor.ts` with these public types:

```ts
import { expect, test as base, type Page } from "@playwright/test";

export type RuntimeIssue = {
  kind: "console" | "pageerror" | "requestfailed" | "response";
  route: string;
  message: string;
};

export type RuntimeMonitor = {
  issues: RuntimeIssue[];
  assertClean(): void;
};

export function isApplicationUrl(candidate: string, baseURL: string) {
  return new URL(candidate).origin === new URL(baseURL).origin;
}

export function formatRuntimeIssues(issues: RuntimeIssue[]) {
  return issues.map((issue) =>
    `[${issue.kind}] ${issue.route}: ${issue.message}`).join("\n");
}

export function createRuntimeMonitor(page: Page, baseURL: string): RuntimeMonitor {
  const issues: RuntimeIssue[] = [];
  const route = () => new URL(page.url() || baseURL).pathname;

  page.on("pageerror", (error) => {
    issues.push({ kind: "pageerror", route: route(), message: error.message });
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      issues.push({ kind: "console", route: route(), message: message.text() });
    }
  });
  page.on("requestfailed", (request) => {
    if (isApplicationUrl(request.url(), baseURL)) {
      issues.push({
        kind: "requestfailed",
        route: route(),
        message: `${request.method()} ${new URL(request.url()).pathname}: ${request.failure()?.errorText ?? "failed"}`,
      });
    }
  });
  page.on("response", (response) => {
    if (isApplicationUrl(response.url(), baseURL) && response.status() >= 500) {
      issues.push({
        kind: "response",
        route: route(),
        message: `${response.status()} ${new URL(response.url()).pathname}`,
      });
    }
  });

  return {
    issues,
    assertClean() {
      expect(issues, formatRuntimeIssues(issues)).toEqual([]);
    },
  };
}

export const test = base.extend<{ runtimeMonitor: RuntimeMonitor }>({
  runtimeMonitor: async ({ page, baseURL }, use) => {
    const monitor = createRuntimeMonitor(page, baseURL ?? "http://127.0.0.1:3000");
    await use(monitor);
    monitor.assertClean();
  },
});

export { expect } from "@playwright/test";
```

Do not read or attach request headers, bodies, cookies, or storage state.

- [ ] **Step 5: Run focused and static verification**

Run:

```powershell
npx.cmd vitest run tests/unit/e2e-runtime-monitor.test.ts
npm.cmd run typecheck
npm.cmd run lint
```

Expected: all commands pass.

---

### Task 3: Verify Public Routes, Metadata, Links, and Anchors

**Files:**
- Create: `tests/e2e/public-routes.spec.ts`

**Interfaces:**
- Consumes: `publicHumanRoutes`, `machineRoutes`, `test`, `expect`, and `runtimeMonitor`.
- Produces: `@smoke` public route coverage and complete Chromium route/link checks.

- [ ] **Step 1: Install the Playwright browser binaries**

Run:

```powershell
npm.cmd run test:e2e:install
```

Expected: Chromium, Firefox, and WebKit install successfully. This command requires network access.

- [ ] **Step 2: Write the public route tests**

Create `tests/e2e/public-routes.spec.ts`:

```ts
import { test, expect } from "./fixtures/runtime-monitor";
import { machineRoutes, publicHumanRoutes } from "./route-inventory";

test.describe("@smoke public route integrity", () => {
  for (const route of publicHumanRoutes) {
    test(`${route} renders a titled document with one main landmark`, async ({
      page, runtimeMonitor,
    }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.ok(), `${route} returned ${response?.status()}`).toBe(true);
      await expect(page).toHaveTitle(/\S+/);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);
      runtimeMonitor.assertClean();
    });
  }
});

test.describe("machine-readable routes", () => {
  for (const route of machineRoutes) {
    test(`${route} responds successfully`, async ({ request }) => {
      const response = await request.get(route);
      expect(response.ok(), `${route} returned ${response.status()}`).toBe(true);
      expect((await response.body()).byteLength).toBeGreaterThan(0);
    });
  }
});

test("sitemap contains every published article and each URL resolves", async ({
  request,
}) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const articlePaths = [...sitemap.matchAll(/<loc>[^<]+(\/blog\/[^<]+)<\/loc>/g)]
    .map((match) => match[1]);
  expect(articlePaths.length).toBeGreaterThan(0);
  for (const path of articlePaths) {
    expect((await request.get(path)).ok(), path).toBe(true);
  }
});

test("representative internal links and anchors resolve", async ({
  page, request, runtimeMonitor,
}) => {
  for (const source of ["/", "/features", "/anatomy", "/blog"]) {
    await page.goto(source, { waitUntil: "domcontentloaded" });
    const hrefs = await page.locator("a[href]").evaluateAll((links) =>
      [...new Set(links.map((link) => (link as HTMLAnchorElement).getAttribute("href"))
        .filter((href): href is string => Boolean(href)))]);
    for (const href of hrefs) {
      if (/^(mailto:|tel:|https?:\/\/)/.test(href)) continue;
      if (href.startsWith("#")) {
        await expect(page.locator(href)).toHaveCount(1);
        continue;
      }
      const target = new URL(href, "http://127.0.0.1:3000");
      expect((await request.get(`${target.pathname}${target.search}`)).status(), `${source} -> ${href}`)
        .toBeLessThan(400);
    }
  }
  runtimeMonitor.assertClean();
});
```

- [ ] **Step 3: Build and run the Chromium smoke test**

Ensure no stale application server is listening on port `3000`, then run:

```powershell
npm.cmd run build
npm.cmd run test:e2e:smoke
```

Expected: public route tests either pass or expose concrete route, runtime, landmark, or heading defects.

- [ ] **Step 4: Fix only evidence-backed public defects**

For every failing route:

1. Add or retain the failing Playwright assertion.
2. Identify the source component or metadata function.
3. Make the smallest semantic correction.
4. Rerun the single failing test with:

```powershell
npx.cmd playwright test tests/e2e/public-routes.spec.ts --project=chromium-desktop --grep "<exact test title>"
```

5. Rerun `npm.cmd run test:e2e:smoke`.

Do not suppress runtime errors or remove route coverage.

---

### Task 4: Add Accessibility and Responsive Layout Checks

**Files:**
- Create: `tests/e2e/support/accessibility.ts`
- Create: `tests/e2e/support/layout.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/responsive-layout.spec.ts`

**Interfaces:**
- Produces:
  - `analyzeAccessibility(page: Page, testInfo?: TestInfo): Promise<AxeResults["violations"]>`
  - `formatAxeViolations(violations): string`
  - `findViewportOffenders(page: Page): Promise<ViewportOffender[]>`
- Consumes: representative routes and the runtime fixture.

- [ ] **Step 1: Create the axe helper**

Create `tests/e2e/support/accessibility.ts`:

```ts
import AxeBuilder from "@axe-core/playwright";
import type { Page, TestInfo } from "@playwright/test";

export async function analyzeAccessibility(page: Page, testInfo?: TestInfo) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const blocking = results.violations.filter((violation) =>
    violation.impact === "serious" || violation.impact === "critical");
  const review = results.violations.filter((violation) =>
    violation.impact === "moderate" || violation.impact === "minor");
  if (review.length && testInfo) {
    await testInfo.attach("axe-review.json", {
      body: Buffer.from(JSON.stringify(review, null, 2)),
      contentType: "application/json",
    });
  }
  return blocking;
}

export function formatAxeViolations(
  violations: Awaited<ReturnType<typeof analyzeAccessibility>>,
) {
  return violations.map((violation) => {
    const targets = violation.nodes.flatMap((node) => node.target).join(", ");
    return `${violation.id} (${violation.impact}): ${targets}\n${violation.helpUrl}`;
  }).join("\n\n");
}
```

- [ ] **Step 2: Create the viewport helper**

Create `tests/e2e/support/layout.ts`:

```ts
import type { Page } from "@playwright/test";

export type ViewportOffender = {
  selector: string;
  left: number;
  right: number;
  width: number;
};

export async function findViewportOffenders(page: Page) {
  return page.evaluate(() => {
    const tolerance = 1;
    const viewport = document.documentElement.clientWidth;
    const visible = [...document.querySelectorAll<HTMLElement>("body *")]
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" &&
          rect.width > 0 && rect.height > 0;
      });
    return visible.flatMap((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.left >= -tolerance && rect.right <= viewport + tolerance) return [];
      const selector = element.id ? `#${element.id}` :
        `${element.tagName.toLowerCase()}.${[...element.classList].join(".")}`;
      return [{ selector, left: rect.left, right: rect.right, width: rect.width }];
    }).slice(0, 20);
  });
}
```

- [ ] **Step 3: Write accessibility coverage**

Create `tests/e2e/accessibility.spec.ts`:

```ts
import { test, expect } from "./fixtures/runtime-monitor";
import { analyzeAccessibility, formatAxeViolations } from "./support/accessibility";

const routes = ["/", "/features", "/anatomy", "/blog", "/sign-in", "/~offline"];

for (const route of routes) {
  test(`${route} has no blocking WCAG A/AA violations`, async ({
    page, runtimeMonitor,
  }, testInfo) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const violations = await analyzeAccessibility(page, testInfo);
    expect(violations, formatAxeViolations(violations)).toEqual([]);
    runtimeMonitor.assertClean();
  });
}

test("skip navigation moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /skip to content/i });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("mobile navigation remains accessible when opened", async ({ page }, testInfo) => {
  test.skip(!page.viewportSize() || page.viewportSize()!.width > 480);
  await page.goto("/");
  await page.locator("summary[aria-label]").click();
  const violations = await analyzeAccessibility(page, testInfo);
  expect(violations, formatAxeViolations(violations)).toEqual([]);
  await expect(page.getByRole("navigation", { name: "Primary" }).last()).toBeVisible();
});

test("opened theme, locale, Anatomy, and validation states remain accessible", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: /theme/i }).click();
  const locale = page.getByRole("button", { name: /language/i });
  await locale.click();
  let violations = await analyzeAccessibility(page, testInfo);
  expect(violations, formatAxeViolations(violations)).toEqual([]);
  await locale.click();

  await page.goto("/anatomy");
  await page.getByRole("button", { name: "Back" }).click();
  await page.getByRole("button", { name: /trapezius/i }).last().click();
  violations = await analyzeAccessibility(page, testInfo);
  expect(violations, formatAxeViolations(violations)).toEqual([]);

  await page.goto("/sign-in");
  await page.getByRole("button", { name: /^sign in$/i }).click();
  violations = await analyzeAccessibility(page, testInfo);
  expect(violations, formatAxeViolations(violations)).toEqual([]);
});

test("focused controls expose a visible indicator", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focusEvidence = await page.evaluate(() => {
    const element = document.activeElement as HTMLElement | null;
    if (!element) return null;
    const style = getComputedStyle(element);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      boxShadow: style.boxShadow,
    };
  });
  expect(focusEvidence).not.toBeNull();
  expect(
    focusEvidence?.outlineStyle !== "none" &&
      focusEvidence?.outlineWidth !== "0px" ||
      focusEvidence?.boxShadow !== "none",
  ).toBe(true);
});
```

If the `<summary>` control is exposed as a different supported role in one browser, select it by its accessible name without adding test-only attributes.

- [ ] **Step 4: Write responsive layout coverage**

Create `tests/e2e/responsive-layout.spec.ts`:

```ts
import { test, expect } from "./fixtures/runtime-monitor";
import { responsiveRoutes } from "./route-inventory";
import { findViewportOffenders } from "./support/layout";

for (const route of responsiveRoutes) {
  test(`${route} stays inside the viewport`, async ({ page, runtimeMonitor }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(documentWidth).toBeLessThanOrEqual((page.viewportSize()?.width ?? documentWidth) + 1);
    const offenders = await findViewportOffenders(page);
    expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
    runtimeMonitor.assertClean();
  });
}
```

- [ ] **Step 5: Run the primary Chromium matrix**

Run:

```powershell
npm.cmd run test:e2e
```

Expected: violations identify exact rules/selectors and overflow failures identify offending elements.

- [ ] **Step 6: Apply the accessibility and layout fix cycle**

For each failure, preserve the failing test, fix the semantic or layout source, and rerun:

```powershell
npx.cmd playwright test tests/e2e/accessibility.spec.ts tests/e2e/responsive-layout.spec.ts --project=chromium-desktop --project=chromium-tablet --project=chromium-mobile
```

Do not disable axe rules globally, add broad selector exclusions, or set global `overflow-x: hidden`.

---

### Task 5: Verify Public Interactions and Authentication Boundaries

**Files:**
- Create: `tests/e2e/public-interactions.spec.ts`
- Create: `tests/e2e/auth-boundaries.spec.ts`
- Create: `tests/e2e/fixtures/auth.ts`
- Create: `tests/e2e/auth.setup.ts`
- Create: `tests/e2e/authenticated-smoke.spec.ts`

**Interfaces:**
- Produces:
  - `authStatePath = "test-results/.auth/user.json"`
  - `hasE2ECredentials(): boolean`
  - `signInDedicatedAccount(page: Page): Promise<void>`
- Consumes: `E2E_TEST_EMAIL`, `E2E_TEST_PASSWORD`, public auth form labels, and protected routes.

- [ ] **Step 1: Implement credential-safe authentication helpers**

Create `tests/e2e/fixtures/auth.ts`:

```ts
import fs from "node:fs/promises";
import path from "node:path";
import type { Page } from "@playwright/test";

export const authStatePath = "test-results/.auth/user.json";

export function hasE2ECredentials() {
  return Boolean(process.env.E2E_TEST_EMAIL && process.env.E2E_TEST_PASSWORD);
}

export async function writeEmptyAuthState() {
  await fs.mkdir(path.dirname(authStatePath), { recursive: true });
  await fs.writeFile(authStatePath, JSON.stringify({ cookies: [], origins: [] }));
}

export async function signInDedicatedAccount(page: Page) {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;
  if (!email || !password) throw new Error("Dedicated E2E credentials are not configured.");
  await page.goto("/sign-in?next=%2Ftoday");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await page.waitForURL(/\/(today|onboarding)/);
}
```

- [ ] **Step 2: Create optional authentication setup**

Create `tests/e2e/auth.setup.ts`:

```ts
import { test as setup, expect } from "@playwright/test";
import {
  authStatePath,
  hasE2ECredentials,
  signInDedicatedAccount,
  writeEmptyAuthState,
} from "./fixtures/auth";

setup("create dedicated account state", async ({ page }) => {
  if (!hasE2ECredentials()) {
    await writeEmptyAuthState();
    setup.skip(true, "E2E_TEST_EMAIL and E2E_TEST_PASSWORD are not configured.");
  }
  await signInDedicatedAccount(page);
  await expect(page).not.toHaveURL(/\/sign-in/);
  await page.context().storageState({ path: authStatePath });
});
```

- [ ] **Step 3: Write anonymous authentication-boundary tests**

Create `tests/e2e/auth-boundaries.spec.ts`:

```ts
import { test, expect } from "./fixtures/runtime-monitor";
import { protectedRoutes } from "./route-inventory";

test.describe("@smoke anonymous route protection", () => {
  for (const route of protectedRoutes) {
    test(`${route} redirects to sign-in with a same-origin destination`, async ({
      page, runtimeMonitor,
    }) => {
      await page.goto(route);
      await expect(page).toHaveURL((url) =>
        url.pathname === "/sign-in" && url.searchParams.get("next") === route);
      runtimeMonitor.assertClean();
    });
  }
});

test("external next destinations are rejected", async ({ page }) => {
  await page.goto("/sign-in?next=https%3A%2F%2Fevil.example");
  const next = await page.locator('input[name="next"]').first().inputValue();
  expect(next).toBe("/today");
});
```

- [ ] **Step 4: Write read-only authenticated smoke coverage**

Create `tests/e2e/authenticated-smoke.spec.ts`:

```ts
import { test, expect } from "./fixtures/runtime-monitor";
import { hasE2ECredentials } from "./fixtures/auth";

test.beforeEach(() => {
  test.skip(!hasE2ECredentials(), "Dedicated E2E credentials are not configured.");
});

for (const route of ["/today", "/nutrition", "/training", "/assistant"]) {
  test(`${route} restores the dedicated account session`, async ({
    page, runtimeMonitor,
  }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page).not.toHaveURL(/\/sign-in/);
    await expect(page.locator("main")).toBeVisible();
    runtimeMonitor.assertClean();
  });
}
```

- [ ] **Step 5: Write public interaction tests**

Create `tests/e2e/public-interactions.spec.ts` with these exact behaviors:

```ts
import { test, expect } from "./fixtures/runtime-monitor";

test("@smoke brand, account entry, theme, and locale remain usable", async ({
  page, runtimeMonitor,
}) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /b fit & healthy/i })).toHaveAttribute("href", "/");
  await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /get started|create account/i })).toBeVisible();

  const theme = page.getByRole("button", { name: /theme/i });
  const initialThemeClass = await page.locator("html").getAttribute("class");
  await theme.click();
  await expect.poll(() => page.locator("html").getAttribute("class"))
    .not.toBe(initialThemeClass);

  const locale = page.getByRole("button", { name: /language/i });
  await locale.click();
  await expect(locale).toHaveAccessibleName(/MK|EN/);
  await locale.click();
  runtimeMonitor.assertClean();
});

test("Anatomy view and selected muscle remain synchronized", async ({
  page, runtimeMonitor,
}) => {
  await page.goto("/anatomy");
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByRole("button", { name: "Back" })).toHaveAttribute("aria-pressed", "true");
  const trapezius = page.getByRole("button", { name: /trapezius/i }).last();
  await trapezius.click();
  await expect(page.locator("[data-anatomy-panel]")).toContainText("Trapezius");
  runtimeMonitor.assertClean();
});

test("reduced motion preserves readable content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator('[data-motion-state="animating"]')).toHaveCount(0);
});
```

During implementation, use the rendered accessible name if localized copy differs; do not add test-only labels.

- [ ] **Step 6: Run authentication and interaction coverage**

Run:

```powershell
npx.cmd playwright test tests/e2e/public-interactions.spec.ts tests/e2e/auth-boundaries.spec.ts tests/e2e/authenticated-smoke.spec.ts --project=chromium-desktop
```

Expected: public and anonymous tests pass. Authenticated tests either pass with dedicated credentials or are explicitly skipped.

---

### Task 6: Verify PWA Boundaries, Offline Route, and SVG Anatomy Fallback

**Files:**
- Create: `tests/e2e/pwa-smoke.spec.ts`

**Interfaces:**
- Consumes: manifest, service worker, offline route, `data-anatomy-renderer`, and current SVG fallback.
- Produces: `@smoke` browser evidence that PWA assets load and Three.js remains dormant without a licensed manifest.

- [ ] **Step 1: Write PWA and renderer smoke tests**

Create `tests/e2e/pwa-smoke.spec.ts`:

```ts
import { test, expect } from "./fixtures/runtime-monitor";

test("@smoke manifest and service worker are production-usable", async ({
  page, request, runtimeMonitor,
}) => {
  const manifestResponse = await request.get("/manifest.webmanifest");
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  expect(manifest.name).toBe("B Fit & Healthy");
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ sizes: "192x192" }),
    expect.objectContaining({ sizes: "512x512" }),
  ]));
  expect((await request.get("/sw.js")).ok()).toBe(true);

  await page.goto("/", { waitUntil: "networkidle" });
  const registration = await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) return null;
    const ready = await navigator.serviceWorker.ready;
    return { scope: ready.scope, active: Boolean(ready.active) };
  });
  expect(registration?.active).toBe(true);
  expect(registration?.scope).toBe("http://127.0.0.1:3000/");
  runtimeMonitor.assertClean();
});

test("@smoke offline route remains directly usable", async ({ page }) => {
  await page.goto("/~offline");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
});

test("@smoke Anatomy retains SVG and does not activate Three.js without a manifest", async ({
  page, runtimeMonitor,
}) => {
  await page.goto("/anatomy", { waitUntil: "networkidle" });
  await expect(page.locator("[data-anatomy-renderer] svg")).toBeVisible();
  await expect(page.locator("[data-anatomy-renderer] canvas")).toHaveCount(0);
  runtimeMonitor.assertClean();
});

test("runtime caches do not contain private application URLs", async ({ page }) => {
  await page.goto("/");
  const cachedUrls = await page.evaluate(async () => {
    const urls: string[] = [];
    for (const name of await caches.keys()) {
      for (const request of await caches.open(name).then((cache) => cache.keys())) {
        urls.push(request.url);
      }
    }
    return urls;
  });
  expect(cachedUrls.filter((url) =>
    /\/api\/|\/auth\/|supabase\.co|\/today(?:[/?]|$)|\/assistant(?:[/?]|$)/.test(url),
  )).toEqual([]);
});

test("navigation timing is recorded without a machine-dependent score gate", async ({
  page,
}, testInfo) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const timing = await page.evaluate(() => {
    const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: Math.round(entry.domContentLoadedEventEnd),
      loadEventEnd: Math.round(entry.loadEventEnd),
      transferSize: entry.transferSize,
    };
  });
  expect(timing.domContentLoaded).toBeGreaterThan(0);
  await testInfo.attach("navigation-timing.json", {
    body: Buffer.from(JSON.stringify(timing, null, 2)),
    contentType: "application/json",
  });
});
```

- [ ] **Step 2: Run PWA smoke coverage**

Run:

```powershell
npx.cmd playwright test tests/e2e/pwa-smoke.spec.ts --project=chromium-desktop
```

Expected: manifest, service-worker registration, offline route, network-only evidence, and SVG fallback all pass.

- [ ] **Step 3: Confirm toolbar CSP noise cannot enter local verification**

Run:

```powershell
rg -n "vercel\\.live|_next-live|feedback\\.js" next.config.mjs src tests/e2e
```

Expected: no production CSP allow-list and no Vercel Toolbar application dependency. Local Playwright tests must report application errors only.

---

### Task 7: Document Operations and Complete the Fix Cycle

**Files:**
- Create: `docs/phase-10a-verification.md`
- Modify: `README.md`
- Modify when evidence requires: only application files directly responsible for a failing Phase 10A assertion.

**Interfaces:**
- Consumes: all Phase 10A commands, test projects, credentials, reports, and known limitations.
- Produces: an operator-readable verification guide and a fully green quality gate.

- [ ] **Step 1: Write the operations guide**

Create `docs/phase-10a-verification.md` with:

```md
# Phase 10A Browser Verification

## Requirements

- Node 24 from `.nvmrc`
- A successful `npm install`
- Playwright browsers installed with `npm run test:e2e:install`
- Port 3000 free before Playwright starts the production server

## Commands

- `npm run test:e2e:smoke` — fast Chromium public/runtime smoke checks
- `npm run test:e2e` — complete Chromium desktop/tablet/mobile matrix
- `npm run test:e2e:all` — all primary projects plus Firefox/WebKit smoke
- `npm run verify:production` — contracts, units, types, lint, build, and all E2E
- `npx playwright show-report` — open the latest local HTML report

## Optional dedicated account

Set `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD` only in `.env.local`.
The account must be dedicated to testing. Authenticated Phase 10A tests are
read-only and are explicitly skipped when either value is absent.

## Artifacts

Failures are stored under `test-results/`; the HTML report is stored under
`playwright-report/`. These directories and authentication state are ignored.
Never share storage-state JSON because it can contain an authenticated session.

## Vercel Toolbar

Local verification does not load Vercel Toolbar. Keep the production CSP strict.
For deployment automation, send `x-vercel-skip-toolbar: 1` or disable the toolbar
for that environment rather than adding `vercel.live` to the application CSP.

## Boundaries

Automated axe checks do not replace screen-reader, forced-colors, zoom, touch,
real-device, Lighthouse, security, or final visual review. Those remain later
Phase 10 workstreams.
```

- [ ] **Step 2: Update README**

Add a `Phase 10A verification` section that links to `docs/phase-10a-verification.md`, lists `npm run test:e2e:smoke` and `npm run verify:production`, and states that authenticated coverage requires a dedicated test account.

- [ ] **Step 3: Run the primary audit and fix failures one at a time**

Run:

```powershell
npm.cmd run test:e2e
```

For each failure:

1. Preserve the failing assertion as the regression test.
2. Trace it to the owning component.
3. Make one root-cause correction.
4. Rerun the exact failed test.
5. Rerun the related spec.
6. Continue only after the related spec is green.

- [ ] **Step 4: Run the secondary browser smoke matrix**

Run:

```powershell
npm.cmd run test:e2e:all
```

Expected: Chromium primary coverage passes; Firefox desktop and WebKit mobile `@smoke` coverage passes; optional authenticated coverage is passed or explicitly skipped.

- [ ] **Step 5: Run the complete fresh verification gate**

Ensure no unrelated process owns port `3000`, then run:

```powershell
npm.cmd run verify:production
```

Expected:

- contract tests pass
- all Vitest tests pass
- TypeScript passes
- ESLint passes
- Next.js production build passes
- all configured Playwright coverage passes or the optional authenticated project reports a credential-based skip

- [ ] **Step 6: Verify repository hygiene**

Run:

```powershell
node --test tests/repository-hygiene.test.js tests/phase-10a-verification.test.js
Test-Path -LiteralPath ".env.example"
Test-Path -LiteralPath "dist"
```

Expected: contract tests pass and both path checks return `False`.

- [ ] **Step 7: Restart the reviewed production build for user inspection**

Resolve the exact process listening on port `3000`. Stop it only if its command line belongs to this repository’s Next.js server. Start:

```powershell
npm.cmd run start
```

Expected: the reviewed production build is available at `http://localhost:3000`.

Do not commit, push, tag, or modify Git state.
