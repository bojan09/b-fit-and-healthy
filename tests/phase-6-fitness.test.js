const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("Phase 6 exposes the complete protected fitness route family", () => {
  for (const file of [
    "src/app/(product)/training/page.tsx", "src/app/(product)/training/planner/page.tsx",
    "src/app/(product)/exercises/page.tsx", "src/app/(product)/exercises/[slug]/page.tsx",
    "src/app/(product)/workouts/page.tsx", "src/app/(product)/workouts/new/page.tsx",
    "src/app/(product)/workouts/[id]/page.tsx", "src/app/(product)/workouts/[id]/edit/page.tsx",
    "src/app/(product)/session/[id]/page.tsx", "src/app/(product)/workout-history/page.tsx",
    "src/app/(product)/workout-history/[id]/page.tsx", "src/app/(product)/personal-records/page.tsx",
  ]) assert.ok(fs.existsSync(path.join(root, file)), `${file} must exist`);
});

test("fitness tables are included in the fresh Appwrite schema", () => {
  const schema = JSON.parse(read("src/lib/appwrite/schema.json"));
  for (const table of ["exercises", "exercise_muscles", "workout_programs", "workout_templates", "workout_template_exercises", "planned_workouts", "workout_sessions", "workout_session_exercises", "workout_sets"]) assert.ok(schema.tables.some((item) => item.id === table));
});

test("fitness mutations authorize users and product shell protects the new routes", () => {
  assert.match(read("src/features/fitness/actions.ts"), /getCurrentAppwriteUser/);
  const proxy = read("src/lib/appwrite/proxy.ts");
  for (const route of ["/training", "/workout-history", "/personal-records"])
    assert.match(proxy, new RegExp(route.replace("/", "\\/")));
  assert.match(read("src/components/shell/product-navigation.tsx"), /\/training/);
});

test("exercise catalogue is bilingual and anatomy-compatible", () => {
  const catalogue = read("src/features/fitness/catalogue.ts");
  assert.match(catalogue, /titleEn/);
  assert.match(catalogue, /titleMk/);
  assert.match(catalogue, /primaryMuscles/);
  assert.match(catalogue, /bodyweight-squat/);
});

test("exercise catalogue media contains exactly 98 nonempty WebP assets", () => {
  const mediaDirectory = path.join(root, "public", "media", "exercises");
  assert.ok(fs.existsSync(mediaDirectory), "public/media/exercises must exist");
  if (!fs.existsSync(mediaDirectory)) return;

  const assets = fs.readdirSync(mediaDirectory)
    .filter((file) => file.endsWith(".webp"))
    .sort();
  assert.equal(assets.length, 98);

  for (const asset of assets) {
    const contents = fs.readFileSync(path.join(mediaDirectory, asset));
    assert.ok(contents.length > 0, `${asset} must not be empty`);
    assert.equal(contents.subarray(0, 4).toString("ascii"), "RIFF", `${asset} must start with a WebP RIFF signature`);
    assert.equal(contents.subarray(8, 12).toString("ascii"), "WEBP", `${asset} must be a WebP file`);
  }
});
