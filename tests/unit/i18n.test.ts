import { describe, expect, it } from "vitest";
import { dictionaries, getDictionary, isLocale, locales } from "@/lib/i18n/config";

describe("foundation localization", () => {
  it("defaults to English and supports Macedonian", () => {
    expect(locales).toEqual(["en", "mk"]);
    expect(isLocale("mk")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(getDictionary()).toBe(dictionaries.en);
  });

  it("keeps exact locale key parity", () => {
    expect(Object.keys(dictionaries.mk).sort()).toEqual(Object.keys(dictionaries.en).sort());
  });
});
