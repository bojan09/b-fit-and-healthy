/* Accessible SVG anatomy prototype. Data and rendering stay renderer-agnostic. */
const Anatomy = {
  value(pair) { return pair[I18n.lang] || pair.en; },

  record(id) { return AnatomyData.muscles.find((muscle) => muscle.id === id); },

  href(id, view) { return `#/anatomy?muscle=${encodeURIComponent(id)}&view=${view}`; },

  region(id, view, d, label) {
    const selected = Router.params.muscle === id;
    return `<a href="${this.href(id, view)}" class="anatomy-region-link" aria-label="${esc(label)}">
      <path class="anatomy-muscle${selected ? " is-selected" : ""}" data-muscle-id="${esc(id)}" d="${d}">
        <title>${esc(label)}</title>
      </path>
    </a>`;
  },

  renderFigure(view, selectedId) {
    const labels = Object.fromEntries(AnatomyData.muscles.map((m) => [m.id, this.value(m.name)]));
    Router.params.muscle = selectedId || "";
    const r = (id, d) => this.region(id, view, d, labels[id]);
    const front = `
      ${r("deltoids", "M92 90 Q68 91 57 112 Q63 132 82 134 L99 111Z M228 90 Q252 91 263 112 Q257 132 238 134 L221 111Z")}
      ${r("pectorals", "M106 102 Q132 88 156 104 L154 154 Q126 166 101 145Z M214 102 Q188 88 164 104 L166 154 Q194 166 219 145Z")}
      ${r("serratus", "M99 145 Q108 154 119 158 L111 190 Q98 184 91 172Z M221 145 Q212 154 201 158 L209 190 Q222 184 229 172Z")}
      ${r("biceps", "M70 137 Q53 147 49 181 L55 218 Q67 225 78 211 L84 163Z M250 137 Q267 147 271 181 L265 218 Q253 225 242 211 L236 163Z")}
      ${r("forearms", "M51 215 Q41 230 44 277 L55 305 Q65 307 70 293 L72 239Z M269 215 Q279 230 276 277 L265 305 Q255 307 250 293 L248 239Z")}
      ${r("abdominals", "M132 163 Q160 154 188 163 L184 260 Q160 278 136 260Z")}
      ${r("obliques", "M116 168 Q128 164 136 168 L132 259 Q116 250 107 221Z M204 168 Q192 164 184 168 L188 259 Q204 250 213 221Z")}
      ${r("adductors", "M140 280 Q151 270 158 280 L153 385 Q137 375 131 331Z M180 280 Q169 270 162 280 L167 385 Q183 375 189 331Z")}
      ${r("quadriceps", "M112 282 Q132 270 153 283 L150 392 Q134 411 112 391 L103 324Z M208 282 Q188 270 167 283 L170 392 Q186 411 208 391 L217 324Z")}
      ${r("tibialis", "M121 409 Q137 399 147 412 L141 503 Q128 517 119 498Z M199 409 Q183 399 173 412 L179 503 Q192 517 201 498Z")}`;
    const back = `
      ${r("trapezius", "M127 87 Q160 75 193 87 L187 149 Q160 166 133 149Z")}
      ${r("deltoids", "M92 92 Q67 94 58 114 Q66 134 84 134 L102 108Z M228 92 Q253 94 262 114 Q254 134 236 134 L218 108Z")}
      ${r("triceps", "M71 138 Q52 151 50 190 L57 221 Q70 226 80 211 L84 160Z M249 138 Q268 151 270 190 L263 221 Q250 226 240 211 L236 160Z")}
      ${r("forearms", "M52 218 Q42 235 45 278 L56 306 Q67 305 71 290 L72 241Z M268 218 Q278 235 275 278 L264 306 Q253 305 249 290 L248 241Z")}
      ${r("latissimus", "M105 133 Q129 143 155 151 L153 237 Q127 229 110 205 L94 165Z M215 133 Q191 143 165 151 L167 237 Q193 229 210 205 L226 165Z")}
      ${r("spinal-erectors", "M151 151 Q158 144 160 151 L158 266 Q146 250 145 213Z M169 151 Q162 144 160 151 L162 266 Q174 250 175 213Z")}
      ${r("glutes", "M111 265 Q135 252 157 271 L153 326 Q130 343 106 323Z M209 265 Q185 252 163 271 L167 326 Q190 343 214 323Z")}
      ${r("hamstrings", "M111 330 Q133 324 153 337 L149 414 Q130 429 111 411 L103 361Z M209 330 Q187 324 167 337 L171 414 Q190 429 209 411 L217 361Z")}
      ${r("calves", "M117 421 Q136 411 148 427 L142 509 Q126 523 116 499Z M203 421 Q184 411 172 427 L178 509 Q194 523 204 499Z")}`;

    return `<svg class="anatomy-figure" viewBox="0 0 320 560" role="img" aria-labelledby="anatomy-figure-title anatomy-figure-desc">
      <title id="anatomy-figure-title">${esc(view === "front" ? "Front muscle view" : "Back muscle view")}</title>
      <desc id="anatomy-figure-desc">${esc("Select a highlighted muscle region or use the matching text list.")}</desc>
      <g class="anatomy-silhouette" aria-hidden="true">
        <ellipse cx="160" cy="48" rx="31" ry="39"/>
        <path d="M145 80 L142 93 Q112 97 97 118 L92 153 Q104 193 116 230 L109 268 Q96 283 101 334 L108 401 Q111 416 119 418 L114 506 Q116 528 134 529 L151 516 L158 424 L160 351 L162 424 L169 516 L186 529 Q204 528 206 506 L201 418 Q209 416 212 401 L219 334 Q224 283 211 268 L204 230 Q216 193 228 153 L223 118 Q208 97 178 93 L175 80 Q160 90 145 80Z"/>
        <path d="M98 112 Q67 119 53 151 Q43 184 48 220 L41 275 Q43 309 57 318 Q72 312 75 291 L79 236 Q91 211 92 177 L112 139Z"/>
        <path d="M222 112 Q253 119 267 151 Q277 184 272 220 L279 275 Q277 309 263 318 Q248 312 245 291 L241 236 Q229 211 228 177 L208 139Z"/>
        <path d="M117 523 Q105 534 99 548 Q119 557 143 549 L145 526Z M203 523 Q215 534 221 548 Q201 557 177 549 L175 526Z"/>
      </g>
      <g class="anatomy-regions">${view === "back" ? back : front}</g>
      <path class="anatomy-midline" d="M160 94 L160 518" aria-hidden="true"/>
    </svg>`;
  },

  renderMuscleList(records, view, selectedId, query = "") {
    const normalized = query.trim().toLowerCase();
    const visible = records.filter((muscle) => muscle.views.includes(view)).filter((muscle) => {
      const haystack = `${muscle.name.en} ${muscle.name.mk} ${muscle.anatomicalName}`.toLowerCase();
      return !normalized || haystack.includes(normalized);
    });
    if (!visible.length) return `<p class="anatomy-empty text-muted">${esc(I18n.lang === "mk" ? "Нема мускули за ова пребарување." : "No muscles match this search.")}</p>`;
    return `<ul class="anatomy-muscle-list">${visible.map((muscle) => `
      <li><a class="anatomy-list-button${selectedId === muscle.id ? " is-selected" : ""}"
        href="${this.href(muscle.id, view)}" ${selectedId === muscle.id ? 'aria-current="true"' : ""}>
        <span><strong>${esc(this.value(muscle.name))}</strong><small>${esc(muscle.anatomicalName)}</small></span>
        ${icon("chevronRight", "icon icon-sm")}
      </a></li>`).join("")}</ul>`;
  },

  renderDetail(record) {
    if (!record) return `<div class="anatomy-detail-empty flow"><span class="anatomy-detail-icon">${icon("target")}</span><h2>${esc(I18n.lang === "mk" ? "Избери мускул" : "Select a muscle")}</h2><p class="text-muted">${esc(I18n.lang === "mk" ? "Избери област на телото или име од листата за да дознаеш повеќе." : "Choose a body region or a name from the list to learn what it does and how to train it.")}</p></div>`;
    const section = (title, value) => `<section class="flow anatomy-copy-section" style="--flow-space:var(--space-2)"><h3>${esc(title)}</h3><p>${esc(this.value(value))}</p></section>`;
    return `<article class="anatomy-detail flow" aria-labelledby="muscle-title">
      <div class="flow" style="--flow-space:var(--space-1)"><p class="eyebrow">${esc(I18n.lang === "mk" ? "Избран мускул" : "Selected muscle")}</p><h2 id="muscle-title">${esc(this.value(record.name))}</h2><p class="anatomical-name">${esc(record.anatomicalName)}</p></div>
      <p class="anatomy-overview">${esc(this.value(record.overview))}</p>
      ${section(I18n.lang === "mk" ? "Што прави" : "What it does", record.function)}
      ${section(I18n.lang === "mk" ? "Зошто е важен" : "Why it matters", record.benefits)}
      ${section(I18n.lang === "mk" ? "Како да го тренираш" : "How to train it", record.training)}
      ${section(I18n.lang === "mk" ? "Честа грешка" : "Common mistake", record.commonMistake)}
      <section class="flow anatomy-copy-section" style="--flow-space:var(--space-3)"><h3>${esc(I18n.lang === "mk" ? "Вежби" : "Exercises")}</h3><div class="anatomy-exercises">${record.exerciseIds.map((id, index) => { const exercise = AnatomyData.exercises[id]; return `<a href="${exercise.href}" class="anatomy-exercise"><span class="num">${String(index + 1).padStart(2, "0")}</span><strong>${esc(this.value(exercise.name))}</strong>${icon("arrowRight", "icon icon-sm")}</a>`; }).join("")}</div></section>
    </article>`;
  },

  filter(query) {
    const list = document.getElementById("anatomy-list");
    if (!list) return;
    const view = Router.params.view === "back" ? "back" : "front";
    list.innerHTML = this.renderMuscleList(AnatomyData.muscles, view, Router.params.muscle, query);
  },

  screen() {
    const view = Router.params.view === "back" ? "back" : "front";
    const candidate = this.record(Router.params.muscle);
    const selected = candidate && candidate.views.includes(view) ? candidate : null;
    const selectedId = selected?.id || "";
    const frontLabel = I18n.lang === "mk" ? "Напред" : "Front";
    const backLabel = I18n.lang === "mk" ? "Назад" : "Back";
    return {
      chrome: "app",
      section: "train",
      title: t("nav.anatomy"),
      body: `<div class="page-stack anatomy-page">
        <header class="page-head"><p class="eyebrow">${esc(t("nav.train"))}</p><h1>${esc(t("nav.anatomy"))}</h1><p>${esc(I18n.lang === "mk" ? "Истражи што прави секоја мускулна група и како да ја тренираш." : "Explore what each muscle group does, why it matters and how to train it.")}</p></header>
        <section class="card anatomy-explorer">
          <div class="anatomy-map-panel section-stack">
            <div class="anatomy-controls">
              <div class="segmented" aria-label="${esc(I18n.lang === "mk" ? "Поглед на телото" : "Body view")}">
                <a class="seg-btn" href="#/anatomy?view=front${selectedId ? `&muscle=${selectedId}` : ""}" aria-current="${view === "front"}">${esc(frontLabel)}</a>
                <a class="seg-btn" href="#/anatomy?view=back${selectedId ? `&muscle=${selectedId}` : ""}" aria-current="${view === "back"}">${esc(backLabel)}</a>
              </div>
              <div class="field anatomy-search"><label class="visually-hidden" for="anatomy-search">${esc(t("common.search"))}</label><input class="input" id="anatomy-search" type="search" data-action="anatomy-search" placeholder="${esc(I18n.lang === "mk" ? "Барај мускул…" : "Search muscles…")}"></div>
            </div>
            <p class="anatomy-prompt">${esc(I18n.lang === "mk" ? "Избери мускул на фигурата или од листата." : "Select any muscle on the figure or from the list.")}</p>
            <div class="anatomy-map-layout">${this.renderFigure(view, selectedId)}<div id="anatomy-list" class="anatomy-list-panel">${this.renderMuscleList(AnatomyData.muscles, view, selectedId)}</div></div>
          </div>
          <div class="anatomy-detail-panel"><p class="visually-hidden" aria-live="polite">${selected ? esc(this.value(selected.name)) : ""}</p>${this.renderDetail(selected)}</div>
        </section>
      </div>`
    };
  }
};
