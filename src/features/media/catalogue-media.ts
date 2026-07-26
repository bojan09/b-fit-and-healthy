import type { Locale } from "@/lib/i18n/config";

export type CatalogueMedia = {
  src: string;
  alt: Record<Locale, string>;
  width: number;
  height: number;
  focalPoint?: `${number}% ${number}%`;
  sourceName: string;
  sourceUrl?: string;
  creator?: string;
  licenseName: string;
  licenseUrl?: string;
};

export type DisplayMedia = {
  src: string;
  alt: string;
  focalPoint?: `${number}% ${number}%`;
  sourceName: string;
  sourceUrl?: string;
  creator?: string;
  licenseName: string;
  licenseUrl?: string;
};

export type MediaFallbackKind =
  | "recipe-breakfast"
  | "recipe-lunch"
  | "recipe-dinner"
  | "recipe-snack"
  | "exercise-push"
  | "exercise-pull"
  | "exercise-legs"
  | "exercise-core"
  | "exercise-mobility";

const MAX_PERCENT_DECODING_STEPS = 64;

function canonicalLocalMediaPath(src: string): string | null {
  if (!src.startsWith("/media/")) return null;

  let decodedPath = src;
  try {
    for (let depth = 0; depth < MAX_PERCENT_DECODING_STEPS; depth += 1) {
      if (/%(?:2e|2f|5c)/i.test(decodedPath)) return null;
      const nextPath = decodeURIComponent(decodedPath);
      if (nextPath === decodedPath) {
        if (decodedPath.includes("\\")) return null;
        return new URL(decodedPath, "https://catalogue-media.invalid").pathname;
      }
      decodedPath = nextPath;
    }
  } catch {
    return null;
  }

  return null;
}

export function validateCatalogueMedia(media: CatalogueMedia): boolean {
  const canonicalPath = canonicalLocalMediaPath(media.src);
  const isLocalWebp = canonicalPath !== null
    && /^\/media\/.+\.webp$/.test(canonicalPath)
    && !canonicalPath.split("/").some((segment) => segment === "." || segment === "..");

  return isLocalWebp
    && Number.isFinite(media.width)
    && media.width > 0
    && Number.isFinite(media.height)
    && media.height > 0
    && media.alt.en.trim().length > 0
    && media.alt.mk.trim().length > 0
    && media.sourceName.trim().length > 0
    && media.licenseName.trim().length > 0;
}

export function fallbackKindForMedia(context: { kind: "exercise" | "recipe"; category: string }): MediaFallbackKind {
  const category = context.category.trim().toLowerCase();

  if (context.kind === "recipe") {
    if (category === "breakfast") return "recipe-breakfast";
    if (category === "lunch") return "recipe-lunch";
    if (category === "snack") return "recipe-snack";
    return "recipe-dinner";
  }

  if (category.includes("push")) return "exercise-push";
  if (category.includes("pull")) return "exercise-pull";
  if (/(squat|lunge|hinge|carry|leg)/.test(category)) return "exercise-legs";
  if (/(core|anti-extension|anti-rotation|anti-lateral-flexion)/.test(category)) return "exercise-core";
  if (/(mobility|rotation|spine|ankle|hip|shoulder)/.test(category)) return "exercise-mobility";
  return "exercise-mobility";
}

export function catalogueMediaForDisplay(media: CatalogueMedia, locale: Locale): DisplayMedia {
  const { width: _width, height: _height, alt, ...provenance } = media;
  return { ...provenance, alt: alt[locale] };
}
