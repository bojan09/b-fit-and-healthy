"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";

export function LocaleSwitcher() {
  const { locale, messages, setLocale } = useLocale();
  const next = locale === "en" ? "mk" : "en";
  return (
    <Button variant="secondary" onClick={() => setLocale(next)} aria-label={`${messages.language}: ${locale.toUpperCase()}`}>
      <Languages aria-hidden="true" size={17} /> {locale.toUpperCase()}
    </Button>
  );
}
