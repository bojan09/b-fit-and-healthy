import { test, expect } from "./fixtures/runtime-monitor";

test.use({ serviceWorkers: "block" });
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const width of [320, 390, 768, 1024]) {
  for (const locale of ["en", "mk"]) {
    test("mobile menu stays inside " + width + "px " + locale, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/" + locale, { waitUntil: "networkidle" });
      const menu = page.locator(".mobile-nav");
      const trigger = menu.locator("summary");
      await trigger.click();
      const panel = menu.locator(".mobile-nav-panel");
      await expect(panel).toBeVisible();
      await expect.poll(() => panel.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const header = element.closest("header")!.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= innerWidth && bounds.top >= header.bottom;
      })).toBe(true);
      await expect(panel.locator('a[aria-current="page"]')).toHaveCount(1);
      await expect(panel.locator('a[href="/sign-up"]')).toBeInViewport();
      await page.keyboard.press("Escape");
      await expect(menu).not.toHaveAttribute("open", "");
      await expect(trigger).toBeFocused();
      await trigger.click();
      await page.mouse.click(width - 4, 4);
      await expect(menu).not.toHaveAttribute("open", "");
    });
  }
}

test("Get started reaches registration with Google visible on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en", { waitUntil: "networkidle" });
  await page.locator('.hero-account-actions a[href="/sign-up"]').click();
  await expect(page).toHaveURL(/\/sign-up(?:\?|$)/);
  await expect(page.getByRole("button", { name: /Google/ })).toBeInViewport();
});

for (const route of ["/sign-in", "/sign-up"]) {
  test("Google starts Appwrite OAuth from " + route, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route("https://fra.cloud.appwrite.io/**", (request) => request.fulfill({
      status: 200, contentType: "text/html", body: "OAuth redirect intercepted for testing",
    }));
    await page.goto(route + "?next=/training", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Google/ }).click();
    await expect(page).toHaveURL(/fra\.cloud\.appwrite\.io\/v1\/account\/tokens\/oauth2\/google/);
    const target = new URL(page.url());
    expect(target.searchParams.get("project")).toBe("6ac945000038e9b28df4");
    const callback = new URL(target.searchParams.get("success")!);
    expect(callback.pathname).toBe("/auth/callback");
    expect(callback.searchParams.get("next")).toBe("/training");
    expect(callback.searchParams.get("state")).toBeTruthy();
  });
}
