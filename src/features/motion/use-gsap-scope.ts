"use client";

import { useEffect, type RefObject } from "react";
import { loadGsap } from "@/features/motion/gsap-loader";
import { useMotionProfile } from "@/features/motion/use-motion-profile";
import type { MotionProfile } from "@/features/motion/preferences";

type GsapModule = Awaited<ReturnType<typeof loadGsap>>;
type Setup = (input: {
  gsap: GsapModule["gsap"];
  root: HTMLElement;
  profile: Exclude<MotionProfile, "reduced">;
}) => void | (() => void);

export function useGsapScope<T extends HTMLElement>(
  rootRef: RefObject<T | null>,
  setup: Setup,
  dependencyKey = "default",
) {
  const profile = useMotionProfile();

  useEffect(() => {
    if (profile === "reduced" || !rootRef.current) return;
    let active = true;
    let revert: (() => void) | undefined;
    void loadGsap().then(({ gsap }) => {
      if (!active || !rootRef.current) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () =>
        setup({ gsap, root: rootRef.current as T, profile }));
      revert = () => media.revert();
    }).catch(() => undefined);
    return () => {
      active = false;
      revert?.();
    };
  }, [dependencyKey, profile, rootRef, setup]);
}
