import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("authentication uses the shared accessible field primitive", () => {
  const authForm = read("src/features/auth/auth-form.tsx");
  const resetForm = read("src/features/auth/reset-form.tsx");

  assert.match(authForm, /import\s*\{\s*Field\s*\}/);
  assert.match(resetForm, /import\s*\{\s*Field\s*\}/);
  assert.match(authForm, /<Field[^>]+label=/);
  assert.match(resetForm, /<Field[^>]+label=/);
});

test("articles expose a dedicated reading column and separated supporting content", () => {
  const page = read("src/app/(marketing)/blog/[slug]/page.tsx");
  const styles = read("src/styles/public.css");

  assert.match(page, /className="article-reading-column"/);
  assert.match(page, /className="article-supporting-content"/);
  assert.match(styles, /--article-measure:\s*66ch/);
  assert.match(styles, /\.article-body\s*\{[^}]*line-height:\s*1\.7/s);
});

test("public compositions use compact editorial sections", () => {
  const styles = read("src/styles/public.css");

  assert.match(styles, /\.public-hero\s*\{/);
  assert.match(styles, /\.auth-shell\s*\{/);
  assert.match(styles, /\.knowledge-library\s*\{/);
  assert.match(styles, /\.information-page\s*\{/);
  assert.doesNotMatch(styles, /min-height:\s*100vh[^;]*;\s*padding:\s*0/s);
});

test("featured blog navigation stays inside the Next.js router", () => {
  const blog = read("src/app/(marketing)/blog/page.tsx");

  assert.match(blog, /import\s+Link\s+from\s*"next\/link"/);
  assert.doesNotMatch(blog, /<a\s+href=\{`\/blog\//);
});
