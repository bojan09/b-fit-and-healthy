import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type CardTone = "default" | "raised" | "soft" | "interactive";

const cardToneClasses: Record<CardTone, string> = {
  default: "bg-[var(--surface)]",
  raised: "bg-[var(--surface-raised)] shadow-[var(--shadow-raised)]",
  soft: "bg-[var(--brand-soft)]",
  interactive:
    "bg-[var(--surface)] transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-[var(--surface-hover)]",
};

export function Card({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: CardTone }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--border)] p-[var(--card-padding)]",
        cardToneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
