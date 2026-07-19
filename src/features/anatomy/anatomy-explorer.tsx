"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useState } from "react";
import { AnatomyFigure } from "@/features/anatomy/anatomy-figure";
import { getMuscle, getMusclesForView, type MuscleView } from "@/features/anatomy/data";
import type { Locale } from "@/lib/i18n/config";

export function AnatomyExplorer({ locale }: { locale: Locale }) {
  const [view, setView] = useState<MuscleView>("front"); const [selected, setSelected] = useState("pectorals");
  const muscle = getMuscle(selected) ?? getMusclesForView(view)[0];
  const changeView = (next: MuscleView) => { setView(next); setSelected(getMusclesForView(next)[0].id); };
  return <div className="anatomy-explorer">
    <div className="anatomy-stage"><div className="view-switcher" role="group" aria-label={locale === "en" ? "Body view" : "Поглед на телото"}><button aria-pressed={view === "front"} onClick={() => changeView("front")}>{locale === "en" ? "Front" : "Напред"}</button><button aria-pressed={view === "back"} onClick={() => changeView("back")}>{locale === "en" ? "Back" : "Назад"}</button></div><AnatomyFigure view={view} locale={locale} selected={selected} onSelect={setSelected} /><p className="stage-hint"><RotateCcw aria-hidden="true" size={16} />{locale === "en" ? "Choose a highlighted muscle or use the list." : "Избери означен мускул или користи ја листата."}</p></div>
    <div className="anatomy-panel"><p className="eyebrow">{muscle.region}</p><h2>{muscle.name[locale]}</h2><p className="scientific-name">{muscle.scientific}</p><p className="anatomy-summary">{muscle.summary[locale]}</p><dl><div><dt>{locale === "en" ? "What it does" : "Што прави"}</dt><dd>{muscle.function[locale]}</dd></div><div><dt>{locale === "en" ? "How to train it" : "Како да го тренираш"}</dt><dd>{muscle.training[locale]}</dd></div></dl><div className="muscle-pills" aria-label={locale === "en" ? "Muscles in this view" : "Мускули во овој поглед"}>{getMusclesForView(view).map((item) => <button key={item.id} onClick={() => setSelected(item.id)} aria-pressed={selected === item.id}>{item.name[locale]}</button>)}</div><Link className="text-link anatomy-detail-link" href={`/anatomy/${muscle.id}`}>{locale === "en" ? "Open full muscle guide" : "Отвори целосен водич"}<ArrowRight aria-hidden="true" size={18} /></Link></div>
  </div>;
}
