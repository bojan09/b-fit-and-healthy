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

type MeshOptions<T> = {
  timeoutMs?: number;
  providers?: readonly ProviderJob<T>[];
};

export async function searchCommercialExerciseProviders<T = DiscoveryExercise>(
  query: string,
  options: MeshOptions<T> = {},
) {
  const defaultProviders: readonly ProviderJob<DiscoveryExercise>[] = [
    {
      id: "wger",
      run: (signal) => searchWgerExercises(query, signal),
    },
    {
      id: "exercise-api",
      run: (signal) => searchExerciseApiExercises(query, signal),
    },
    {
      id: "wrkout",
      run: (signal) => searchWrkoutExercises(query, signal),
    },
  ];

  const providers = options.providers
    ?? (defaultProviders as unknown as readonly ProviderJob<T>[]);
  return runProviders(providers, {
    timeoutMs: options.timeoutMs ?? 3_500,
  });
}
