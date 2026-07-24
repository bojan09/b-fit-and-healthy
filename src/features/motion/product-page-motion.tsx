"use client";

import { Fragment, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MotionReveal } from "@/features/motion/motion-reveal";

const enhancedRoutes = ["/nutrition", "/training"];

export function ProductPageMotion({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const enhanced = enhancedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (!enhanced) return <Fragment>{children}</Fragment>;
  return <MotionReveal className="product-page-reveal">{children}</MotionReveal>;
}
