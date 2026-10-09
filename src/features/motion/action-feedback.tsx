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
  // The live region stays mounted; only the inner node remounts to replay the CSS pulse/shake.
  return <div role={status === "error" ? "alert" : "status"} aria-live={status === "error" ? "assertive" : "polite"} className="action-feedback-region">
    <div
      key={`${status}:${message}`}
      className={`action-feedback ${className} ${status}`.trim()}
      data-action-status={status}
    >
      <Icon aria-hidden="true" />
      <span>{message}</span>
    </div>
  </div>;
}
