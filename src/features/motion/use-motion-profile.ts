"use client";

import { useEffect, useState } from "react";
import {
  resolveMotionProfile,
  type MotionCapabilitySnapshot,
  type MotionProfile,
} from "@/features/motion/preferences";

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

function mediaQuery(query: string) {
  if (typeof window.matchMedia === "function") return window.matchMedia(query);
  return {
    matches: false,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  };
}

function supportsWebGl2() {
  if (typeof WebGL2RenderingContext === "undefined") return false;
  const canvas = document.createElement("canvas");
  try {
    return Boolean(canvas.getContext("webgl2"));
  } catch {
    return false;
  } finally {
    canvas.remove();
  }
}

function readSnapshot(): MotionCapabilitySnapshot {
  const hints = navigator as NavigatorHints;
  return {
    reducedMotion: mediaQuery("(prefers-reduced-motion: reduce)").matches,
    coarsePointer: mediaQuery("(pointer: coarse)").matches,
    saveData: Boolean(hints.connection?.saveData),
    documentVisible: document.visibilityState !== "hidden",
    hardwareConcurrency: Number.isFinite(hints.hardwareConcurrency) ? hints.hardwareConcurrency : null,
    deviceMemory: Number.isFinite(hints.deviceMemory) ? hints.deviceMemory ?? null : null,
    webgl2: supportsWebGl2(),
  };
}

const initialSnapshot: MotionCapabilitySnapshot = {
  reducedMotion: false,
  coarsePointer: true,
  saveData: false,
  documentVisible: true,
  hardwareConcurrency: null,
  deviceMemory: null,
  webgl2: false,
};

export function useMotionCapabilities(): MotionCapabilitySnapshot {
  const [snapshot, setSnapshot] = useState<MotionCapabilitySnapshot>(initialSnapshot);

  useEffect(() => {
    const reduced = mediaQuery("(prefers-reduced-motion: reduce)");
    const coarse = mediaQuery("(pointer: coarse)");
    const update = () => setSnapshot(readSnapshot());
    update();
    reduced.addEventListener("change", update);
    coarse.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      reduced.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return snapshot;
}

export function useMotionProfile(): MotionProfile {
  return resolveMotionProfile(useMotionCapabilities());
}
