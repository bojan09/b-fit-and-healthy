"use client";

import type { KeyboardEvent } from "react";
import { getMusclesForView, type MuscleView } from "@/features/anatomy/data";
import type { Locale } from "@/lib/i18n/config";
import { atlasViews } from "@/features/anatomy/atlas-paths";

export function AnatomyFigure({ view, locale, selected, onSelect }: { view: MuscleView; locale: Locale; selected: string; onSelect: (id: string) => void }) {
  const atlas = atlasViews[view];
  const activate = (event: KeyboardEvent<SVGGElement>, id: string) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(id); } };
  return <svg className="anatomy-figure" viewBox="0 0 360 640" role="group" aria-label={view === "front" ? "Front muscle view" : "Back muscle view"}>
    <path className="body-silhouette" d={atlas.silhouette} />
    <g className="body-landmarks" aria-hidden="true">{atlas.landmarks.map((path, index) => <path key={index} d={path} />)}</g>
    {getMusclesForView(view).map((muscle) => <g key={muscle.id} role="button" tabIndex={0} aria-label={muscle.name[locale]} aria-pressed={selected === muscle.id} className="muscle-region" onClick={() => onSelect(muscle.id)} onKeyDown={(event) => activate(event, muscle.id)}>{atlas.muscles[muscle.id].map((path, index) => <path key={index} d={path} />)}</g>)}
  </svg>;
}
