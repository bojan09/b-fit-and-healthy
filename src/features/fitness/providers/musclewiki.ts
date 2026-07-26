import "server-only";

import { getServerEnv } from "@/lib/env/server";
import {
  normalizeDiscoveryTitle,
  type DiscoveryExercise,
  type DiscoveryWorkout,
} from "@/features/discovery/types";

function headers() {
  const apiKey = getServerEnv().MUSCLEWIKI_API_KEY;
  return apiKey ? { "X-API-Key": apiKey } : null;
}

async function request(path: string, signal?: AbortSignal) {
  const auth = headers();
  if (!auth) return null;
  const response = await fetch(`https://api.musclewiki.com${path}`, {
    headers: auth,
    signal,
    cache: "no-store",
  });
  if (!response.ok) return null;
  return response;
}

export async function searchMuscleWikiExercises(
  query: string,
  signal?: AbortSignal,
): Promise<{ available: boolean; results: DiscoveryExercise[] }> {
  void query;
  void signal;
  // The free/playground terms do not grant commercial production use.
  // Keep this adapter disabled until a paid commercial agreement supplies
  // explicit exercise-level provenance.
  return { available: false, results: [] };
}

export async function searchMuscleWikiWorkouts(
  query: string,
  signal?: AbortSignal,
): Promise<{ available: boolean; results: DiscoveryWorkout[] }> {
  const response = await request(
    `/workouts?limit=12&goal=${encodeURIComponent(query)}`,
    signal,
  );
  if (!response) return { available: false, results: [] };
  const payload = (await response.json()) as {
    results?: Array<{
      id: number;
      name: string;
      goal?: string;
      difficulty?: string;
      equipment?: string[];
    }>;
  };
  return {
    available: true,
    results: (payload.results ?? []).map((item) => ({
      id: `musclewiki:${item.id}`,
      kind: "workout",
      provider: "musclewiki",
      externalId: String(item.id),
      title: item.name,
      normalizedTitle: normalizeDiscoveryTitle(item.name),
      sourceUrl: "https://musclewiki.com",
      attribution: "MuscleWiki",
      retrievedAt: new Date().toISOString(),
      quality: "verified",
      completeness: [],
      alternates: [],
      goal: item.goal ?? "general",
      durationMinutes: null,
      difficulty: item.difficulty ?? null,
      equipment: item.equipment ?? [],
      exercises: [],
    })),
  };
}
