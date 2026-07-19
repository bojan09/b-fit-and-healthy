import { describe, expect, it } from "vitest";
import { resolveBrandDestination } from "@/components/shell/brand-destination";

describe("brand destination", () => {
  it("sends public visitors to the homepage", () => {
    expect(resolveBrandDestination(false)).toBe("/");
  });

  it("sends authenticated visitors to today", () => {
    expect(resolveBrandDestination(true)).toBe("/today");
  });
});
