"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

const copy = {
  en: { rest: "Rest", over: "Rest is over. Ready for the next set.", skip: "Skip rest" },
  mk: { rest: "Одмор", over: "Одморот заврши. Подготвени за следната серија.", skip: "Прескокни одмор" },
} as const;

function format(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

/** Countdown shown after a set is completed. Remount (change `key`) to restart it. */
export function RestTimer({ seconds, locale, onDismiss }: { seconds: number; locale: Locale; onDismiss: () => void }) {
  const t = copy[locale];
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = window.setTimeout(() => setRemaining((value) => value - 1), 1_000);
    return () => window.clearTimeout(timer);
  }, [remaining]);

  return (
    <div className="rest-timer" data-finished={remaining <= 0 || undefined}>
      <span>
        {t.rest} <strong role="timer" aria-live="off">{format(Math.max(remaining, 0))}</strong>
      </span>
      <span className="sr-only" role="status">{remaining <= 0 ? t.over : ""}</span>
      <button type="button" className="icon-action quiet" onClick={onDismiss} aria-label={t.skip}>
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
