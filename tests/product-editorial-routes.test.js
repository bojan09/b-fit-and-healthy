import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("Today and Coach use the balanced product canvas", () => {
  const styles = read("src/styles/product.css");

  assert.match(
    styles,
    /\.today-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1\.45fr\)\s+minmax\(16rem,\s*0\.55fr\)/s,
  );
  assert.match(styles, /\.next-action-panel\s*\{[^}]*min-height:\s*12rem/s);
  assert.match(
    styles,
    /\.assistant-page\s*\{[^}]*width:\s*min\(calc\(100% - 2rem\),\s*var\(--shell\)\)/s,
  );
});

test("Goals and habits prioritize existing records before creation forms", () => {
  for (const route of ["goals", "habits"]) {
    const source = read(`src/app/(product)/${route}/page.tsx`);
    const records = source.indexOf('className="tracking-records"');
    const form = source.indexOf('className="tracking-form-panel"');

    assert.ok(records >= 0, `${route} records`);
    assert.ok(form >= 0, `${route} form`);
    assert.ok(records < form, `${route} should show records before its form`);
  }
});

test("Progress places trends and history before entry", () => {
  const source = read("src/app/(product)/progress/page.tsx");
  const history = source.indexOf('className="progress-panel"');
  const form = source.indexOf('className="tracking-form-panel"');

  assert.ok(history >= 0 && history < form);
});

test("Notifications and onboarding use shared compact primitives", () => {
  const notifications = read("src/app/(product)/notifications/page.tsx");
  const onboarding = read("src/features/onboarding/onboarding-flow.tsx");
  const styles = read("src/styles/product.css");

  assert.match(notifications, /import\s*\{\s*EmptyState\s*\}/);
  assert.match(onboarding, /import\s*\{\s*Field\s*\}/);
  assert.match(styles, /\.onboarding-card h1\s*\{[^}]*2\.75rem/s);
});
