const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("Phase 10A pins browser verification dependencies and commands", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.devDependencies["@playwright/test"], "1.61.1");
  assert.equal(pkg.devDependencies["@axe-core/playwright"], "4.12.1");
  for (const script of [
    "test:e2e:install",
    "test:e2e:smoke",
    "test:e2e",
    "test:e2e:all",
    "verify:production",
  ]) {
    assert.equal(typeof pkg.scripts[script], "string", `${script} is missing`);
  }
});

test("Playwright targets the local production server and approved projects", () => {
  const config = read("playwright.config.ts");
  assert.match(config, /http:\/\/127\.0\.0\.1:3000/);
  assert.match(config, /npm run start/);
  for (const project of [
    "chromium-desktop",
    "chromium-tablet",
    "chromium-mobile",
    "firefox-desktop",
    "webkit-mobile",
    "auth-setup",
    "chromium-authenticated",
  ]) {
    assert.match(config, new RegExp(`name:\\s*["']${project}["']`));
  }
  assert.match(config, /reuseExistingServer:\s*false/);
});

test("Playwright artifacts and authentication state are ignored", () => {
  const ignore = read(".gitignore");
  for (const entry of ["playwright-report/", "test-results/", ".auth/"]) {
    assert.match(ignore, new RegExp(`^${entry.replace(".", "\\.")}$`, "m"));
  }
  assert.doesNotMatch(ignore, /^\.env\.example$/m);
});
