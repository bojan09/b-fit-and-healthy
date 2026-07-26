import {
  normalizeDiscoveryTitle,
  type DiscoveryExercise,
} from "@/features/discovery/types";
import {
  normalizeCommercialLicense,
} from "@/features/discovery/commercial-license";

type WrkoutExercise = {
  name: string;
  force?: string | null;
  level?: string | null;
  mechanic?: string | null;
  equipment?: string | null;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  instructions?: string[];
  category?: string;
  images?: string[];
};

type GitHubTree = {
  tree?: Array<{ path?: string; type?: string }>;
};

const repository = "https://github.com/wrkout/exercises.json";

export function normalizeWrkoutExercise(
  exercise: WrkoutExercise,
  externalId: string,
): DiscoveryExercise {
  const attribution = "wrkout/exercises.json public-domain exercise dataset";
  const license = normalizeCommercialLicense({
    name: "Unlicense",
    url: `${repository}/blob/master/LICENSE.md`,
    attribution,
  })!;

  return {
    id: `wrkout:${externalId}`,
    kind: "exercise",
    provider: "wrkout",
    license,
    externalId,
    title: exercise.name.trim(),
    normalizedTitle: normalizeDiscoveryTitle(exercise.name),
    sourceUrl: `${repository}/tree/master/exercises/${encodeURIComponent(externalId)}`,
    attribution,
    retrievedAt: new Date().toISOString(),
    quality: "community",
    completeness: [
      ...(exercise.primaryMuscles?.length ? ["primaryMuscles"] : []),
      ...(exercise.instructions?.length ? ["instructions"] : []),
    ],
    alternates: [],
    primaryMuscles: exercise.primaryMuscles?.filter(Boolean) ?? [],
    secondaryMuscles: exercise.secondaryMuscles?.filter(Boolean) ?? [],
    equipment: exercise.equipment ? [exercise.equipment] : [],
    difficulty: exercise.level ?? null,
    movementPattern: exercise.force ?? exercise.mechanic ?? null,
    instructions: exercise.instructions?.filter(Boolean) ?? [],
    safety: null,
    media: [],
  };
}

function scoreFolder(folder: string, query: string) {
  const normalized = normalizeDiscoveryTitle(folder.replaceAll("_", " "));
  if (normalized === query) return 0;
  if (normalized.startsWith(query)) return 1;
  if (normalized.includes(query)) return 2;
  return 3;
}

export async function searchWrkoutExercises(
  query: string,
  signal?: AbortSignal,
) {
  try {
    const treeResponse = await fetch(
      "https://api.github.com/repos/wrkout/exercises.json/git/trees/master?recursive=1",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "B-Fit-and-Healthy",
        },
        signal,
        next: { revalidate: 2_592_000 },
      },
    );
    if (!treeResponse.ok) return [];
    const payload = (await treeResponse.json()) as GitHubTree;
    const normalizedQuery = normalizeDiscoveryTitle(query);
    const matches = (payload.tree ?? [])
      .flatMap((entry) => {
        const match = entry.path?.match(/^exercises\/([^/]+)\/exercise\.json$/);
        return match ? [match[1]] : [];
      })
      .filter((folder) =>
        normalizeDiscoveryTitle(folder.replaceAll("_", " "))
          .includes(normalizedQuery)
      )
      .sort((left, right) =>
        scoreFolder(left, normalizedQuery) - scoreFolder(right, normalizedQuery)
        || left.localeCompare(right)
      )
      .slice(0, 8);

    const records = await Promise.all(matches.map(async (folder) => {
      const response = await fetch(
        `https://raw.githubusercontent.com/wrkout/exercises.json/master/exercises/${encodeURIComponent(folder)}/exercise.json`,
        {
          headers: { "User-Agent": "B-Fit-and-Healthy" },
          signal,
          next: { revalidate: 2_592_000 },
        },
      );
      if (!response.ok) return null;
      return {
        folder,
        exercise: (await response.json()) as WrkoutExercise,
      };
    }));

    return records.flatMap((record) =>
      record ? [normalizeWrkoutExercise(record.exercise, record.folder)] : []
    );
  } catch {
    return [];
  }
}
