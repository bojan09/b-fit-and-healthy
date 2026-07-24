const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("Phase 9 pins approved motion dependencies", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.dependencies.gsap, "3.15.0");
  assert.equal(pkg.dependencies.three, "0.185.1");
  assert.equal(pkg.devDependencies["@types/three"], "0.185.1");
});

test("motion libraries stay behind client-only dynamic boundaries", () => {
  assert.match(read("src/features/motion/gsap-loader.ts"), /import\("gsap"\)/);
  assert.doesNotMatch(read("src/app/(marketing)/page.tsx"), /from ["']gsap["']/);
  assert.match(read("src/features/anatomy/three-anatomy-boundary.tsx"), /import\(".+three-anatomy-renderer"\)/);
});

test("SVG remains the default Anatomy renderer", () => {
  const boundary = read("src/features/anatomy/anatomy-renderer.tsx");
  assert.match(boundary, /SvgAnatomyRenderer/);
  assert.match(boundary, /manifest/);
  assert.match(boundary, /canUseThreeRenderer/);
  assert.doesNotMatch(read("src/app/(marketing)/anatomy/page.tsx"), /<canvas/);
});

test("reduced motion and explicit Three.js cleanup remain mandatory", () => {
  assert.match(read("src/app/globals.css"), /prefers-reduced-motion:\s*reduce/);
  const cleanup = read("src/features/anatomy/three-resource-disposer.ts");
  assert.match(cleanup, /dispose/);
  assert.match(cleanup, /setAnimationLoop\(null\)/);
  const manifest = read("src/features/anatomy/anatomy-asset-manifest.ts");
  assert.match(manifest, /return null/);
  assert.doesNotMatch(manifest, /commercialUseAllowed:\s*true/);
});

test("approved content and planner surfaces reuse the restrained reveal primitive", () => {
  assert.match(read("src/components/content/feature-page.tsx"), /MotionReveal/);
  assert.match(read("src/features/knowledge/motion-knowledge-library.tsx"), /MotionReveal/);
  assert.match(read("src/app/(marketing)/blog/page.tsx"), /MotionKnowledgeLibrary/);
  const productMotion = read("src/features/motion/product-page-motion.tsx");
  assert.match(productMotion, /"\/nutrition"/);
  assert.match(productMotion, /"\/training"/);
  assert.match(read("src/app/(product)/layout.tsx"), /ProductPageMotion/);
  assert.doesNotMatch(read("src/app/(marketing)/blog/[slug]/page.tsx"), /MotionReveal/);
});
