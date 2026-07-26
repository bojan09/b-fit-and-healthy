import { NextResponse } from "next/server";
import { loadDiscoveryContext } from "@/features/discovery/context";
import {
  localDiscoveryWorkouts,
  searchLocal,
} from "@/features/discovery/local";
import { mergeAndRank } from "@/features/discovery/merge";
import { runProviders } from "@/features/discovery/provider-runner";
import {
  discoveryResponse,
  logDiscoveryProviders,
} from "@/features/discovery/route-response";
import { discoveryQuerySchema } from "@/features/discovery/schemas";
import { searchMuscleWikiWorkouts } from "@/features/fitness/providers/musclewiki";
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
    runProviders(
      [
        {
          id: "musclewiki",
          run: async (signal) =>
            (await searchMuscleWikiWorkouts(query, signal)).results,
        },
      ],
      { timeoutMs: 2_500 },
    ),
    loadDiscoveryContext(user.id),
  ]);
  const results = mergeAndRank(
    [...searchLocal(localDiscoveryWorkouts, query), ...external.results],
    { query, ...context },
  );
  logDiscoveryProviders("workouts", external.failures, external.elapsedMs);
  return discoveryResponse(query, results, external.failures);
}
