import { describe, expect, it } from "vitest";
import { sanitizeNextPath } from "@/features/auth/redirects";
import { onboardingSchema, signUpSchema } from "@/features/auth/schemas";

describe("authentication domain", () => {
  it("keeps safe local destinations and rejects hostile or looping paths", () => {
    expect(sanitizeNextPath("/anatomy?view=back")).toBe("/anatomy?view=back");
    for (const value of ["https://evil.test", "//evil.test", "/sign-in", "/auth/callback", "\\evil.test"]) {
      expect(sanitizeNextPath(value)).toBe("/today");
    }
  });

  it("normalizes valid registration and rejects mismatched passwords", () => {
    const valid = signUpSchema.parse({ displayName: " Ana ", email: " ANA@EXAMPLE.COM ", password: "healthy-pass-12", confirmPassword: "healthy-pass-12", locale: "en" });
    expect(valid.email).toBe("ana@example.com");
    expect(valid.displayName).toBe("Ana");
    expect(signUpSchema.safeParse({ ...valid, confirmPassword: "different" }).success).toBe(false);
  });

  it("requires complete preferences and one to three priorities", () => {
    const input = { displayName: "Ana", locale: "en", units: "metric", timezone: "Europe/Skopje", priorities: ["movement", "strength"] };
    expect(onboardingSchema.safeParse(input).success).toBe(true);
    expect(onboardingSchema.safeParse({ ...input, priorities: [] }).success).toBe(false);
    expect(onboardingSchema.safeParse({ ...input, priorities: ["movement", "strength", "nutrition", "education"] }).success).toBe(false);
  });
});
