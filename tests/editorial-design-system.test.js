const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const read = (path) => fs.readFileSync(path, "utf8");

test("Voltage design system is centralized", () => {
  const layout = read("src/app/layout.tsx");
  const tokens = read("src/styles/tokens.css");

  assert.match(layout, /Archivo_Black/);
  assert.match(layout, /Inter/);
  assert.match(tokens, /--shell:\s*73\.75rem/);
  assert.match(tokens, /--control-height:\s*2\.5rem/);
  assert.match(tokens, /--radius-card:\s*0\.8125rem/);
  assert.match(tokens, /--accent:\s*#d4ff2f/);
  assert.match(tokens, /--cut-clip:\s*polygon\(/);
  assert.match(tokens, /\.dark\s*\{[\s\S]*--background:\s*#0a0a0a/i);
  assert.match(tokens, /:root\s*\{[\s\S]*--background:\s*#f4f4f2/i);
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
  assert.doesNotMatch(globalStyles, /@layer legacy/);
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

test("desktop navigation uses compact controls without shrinking touch targets", () => {
  const shell = read("src/styles/shell.css");

  assert.match(shell, /--nav-control-height:\s*2\.25rem/);
  assert.match(shell, /\.product-nav a,[\s\S]*min-height:\s*var\(--nav-control-height\)/);
  assert.match(shell, /\.product-header-actions[\s\S]*\.ui-button[\s\S]*height:\s*var\(--nav-control-height\)/);
  assert.match(shell, /\.product-header-actions[\s\S]*border-color:\s*transparent/);
  assert.match(shell, /\.public-account-actions \.ui-button,[\s\S]*padding-inline:\s*0\.5rem/);
  assert.match(shell, /@media\s*\(pointer:\s*coarse\)[\s\S]*min-height:\s*var\(--touch-target\)/);
});
