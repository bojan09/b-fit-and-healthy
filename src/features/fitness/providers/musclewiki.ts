import "server-only";

import { getServerEnv } from "@/lib/env/server";
import { safeProviderUrl } from "@/features/discovery/safe-url";
import {
  normalizeDiscoveryTitle,
  type DiscoveryExercise,
  type DiscoveryWorkout,
} from "@/features/discovery/types";

type MuscleWikiExercise = {
  id: number;
  name: string;
  primary_muscles?: string[];
  secondary_muscles?: string[];
  category?: string;
  difficulty?: string;
  force?: string;
  steps?: string[];
  videos?: Array<{ url?: string } | string>;
};

function headers() {
  const apiKey = getServerEnv().MUSCLEWIKI_API_KEY;
  return apiKey ? { "X-API-Key": apiKey } : null;
}

function normalizeExercise(item: MuscleWikiExercise): DiscoveryExercise {
  const media = (item.videos ?? [])
    .map((video) => (typeof video === "string" ? video : video.url))
    .map((url) => safeProviderUrl(url, "musclewiki"))
    .filter((url): url is string => Boolean(url))
    .map((url) => ({ type: "video" as const, url }));
  return {
    id: `musclewiki:${item.id}`,
    kind: "exercise",
    provider: "musclewiki",
    externalId: String(item.id),
    title: item.name,
    normalizedTitle: normalizeDiscoveryTitle(item.name),
    sourceUrl: "https://musclewiki.com",
    attribution: "MuscleWiki",
    retrievedAt: new Date().toISOString(),
    quality: "verified",
    completeness: [
      ...(item.steps?.length ? ["instructions"] : []),
      ...(media.length ? ["media"] : []),
    ],
    alternates: [],
    primaryMuscles: item.primary_muscles ?? [],
    secondaryMuscles: item.secondary_muscles ?? [],
    equipment: item.category ? [item.category] : [],
    difficulty: item.difficulty ?? null,
    movementPattern: item.force ?? null,
    instructions: item.steps ?? [],
    safety: null,
    media,
  };
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
  const response = await request(
    `/search?q=${encodeURIComponent(query)}&limit=12`,
    signal,
  );
  if (!response) return { available: false, results: [] };
  const payload = (await response.json()) as {
    results?: MuscleWikiExercise[];
  };
  return {
    available: true,
    results: (payload.results ?? []).map(normalizeExercise),
  };
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
