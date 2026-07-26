"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";

export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, messages, setLocale } = useLocale();
  const next = locale === "en" ? "mk" : "en";
  return (
    <Button className={compact ? "header-utility" : undefined} variant="secondary" onClick={() => setLocale(next)} aria-label={`${messages.language}: ${locale.toUpperCase()}`}>
      <Languages aria-hidden="true" size={17} /> {locale.toUpperCase()}
    </Button>
  );
}
