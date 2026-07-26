import { describe, expect, it } from "vitest";
import { accountSettingsSchema } from "@/features/account/schemas";

describe("account settings", () => {
  it("accepts a compact account update", () => {
    expect(
      accountSettingsSchema.parse({
        displayName: "Stan",
        units: "metric",
        timezone: "Europe/Skopje",
      }),
    ).toEqual({
      displayName: "Stan",
      units: "metric",
      timezone: "Europe/Skopje",
    });
  });

  it("rejects invalid display names and timezones", () => {
    expect(() =>
      accountSettingsSchema.parse({
        displayName: "S",
        units: "metric",
        timezone: "",
      }),
    ).toThrow();
  });
});
