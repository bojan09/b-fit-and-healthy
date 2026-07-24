import { test, expect } from "./fixtures/runtime-monitor";
import { hasE2ECredentials } from "./fixtures/auth";

test.beforeEach(() => {
  test.skip(
    !hasE2ECredentials(),
    "Dedicated E2E credentials are not configured.",
  );
});

for (const route of ["/today", "/nutrition", "/training", "/assistant"]) {
  test(`${route} restores the dedicated account session`, async ({
    page,
    runtimeMonitor,
  }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page).not.toHaveURL(/\/sign-in/);
    await expect(page.locator("main")).toBeVisible();
    runtimeMonitor.assertClean();
  });
}
