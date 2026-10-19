"use client";

import { useEffect, useState, type ButtonHTMLAttributes } from "react";
import { useOptionalLocale } from "@/components/providers/locale-provider";

const confirmLabel = { en: "Confirm", mk: "Потврди" } as const;
const CONFIRM_WINDOW_MS = 5_000;

/**
 * Submit button for destructive form actions. The first press arms it and shows
 * the warning inline; a second press within a few seconds submits. This replaces
 * window.confirm, which is unstyled, untranslatable and awkward on mobile.
 */
export function ConfirmSubmitButton({
  message,
  onClick,
  onBlur,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { message: string }) {
  const locale = useOptionalLocale();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = window.setTimeout(() => setArmed(false), CONFIRM_WINDOW_MS);
    return () => window.clearTimeout(timer);
  }, [armed]);

  return (
    <>
      <button
        type="submit"
        {...props}
        data-armed={armed || undefined}
        onClick={(event) => {
          if (!armed) {
            event.preventDefault();
            setArmed(true);
          }
          onClick?.(event);
        }}
        onBlur={(event) => {
          setArmed(false);
          onBlur?.(event);
        }}
      >
        {armed ? confirmLabel[locale] : children}
      </button>
      <span className="confirm-hint" role="status" aria-live="polite">
        {armed ? message : ""}
      </span>
    </>
  );
}
