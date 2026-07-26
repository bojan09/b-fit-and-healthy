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

const ATTRIBUTION =
  "Exercise data by ExerciseAPI (https://exercise-api.com), licensed under CC BY 4.0.";

type ExerciseApiExercise = {
  id: string;
  name: string;
  primary_muscle?: string;
  primary_muscles?: string[];
  secondary_muscles?: string[];
  equipment?: string[];
  pattern?: string;
  instructions?: string[];
  cues?: string;
};

export function normalizeExerciseApiExercise(
  exercise: ExerciseApiExercise,
): DiscoveryExercise {
  const license = normalizeCommercialLicense({
    name: "CC BY 4.0",
    url: "https://creativecommons.org/licenses/by/4.0/",
    attribution: ATTRIBUTION,
  })!;
  const instructions = exercise.instructions?.filter(Boolean)
    ?? (exercise.cues?.trim() ? [exercise.cues.trim()] : []);
  const primaryMuscles = exercise.primary_muscles?.filter(Boolean)
    ?? (exercise.primary_muscle ? [exercise.primary_muscle] : []);

  return {
    id: `exercise-api:${exercise.id}`,
    kind: "exercise",
    provider: "exercise-api",
    license,
    externalId: exercise.id,
    title: exercise.name.trim(),
    normalizedTitle: normalizeDiscoveryTitle(exercise.name),
    sourceUrl: `https://exercise-api.com/v1/exercises/${encodeURIComponent(exercise.id)}`,
    attribution: ATTRIBUTION,
    retrievedAt: new Date().toISOString(),
    quality: "curated",
    completeness: [
      ...(primaryMuscles.length ? ["primaryMuscles"] : []),
      ...(instructions.length ? ["instructions"] : []),
    ],
    alternates: [],
    primaryMuscles,
    secondaryMuscles: exercise.secondary_muscles?.filter(Boolean) ?? [],
    equipment: exercise.equipment?.filter(Boolean) ?? [],
    difficulty: null,
    movementPattern: exercise.pattern ?? null,
    instructions,
    safety: null,
    media: [],
  };
}

export async function searchExerciseApiExercises(
  criteria: ExerciseSearchCriteria,
  signal?: AbortSignal,
) {
  try {
    const response = await fetch(
      "https://exercise-api.com/v1/exercises?limit=200&offset=0",
      {
        signal,
        next: { revalidate: 2_592_000 },
      },
    );
    requireExerciseProviderResponse("exercise-api", response);
    const payload = (await response.json()) as {
      data?: ExerciseApiExercise[];
    };
    const normalizedQuery = normalizeDiscoveryTitle(
      exerciseTextQuery(criteria),
    );

    return (payload.data ?? [])
      .map(normalizeExerciseApiExercise)
      .filter((exercise) =>
        !normalizedQuery
        || normalizeDiscoveryTitle([
          exercise.title,
          exercise.primaryMuscles.join(" "),
          exercise.secondaryMuscles.join(" "),
          exercise.equipment.join(" "),
          exercise.movementPattern ?? "",
        ].join(" ")).includes(normalizedQuery)
      )
      .slice(0, normalizedQuery ? 20 : 200);
  } catch (error) {
    rethrowExerciseProviderError("exercise-api", error);
  }
}
