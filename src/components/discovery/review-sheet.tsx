"use client";

import {
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from "react";
import { X } from "lucide-react";
import { useOptionalLocale } from "@/components/providers/locale-provider";

const copy = {
  en: { eyebrow: "Review before saving", close: "Close review" },
  mk: { eyebrow: "Прегледај пред зачувување", close: "Затвори преглед" },
} as const;

export function ReviewSheet({
  open,
  title,
  eyebrow,
  onClose,
  children,
  footer,
  returnFocus,
}: {
  open: boolean;
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  returnFocus?: HTMLElement | null;
}) {
  const t = copy[useOptionalLocale()];
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = returnFocus ?? document.activeElement;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.documentElement.classList.add("has-review-sheet");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("has-review-sheet");
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [onClose, open, returnFocus]);

  if (!open) return null;
  return (
    <div className="review-sheet-layer">
      <button
        className="review-sheet-backdrop"
        type="button"
        onClick={onClose}
        aria-label={t.close}
      />
      <section
        className="review-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="review-sheet-header">
          <div>
            <p className="eyebrow">{eyebrow ?? t.eyebrow}</p>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button
            ref={closeRef}
            className="icon-action quiet"
            type="button"
            onClick={onClose}
            aria-label={t.close}
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="review-sheet-body">{children}</div>
        {footer ? <footer className="review-sheet-footer">{footer}</footer> : null}
      </section>
    </div>
  );
}
