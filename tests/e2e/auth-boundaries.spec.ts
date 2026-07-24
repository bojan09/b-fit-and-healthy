import { test, expect } from "./fixtures/runtime-monitor";
import { protectedRoutes } from "./route-inventory";

test.describe("@smoke anonymous route protection", () => {
  for (const route of protectedRoutes) {
    test(`${route} redirects to sign-in with a same-origin destination`, async ({
      page,
      runtimeMonitor,
    }) => {
      await page.goto(route);
      await expect(page).toHaveURL(
        (url) =>
          url.pathname === "/sign-in" &&
          url.searchParams.get("next") === route,
      );
      runtimeMonitor.assertClean();
    });
  }
});

test("external next destinations are rejected", async ({ page }) => {
  await page.goto("/sign-in?next=https%3A%2F%2Fevil.example");
  const next = await page.locator('input[name="next"]').first().inputValue();
  expect(next).toBe("/today");
});
