import { test, expect } from "./fixtures/runtime-monitor";
import { responsiveRoutes } from "./route-inventory";
import { findViewportOffenders } from "./support/layout";

for (const route of responsiveRoutes) {
  test(`${route} stays inside the viewport`, async ({
    page,
    runtimeMonitor,
  }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const documentWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(documentWidth).toBeLessThanOrEqual(
      (page.viewportSize()?.width ?? documentWidth) + 1,
    );
    const offenders = await findViewportOffenders(page);
    expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
    runtimeMonitor.assertClean();
  });
}
