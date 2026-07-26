import { test, expect } from "./fixtures/runtime-monitor";

test("@smoke brand, account entry, theme, and locale remain usable", async ({
  page,
  runtimeMonitor,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("link", { name: /b fit & healthy home/i }).first(),
  ).toHaveAttribute("href", "/");
  const accountActions = page.locator(".public-account-actions");
  await expect(
    accountActions.getByRole("link", { name: /sign in/i }),
  ).toBeVisible();
  await expect(
    accountActions.getByRole("link", { name: /get started|create account/i }),
  ).toBeVisible();

  const theme = page.getByRole("button", { name: /theme/i });
  const initialThemeName = await theme.getAttribute("aria-label");
  await theme.click();
  await expect(theme).not.toHaveAttribute("aria-label", initialThemeName ?? "");
  await theme.click();
  await expect
    .poll(() => page.locator("html").getAttribute("class"))
    .toContain("dark");

  const locale = page.getByRole("button", { name: /language/i });
  const macedonianRefresh = page.waitForResponse(
    (response) =>
      response.ok() && response.request().headers().rsc === "1",
  );
  await locale.click();
  await macedonianRefresh;
  await expect(page.locator("html")).toHaveAttribute("lang", "mk");

  const englishRefresh = page.waitForResponse(
    (response) =>
      response.ok() && response.request().headers().rsc === "1",
  );
  await page.getByRole("button", { name: /Јазик/i }).click();
  await englishRefresh;
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  runtimeMonitor.assertClean();
});

test("anatomy view and selected muscle remain synchronized", async ({
  page,
  runtimeMonitor,
}) => {
  await page.goto("/anatomy");
  const backView = page.getByRole("button", {
    name: "Back",
    exact: true,
  });
  await backView.click();
  await expect(backView).toHaveAttribute("aria-pressed", "true");
  const trapezius = page.getByRole("button", { name: /trapezius/i }).last();
  await trapezius.click();
  await expect(trapezius).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-anatomy-panel]")).toContainText(
    "Trapezius",
  );
  runtimeMonitor.assertClean();
});

test("reduced motion preserves readable content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator('[data-motion-state="animating"]')).toHaveCount(0);
});

test("interactive controls expose an intentional pointer cursor", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    const fixture = document.createElement("div");
    fixture.innerHTML = `
      <a id="cursor-link" href="#main-content">Link</a>
      <button id="cursor-button" type="button">Button</button>
      <button id="cursor-disabled" type="button" disabled>Disabled</button>
      <span id="cursor-role-button" role="button" tabindex="0">Custom control</span>
      <input id="cursor-text" type="text" aria-label="Cursor text field">
    `;
    document.body.append(fixture);
  });

  await expect
    .poll(() => page.locator("#cursor-link").evaluate(
      (element) => getComputedStyle(element).cursor,
    ))
    .toBe("pointer");
  await expect
    .poll(() => page.locator("#cursor-button").evaluate(
      (element) => getComputedStyle(element).cursor,
    ))
    .toBe("pointer");
  await expect
    .poll(() => page.locator("#cursor-role-button").evaluate(
      (element) => getComputedStyle(element).cursor,
    ))
    .toBe("pointer");
  await expect
    .poll(() => page.locator("#cursor-disabled").evaluate(
      (element) => getComputedStyle(element).cursor,
    ))
    .toBe("not-allowed");
  await expect
    .poll(() => page.locator("#cursor-text").evaluate(
      (element) => getComputedStyle(element).cursor,
    ))
    .toBe("text");
});
