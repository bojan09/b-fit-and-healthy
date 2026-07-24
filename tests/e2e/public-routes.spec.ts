import { test, expect } from "./fixtures/runtime-monitor";
import { machineRoutes, publicHumanRoutes } from "./route-inventory";

test.describe("@smoke public route integrity", () => {
  for (const route of publicHumanRoutes) {
    test(`${route} renders a titled document with one main landmark`, async ({
      page,
      runtimeMonitor,
    }) => {
      const response = await page.goto(route, {
        waitUntil: "domcontentloaded",
      });

      expect(
        response?.ok(),
        `${route} returned ${response?.status()}`,
      ).toBe(true);
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

      expect(
        response.ok(),
        `${route} returned ${response.status()}`,
      ).toBe(true);
      expect((await response.body()).byteLength).toBeGreaterThan(0);
    });
  }
});

test(
  "sitemap contains every published article and each URL resolves",
  async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const articlePaths = [
      ...sitemap.matchAll(/<loc>[^<]+(\/blog\/[^<]+)<\/loc>/g),
    ].map((match) => match[1]);

    expect(articlePaths.length).toBeGreaterThan(0);
    for (const path of articlePaths) {
      expect((await request.get(path)).ok(), path).toBe(true);
    }
  },
);

test(
  "representative internal links and anchors resolve",
  async ({ page, request, runtimeMonitor }) => {
    for (const source of ["/", "/features", "/anatomy", "/blog"]) {
      await page.goto(source, { waitUntil: "domcontentloaded" });
      const hrefs = await page.locator("a[href]").evaluateAll((links) => [
        ...new Set(
          links
            .map((link) =>
              (link as HTMLAnchorElement).getAttribute("href"),
            )
            .filter((href): href is string => Boolean(href)),
        ),
      ]);

      for (const href of hrefs) {
        if (/^(mailto:|tel:|https?:\/\/)/.test(href)) continue;
        if (href.startsWith("#")) {
          await expect(page.locator(href)).toHaveCount(1);
          continue;
        }
        const target = new URL(href, "http://127.0.0.1:3000");
        const response = await request.get(
          `${target.pathname}${target.search}`,
        );
        expect(
          response.status(),
          `${source} -> ${href}`,
        ).toBeLessThan(400);
      }
    }

    runtimeMonitor.assertClean();
  },
);
