"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw, Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { AnatomyRenderer } from "@/features/anatomy/anatomy-renderer";
import { getAnatomyRegions, getMuscle, getMusclesForView, regionLabel, searchMuscles, type MuscleView } from "@/features/anatomy/data";
import type { Locale } from "@/lib/i18n/config";

export function AnatomyExplorer({ locale }: { locale: Locale }) {
  const [view, setView] = useState<MuscleView>("front");
  const [selected, setSelected] = useState("pectorals");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const stageRef = useRef<HTMLDivElement>(null);

  const muscle = getMuscle(selected) ?? getMusclesForView(view)[0];
  const results = useMemo(() => searchMuscles(query, region), [query, region]);
  const regions = getAnatomyRegions();
  const changeView = (next: MuscleView) => {
    setView(next);
    if (getMuscle(selected)?.view !== next) setSelected(getMusclesForView(next)[0].id);
  };
  const choose = (id: string) => {
    const next = getMuscle(id);
    if (!next) return;
    setView(next.view);
    setSelected(id);
    const stage = stageRef.current;
    if (stage) {
      const bounds = stage.getBoundingClientRect();
      if (bounds.top < 0 || bounds.bottom > window.innerHeight) stage.scrollIntoView({ block: "nearest", behavior: "auto" });
    }
  };
  const clear = () => {
    setQuery("");
    setRegion("all");
  };

  return (
    <div className="anatomy-encyclopedia">

      <div className="anatomy-explorer">
        <div ref={stageRef} className="anatomy-stage">
          <div className="view-switcher" role="group" aria-label={locale === "en" ? "Body view" : "Поглед на телото"}>
            <button aria-pressed={view === "front"} onClick={() => changeView("front")}>{locale === "en" ? "Front" : "Напред"}</button>
            <button aria-pressed={view === "back"} onClick={() => changeView("back")}>{locale === "en" ? "Back" : "Назад"}</button>
          </div>
          <div className="anatomy-renderer-shell" data-anatomy-renderer>
            <AnatomyRenderer view={view} locale={locale} selectedMuscleId={selected} onSelectMuscle={setSelected} />
          </div>
          <p className="stage-hint"><RotateCcw aria-hidden="true" size={16} />{locale === "en" ? "Choose a highlighted muscle or use the directory." : "Избери означен мускул или користи го именикот."}</p>
        </div>
        <div className="anatomy-panel" data-anatomy-panel aria-live="polite" key={muscle.id}>
          <p className="eyebrow">{regionLabel(muscle.region, locale)}</p>
          <h2>{muscle.name[locale]}</h2>
          <p className="scientific-name">{muscle.scientific}</p>
          <p className="anatomy-summary">{muscle.summary[locale]}</p>
          <dl>
            <div><dt>{locale === "en" ? "Where it is" : "Каде се наоѓа"}</dt><dd>{muscle.location[locale]}</dd></div>
            <div><dt>{locale === "en" ? "What it does" : "Што прави"}</dt><dd>{muscle.function[locale]}</dd></div>
            <div><dt>{locale === "en" ? "Why it matters" : "Зошто е важно"}</dt><dd>{muscle.benefit[locale]}</dd></div>
            <div><dt>{locale === "en" ? "How to train it" : "Како да го тренираш"}</dt><dd>{muscle.training[locale]}</dd></div>
            <div><dt>{locale === "en" ? "Exercises to explore" : "Вежби за истражување"}</dt><dd>{muscle.exercises[locale]}</dd></div>
          </dl>
          <Link className="text-link anatomy-detail-link" href={`/anatomy/${muscle.id}`}>{locale === "en" ? "Open full muscle guide" : "Отвори целосен водич"}<ArrowRight aria-hidden="true" size={18} /></Link>
        </div>
      </div>

      <section className="anatomy-directory" aria-labelledby="muscle-directory">
        <header>
          <div><p className="eyebrow">{locale === "en" ? "Encyclopedia" : "Енциклопедија"}</p><h2 id="muscle-directory">{locale === "en" ? "Muscle directory" : "Именик на мускули"}</h2></div>
          <p>{locale === "en" ? "Select any entry to locate it on the atlas." : "Избери запис за да го лоцираш на атласот."}</p>
        </header>
        <div className="anatomy-tools">
          <label>
            <span>{locale === "en" ? "Search muscles" : "Пребарај мускули"}</span>
            <div><Search aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === "en" ? "Name, region, or scientific name" : "Име, регион или научно име"} /></div>
          </label>
          <label>
            <span>{locale === "en" ? "Body region" : "Регион на телото"}</span>
            <select aria-label={locale === "en" ? "Body region" : "Регион на телото"} value={region} onChange={(event) => setRegion(event.target.value)}>
              <option value="all">{locale === "en" ? "All regions" : "Сите региони"}</option>
              {regions.map((item) => <option value={item} key={item}>{regionLabel(item, locale)}</option>)}
            </select>
          </label>
          <button type="button" className="text-action" onClick={clear}><X aria-hidden="true" />{locale === "en" ? "Clear filters" : "Исчисти филтри"}</button>
          <p aria-live="polite">{results.length} {locale === "en" ? "muscles" : "мускули"}</p>
        </div>
        {results.length ? (
          <div>{results.map((item) => (
            <button type="button" key={item.id} onClick={() => choose(item.id)} aria-pressed={selected === item.id}>
              <span><strong>{item.name[locale]}</strong><small>{item.scientific}</small></span>
              <em>{regionLabel(item.region, locale)}</em>
              <ArrowRight aria-hidden="true" />
            </button>
          ))}</div>
        ) : (
          <div className="anatomy-empty">
            <h3>{locale === "en" ? "No muscles match those filters." : "Нема мускули за овие филтри."}</h3>
            <p>{locale === "en" ? "Try another term or clear the region filter." : "Пробај друг поим или исчисти го филтерот."}</p>
            <button type="button" onClick={clear}>{locale === "en" ? "Clear filters" : "Исчисти филтри"}</button>
          </div>
        )}
      </section>
    </div>
  );
}
