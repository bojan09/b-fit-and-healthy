import {
  normalizeDiscoveryTitle,
  type DiscoveryExercise,
} from "@/features/discovery/types";

type WgerExercise = {
  id: number;
  category?: { name?: string };
  muscles?: Array<{ name_en?: string; name?: string }>;
  muscles_secondary?: Array<{ name_en?: string; name?: string }>;
  equipment?: Array<{ name?: string }>;
  translations?: Array<{
    language?: number;
    name?: string;
    description?: string;
  }>;
};

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function normalizeWgerExercise(
  exercise: WgerExercise,
): DiscoveryExercise | null {
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
  query: string,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `https://wger.de/api/v2/exerciseinfo/?limit=20&language=2&name=${encodeURIComponent(query)}`,
    { signal, next: { revalidate: 86_400 } },
  );
  if (!response.ok) return [];
  const payload = (await response.json()) as { results?: WgerExercise[] };
  return (payload.results ?? [])
    .map(normalizeWgerExercise)
    .filter((item): item is DiscoveryExercise => item !== null);
}
