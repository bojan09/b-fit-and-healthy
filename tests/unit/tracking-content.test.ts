import { describe, expect, it } from "vitest";
import { getTrackingContent } from "@/features/tracking/content";

describe("tracking content", () => {
  it("keeps English and Macedonian control shapes aligned", () => {
    const en = getTrackingContent("en");
    const mk = getTrackingContent("mk");
    expect(Object.keys(mk)).toEqual(Object.keys(en));
    expect(Object.keys(mk.nav)).toEqual(Object.keys(en.nav));
    expect(Object.keys(mk.empty)).toEqual(Object.keys(en.empty));
    expect(Object.keys(mk.forms)).toEqual(Object.keys(en.forms));
  });

  it("localizes primary tracking actions", () => {
    expect(getTrackingContent("en").forms.addWater).toBe("Add water");
    expect(getTrackingContent("mk").forms.addWater).toBe("Додај вода");
    expect(getTrackingContent("mk").nav.today).not.toBe(getTrackingContent("en").nav.today);
  });
});
