import {
  normalizeDiscoveryTitle,
  type DiscoveryExercise,
} from "@/features/discovery/types";
import {
  normalizeCommercialLicense,
} from "@/features/discovery/commercial-license";
import {
  exerciseTextQuery,
  type ExerciseSearchCriteria,
} from "@/features/fitness/exercise-search";
import {
  requireExerciseProviderResponse,
  rethrowExerciseProviderError,
} from "@/features/fitness/providers/provider-error";

type WgerExercise = {
  id: number;
  category?: { name?: string };
  muscles?: Array<{ name_en?: string; name?: string }>;
  muscles_secondary?: Array<{ name_en?: string; name?: string }>;
  equipment?: Array<{ name?: string }>;
  license?: {
    full_name?: string;
    short_name?: string;
    url?: string;
  };
  license_author?: string;
  translations?: Array<{
    language?: number;
    name?: string;
    description?: string;
  }>;
};

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeWgerExercise(
  exercise: WgerExercise,
): DiscoveryExercise | null {
  const license = normalizeCommercialLicense({
    name: exercise.license?.short_name
      ?? exercise.license?.full_name
      ?? "",
    url: exercise.license?.url ?? null,
    attribution: exercise.license_author?.trim() || "wger contributor",
  });
  if (!license) return null;

  const translation =
    exercise.translations?.find((item) => item.language === 2) ??
    exercise.translations?.find((item) => item.name?.trim());
  const title = translation?.name?.trim();
  if (!title) return null;
  const instructions = stripHtml(translation?.description ?? "")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);

  return {
    id: `wger:${exercise.id}`,
    kind: "exercise",
    provider: "wger",
    license,
    externalId: String(exercise.id),
    title,
    normalizedTitle: normalizeDiscoveryTitle(title),
    sourceUrl: `https://wger.de/en/exercise/${exercise.id}/view`,
    attribution: "wger open exercise database",
    retrievedAt: new Date().toISOString(),
    quality: "community",
    completeness: instructions.length ? ["instructions"] : [],
    alternates: [],
    primaryMuscles: (exercise.muscles ?? []).map(
      (muscle) => muscle.name_en ?? muscle.name ?? "",
    ).filter(Boolean),
    secondaryMuscles: (exercise.muscles_secondary ?? []).map(
      (muscle) => muscle.name_en ?? muscle.name ?? "",
    ).filter(Boolean),
    equipment: (exercise.equipment ?? []).map((item) => item.name ?? "").filter(Boolean),
    difficulty: null,
    movementPattern: exercise.category?.name ?? null,
    instructions,
    safety: null,
    media: [],
  };
}

export async function searchWgerExercises(
  criteria: ExerciseSearchCriteria,
  signal?: AbortSignal,
) {
  try {
    const query = exerciseTextQuery(criteria);
    const params = new URLSearchParams({
      limit: query ? "20" : "100",
      language: "2",
    });
    if (query) params.set("name", query);
    const response = await fetch(
      `https://wger.de/api/v2/exerciseinfo/?${params.toString()}`,
      { signal, next: { revalidate: 86_400 } },
    );
    requireExerciseProviderResponse("wger", response);
    const payload = (await response.json()) as { results?: WgerExercise[] };
    return (payload.results ?? [])
      .map(normalizeWgerExercise)
      .filter((item): item is DiscoveryExercise => item !== null);
  } catch (error) {
    rethrowExerciseProviderError("wger", error);
  }
}
