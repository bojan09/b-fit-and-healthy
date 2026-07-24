import { describe, expect, it } from "vitest";
import {
  anatomyAssetManifestSchema,
  getAnatomyAssetManifest,
} from "@/features/anatomy/anatomy-asset-manifest";

const valid = {
  assetUrl: "/models/clinical-atlas.glb",
  licenseName: "Commercial anatomy licence",
  licenseUrl: "https://example.com/licence",
  attribution: "Clinical Atlas Studio",
  commercialUseAllowed: true as const,
  modelVersion: "1.0.0",
  muscleMeshes: {
    pectorals: ["PectoralisMajor.L", "PectoralisMajor.R"],
    deltoids: ["Deltoid.L", "Deltoid.R"],
  },
};

describe("Anatomy asset manifest", () => {
  it("accepts a licensed model with known muscle IDs and unique meshes", () => {
    expect(anatomyAssetManifestSchema.parse(valid)).toEqual(valid);
  });

  it("rejects unlicensed, unknown, duplicate, and non-model assets", () => {
    expect(anatomyAssetManifestSchema.safeParse({ ...valid, commercialUseAllowed: false }).success).toBe(false);
    expect(anatomyAssetManifestSchema.safeParse({
      ...valid,
      muscleMeshes: { unknownMuscle: ["Unknown"] },
    }).success).toBe(false);
    expect(anatomyAssetManifestSchema.safeParse({
      ...valid,
      muscleMeshes: { pectorals: ["Shared"], deltoids: ["Shared"] },
    }).success).toBe(false);
    expect(anatomyAssetManifestSchema.safeParse({ ...valid, assetUrl: "/models/atlas.png" }).success).toBe(false);
  });

  it("keeps the licensed asset disabled in this phase", () => {
    expect(getAnatomyAssetManifest()).toBeNull();
  });
});
