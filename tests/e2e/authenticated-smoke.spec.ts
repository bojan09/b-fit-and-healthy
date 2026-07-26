import { test, expect } from "./fixtures/runtime-monitor";
import { hasE2ECredentials } from "./fixtures/auth";

const connectedExerciseFixture = Array.from({ length: 25 }, (_, index) => ({
  id: `exercise-api:biceps_curl_${index + 1}`,
  kind: "exercise" as const,
  provider: "exercise-api" as const,
  externalId: `biceps_curl_${index + 1}`,
  title: `Connected biceps curl ${index + 1}`,
  normalizedTitle: `connected biceps curl ${index + 1}`,
  sourceUrl: `https://exercise-api.com/v1/exercises/biceps_curl_${index + 1}`,
  attribution: "Exercise data by ExerciseAPI, licensed under CC BY 4.0.",
  retrievedAt: "2026-07-26T00:00:00.000Z",
  quality: "curated" as const,
  completeness: ["instructions"],
  alternates: [],
  license: {
    id: "CC-BY-4.0",
    name: "CC BY 4.0",
    url: "https://creativecommons.org/licenses/by/4.0/",
    attribution: "Exercise data by ExerciseAPI",
    commercialUse: true,
  },
  primaryMuscles: ["biceps"],
  secondaryMuscles: ["forearms"],
  equipment: ["dumbbell"],
  difficulty: "beginner",
  movementPattern: "curl",
  instructions: ["Keep the upper arm still.", "Curl with control."],
  safety: null,
  media: [],
}));

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

test("exercise library connects filters, pagination, keyboard review, and mobile disclosure", async ({
  page,
  runtimeMonitor,
}) => {
  await page.route("**/api/discovery/exercises**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ results: connectedExerciseFixture }),
    });
  });

  await page.goto("/exercises");
  const bicepsRequest = page.waitForRequest((request) => {
    const url = new URL(request.url());
    return (
      url.pathname === "/api/discovery/exercises" &&
      url.searchParams.get("muscle") === "biceps" &&
      url.searchParams.get("q") === "biceps"
    );
  });
  await page.getByLabel("Muscle").selectOption("biceps");

  const requestedUrl = new URL((await bicepsRequest).url());
  expect(requestedUrl.searchParams.get("muscle")).toBe("biceps");
  expect(requestedUrl.searchParams.get("q")).toBe("biceps");

  const desktopFilterTargets = page.locator([
    ".fitness-filter input:visible",
    ".fitness-filter select:visible",
    ".fitness-filter .text-action:visible",
  ].join(", "));
  await expect(desktopFilterTargets).toHaveCount(5);
  for (let index = 0; index < await desktopFilterTargets.count(); index += 1) {
    const box = await desktopFilterTargets.nth(index).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  const connectedCards = page.getByRole("button", {
    name: /Review Connected biceps curl/,
  });
  await expect(connectedCards).toHaveCount(12);
  await page.getByRole("button", { name: "Show 12 more" }).click();
  await expect(connectedCards).toHaveCount(24);

  await connectedCards.first().focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", {
    name: "Connected biceps curl 1",
  })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.setViewportSize({ width: 320, height: 720 });
  const filterToggle = page.getByRole("button", { name: /Filters/ });
  await expect(filterToggle).toHaveAttribute("aria-expanded", "false");
  await filterToggle.focus();
  await page.keyboard.press("Enter");
  await expect(filterToggle).toHaveAttribute("aria-expanded", "true");

  const mobileFilterTargets = page.locator([
    ".fitness-filter input:visible",
    ".fitness-filter select:visible",
    ".fitness-filter .text-action:visible",
    ".fitness-filter .exercise-filter-toggle:visible",
  ].join(", "));
  await expect(mobileFilterTargets).toHaveCount(6);
  for (let index = 0; index < await mobileFilterTargets.count(); index += 1) {
    const box = await mobileFilterTargets.nth(index).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  for (const width of [320, 375, 480]) {
    await page.setViewportSize({ width, height: 720 });
    await expect(filterToggle).toHaveAttribute("aria-expanded", "true");
    expect(await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    )).toBe(true);
  }

  await page.keyboard.press("Space");
  await expect(filterToggle).toHaveAttribute("aria-expanded", "false");
  runtimeMonitor.assertClean();
});
