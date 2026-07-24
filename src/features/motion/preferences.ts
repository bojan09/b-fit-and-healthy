export type MotionCapabilitySnapshot = {
  reducedMotion: boolean;
  coarsePointer: boolean;
  saveData: boolean;
  documentVisible: boolean;
  hardwareConcurrency: number | null;
  deviceMemory: number | null;
  webgl2: boolean;
};

export type MotionProfile = "full" | "limited" | "reduced";

export function resolveMotionProfile(snapshot: MotionCapabilitySnapshot): MotionProfile {
  if (snapshot.reducedMotion) return "reduced";
  const lowConcurrency = snapshot.hardwareConcurrency !== null && snapshot.hardwareConcurrency < 4;
  const lowMemory = snapshot.deviceMemory !== null && snapshot.deviceMemory < 4;
  if (snapshot.coarsePointer || snapshot.saveData || !snapshot.documentVisible || lowConcurrency || lowMemory) {
    return "limited";
  }
  return "full";
}

export function canUseThreeRenderer(snapshot: MotionCapabilitySnapshot, hasLicensedAsset: boolean) {
  return hasLicensedAsset
    && snapshot.webgl2
    && snapshot.documentVisible
    && resolveMotionProfile(snapshot) === "full";
}
