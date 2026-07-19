const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

describe("Phase 4 core tracking", () => {
  it("defines owner-only tracking storage", () => {
    const sql = read("supabase/migrations/202607190003_core_tracking.sql");
    for (const table of ["water_logs", "body_measurements", "habits", "habit_checkins", "notifications"]) {
      assert.match(sql, new RegExp(`create table public\\.${table}`));
      assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`));
    }
    assert.match(sql, /auth\.uid\(\) = user_id/);
  });

  it("keeps all tracking mutations server-authorized", () => {
    const actions = read("src/features/tracking/actions.ts");
    assert.match(actions, /^"use server";/);
    assert.match(actions, /auth\.getUser/);
    assert.match(actions, /revalidatePath\("\/today"\)/);
    assert.doesNotMatch(actions, /service.role|SERVICE_ROLE/i);
  });

  it("provides the complete protected route set", () => {
    for (const route of ["today", "habits", "goals", "progress", "notifications"]) {
      assert.ok(fs.existsSync(path.join(root, `src/app/(product)/${route}/page.tsx`)), route);
    }
    assert.match(read("src/lib/supabase/proxy.ts"), /"\/goals"/);
  });

  it("uses the Guided Daily Canvas without prototype health values", () => {
    const page = read("src/app/(product)/today/page.tsx");
    const canvas = read("src/features/dashboard/today-canvas.tsx");
    assert.match(page, /loadTodayData/);
    assert.match(canvas, /DailyBalance/);
    assert.match(canvas, /RhythmRail/);
    assert.doesNotMatch(`${page}${canvas}`, /790|1,310|2,100|74g|34min|6 day streak/);
  });

  it("keeps all core tracking destinations reachable", () => {
    const nav = read("src/components/shell/product-navigation.tsx");
    for (const href of ["/today", "/progress", "/habits", "/goals"]) assert.match(nav, new RegExp(href));
  });
});
