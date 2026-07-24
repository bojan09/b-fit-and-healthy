import { describe, expect, it } from "vitest";
import {
  canUseThreeRenderer,
  resolveMotionProfile,
  type MotionCapabilitySnapshot,
} from "@/features/motion/preferences";

const fullDesktop: MotionCapabilitySnapshot = {
  reducedMotion: false,
  coarsePointer: false,
  saveData: false,
  documentVisible: true,
  hardwareConcurrency: 8,
  deviceMemory: 8,
  webgl2: true,
};

describe("motion capability decisions", () => {
  it("uses full motion only for a visible capable desktop", () => {
    expect(resolveMotionProfile(fullDesktop)).toBe("full");
  });

  it.each([
    ["coarse pointer", { coarsePointer: true }],
    ["data saver", { saveData: true }],
    ["hidden document", { documentVisible: false }],
    ["low concurrency", { hardwareConcurrency: 2 }],
    ["low memory", { deviceMemory: 2 }],
  ])("uses limited motion for %s", (_label, patch) => {
    expect(resolveMotionProfile({ ...fullDesktop, ...patch })).toBe("limited");
  });

  it("lets reduced motion override every capability", () => {
    expect(resolveMotionProfile({
      ...fullDesktop,
      reducedMotion: true,
      coarsePointer: true,
      saveData: true,
    })).toBe("reduced");
  });

  it("treats absent hardware hints as unknown rather than low powered", () => {
    expect(resolveMotionProfile({
      ...fullDesktop,
      hardwareConcurrency: null,
      deviceMemory: null,
    })).toBe("full");
  });

  it("requires a licensed asset and full WebGL2 capability for Three.js", () => {
    expect(canUseThreeRenderer(fullDesktop, false)).toBe(false);
    expect(canUseThreeRenderer(fullDesktop, true)).toBe(true);
    expect(canUseThreeRenderer({ ...fullDesktop, webgl2: false }, true)).toBe(false);
    expect(canUseThreeRenderer({ ...fullDesktop, reducedMotion: true }, true)).toBe(false);
    expect(canUseThreeRenderer({ ...fullDesktop, coarsePointer: true }, true)).toBe(false);
  });
});
