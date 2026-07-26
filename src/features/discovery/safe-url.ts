import type { DiscoveryProvider } from "@/features/discovery/types";

const allowedHosts: Partial<Record<DiscoveryProvider, string[]>> = {
  usda: ["fdc.nal.usda.gov", "api.nal.usda.gov"],
  "open-food-facts": [
    "world.openfoodfacts.org",
    "images.openfoodfacts.org",
  ],
  themealdb: ["themealdb.com", "www.themealdb.com"],
  wger: ["wger.de"],
  musclewiki: ["api.musclewiki.com", "musclewiki.com", "www.musclewiki.com"],
  "exercise-api": ["exercise-api.com", "www.exercise-api.com"],
  wrkout: ["github.com", "raw.githubusercontent.com"],
};

export function safeProviderUrl(
  value: string | null | undefined,
  provider: DiscoveryProvider,
) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !allowedHosts[provider]?.includes(url.hostname)
    ) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}
