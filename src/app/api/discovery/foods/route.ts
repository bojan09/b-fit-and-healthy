import { NextResponse } from "next/server";
import { discoveryQuerySchema } from "@/features/discovery/schemas";
import { mergeAndRank } from "@/features/discovery/merge";
import { runProviders } from "@/features/discovery/provider-runner";
import {
  localDiscoveryFoods,
  searchLocal,
} from "@/features/discovery/local";
import {
  discoveryResponse,
  logDiscoveryProviders,
} from "@/features/discovery/route-response";
import { loadDiscoveryContext } from "@/features/discovery/context";
import { searchUsdaFoods } from "@/features/nutrition/usda";
import {
  lookupOpenFoodFactsBarcode,
  searchOpenFoodFactsBrands,
} from "@/features/nutrition/providers/open-food-facts";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { message: "Sign in to search foods.", results: [] },
      { status: 401 },
    );
  }

  const parsed = discoveryQuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Enter at least two characters or a valid barcode.", results: [] },
      { status: 400 },
    );
  }

  const query = parsed.data.barcode ?? parsed.data.q ?? "";
  const local = parsed.data.barcode
    ? []
    : searchLocal(localDiscoveryFoods, parsed.data.q ?? "");
  const providers = parsed.data.barcode
    ? [
        {
          id: "open-food-facts",
          run: (signal: AbortSignal) =>
            lookupOpenFoodFactsBarcode(parsed.data.barcode!, signal),
        },
      ]
    : [
        {
          id: "usda",
          run: async (signal: AbortSignal) =>
            (await searchUsdaFoods(parsed.data.q!, signal)).results,
        },
        ...(parsed.data.source === "branded"
          ? [
              {
                id: "open-food-facts",
                run: (signal: AbortSignal) =>
                  searchOpenFoodFactsBrands(parsed.data.q!, signal),
              },
            ]
          : []),
      ];
  const [external, context] = await Promise.all([
    runProviders(providers, { timeoutMs: 2_500 }),
    loadDiscoveryContext(user.id),
  ]);
  const results = mergeAndRank([...local, ...external.results], {
    query,
    ...context,
  });
  logDiscoveryProviders("foods", external.failures, external.elapsedMs);
  return discoveryResponse(query, results, external.failures);
}
