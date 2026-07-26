import type {
  CommercialExerciseLicense,
} from "@/features/discovery/types";

type RawCommercialLicense = {
  name: string;
  url: string | null;
  attribution: string;
};

export function normalizeCommercialLicense({
  name,
  url,
  attribution,
}: RawCommercialLicense): CommercialExerciseLicense | null {
  const normalized = name
    .normalize("NFKC")
    .trim()
    .toLocaleUpperCase()
    .replace(/[_–—-]+/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized || /\bNC\b|NONCOMMERCIAL|PERSONAL USE/.test(normalized)) {
    return null;
  }

  if (normalized === "UNLICENSE") {
    return {
      id: "Unlicense",
      name: "Unlicense",
      url,
      attribution,
      commercialUse: true,
    };
  }

  if (
    normalized === "CC BY SA 4"
    || normalized === "CC BY SA 4 0"
    || normalized === "CREATIVE COMMONS ATTRIBUTION SHARE ALIKE 4"
    || normalized === "CREATIVE COMMONS ATTRIBUTION SHARE ALIKE 4 0"
  ) {
    return {
      id: "CC-BY-SA-4.0",
      name: "CC BY-SA 4.0",
      url,
      attribution,
      commercialUse: true,
    };
  }

  if (
    normalized === "CC BY 4"
    || normalized === "CC BY 4 0"
    || normalized === "CREATIVE COMMONS ATTRIBUTION 4"
    || normalized === "CREATIVE COMMONS ATTRIBUTION 4 0"
  ) {
    return {
      id: "CC-BY-4.0",
      name: "CC BY 4.0",
      url,
      attribution,
      commercialUse: true,
    };
  }

  return null;
}
