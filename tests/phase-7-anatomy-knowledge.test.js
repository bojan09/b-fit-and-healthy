const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("Phase 7 anatomy records provide encyclopedia depth and relationships", () => {
  const data = read("src/features/anatomy/data.ts");
  for (const field of ["location", "origin", "insertion", "primaryMovements", "secondaryMovements", "activation", "beginnerExercises", "advancedExercises", "mobility", "stretching", "recovery", "prevention", "relatedMuscles", "relatedArticles"]) {
    assert.match(data, new RegExp(`${field}:`), `missing ${field}`);
  }
  assert.match(data, /searchMuscles/);
  assert.match(data, /getAnatomyRegions/);
  assert.match(data, /resolveRelatedMuscles/);
});

test("anatomy encyclopedia exposes search, regions, accessible atlas, and related content", () => {
  const explorer = read("src/features/anatomy/anatomy-explorer.tsx");
  assert.match(explorer, /type="search"/);
  assert.match(explorer, /region/);
  assert.match(explorer, /aria-live/);
  const figure = read("src/features/anatomy/anatomy-figure.tsx");
  assert.match(figure, /tabIndex=\{0\}/);
  assert.match(figure, /aria-pressed/);
  assert.ok(fs.existsSync(path.join(root, "src/features/anatomy/related-content.tsx")));
});

test("knowledge schema validates references and anatomy/exercise relationships", () => {
  const schema = read("src/lib/content/article-schema.ts");
  for (const field of ["references", "relatedMuscles", "relatedExercises", "featuredImage"]) assert.match(schema, new RegExp(field));
  assert.match(schema, /z\.url/);
  const repository = read("src/lib/content/articles.ts");
  assert.match(repository, /getArticleCategories/);
  assert.match(repository, /resolveArticleRelationships/);
  assert.ok(fs.existsSync(path.join(root, "src/features/knowledge/knowledge-library.tsx")));
});

test("starter content is paired and the roadmap contains 36 planned topics", () => {
  const en = fs.readdirSync(path.join(root, "content/articles/en")).filter((file) => file.endsWith(".md"));
  const mk = fs.readdirSync(path.join(root, "content/articles/mk")).filter((file) => file.endsWith(".md"));
  assert.deepEqual(en.sort(), mk.sort());
  for (const file of en) {
    const source = read(`content/articles/en/${file}`);
    assert.match(source, /references:/);
    assert.match(source, /relatedMuscles:/);
    assert.match(source, /relatedExercises:/);
  }
  const roadmap = read("content/editorial/topic-plan.md");
  assert.equal((roadmap.match(/^\d+\./gm) ?? []).length, 36);
  assert.doesNotMatch(roadmap, /Ð|Ñ|Â/);
});
