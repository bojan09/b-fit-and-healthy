import { describe, expect, it } from "vitest";
import { getAccountDestination } from "@/features/auth/redirects";

describe("account routing", () => {
  it("requires onboarding before honoring the eventual destination", () => {
    expect(getAccountDestination(false, "/anatomy")).toBe("/onboarding?next=%2Fanatomy");
  });

  it("honors safe destinations after onboarding", () => {
    expect(getAccountDestination(true, "/anatomy?view=back")).toBe("/anatomy?view=back");
    expect(getAccountDestination(true, "https://evil.test")).toBe("/today");
  });
});
