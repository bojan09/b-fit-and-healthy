const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

test("demo route is never listed as a protected prefix", () => {
  const proxy = fs.readFileSync("src/lib/supabase/proxy.ts", "utf8");
  const match = proxy.match(/protectedPrefixes = \[([\s\S]*?)\]/);
  assert.ok(match, "protectedPrefixes array not found in proxy.ts");
  assert.doesNotMatch(match[1], /"\/demo/, "/demo must never be added to protectedPrefixes");
});

test("demo route tree never imports Supabase", () => {
  const roots = ["src/app/(demo)", "src/features/demo"];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const file of walk(root)) {
      if (!/\.(ts|tsx)$/.test(file)) continue;
      const content = fs.readFileSync(file, "utf8");
      assert.doesNotMatch(
        content,
        /@\/lib\/supabase/,
        `${file} must not import Supabase — demo data is fully static`,
      );
    }
  }
});

test("demo pages exist for all four screens", () => {
  for (const route of ["today", "nutrition", "training", "progress"]) {
    assert.ok(
      fs.existsSync(`src/app/(demo)/demo/${route}/page.tsx`),
      `demo/${route} page is missing`,
    );
  }
});

test("demo index redirects rather than duplicating content", () => {
  const content = fs.readFileSync("src/app/(demo)/demo/page.tsx", "utf8");
  assert.match(content, /redirect\(/, "demo index page must redirect to a real screen");
});
