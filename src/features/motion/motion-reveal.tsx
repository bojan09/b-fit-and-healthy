"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { loadGsap } from "@/features/motion/gsap-loader";
import { useMotionProfile } from "@/features/motion/use-motion-profile";

export function MotionReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const profile = useMotionProfile();
  const [state, setState] = useState<"static" | "animating" | "complete">("static");

  useEffect(() => {
    const element = root.current;
    if (!element || state !== "static") return;
    if (typeof IntersectionObserver === "undefined") return;
    let active = true;
    let observing = true;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      observing = false;
      if (profile === "reduced") {
        setState("complete");
        return;
      }
      setState("animating");
      void loadGsap().then(({ gsap }) => {
        if (!active) return;
        gsap.fromTo(element,
          { opacity: 0.84, y: profile === "full" ? 18 : 8 },
          {
            opacity: 1,
            y: 0,
            duration: profile === "full" ? 0.56 : 0.3,
            ease: "power3.out",
            clearProps: "transform,opacity",
            onComplete: () => active && setState("complete"),
          });
      }).catch(() => active && setState("complete"));
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    observer.observe(element);
    return () => {
      active = false;
      if (observing) observer.disconnect();
    };
  }, [profile, state]);

  return <div ref={root} className={className} data-motion-state={state}>{children}</div>;
}
