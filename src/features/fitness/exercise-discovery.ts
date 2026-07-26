import { mergeAndRank } from "@/features/discovery/merge";
import type {
  DiscoveryContext,
  DiscoveryExercise,
} from "@/features/discovery/types";
import {
  effectiveExerciseQuery,
  filterConnectedExercises,
  type ExerciseSearchCriteria,
} from "@/features/fitness/exercise-search";

type ExerciseDiscoveryInput = {
  local: readonly DiscoveryExercise[];
  external: readonly DiscoveryExercise[];
  criteria: ExerciseSearchCriteria;
  context: Omit<DiscoveryContext, "query" | "equipment">;
};

export function resolveExerciseDiscovery({
  local,
  external,
  criteria,
  context,
}: ExerciseDiscoveryInput) {
  const filtered = [
    ...filterConnectedExercises(local, criteria),
    ...filterConnectedExercises(external, criteria),
  ];

  return mergeAndRank(filtered, {
    query: effectiveExerciseQuery(criteria),
    ...context,
    equipment: criteria.equipment ? [criteria.equipment] : undefined,
  }).slice(0, 60);
}
