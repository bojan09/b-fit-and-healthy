import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ComponentType<{ "aria-hidden"?: boolean }>;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  icon: Icon,
  className,
}: EmptyStateProps) {
  return (
    <section className={cn("empty-state", className)}>
      {Icon ? <Icon aria-hidden={true} /> : null}
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action ? <div className="empty-state-action">{action}</div> : null}
    </section>
  );
}
