import { NextResponse } from "next/server";
import { loadDiscoveryContext } from "@/features/discovery/context";
import {
  localDiscoveryExercises,
  searchLocal,
} from "@/features/discovery/local";
import { mergeAndRank } from "@/features/discovery/merge";
import {
  discoveryResponse,
  logDiscoveryProviders,
} from "@/features/discovery/route-response";
import { discoveryQuerySchema } from "@/features/discovery/schemas";
import {
  searchCommercialExerciseProviders,
} from "@/features/fitness/providers/exercise-mesh";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ results: [] }, { status: 401 });
  const parsed = discoveryQuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!parsed.success || !parsed.data.q) {
    return NextResponse.json({ results: [] }, { status: 400 });
  }
  const query = parsed.data.q;
  const [external, context] = await Promise.all([
    searchCommercialExerciseProviders(query),
    loadDiscoveryContext(user.id),
  ]);
  const results = mergeAndRank(
    [...searchLocal(localDiscoveryExercises, query), ...external.results],
    {
      query,
      ...context,
      equipment: parsed.data.equipment ? [parsed.data.equipment] : undefined,
      difficulty: parsed.data.difficulty ?? null,
    },
  );
  logDiscoveryProviders("exercises", external.failures, external.elapsedMs);
  return discoveryResponse(query, results, external.failures);
}
