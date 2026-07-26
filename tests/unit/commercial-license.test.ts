import { describe, expect, it } from "vitest";
import {
  normalizeCommercialLicense,
} from "@/features/discovery/commercial-license";

describe("commercial exercise licenses", () => {
  it.each([
    ["CC BY 4.0", "CC-BY-4.0"],
    ["Creative Commons Attribution 4", "CC-BY-4.0"],
    ["CC-BY-SA 4", "CC-BY-SA-4.0"],
    ["Creative Commons Attribution Share Alike 4", "CC-BY-SA-4.0"],
    ["Unlicense", "Unlicense"],
  ])("accepts %s", (name, expected) => {
    expect(normalizeCommercialLicense({
      name,
      url: "https://example.com/license",
      attribution: "Source",
    })?.id).toBe(expected);
  });

  it.each([
    "CC BY-NC 4.0",
    "CC BY-NC-SA 4.0",
    "personal use",
    "",
  ])("rejects %s", (name) => {
    expect(normalizeCommercialLicense({
      name,
      url: null,
      attribution: "Source",
    })).toBeNull();
  });
});
