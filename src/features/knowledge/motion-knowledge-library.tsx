"use client";

import type { Locale } from "@/lib/i18n/config";
import {
  KnowledgeLibrary,
  type KnowledgeSummary,
} from "@/features/knowledge/knowledge-library";
import { MotionReveal } from "@/features/motion/motion-reveal";

export function MotionKnowledgeLibrary({
  locale,
  articles,
}: {
  locale: Locale;
  articles: KnowledgeSummary[];
}) {
  return <MotionReveal className="knowledge-library-reveal">
    <KnowledgeLibrary locale={locale} articles={articles} />
  </MotionReveal>;
}
