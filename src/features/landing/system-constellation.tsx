"use client";

import Link from "next/link";
import { Apple, BookOpen, Brain, Dumbbell, type LucideIcon } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { Locale } from "@/lib/i18n/config";

type Module = { id: string; href: string; label: string; detail: string; Icon: LucideIcon };
const content: Record<Locale, Module[]> = {
  en: [
    { id: "fuel", href: "/features/nutrition", label: "Fuel", detail: "Make food information useful", Icon: Apple },
    { id: "move", href: "/features/training", label: "Move", detail: "Train with purpose", Icon: Dumbbell },
    { id: "learn", href: "/blog", label: "Learn", detail: "Understand your next step", Icon: BookOpen }
  ],
  mk: [
    { id: "fuel", href: "/features/nutrition", label: "Гориво", detail: "Направи ги информациите за храна корисни", Icon: Apple },
    { id: "move", href: "/features/training", label: "Движење", detail: "Тренирај со цел", Icon: Dumbbell },
    { id: "learn", href: "/blog", label: "Знаење", detail: "Разбери го следниот чекор", Icon: BookOpen }
  ]
};

export function SystemConstellation({ locale }: { locale: Locale }) {
  const modules = content[locale];
  const [active, setActive] = useState<Module | null>(null);
  const ActiveIcon = active?.Icon ?? Brain;
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10;
    event.currentTarget.style.setProperty("--orbit-x", `${x.toFixed(1)}px`);
    event.currentTarget.style.setProperty("--orbit-y", `${y.toFixed(1)}px`);
  };
  const activate = (id: string) => setActive(modules.find((item) => item.id === id) ?? null);

  return <div className="system-orbit" data-active={active?.id ?? "context"} onPointerMove={onPointerMove} onPointerLeave={() => setActive(null)}>
    <div className="orbit-ring orbit-ring-outer" aria-hidden="true" /><div className="orbit-ring orbit-ring-inner" aria-hidden="true" />
    <div className="orbit-core" aria-live="polite"><ActiveIcon aria-hidden="true" /><strong>{active?.label ?? "B"}</strong><span>{active?.detail ?? (locale === "en" ? "Your daily context" : "Твојот дневен контекст")}</span></div>
    {modules.map(({ id, href, label, Icon }) => <Link key={id} className={`orbit-node orbit-${id}`} href={href} onMouseEnter={() => activate(id)} onFocus={() => activate(id)}><Icon aria-hidden="true" />{label}</Link>)}
  </div>;
}
