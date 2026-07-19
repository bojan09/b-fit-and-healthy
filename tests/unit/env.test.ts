import { describe, expect, it } from "vitest";
import { parsePublicEnv } from "@/lib/env/public";
import { parseServerEnv } from "@/lib/env/server-schema";

describe("environment validation", () => {
  it("accepts a valid public Supabase configuration", () => {
    const value = parsePublicEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example"
    });

    expect(value.NEXT_PUBLIC_SUPABASE_URL).toBe("https://example.supabase.co");
  });

  it("rejects missing or non-HTTPS public configuration", () => {
    expect(() => parsePublicEnv({
      NEXT_PUBLIC_SUPABASE_URL: "http://example.test",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ""
    })).toThrow();
  });

  it("keeps external service keys server-only and optional in Phase 1", () => {
    const value = parseServerEnv({ GROQ_API_KEY: "", USDA_FDC_API_KEY: "usda-test" });
    expect(value.USDA_FDC_API_KEY).toBe("usda-test");
    expect(value.GROQ_API_KEY).toBeUndefined();
  });
});
