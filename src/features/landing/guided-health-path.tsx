"use client";

import Link from "next/link";
import {
  Apple,
  ArrowUpRight,
  BookOpen,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";
import { useMotionProfile } from "@/features/motion/use-motion-profile";
import type { Locale } from "@/lib/i18n/config";

type PathStep = {
  id: string;
  href: string;
  label: string;
  detail: string;
  Icon: LucideIcon;
};

const content: Record<Locale, PathStep[]> = {
  en: [
    {
      id: "fuel",
      href: "/features/nutrition",
      label: "Fuel",
      detail: "Make food information useful",
      Icon: Apple,
    },
    {
      id: "move",
      href: "/features/training",
      label: "Move",
      detail: "Train with purpose",
      Icon: Dumbbell,
    },
    {
      id: "learn",
      href: "/blog",
      label: "Learn",
      detail: "Understand your next step",
      Icon: BookOpen,
    },
  ],
  mk: [
    {
      id: "fuel",
      href: "/features/nutrition",
      label: "Гориво",
      detail: "Корисни информации за исхрана",
      Icon: Apple,
    },
    {
      id: "move",
      href: "/features/training",
      label: "Движење",
      detail: "Тренирајте со цел",
      Icon: Dumbbell,
    },
    {
      id: "learn",
      href: "/blog",
      label: "Учење",
      detail: "Разберете го следниот чекор",
      Icon: BookOpen,
    },
  ],
};

export function GuidedHealthPath({ locale }: { locale: Locale }) {
  const motion = useMotionProfile();

  return (
    <nav
      className="guided-health-path"
      aria-label={
        locale === "en" ? "Connected health path" : "Поврзан пат за здравје"
      }
      data-motion={motion}
    >
      <ol>
        {content[locale].map(
          ({ id, href, label, detail, Icon }, index) => (
            <li key={id} className={index === 0 ? "is-next" : undefined}>
              <Link href={href}>
                <span className="path-index">0{index + 1}</span>
                <span className="path-icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="path-copy">
                  <strong>{label}</strong>
                  <small>{detail}</small>
                </span>
                {index === 0 ? (
                  <em>
                    {locale === "en"
                      ? "Next useful step"
                      : "Следен корисен чекор"}
                  </em>
                ) : (
                  <ArrowUpRight aria-hidden="true" className="path-arrow" />
                )}
              </Link>
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}
