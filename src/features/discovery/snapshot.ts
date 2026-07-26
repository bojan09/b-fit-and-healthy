import type { Json } from "@/types/database";
import type { DiscoveryItem } from "@/features/discovery/types";

export const DISCOVERY_SNAPSHOT_VERSION = 1;

export function toSnapshotInsert(userId: string, item: DiscoveryItem) {
  return {
    user_id: userId,
    content_type: item.kind,
    provider: item.provider,
    external_id: item.externalId,
    title: item.title,
    source_url: item.sourceUrl,
    attribution: item.attribution,
    schema_version: DISCOVERY_SNAPSHOT_VERSION,
    payload: item as unknown as Json,
    retrieved_at: item.retrievedAt,
  };
}
