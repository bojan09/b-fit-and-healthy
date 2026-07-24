"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useCallback, useRef } from "react";
import type { AuthActionState } from "@/features/auth/types";
import { useGsapScope } from "@/features/motion/use-gsap-scope";

export function ActionFeedback({
  status,
  message,
  className = "",
}: {
  status: AuthActionState["status"];
  message: string;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const setup = useCallback(({ gsap, root: scope, profile }: Parameters<Parameters<typeof useGsapScope>[1]>[0]) => {
    if (status !== "success") return;
    gsap.fromTo(scope,
      { scale: profile === "full" ? 0.985 : 1, opacity: 0.88 },
      { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out", clearProps: "transform,opacity" });
  }, [status]);
  useGsapScope(root, setup, status);
  const Icon = status === "success" ? CheckCircle2 : AlertCircle;
  return <div
    ref={root}
    className={`action-feedback ${className} ${status}`.trim()}
    data-action-status={status}
    role="status"
    aria-live="polite"
  >
    <Icon aria-hidden="true" />
    <span>{message}</span>
  </div>;
}
