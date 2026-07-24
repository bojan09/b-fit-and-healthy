import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");

test("Phase 8 exposes a protected coach route and server stream endpoint", () => {
  assert.ok(existsSync("src/app/(product)/assistant/page.tsx"));
  assert.ok(existsSync("src/app/api/assistant/route.ts"));
  const proxy = read("src/lib/supabase/proxy.ts");
  assert.match(proxy, /"\/assistant"/);
  const navigation = read("src/components/shell/product-navigation.tsx");
  assert.match(navigation, /href:\s*"\/assistant"/);
});

test("AI history is owner-only and expires after 30 days", () => {
  const migration = read("supabase/migrations/202607230001_ai_coach.sql");
  for (const table of ["ai_conversations", "ai_messages"]) {
    assert.match(migration, new RegExp(`create table if not exists public\\.${table}`));
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`));
  }
  assert.match(migration, /auth\.uid\(\)\s*=\s*user_id/);
  assert.match(migration, /interval '30 days'/);
  assert.match(migration, /cleanup_expired_ai_conversations/);
  assert.match(migration, /on delete cascade/);
});

test("Groq access remains server-only and bounded", () => {
  const provider = read("src/features/assistant/groq.ts");
  assert.match(provider, /import "server-only"/);
  assert.match(provider, /GROQ_API_KEY/);
  assert.match(provider, /api\.groq\.com\/openai\/v1\/chat\/completions/);
  assert.doesNotMatch(provider, /NEXT_PUBLIC_GROQ/);
  const clientFiles = [
    "src/features/assistant/assistant-canvas.tsx",
    "src/features/assistant/draft-card.tsx",
  ].map(read).join("\n");
  assert.doesNotMatch(clientFiles, /GROQ_API_KEY|api\.groq\.com/);
});

test("the coach uses reviewable drafts and documents its safety boundary", () => {
  for (const path of [
    "src/features/assistant/schemas.ts",
    "src/features/assistant/context.ts",
    "src/features/assistant/safety.ts",
    "src/features/assistant/draft-actions.ts",
    "docs/ai-coach-operations.md",
  ]) assert.ok(existsSync(path), path);
  const actions = read("src/features/assistant/draft-actions.ts");
  assert.match(actions, /messageId/);
  assert.match(actions, /user\.id/);
  assert.doesNotMatch(actions, /JSON\.parse\(.*formData/);
  const operations = read("docs/ai-coach-operations.md");
  assert.match(operations, /30 days/i);
  assert.match(operations, /not medical advice|does not diagnose/i);
});

