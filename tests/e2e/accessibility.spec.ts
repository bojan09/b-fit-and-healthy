import { test, expect } from "./fixtures/runtime-monitor";
import {
  analyzeAccessibility,
  formatAxeViolations,
} from "./support/accessibility";

const routes = ["/", "/features", "/anatomy", "/blog", "/sign-in", "/~offline"];

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const route of routes) {
  test(`${route} has no blocking WCAG A/AA violations`, async (
    { page, runtimeMonitor },
    testInfo,
  ) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const violations = await analyzeAccessibility(page, testInfo);
    expect(violations.length, formatAxeViolations(violations)).toBe(0);
    runtimeMonitor.assertClean();
  });
}

test("skip navigation moves focus to main content", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /skip to content/i });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("mobile navigation remains accessible when opened", async (
  { page },
  testInfo,
) => {
  test.skip(!page.viewportSize() || page.viewportSize()!.width > 480);
  await page.goto("/");
  await page.locator("summary[aria-label]").click();
  const violations = await analyzeAccessibility(page, testInfo);
  expect(violations.length, formatAxeViolations(violations)).toBe(0);
  await expect(
    page.getByRole("navigation", { name: "Primary" }).last(),
  ).toBeVisible();
});

test("opened theme, locale, anatomy, and validation states remain accessible", async (
  { page },
  testInfo,
) => {
  await page.goto("/");
  await page.getByRole("button", { name: /theme/i }).click();
  const locale = page.getByRole("button", { name: /language/i });
  const localeRefresh = page.waitForResponse(
    (response) =>
      response.ok() && response.request().headers().rsc === "1",
  );
  await locale.click();
  await localeRefresh;
  await expect(page.locator("html")).toHaveAttribute("lang", "mk");
  await expect(page).toHaveTitle(/\S+/);
  let violations = await analyzeAccessibility(page, testInfo);
  expect(violations.length, formatAxeViolations(violations)).toBe(0);
  const englishRefresh = page.waitForResponse(
    (response) =>
      response.ok() && response.request().headers().rsc === "1",
  );
  await page.getByRole("button", { name: /Јазик/i }).click();
  await englishRefresh;
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.goto("/anatomy");
  const backView = page.getByRole("button", { name: "Back", exact: true });
  await backView.click();
  await expect(backView).toHaveAttribute("aria-pressed", "true");
  const trapezius = page.getByRole("button", { name: /trapezius/i }).last();
  await trapezius.click();
  await expect(trapezius).toHaveAttribute("aria-pressed", "true");
  violations = await analyzeAccessibility(page, testInfo);
  expect(violations.length, formatAxeViolations(violations)).toBe(0);

  await page.goto("/sign-in");
  await page.getByRole("button", { name: /^sign in$/i }).click();
  violations = await analyzeAccessibility(page, testInfo);
  expect(violations.length, formatAxeViolations(violations)).toBe(0);
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
    (focusEvidence?.outlineStyle !== "none" &&
      focusEvidence?.outlineWidth !== "0px") ||
      focusEvidence?.boxShadow !== "none",
  ).toBe(true);
});
