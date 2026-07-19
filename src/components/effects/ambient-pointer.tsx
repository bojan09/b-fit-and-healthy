"use client";

import { useEffect } from "react";

export function AmbientPointer() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduced.matches || coarse.matches) return;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    const update = () => {
      document.documentElement.style.setProperty("--pointer-x", `${x}px`);
      document.documentElement.style.setProperty("--pointer-y", `${y}px`);
      frame = 0;
    };
    const onPointerMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="ambient-pointer" aria-hidden="true" />;
}
