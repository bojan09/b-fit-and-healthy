"use client";

import { useEffect } from "react";
import { useMotionProfile } from "@/features/motion/use-motion-profile";

export function AmbientPointer() {
  const motionProfile = useMotionProfile();
  useEffect(() => {
    if (motionProfile !== "full") return;

    let frame = 0;
    let visible = document.visibilityState !== "hidden";
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    const update = () => {
      document.documentElement.style.setProperty("--pointer-x", `${x}px`);
      document.documentElement.style.setProperty("--pointer-y", `${y}px`);
      frame = 0;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!visible) return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const onVisibilityChange = () => {
      visible = document.visibilityState !== "hidden";
      if (!visible && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [motionProfile]);

  return <div className="ambient-pointer" aria-hidden="true" />;
}
