import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  catalogueMediaForDisplay,
  fallbackKindForMedia,
  validateCatalogueMedia,
  type CatalogueMedia,
} from "@/features/media/catalogue-media";

const validMedia: CatalogueMedia = {
  src: "/media/recipe.webp",
  alt: { en: "Roasted vegetables in a bowl", mk: "Печен зеленчук во чинија" },
  width: 1200,
  height: 900,
  focalPoint: "45% 35%",
  sourceName: "B Fit & Healthy",
  sourceUrl: "https://example.com/source",
  creator: "Catalogue team",
  licenseName: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
};

describe("catalogue media", () => {
  it("accepts complete local WebP catalogue media", () => {
    expect(validateCatalogueMedia(validMedia)).toBe(true);
  });

  it("accepts a percent-encoded filename that remains within local media", () => {
    expect(validateCatalogueMedia({ ...validMedia, src: "/media/recipe%20image.webp" })).toBe(true);
  });

  it.each([
    ["an unsafe path", { src: "/assets/recipe.webp" }],
    ["a path traversal", { src: "/media/../private.webp" }],
    ["an encoded dot traversal", { src: "/media/%2e%2e/private.webp" }],
    ["an encoded slash traversal", { src: "/media/%2e%2e%2fprivate.webp" }],
    ["an encoded backslash traversal", { src: "/media/%2e%2e%5cprivate.webp" }],
    ["a five-times-encoded traversal", { src: "/media/%252525252e%252525252e%252525252fprivate.webp" }],
    ["a non-WebP path", { src: "/media/recipe.jpg" }],
    ["zero width", { width: 0 }],
    ["zero height", { height: 0 }],
    ["blank English alt text", { alt: { ...validMedia.alt, en: "  " } }],
    ["blank Macedonian alt text", { alt: { ...validMedia.alt, mk: "  " } }],
    ["blank source name", { sourceName: "  " }],
    ["blank licence name", { licenseName: "  " }],
  ] as const)("rejects %s", (_description, overrides) => {
    expect(validateCatalogueMedia({ ...validMedia, ...overrides })).toBe(false);
  });

  it.each([
    [{ kind: "recipe", category: "breakfast" }, "recipe-breakfast"],
    [{ kind: "recipe", category: "lunch" }, "recipe-lunch"],
    [{ kind: "recipe", category: "dinner" }, "recipe-dinner"],
    [{ kind: "recipe", category: "snack" }, "recipe-snack"],
    [{ kind: "exercise", category: "horizontal-push" }, "exercise-push"],
    [{ kind: "exercise", category: "vertical-pull" }, "exercise-pull"],
    [{ kind: "exercise", category: "squat" }, "exercise-legs"],
    [{ kind: "exercise", category: "lunge" }, "exercise-legs"],
    [{ kind: "exercise", category: "hinge" }, "exercise-legs"],
    [{ kind: "exercise", category: "carry" }, "exercise-legs"],
    [{ kind: "exercise", category: "leg" }, "exercise-legs"],
    [{ kind: "exercise", category: "core" }, "exercise-core"],
    [{ kind: "exercise", category: "anti-extension" }, "exercise-core"],
    [{ kind: "exercise", category: "anti-rotation" }, "exercise-core"],
    [{ kind: "exercise", category: "anti-lateral-flexion" }, "exercise-core"],
    [{ kind: "exercise", category: "hip-mobility" }, "exercise-mobility"],
    [{ kind: "exercise", category: "mobility" }, "exercise-mobility"],
    [{ kind: "exercise", category: "rotation" }, "exercise-mobility"],
    [{ kind: "exercise", category: "spine" }, "exercise-mobility"],
    [{ kind: "exercise", category: "ankle" }, "exercise-mobility"],
    [{ kind: "exercise", category: "shoulder" }, "exercise-mobility"],
    [{ kind: "recipe", category: "unknown" }, "recipe-dinner"],
    [{ kind: "exercise", category: "unknown" }, "exercise-mobility"],
  ] as const)("maps %o to %s", (context, expected) => {
    expect(fallbackKindForMedia(context)).toBe(expected);
  });

  it("localizes alt text while retaining provenance", () => {
    expect(catalogueMediaForDisplay(validMedia, "mk")).toEqual({
      src: "/media/recipe.webp",
      alt: "Печен зеленчук во чинија",
      focalPoint: "45% 35%",
      sourceName: "B Fit & Healthy",
      sourceUrl: "https://example.com/source",
      creator: "Catalogue team",
      licenseName: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    });
  });

  it("wires the exercise detail route to localized catalogue media with attribution", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/app/(product)/exercises/[slug]/page.tsx"),
      "utf8",
    );

    expect(source).toContain("CatalogueImage");
    expect(source).toContain("catalogueMediaForDisplay");
    expect(source).toContain("showAttribution");
    expect(source).not.toContain("movement-hero");
  });
});
