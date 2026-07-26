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

test("full-body presets keep ten aligned rows without horizontal overflow", async ({
  page,
  runtimeMonitor,
}) => {
  await page.goto("/workouts/new?idea=dumbbell-full-body", {
    waitUntil: "networkidle",
  });
  await expect(page.getByTestId("builder-row")).toHaveCount(10);
  await expect(page.locator(".builder-row-actions")).toHaveCount(10);
  expect(await page.evaluate(() =>
    document.documentElement.scrollWidth
    <= document.documentElement.clientWidth
  )).toBe(true);

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() =>
    document.documentElement.scrollWidth
    <= document.documentElement.clientWidth
  )).toBe(true);
  runtimeMonitor.assertClean();
});

test("exercise discovery presents commercial provenance before saving", async ({
  page,
  runtimeMonitor,
}) => {
  await page.route("**/api/discovery/exercises**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        results: [{
          id: "exercise-api:barbell_bench_press",
          kind: "exercise",
          provider: "exercise-api",
          externalId: "barbell_bench_press",
          title: "Barbell bench press",
          normalizedTitle: "barbell bench press",
          sourceUrl: "https://exercise-api.com/v1/exercises/barbell_bench_press",
          attribution: "Exercise data by ExerciseAPI, licensed under CC BY 4.0.",
          retrievedAt: "2026-07-26T00:00:00.000Z",
          quality: "curated",
          completeness: ["instructions"],
          alternates: [],
          license: {
            id: "CC-BY-4.0",
            name: "CC BY 4.0",
            url: "https://creativecommons.org/licenses/by/4.0/",
            attribution: "Exercise data by ExerciseAPI",
            commercialUse: true,
          },
          primaryMuscles: ["chest"],
          secondaryMuscles: ["triceps"],
          equipment: ["barbell", "bench"],
          difficulty: null,
          movementPattern: "horizontal press",
          instructions: ["Set the shoulders.", "Press with control."],
          safety: null,
          media: [],
        }],
      }),
    });
  });

  await page.goto("/exercises");
  await page.getByRole("searchbox").fill("barbell");
  await expect(page.getByText("ExerciseAPI")).toBeVisible();
  await expect(page.getByText("CC BY 4.0")).toBeVisible();
  await page.getByRole("button", {
    name: /Review Barbell bench press/,
  }).click();
  await expect(page.getByRole("dialog", {
    name: "Barbell bench press",
  })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  runtimeMonitor.assertClean();
});
