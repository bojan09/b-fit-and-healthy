import { describe, expect, it } from "vitest";
import { parsePublicEnv } from "@/lib/env/public";
import { parseServerEnv } from "@/lib/env/server-schema";

describe("environment validation", () => {
  it("accepts the configured public Appwrite endpoint and project", () => {
    const value = parsePublicEnv({
      NEXT_PUBLIC_APPWRITE_ENDPOINT: "https://fra.cloud.appwrite.io/v1",
      NEXT_PUBLIC_APPWRITE_PROJECT_ID: "6ac945000038e9b28df4"
    });

    expect(value.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
    expect(value.NEXT_PUBLIC_APPWRITE_ENDPOINT).toBe("https://fra.cloud.appwrite.io/v1");
    expect(value.NEXT_PUBLIC_APPWRITE_PROJECT_ID).toBe("6ac945000038e9b28df4");
  });

  it("rejects missing project IDs, non-HTTPS endpoints, and insecure production site URLs", () => {
    expect(() => parsePublicEnv({
      NEXT_PUBLIC_APPWRITE_ENDPOINT: "http://fra.cloud.appwrite.io/v1",
      NEXT_PUBLIC_APPWRITE_PROJECT_ID: ""
    })).toThrow();
    expect(() => parsePublicEnv({ NEXT_PUBLIC_SITE_URL: "http://example.com", NEXT_PUBLIC_APPWRITE_ENDPOINT: "https://fra.cloud.appwrite.io/v1", NEXT_PUBLIC_APPWRITE_PROJECT_ID: "project" })).toThrow();
  });

  it("keeps the Appwrite API key and database ID in server-only configuration", () => {
    const value = parseServerEnv({
      APPWRITE_API_KEY: "server-key",
      APPWRITE_DATABASE_ID: "b-fit"
    });

    expect(value.APPWRITE_API_KEY).toBe("server-key");
    expect(value.APPWRITE_DATABASE_ID).toBe("b-fit");
  });

  it("keeps external service keys server-only and optional in Phase 1", () => {
    const value = parseServerEnv({
      GROQ_API_KEY: "",
      USDA_FDC_API_KEY: "usda-test",
      THEMEALDB_API_KEY: "meal-test",
      MUSCLEWIKI_API_KEY: "",
    });
    expect(value.USDA_FDC_API_KEY).toBe("usda-test");
    expect(value.THEMEALDB_API_KEY).toBe("meal-test");
    expect(value.MUSCLEWIKI_API_KEY).toBeUndefined();
    expect(value.GROQ_API_KEY).toBeUndefined();
  });
});
