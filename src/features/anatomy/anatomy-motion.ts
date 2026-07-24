"use client";

import { useCallback, type RefObject } from "react";
import type { MuscleView } from "@/features/anatomy/data";
import { useGsapScope } from "@/features/motion/use-gsap-scope";

export function useAnatomyMotion(
  rootRef: RefObject<HTMLDivElement | null>,
  view: MuscleView,
  selectedMuscleId: string,
) {
  const setup = useCallback(({ gsap, root, profile }: Parameters<Parameters<typeof useGsapScope>[1]>[0]) => {
    const renderer = root.querySelector("[data-anatomy-renderer]");
    const panelItems = root.querySelectorAll("[data-anatomy-panel] > *");
    if (renderer) {
      gsap.fromTo(renderer,
        { opacity: 0.88, x: profile === "full" ? (view === "front" ? -10 : 10) : 0 },
        { opacity: 1, x: 0, duration: profile === "full" ? 0.36 : 0.2, ease: "power2.out", clearProps: "transform,opacity" });
    }
    if (panelItems.length) {
      gsap.fromTo(panelItems,
        { opacity: 0.82, y: profile === "full" ? 8 : 0 },
        { opacity: 1, y: 0, duration: 0.22, stagger: profile === "full" ? 0.025 : 0, ease: "power2.out", clearProps: "transform,opacity" });
    }
  }, [view]);
  useGsapScope(rootRef, setup, `${view}:${selectedMuscleId}`);
}
