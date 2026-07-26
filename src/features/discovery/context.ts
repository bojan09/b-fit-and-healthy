import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function loadDiscoveryContext(userId: string) {
  const supabase = await createClient();
  const [goals, recent] = await Promise.all([
    supabase
      .from("goals")
      .select("kind")
      .eq("user_id", userId)
      .eq("status", "active"),
    supabase
      .from("external_content_snapshots")
      .select("provider,external_id")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(20),
  ]);

  return {
    activeGoals: (goals.data ?? []).map((goal) => goal.kind),
    recentIds: (recent.data ?? []).map(
      (item) => `${item.provider}:${item.external_id}`,
    ),
  };
}
