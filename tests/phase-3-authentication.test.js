const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

describe("Phase 3 authentication and onboarding", () => {
  it("provides the complete authentication route set", () => {
    for (const route of ["sign-in", "sign-up", "magic-link", "forgot-password", "reset-password"]) {
      assert.ok(fs.existsSync(path.join(root, `src/app/(auth)/${route}/page.tsx`)), route);
    }
    assert.ok(fs.existsSync(path.join(root, "src/app/auth/callback/route.ts")));
  });

  it("keeps authentication mutations on the server", () => {
    const actions = read("src/features/auth/actions.ts");
    assert.match(actions, /^"use server";/);
    assert.match(actions, /signInWithPassword/);
    assert.match(actions, /signInWithOtp/);
    assert.match(actions, /signInWithOAuth/);
    assert.match(actions, /signOut/);
    assert.match(actions, /sanitizeNextPath/);
  });

  it("provides required onboarding and an honest protected workspace", () => {
    const onboarding = read("src/features/onboarding/onboarding-flow.tsx");
    const action = read("src/features/onboarding/actions.ts");
    const today = read("src/app/(product)/today/page.tsx");
    assert.match(onboarding, /aria-current=.*"step"/);
    assert.match(onboarding, /priorities/);
    assert.match(action, /auth\.getUser/);
    assert.match(action, /onboarding_complete/);
    assert.doesNotMatch(today, /1,310|2,100|74g|34min/);
  });

  it("documents provider and callback configuration", () => {
    const docs = read("docs/supabase-auth-configuration.md");
    assert.match(docs, /localhost:3000\/auth\/callback/);
    assert.match(docs, /Google/i);
    assert.match(docs, /Vercel/i);
  });
});
