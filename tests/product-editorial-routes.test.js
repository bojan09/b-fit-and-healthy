import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");
// Assert the rules that actually render: split styles plus globals.css overrides.
const allStyles = () => ["src/styles/product.css", "src/styles/public.css", "src/app/globals.css"].map(read).join(String.fromCharCode(10));

test("Today and Coach use the balanced product canvas", () => {
  const styles = allStyles();

  assert.match(
    styles,
    /\.today-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1\.45fr\)\s+minmax\(17rem,\s*\.55fr\)/s,
  );
  assert.match(styles, /\.next-action-panel\s*\{[^}]*min-height:\s*17rem/s);
  assert.match(
    styles,
    /\.assistant-page\s*\{[^}]*width:\s*min\(calc\(100% - 2rem\),\s*92rem\)/s,
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
  const styles = allStyles();

  assert.match(notifications, /import\s*\{\s*EmptyState\s*\}/);
  assert.match(onboarding, /import\s*\{\s*Field\s*\}/);
  assert.match(styles, /\.onboarding-card h1\s*\{[^}]*font-size:\s*clamp\(2\.2rem,\s*6vw,\s*4rem\)/s);
});
