import { NextResponse } from "next/server";
import { loadDiscoveryContext } from "@/features/discovery/context";
import { localDiscoveryExercises } from "@/features/discovery/local";
import {
  discoveryResponse,
  logDiscoveryProviders,
} from "@/features/discovery/route-response";
import { discoveryQuerySchema } from "@/features/discovery/schemas";
import {
  effectiveExerciseQuery,
  type ExerciseSearchCriteria,
} from "@/features/fitness/exercise-search";
import { resolveExerciseDiscovery } from "@/features/fitness/exercise-discovery";
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
  if (!parsed.success) {
    return NextResponse.json({ results: [] }, { status: 400 });
  }
  const criteria: ExerciseSearchCriteria = {
    query: parsed.data.q ?? "",
    muscle: parsed.data.muscle ?? "",
    equipment: parsed.data.equipment ?? "",
    type: parsed.data.type ?? "",
  };
  const query = effectiveExerciseQuery(criteria);
  const [external, context] = await Promise.all([
    searchCommercialExerciseProviders(criteria),
    loadDiscoveryContext(user.id),
  ]);
  const results = resolveExerciseDiscovery({
    local: localDiscoveryExercises,
    external: external.results,
    criteria,
    context: {
      ...context,
      difficulty: parsed.data.difficulty ?? null,
    },
  });
  logDiscoveryProviders("exercises", external.failures, external.elapsedMs);
  return discoveryResponse(query, results, external.failures);
}
