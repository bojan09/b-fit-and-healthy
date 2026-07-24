import { z } from "zod";
import { muscles } from "@/features/anatomy/data";

const knownMuscleIds = new Set(muscles.map((muscle) => muscle.id));
const assetUrlSchema = z.string().refine((value) => {
  if (!/\.(glb|gltf)$/i.test(value)) return false;
  if (value.startsWith("/")) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}, "Asset URL must be a root-relative or HTTPS GLB/GLTF file");

export const anatomyAssetManifestSchema = z.object({
  assetUrl: assetUrlSchema,
  licenseName: z.string().trim().min(2),
  licenseUrl: z.url(),
  attribution: z.string().trim().min(2),
  commercialUseAllowed: z.literal(true),
  modelVersion: z.string().trim().min(1),
  muscleMeshes: z.record(z.string(), z.array(z.string().trim().min(1)).min(1)),
}).superRefine((manifest, context) => {
  const meshOwners = new Map<string, string>();
  for (const [muscleId, meshNames] of Object.entries(manifest.muscleMeshes)) {
    if (!knownMuscleIds.has(muscleId)) {
      context.addIssue({ code: "custom", path: ["muscleMeshes", muscleId], message: "Unknown muscle ID" });
    }
    for (const meshName of meshNames) {
      const owner = meshOwners.get(meshName);
      if (owner && owner !== muscleId) {
        context.addIssue({ code: "custom", path: ["muscleMeshes", muscleId], message: "Mesh names must be unique across muscles" });
      }
      meshOwners.set(meshName, muscleId);
    }
  }
});

export type AnatomyAssetManifest = z.infer<typeof anatomyAssetManifestSchema>;

export function getAnatomyAssetManifest(): AnatomyAssetManifest | null {
  return null;
}
