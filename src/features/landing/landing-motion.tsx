"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { useGsapScope } from "@/features/motion/use-gsap-scope";

export function LandingMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const setup = useCallback(({ gsap, root: scope, profile }: Parameters<Parameters<typeof useGsapScope>[1]>[0]) => {
    const items = scope.querySelectorAll(
      "[data-motion-hero] .eyebrow, [data-motion-hero] h1, [data-motion-hero] .lede, [data-motion-hero] .action-row, [data-motion-hero] .supporting-note, [data-motion-hero] .system-orbit",
    );
    if (!items.length) return;
    gsap.fromTo(items,
      { opacity: 0.82, y: profile === "full" ? 20 : 8 },
      {
        opacity: 1,
        y: 0,
        duration: profile === "full" ? 0.56 : 0.3,
        stagger: profile === "full" ? 0.055 : 0.025,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });
  }, []);
  useGsapScope(root, setup, "landing-hero");
  return <div ref={root} className="landing-motion-root">{children}</div>;
}
