const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const read = (path) => fs.readFileSync(path, "utf8");

test("editorial design system is centralized", () => {
  const layout = read("src/app/layout.tsx");
  const tokens = read("src/styles/tokens.css");

  assert.match(layout, /Source_Sans_3/);
  assert.match(tokens, /--shell:\s*73\.75rem/);
  assert.match(tokens, /--control-height:\s*2\.5rem/);
  assert.match(tokens, /--radius-card:\s*0\.8125rem/);
  assert.match(tokens, /\.dark\s*\{[\s\S]*--background:\s*#10161a/i);
  assert.doesNotMatch(
    tokens,
    /--brand:[^;]*(yellow|#f[bc][0-9a-f]{3})/i,
  );
});

test("global styles are split by responsibility", () => {
  const globalStyles = read("src/app/globals.css");
  for (const stylesheet of [
    "tokens",
    "base",
    "shell",
    "components",
    "public",
    "product",
    "anatomy",
    "responsive",
  ]) {
    assert.match(
      globalStyles,
      new RegExp(`@import\\s+["']\\.\\./styles/${stylesheet}\\.css["']`),
      `${stylesheet}.css is not imported`,
    );
  }
});

test("primary product routes expose local loading UI", () => {
  for (const route of [
    "today",
    "nutrition",
    "recipes",
    "training",
    "progress",
    "assistant",
  ]) {
    assert.ok(
      fs.existsSync(`src/app/(product)/${route}/loading.tsx`),
      `${route} loading UI is missing`,
    );
  }
});
