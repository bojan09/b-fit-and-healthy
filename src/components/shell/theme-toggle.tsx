"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";

const order = ["system", "light", "dark"] as const;
const subscribe = () => () => undefined;

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme = "system", setTheme } = useTheme();
  const { messages } = useLocale();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const active = mounted && order.includes(theme as typeof order[number]) ? theme as typeof order[number] : "system";
  const next = order[(order.indexOf(active) + 1) % order.length];
  const Icon = active === "dark" ? Moon : active === "light" ? Sun : Monitor;
  const label = active === "dark" ? messages.dark : active === "light" ? messages.light : messages.system;

  return (
    <Button className={compact ? "header-utility" : undefined} variant="secondary" size="icon" onClick={() => setTheme(next)} aria-label={`${messages.theme}: ${label}`} title={`${messages.theme}: ${label}`}>
      <Icon aria-hidden="true" size={18} />
    </Button>
  );
}
