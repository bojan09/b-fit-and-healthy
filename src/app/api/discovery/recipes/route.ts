import { NextResponse } from "next/server";
import { loadDiscoveryContext } from "@/features/discovery/context";
import {
  localDiscoveryRecipes,
  searchLocal,
} from "@/features/discovery/local";
import { mergeAndRank } from "@/features/discovery/merge";
import { runProviders } from "@/features/discovery/provider-runner";
import {
  discoveryResponse,
  logDiscoveryProviders,
} from "@/features/discovery/route-response";
import { discoveryQuerySchema } from "@/features/discovery/schemas";
import { searchMealDb } from "@/features/nutrition/providers/themealdb";
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
      [{ id: "themealdb", run: (signal) => searchMealDb(query, signal) }],
      { timeoutMs: 2_500 },
    ),
    loadDiscoveryContext(user.id),
  ]);
  const results = mergeAndRank(
    [...searchLocal(localDiscoveryRecipes, query), ...external.results],
    { query, ...context },
  );
  logDiscoveryProviders("recipes", external.failures, external.elapsedMs);
  return discoveryResponse(query, results, external.failures);
}
