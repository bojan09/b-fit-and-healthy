import type { ReactNode } from "react";

/**
 * Scroll-driven entrance handled entirely in CSS (`animation-timeline: view()`).
 * Content is fully visible without CSS support or with reduced motion.
 */
export function MotionReveal({
  children,
  className,
  variant = "rise",
}: {
  children: ReactNode;
  className?: string;
  variant?: "rise" | "tilt";
}) {
  return (
    <div className={className ? `motion-reveal ${className}` : "motion-reveal"} data-reveal={variant}>
      {children}
    </div>
  );
}
