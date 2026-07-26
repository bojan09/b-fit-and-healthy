import type {
  DiscoveryExercise,
} from "@/features/discovery/types";
import {
  runProviders,
  type ProviderJob,
} from "@/features/discovery/provider-runner";
import {
  searchExerciseApiExercises,
} from "@/features/fitness/providers/exercise-api";
import {
  searchWgerExercises,
} from "@/features/fitness/providers/wger";
import {
  searchWrkoutExercises,
} from "@/features/fitness/providers/wrkout";
import type {
  ExerciseSearchCriteria,
} from "@/features/fitness/exercise-search";

type MeshOptions<T> = {
  timeoutMs?: number;
  providers?: readonly ProviderJob<T>[];
};

export async function searchCommercialExerciseProviders<T = DiscoveryExercise>(
  criteria: ExerciseSearchCriteria,
  options: MeshOptions<T> = {},
) {
  const defaultProviders: readonly ProviderJob<DiscoveryExercise>[] = [
    {
      id: "wger",
      run: (signal) => searchWgerExercises(criteria, signal),
    },
    {
      id: "exercise-api",
      run: (signal) => searchExerciseApiExercises(criteria, signal),
    },
    {
      id: "wrkout",
      run: (signal) => searchWrkoutExercises(criteria, signal),
    },
  ];

  const providers = options.providers
    ?? (defaultProviders as unknown as readonly ProviderJob<T>[]);
  return runProviders(providers, {
    timeoutMs: options.timeoutMs ?? 3_500,
  });
}
