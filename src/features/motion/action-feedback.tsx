import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { AuthActionState } from "@/features/auth/types";

/** Status message; the success pulse and error shake are CSS keyframes keyed on the message. */
export function ActionFeedback({
  status,
  message,
  className = "",
}: {
  status: AuthActionState["status"];
  message: string;
  className?: string;
}) {
  const Icon = status === "success" ? CheckCircle2 : AlertCircle;
  return <div
    key={`${status}:${message}`}
    className={`action-feedback ${className} ${status}`.trim()}
    data-action-status={status}
    role="status"
    aria-live="polite"
  >
    <Icon aria-hidden="true" />
    <span>{message}</span>
  </div>;
}
