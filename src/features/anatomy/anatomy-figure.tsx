"use client";

import type { KeyboardEvent } from "react";
import { getMusclesForView, type MuscleView } from "@/features/anatomy/data";
import type { Locale } from "@/lib/i18n/config";

const shapes: Record<string, string[]> = {
  pectorals:["M130 172 Q180 145 230 172 L220 218 Q180 234 140 218Z"], deltoids:["M122 166 Q102 174 96 210 L120 224 137 177Z","M238 166 Q258 174 264 210 L240 224 223 177Z"],
  biceps:["M101 218 Q89 246 94 282 L113 276 122 226Z","M259 218 Q271 246 266 282 L247 276 238 226Z"], abdominals:["M151 225 L209 225 214 335 Q180 356 146 335Z"], quadriceps:["M139 355 Q119 411 132 493 L170 491 174 360Z","M221 355 Q241 411 228 493 L190 491 186 360Z"], tibialis:["M136 498 L169 498 161 587 139 587Z","M224 498 L191 498 199 587 221 587Z"],
  trapezius:["M137 159 Q180 190 223 159 L215 232 145 232Z"], latissimus:["M133 209 Q111 240 128 328 L165 346 175 227Z","M227 209 Q249 240 232 328 L195 346 185 227Z"], triceps:["M102 214 Q91 250 96 292 L115 281 124 221Z","M258 214 Q269 250 264 292 L245 281 236 221Z"], glutes:["M139 335 Q126 368 143 398 L177 387 177 340Z","M221 335 Q234 368 217 398 L183 387 183 340Z"], hamstrings:["M141 399 Q125 444 136 496 L171 494 176 393Z","M219 399 Q235 444 224 496 L189 494 184 393Z"], calves:["M137 500 Q122 540 141 586 L163 586 170 500Z","M223 500 Q238 540 219 586 L197 586 190 500Z"]
};

export function AnatomyFigure({ view, locale, selected, onSelect }: { view: MuscleView; locale: Locale; selected: string; onSelect: (id: string) => void }) {
  const activate = (event: KeyboardEvent<SVGGElement>, id: string) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(id); } };
  return <svg className="anatomy-figure" viewBox="0 0 360 640" role="group" aria-label={view === "front" ? "Front muscle view" : "Back muscle view"}>
    <path className="body-silhouette" d="M180 24 C153 24 140 45 142 72 C143 93 154 108 165 113 L161 136 C136 140 113 150 94 170 C76 190 71 222 76 259 L88 325 78 365 88 379 101 366 104 321 118 280 128 334 121 391 125 496 133 590 149 619 167 615 170 590 180 507 190 590 193 615 211 619 227 590 235 496 239 391 232 334 242 280 256 321 259 366 272 379 282 365 272 325 284 259 C289 222 284 190 266 170 C247 150 224 140 199 136 L195 113 C206 108 217 93 218 72 C220 45 207 24 180 24Z" />
    <path className="body-detail" d="M161 136 Q180 153 199 136 M128 334 Q180 365 232 334 M180 148 L180 507" />
    {getMusclesForView(view).map((muscle) => <g key={muscle.id} role="button" tabIndex={0} aria-label={muscle.name[locale]} aria-pressed={selected === muscle.id} className="muscle-region" onClick={() => onSelect(muscle.id)} onKeyDown={(event) => activate(event, muscle.id)}>{shapes[muscle.id].map((path, index) => <path key={index} d={path} />)}</g>)}
  </svg>;
}
