const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const walk = (dir) => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
  const relative = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(relative) : [relative];
});

test("motion ships no animation or 3D libraries", () => {
  const pkg = JSON.parse(read("package.json"));
  for (const name of ["gsap", "three", "@types/three", "tw-animate-css", "framer-motion", "motion"]) {
    assert.equal(pkg.dependencies[name], undefined, `${name} must not be a dependency`);
    assert.equal(pkg.devDependencies[name], undefined, `${name} must not be a dev dependency`);
  }
  const sources = walk("src").filter((file) => /\.(ts|tsx|css)$/.test(file)).map(read).join("\n");
  assert.doesNotMatch(sources, /from ["'](gsap|three)["']|import\(["'](gsap|three)["']\)/);
  assert.doesNotMatch(read("src/app/globals.css"), /tw-animate-css/);
});

test("the anatomy atlas turns in CSS 3D and keeps the hidden face inert", () => {
  const renderer = read("src/features/anatomy/anatomy-renderer.tsx");
  assert.match(renderer, /anatomy-turntable/);
  assert.match(renderer, /inert=/);
  const css = read("src/styles/motion.css");
  assert.match(css, /transform-style:\s*preserve-3d/);
  assert.match(css, /backface-visibility:\s*hidden/);
  assert.match(css, /rotateY\(180deg\)/);
});

test("every animation is opt-in behind prefers-reduced-motion", () => {
  const css = read("src/styles/motion.css");
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(css, /@supports \(animation-timeline: view\(\)\)/);
  assert.match(read("src/app/globals.css"), /prefers-reduced-motion:\s*reduce/);
  assert.match(read("src/app/globals.css"), /@import "\.\.\/styles\/motion\.css";/);
});

test("approved content and planner surfaces reuse the restrained reveal primitive", () => {
  assert.match(read("src/components/content/feature-page.tsx"), /MotionReveal/);
  assert.match(read("src/features/knowledge/motion-knowledge-library.tsx"), /MotionReveal/);
  assert.match(read("src/app/[locale]/(marketing)/blog/page.tsx"), /MotionKnowledgeLibrary/);
  const productMotion = read("src/features/motion/product-page-motion.tsx");
  assert.match(productMotion, /"\/nutrition"/);
  assert.match(productMotion, /"\/training"/);
  assert.match(read("src/app/(product)/layout.tsx"), /ProductPageMotion/);
  assert.doesNotMatch(read("src/app/[locale]/(marketing)/blog/[slug]/page.tsx"), /MotionReveal/);
});
