import "server-only";

import type { DiscoveryItem, DiscoveryKind } from "@/features/discovery/types";
import { toSnapshotInsert } from "@/features/discovery/snapshot";
import { createClient } from "@/lib/supabase/server";

export async function saveDiscoverySnapshot(
  userId: string,
  item: DiscoveryItem,
) {
  const supabase = await createClient();
  const result = await supabase
    .from("external_content_snapshots")
    .upsert(toSnapshotInsert(userId, item), {
      onConflict: "user_id,content_type,provider,external_id",
    })
    .select("id")
    .single();
  if (result.error || !result.data) {
    throw new Error("DISCOVERY_SNAPSHOT_SAVE_FAILED");
  }
  return result.data.id;
}

export async function loadDiscoverySnapshots(
  userId: string,
  kind: DiscoveryKind,
) {
  const supabase = await createClient();
  const result = await supabase
    .from("external_content_snapshots")
    .select("*")
    .eq("user_id", userId)
    .eq("content_type", kind)
    .order("updated_at", { ascending: false });
  if (result.error) throw new Error("DISCOVERY_SNAPSHOT_LOAD_FAILED");
  return result.data ?? [];
}
