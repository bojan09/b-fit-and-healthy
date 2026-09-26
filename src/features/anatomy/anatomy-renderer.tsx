"use client";

import { AnatomyFigure } from "@/features/anatomy/anatomy-figure";
import type { AnatomyRendererProps } from "@/features/anatomy/anatomy-renderer-types";
import type { MuscleView } from "@/features/anatomy/data";

const views: MuscleView[] = ["front", "back"];

/**
 * CSS 3D turntable: the front and back atlases are the two faces of one card,
 * and switching view rotates the card 180° around the Y axis. The hidden face
 * is inert so keyboard and screen-reader users only meet the visible muscles.
 */
export function AnatomyRenderer({ view, locale, selectedMuscleId, onSelectMuscle }: AnatomyRendererProps) {
  return (
    <div className="anatomy-turntable" data-view={view}>
      <div className="anatomy-card">
        {views.map((face) => (
          <div
            key={face}
            className={`anatomy-face anatomy-face-${face}`}
            aria-hidden={face !== view || undefined}
            inert={face !== view}
          >
            <AnatomyFigure view={face} locale={locale} selected={selectedMuscleId} onSelect={onSelectMuscle} />
          </div>
        ))}
      </div>
      <div className="anatomy-floor" aria-hidden="true" />
    </div>
  );
}
