/* ==========================================================================
   In-app screens.
   ========================================================================== */

const pct = (v, goal) => Math.round((v / goal) * 100);

const AppScreens = {

  /* ======================================================================
     TODAY — hero focus card + the rhythm timeline + instrument rail
     ====================================================================== */
  today() {
    const h = new Date().getHours();
    const greetKey = h < 11 ? "today.greeting.morning" : h < 18 ? "today.greeting.day" : "today.greeting.evening";

    // Today always reads the real calendar day, whatever the date bar is set to.
    const opts = { date: DateUtil.iso(), scope: "day" };
    const meals = Records.list("meals", opts);
    const totals = Records.totals(opts);
    const tg = Store.targets;
    const d = { ...Store.today, meals, energy: totals.kcal, protein: totals.p, carbs: totals.c, fat: totals.f };
    const loggedSlots = new Set(meals.map((m) => m.slot));

    const mealRow = (slot, timeLabel) => {
      const meal = meals.find((m) => m.slot === slot);
      if (meal) {
        return `<div class="card row">
          <span class="grow">
            <span class="text-xs text-muted">${esc(t("today." + slot))} · <span class="num">${esc(meal.time)}</span></span>
            <span style="display:block;font-weight:600">${esc(L(meal.name))}</span>
          </span>
          <span class="num text-secondary">${I18n.num(meal.kcal)} <span class="text-xs">${esc(t("common.kcal"))}</span></span>
        </div>`;
      }
      return `<button class="card row" style="width:100%;text-align:left" data-action="log-meal" data-slot="${slot}">
        <span class="grow">
          <span class="text-xs text-muted">${esc(t("today." + slot))}</span>
          <span style="display:block;font-weight:600;color:var(--ink-secondary)">${esc(t("today.logMeal"))}</span>
        </span>
        ${icon("plus")}
      </button>`;
    };

    const timeline = [
      { key: "today.tl.morning", time: "07:00 – 11:00", done: loggedSlots.has("breakfast"),
        body: mealRow("breakfast") + `
          <div class="card row">
            <span class="grow">
              <span class="text-xs text-muted">${esc(t("today.water"))}</span>
              <span style="display:block;font-weight:600" class="num">${I18n.num(d.water)} / ${I18n.num(tg.water)} ${esc(t("common.ml"))}</span>
              <span class="bar" style="margin-top:var(--sp-2)">
                <span class="bar-fill" style="width:${Math.min(100, pct(d.water, tg.water))}%;background:var(--data-3)"></span>
              </span>
            </span>
            <button class="btn btn-secondary btn-sm" data-action="add-water">
              ${icon("plus", "icon icon-sm")} ${esc(t("today.waterAdd"))}
            </button>
          </div>` },
      { key: "today.tl.midday", time: "12:00 – 15:00", done: loggedSlots.has("lunch"), body: mealRow("lunch") },
      { key: "today.tl.afternoon", time: "16:00 – 19:00", now: true, done: false,
        body: `<div class="card stack stack-3">
            <div class="row-between">
              <h3 style="font-size:var(--text-base)">${esc(t("today.habits"))}</h3>
              <a class="text-xs" href="#/habits">${esc(t("common.viewAll"))}</a>
            </div>
            <div class="stack">
              ${Store.habits.map((hb) => `
                <button class="check-row" role="checkbox" aria-checked="${hb.done}"
                  data-action="toggle-habit" data-id="${hb.id}">
                  <span class="check-box">${icon("check", "icon icon-sm")}</span>
                  <span class="check-label grow">${esc(L(hb.name))}</span>
                  <span class="badge">${icon("flame", "icon icon-sm")}<span class="num">${hb.streak}</span></span>
                </button>`).join("")}
            </div>
          </div>` + mealRow("snack") },
      { key: "today.tl.evening", time: "19:00 – 22:00", done: loggedSlots.has("dinner"), body: mealRow("dinner") }
    ];

    const metric = (label, value, goal, unit, tone = "brand") => `
      <div class="metric-row metric-${tone}">
        <div class="metric-copy"><span>${esc(label)}</span><strong class="num">${esc(value)} / ${esc(goal)} ${esc(unit)}</strong></div>
        <span class="bar" aria-hidden="true"><span class="bar-fill" style="width:${Math.min(100, pct(Number(value.replace?.(/[^0-9.]/g, "") || value), Number(goal.replace?.(/[^0-9.]/g, "") || goal)))}%"></span></span>
      </div>`;

    const aside = `
      <section class="card daily-balance section-stack" aria-labelledby="balance-title">
        <div class="row-between">
          <div class="flow" style="--flow-space:var(--space-1)">
            <p class="eyebrow">${esc(t("today.remaining"))}</p>
            <h2 id="balance-title">${esc(t("today.rings.title"))}</h2>
          </div>
          <span class="badge badge-brand">${icon("flame", "icon icon-sm")} ${esc(t("today.streak", { n: Store.user.streak }))}</span>
        </div>
        <p class="balance-total"><strong class="num">${I18n.num(tg.energy - d.energy)}</strong> ${esc(t("common.kcal"))} ${esc(t("today.remaining").toLowerCase())}</p>
        <div class="balance-metrics section-stack">
          ${metric(t("today.ring.energy"), String(d.energy), String(tg.energy), t("common.kcal"))}
          ${metric(t("today.ring.protein"), String(d.protein), String(tg.protein), t("common.g"), "mineral")}
          ${metric(t("today.ring.move"), String(d.moveMinutes), String(d.moveGoal), t("common.min"), "ochre")}
          ${metric(t("today.water"), String(d.water), String(tg.water), t("common.ml"), "mineral")}
        </div>
      </section>

      <aside class="card coach-panel flow" aria-labelledby="coach-title">
        <span class="coach-icon" aria-hidden="true">${icon("sparkles")}</span>
        <p class="eyebrow">${esc(t("ai.title"))}</p>
        <h2 id="coach-title">${esc(t("ai.suggest1"))}</h2>
        <p class="text-muted">${esc(t("ai.subtitle"))}</p>
        <a class="btn btn-secondary" href="#/assistant">${esc(t("ai.title"))} ${icon("arrowRight", "icon icon-sm")}</a>
      </aside>`;

    return {
      chrome: "app",
      title: t("nav.today"),
      body: `
      <div class="today-grid daily-canvas">
        <div class="page-stack">
          <header class="page-head">
            <h1>${esc(t(greetKey, { name: L(Store.user.name) }))}</h1>
            <p>${esc(t("today.subtitle"))}</p>
          </header>

          <section class="today-hero" aria-labelledby="hero-h">
            <div class="hero-card">
              <p class="hero-eyebrow">${esc(t("today.hero.eyebrow"))}</p>
              <h2 class="hero-title" id="hero-h">${esc(L(Store.program.next.focus))}</h2>
              <p class="hero-meta">${esc(t("today.hero.meta", { min: Store.program.next.minutes, focus: L(Store.program.name) }))}</p>
              <div class="row wrap" style="margin-top:var(--sp-5)">
                <a class="btn btn-primary" href="#/session">${icon("play", "icon icon-sm")} ${esc(t("today.hero.start"))}</a>
                <button class="btn btn-ghost" data-action="proto-only">${esc(t("today.hero.later"))}</button>
              </div>
            </div>
          </section>

          <section class="daily-timeline" aria-labelledby="tl-h">
            <div class="section-head"><h2 id="tl-h">${esc(t("today.timeline"))}</h2></div>
            <ol class="timeline">
              ${timeline.map((item) => `
                <li class="tl-item ${item.done ? "is-done" : ""} ${item.now ? "is-now" : ""}">
                  <span class="tl-dot">${item.done ? icon("check", "icon icon-sm") : ""}</span>
                  <p class="tl-time">${esc(t(item.key))} · <span class="num">${esc(item.time)}</span></p>
                  <div class="tl-body">${item.body}</div>
                </li>`).join("")}
            </ol>
          </section>
        </div>

        <div class="today-aside section-stack">${aside}</div>
      </div>`
    };
  },

  /* ======================================================================
     NUTRITION
     ====================================================================== */
  nutrition() {
    const opts = { date: DateUtil.iso(), scope: "day" };
    const totals = Records.totals(opts);
    const tg = Store.targets;
    const d = { ...Store.today, meals: Records.list("meals", opts),
      energy: totals.kcal, protein: totals.p, carbs: totals.c, fat: totals.f };
    const macros = [
      { label: t("nutrition.protein"), value: d.protein },
      { label: t("nutrition.carbs"), value: d.carbs },
      { label: t("nutrition.fat"), value: d.fat }
    ];
    const week = Store.weekEnergy.map((p) => ({ label: splitLabel(p.label), value: p.value }));
    const logged = Store.weekEnergy.filter((p) => p.value !== null);
    const avg = Math.round(logged.reduce((s, p) => s + p.value, 0) / logged.length);

    const macroRow = (labelKey, val, goal, dataIdx) => `
      <div class="stack stack-2">
        <div class="row-between text-sm">
          <span>${esc(t(labelKey))}</span>
          <span class="num text-muted">${I18n.num(val)} / ${I18n.num(goal)} ${esc(t("common.g"))}</span>
        </div>
        <span class="bar"><span class="bar-fill ${val > goal ? "is-over" : ""}"
          style="width:${Math.min(100, pct(val, goal))}%;background:var(--data-${dataIdx})"></span></span>
      </div>`;

    return {
      chrome: "app",
      title: t("nutrition.title"),
      body: `
      <header class="page-head">
        <h1>${esc(t("nutrition.title"))}</h1>
        <p>${esc(t("nutrition.subtitle"))}</p>
      </header>

      <section class="card nutrition-summary section-stack">
        <div class="row-between">
          <h2 style="font-size:var(--text-base)">${esc(t("nutrition.today"))}</h2>
          <button class="btn btn-primary btn-sm" data-action="add-food">
            ${icon("plus", "icon icon-sm")} ${esc(t("nutrition.addFood"))}
          </button>
        </div>

        <div class="nutrition-overview">
          <div class="nutrition-energy flow" style="--flow-space:var(--space-1)">
            <span class="eyebrow">${esc(t("today.remaining"))}</span>
            <strong class="num">${I18n.num(tg.energy - d.energy)}</strong>
            <span class="text-muted">${esc(t("common.kcal"))}</span>
          </div>
          <div class="grow section-stack">
            ${macroRow("nutrition.protein", d.protein, tg.protein, 1)}
            ${macroRow("nutrition.carbs", d.carbs, tg.carbs, 2)}
            ${macroRow("nutrition.fat", d.fat, tg.fat, 3)}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>${esc(t("nutrition.meals"))}</h2></div>
        ${d.meals.length ? `
          <div class="card card-flush">
            ${d.meals.map((m) => `
              <div class="list-row">
                <span class="avatar" aria-hidden="true">${icon("apple", "icon icon-sm")}</span>
                <span class="grow">
                  <span style="display:block;font-weight:600">${esc(L(m.name))}</span>
                  <span class="text-xs text-muted">${esc(t("today." + m.slot))} · <span class="num">${esc(m.time)}</span></span>
                </span>
                <span class="text-right">
                  <span class="num" style="display:block;font-weight:600">${I18n.num(m.kcal)}</span>
                  <span class="text-xs text-muted num">${m.p}${esc(t("common.g"))} P</span>
                </span>
                <button class="btn-icon" data-action="confirm-delete" data-id="${m.id}"
                  aria-label="${esc(t("common.delete"))}">${icon("trash", "icon icon-sm")}</button>
              </div>`).join("")}
          </div>`
        : emptyState("apple", t("nutrition.empty.title"), t("nutrition.empty.body"),
            `<button class="btn btn-primary" data-action="add-food">${esc(t("nutrition.addFood"))}</button>`)}
      </section>

      <section class="section">
        <div class="section-head">
          <h2>${esc(t("nutrition.weekTrend"))}</h2>
          <span class="text-xs text-muted">${esc(t("nutrition.avgPerDay"))}:
            <span class="num">${I18n.num(avg)}</span> ${esc(t("common.kcal"))}</span>
        </div>
        <div class="card">
          <div class="chart-head">
            <span class="text-sm" style="font-weight:600">${esc(t("nutrition.energy"))}</span>
            ${Charts.legend([
              { color: "var(--data-1)", label: t("nutrition.energy") },
              { color: "var(--warn)", label: t("today.over") },
              { color: "var(--data-neutral)", label: t("habits.missed") }
            ])}
          </div>
          ${barChart(week, { goal: tg.energy, unit: " " + t("common.kcal"), goalLabel: t("common.goal") })}
        </div>
      </section>`
    };
  },

  /* ======================================================================
     RECIPES
     ====================================================================== */
  recipes() {
    const filter = Router.params.tag || "all";
    const filters = [["all", "recipes.filter.all"], ["breakfast", "recipes.filter.breakfast"],
      ["lunch", "recipes.filter.lunch"], ["dinner", "recipes.filter.dinner"],
      ["snack", "recipes.filter.snack"], ["veg", "recipes.filter.vegetarian"]];
    const list = Store.recipes.filter((r) =>
      filter === "all" ? true : filter === "veg" ? r.veg : r.tag === filter);

    return {
      chrome: "app",
      title: t("recipes.title"),
      body: `
      <header class="page-head">
        <h1>${esc(t("recipes.title"))}</h1>
        <p>${esc(t("recipes.subtitle"))}</p>
      </header>

      <div class="chips" role="group" aria-label="${esc(t("common.search"))}">
        ${filters.map(([id, key]) => `
          <button class="chip" aria-pressed="${filter === id}" data-action="filter-recipes" data-id="${id}">
            ${esc(t(key))}
          </button>`).join("")}
      </div>

      <h2 class="visually-hidden">${esc(t("recipes.title"))}</h2>
      <div class="tile-grid" style="margin-top:var(--sp-5)">
        ${list.map((r) => `
          <a class="card card-link card-flush" href="#/recipe?id=${r.id}">
            <div class="tile-media">${icon("apple", "icon icon-lg")}</div>
            <div class="tile-body">
              <h3 class="tile-title">${esc(L(r.title))}</h3>
              <div class="tile-meta">
                <span class="row" style="gap:4px">${icon("clock", "icon icon-sm")}<span class="num">${r.min}</span> ${esc(t("common.min"))}</span>
                <span class="row" style="gap:4px">${icon("flame", "icon icon-sm")}<span class="num">${I18n.num(r.kcal)}</span></span>
                <span class="badge badge-brand">${r.p}${esc(t("common.g"))} P</span>
              </div>
            </div>
          </a>`).join("")}
      </div>
      ${list.length === 0 ? emptyState("search", t("nutrition.empty.title"), t("nutrition.empty.body")) : ""}`
    };
  },

  recipe() {
    const r = Store.recipes.find((x) => x.id === Router.params.id) || Store.recipes[0];
    const saved = Store.state.savedRecipes.has(r.id);
    return {
      chrome: "app",
      title: L(r.title),
      back: "#/recipes",
      body: `
      <article class="article stack stack-6">
        <header class="stack stack-3">
          <div class="tile-media" style="border-radius:var(--radius-md);aspect-ratio:16/7">${icon("apple", "icon icon-lg")}</div>
          <h1>${esc(L(r.title))}</h1>
          <div class="row wrap text-sm text-muted">
            <span class="row" style="gap:4px">${icon("clock", "icon icon-sm")}${esc(t("recipes.time", { n: r.min }))}</span>
            <span class="row" style="gap:4px">${icon("user", "icon icon-sm")}${esc(t("recipes.servings", { n: r.servings }))}</span>
          </div>
          <div class="row">
            <button class="btn btn-primary" data-action="add-recipe" data-id="${r.id}">
              ${icon("plus", "icon icon-sm")} ${esc(t("recipes.addToDay"))}
            </button>
            <button class="btn btn-secondary" data-action="save-recipe" data-id="${r.id}" aria-pressed="${saved}">
              ${icon("bookmark", "icon icon-sm")} ${esc(saved ? t("recipes.saved") : t("recipes.save"))}
            </button>
          </div>
        </header>

        <div class="card">
          <h2 class="card-title" style="margin-bottom:var(--sp-3);font-size:var(--text-base)">${esc(t("recipes.perServing"))}</h2>
          <div class="stat-grid">
            ${[[t("nutrition.energy"), I18n.num(r.kcal), t("common.kcal")],
               [t("nutrition.protein"), r.p, t("common.g")],
               [t("nutrition.carbs"), r.c, t("common.g")],
               [t("nutrition.fat"), r.f, t("common.g")]].map(([lab, val, unit]) => `
              <div class="stat">
                <p class="stat-label">${esc(lab)}</p>
                <p class="stat-value num">${esc(val)} <span class="stat-unit">${esc(unit)}</span></p>
              </div>`).join("")}
          </div>
        </div>

        <section>
          <h2 style="margin-bottom:var(--sp-3)">${esc(t("recipes.ingredients"))}</h2>
          <ul class="card stack stack-2">
            ${L(r.ingredients).map((i) => `<li class="row">${icon("check", "icon icon-sm")}<span>${esc(i)}</span></li>`).join("")}
          </ul>
        </section>

        <section>
          <h2 style="margin-bottom:var(--sp-3)">${esc(t("recipes.steps"))}</h2>
          <ol class="stack stack-3">
            ${L(r.steps).map((s, i) => `
              <li class="card row" style="align-items:flex-start">
                <span class="avatar num" style="width:28px;height:28px;font-size:var(--text-sm)">${i + 1}</span>
                <span class="grow">${esc(s)}</span>
              </li>`).join("")}
          </ol>
        </section>
      </article>`
    };
  },

  /* ======================================================================
     TRAIN
     ====================================================================== */
  train() {
    const p = Store.program;
    const coverageIds = {
      "muscle.quads": "quadriceps", "muscle.hamstrings": "hamstrings",
      "muscle.rearDelt": "deltoids", "muscle.serratus": "serratus",
      "muscle.core": "abdominals"
    };
    return {
      chrome: "app",
      title: t("train.title"),
      body: `
      <header class="page-head">
        <h1>${esc(t("train.title"))}</h1>
        <p>${esc(t("train.subtitle"))}</p>
      </header>

      <section class="card program-focus section-stack">
        <div class="row-between">
          <div>
            <p class="eyebrow">${esc(t("train.currentProgram"))}</p>
            <h2 style="font-size:var(--text-lg);margin-top:var(--sp-1)">${esc(L(p.name))}</h2>
          </div>
          <span class="badge badge-brand num">${esc(t("train.week", { n: p.week }))} / ${p.totalWeeks}</span>
        </div>
        <span class="bar"><span class="bar-fill" style="width:${(p.week / p.totalWeeks) * 100}%"></span></span>

        <hr class="divider">

        <div class="row-between">
          <div>
            <p class="text-xs text-muted">${esc(t("train.nextSession"))}</p>
            <p style="font-weight:600">${esc(L(p.next.focus))}</p>
            <p class="text-xs text-muted num">${p.next.exercises.length} ${esc(t("train.exercise").toLowerCase())} · ${p.next.minutes} ${esc(t("common.min"))}</p>
          </div>
          <a class="btn btn-primary" href="#/session">${icon("play", "icon icon-sm")} ${esc(t("train.startSession"))}</a>
        </div>
      </section>

      <section class="section coverage-anatomy-link" aria-labelledby="cov-h">
        <div class="section-head">
          <h2 id="cov-h">${esc(t("coverage.title"))}</h2>
          <span class="text-xs text-muted">${esc(t("coverage.subtitle"))}</span>
        </div>
        <div class="card training-coverage">
          ${AnatomyPreview.render()}
          <div class="coverage-list section-stack">
            ${Store.coverage.map((item) => `<a href="#/anatomy?muscle=${encodeURIComponent(coverageIds[item.key] || "pectorals")}&view=${item.key === "muscle.hamstrings" || item.key === "muscle.rearDelt" ? "back" : "front"}" class="metric-row">
              <span>${esc(t(item.key))}</span><strong class="num">${esc(t("coverage.sets", { n: item.sets }))}</strong>
            </a>`).join("")}
          </div>
          <p class="text-xs" style="color:var(--invert-muted);margin-bottom:var(--sp-3)">
            ${esc(t("coverage.session"))}
          </p>
          <div class="stack stack-2">
            ${p.next.exercises.map((ex) => `
              <div class="row-between text-sm">
                <span style="font-weight:600">${esc(L(ex.name))}</span>
                <span class="num" style="color:var(--invert-muted)">
                  ${esc(t("coverage.sets", { n: ex.sets }))}
                </span>
              </div>`).join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <h2>${esc(t("train.thisWeek"))}</h2>
          <a class="text-xs" href="#/exercises">${esc(t("exercises.title"))} →</a>
        </div>
        <div class="stat-grid training-summary">
          <div class="stat">
            <p class="stat-label">${esc(t("train.sessions"))}</p>
            <p class="stat-value num">3</p>
            <p class="stat-delta up">${icon("arrowUp", "icon icon-sm")} +1</p>
          </div>
          <div class="stat">
            <p class="stat-label">${esc(t("train.volume"))}</p>
            <p class="stat-value num">11 400 <span class="stat-unit">${esc(t("common.kg"))}</span></p>
            <p class="stat-delta up">${icon("arrowUp", "icon icon-sm")} +4.6%</p>
          </div>
          <div class="stat">
            <p class="stat-label">${esc(t("common.min"))}</p>
            <p class="stat-value num">121</p>
            <p class="stat-delta flat">${icon("minus", "icon icon-sm")} 0%</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>${esc(t("train.volume"))}</h2></div>
        <div class="card">${lineChart(Store.volumeTrend, { unit: " " + t("common.kg") })}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2>${esc(t("train.history"))}</h2></div>
        <div class="card card-flush">
          ${Store.sessions.map((s) => `
            <div class="list-row">
              <span class="avatar" aria-hidden="true">${icon("dumbbell", "icon icon-sm")}</span>
              <span class="grow">
                <span style="display:block;font-weight:600">${esc(L(s.name))}</span>
                <span class="text-xs text-muted">${esc(I18n.date(s.date, { day: "numeric", month: "short" }))}</span>
              </span>
              <span class="text-xs text-muted num">${I18n.num(s.volume)} ${esc(t("common.kg"))} · ${s.min} ${esc(t("common.min"))}</span>
            </div>`).join("")}
        </div>
      </section>`
    };
  },

  session() {
    const p = Store.program.next;
    return {
      chrome: "app",
      title: L(p.focus),
      back: "#/train",
      body: `
      <header class="page-head">
        <p class="eyebrow">${esc(t("train.week", { n: Store.program.week }))} · ${esc(t("train.day", { n: Store.program.day }))}</p>
        <h1>${esc(L(p.focus))}</h1>
        <p>${esc(t("today.hero.meta", { min: p.minutes, focus: L(Store.program.name) }))}</p>
      </header>

      <div class="stack stack-4">
        ${p.exercises.map((ex, i) => `
          <section class="card stack stack-3">
            <div class="row-between">
              <h2 style="font-size:var(--text-base)">${esc(L(ex.name))}</h2>
              <a class="btn-icon" href="#/exercise?id=x${i + 1}" aria-label="${esc(t("exercises.technique"))}">
                ${icon("info", "icon icon-sm")}
              </a>
            </div>
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>${esc(t("train.sets"))}</th>
                    <th class="num">${esc(t("train.weight"))}</th>
                    <th class="num">${esc(t("train.reps"))}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  ${Array.from({ length: ex.sets }, (_, s) => `
                    <tr>
                      <td class="num">${s + 1}</td>
                      <td class="num">${ex.weight ? I18n.num(ex.weight, 1) + " " + t("common.kg") : "—"}</td>
                      <td class="num">${esc(ex.reps)}</td>
                      <td style="text-align:right">
                        <button class="btn btn-secondary btn-sm" data-action="log-set">
                          ${icon("check", "icon icon-sm")} ${esc(t("train.logSet"))}
                        </button>
                      </td>
                    </tr>`).join("")}
                </tbody>
              </table>
            </div>
          </section>`).join("")}
      </div>

      <div style="margin-top:var(--sp-6)">
        <button class="btn btn-accent btn-block btn-lg" data-action="finish-session">
          ${icon("check")} ${esc(t("train.finish"))}
        </button>
      </div>`
    };
  },

  /* ======================================================================
     EXERCISES
     ====================================================================== */
  exercises() {
    const muscle = Router.params.muscle || "all";
    const groups = ["all", "legs", "chest", "back", "shoulders", "core"];
    const labels = {
      all: t("common.all"), legs: I18n.lang === "mk" ? "Нозе" : "Legs",
      chest: I18n.lang === "mk" ? "Гради" : "Chest", back: I18n.lang === "mk" ? "Грб" : "Back",
      shoulders: I18n.lang === "mk" ? "Рамења" : "Shoulders", core: I18n.lang === "mk" ? "Јадро" : "Core"
    };
    const list = Store.exercises.filter((x) => muscle === "all" || x.muscle === muscle);

    return {
      chrome: "app",
      title: t("exercises.title"),
      body: `
      <header class="page-head">
        <h1>${esc(t("exercises.title"))}</h1>
        <p>${esc(t("exercises.subtitle"))}</p>
      </header>

      <div class="field" style="margin-bottom:var(--sp-4)">
        <label class="visually-hidden" for="ex-search">${esc(t("common.search"))}</label>
        <input class="input" id="ex-search" type="search" placeholder="${esc(t("common.searchPlaceholder"))}"
          data-action="proto-only">
      </div>

      <div class="chips" role="group" aria-label="${esc(t("exercises.filter.muscle"))}">
        ${groups.map((g) => `
          <button class="chip" aria-pressed="${muscle === g}" data-action="filter-muscle" data-id="${g}">
            ${esc(labels[g])}
          </button>`).join("")}
      </div>

      <div class="card card-flush" style="margin-top:var(--sp-5)">
        ${list.map((x) => `
          <a class="list-row" href="#/exercise?id=${x.id}">
            <span class="avatar" aria-hidden="true">${icon("dumbbell", "icon icon-sm")}</span>
            <span class="grow">
              <span style="display:block;font-weight:600">${esc(L(x.name))}</span>
              <span class="text-xs text-muted">${esc(L(x.primary))}</span>
            </span>
            ${icon("chevronRight", "icon icon-sm")}
          </a>`).join("")}
      </div>`
    };
  },

  exercise() {
    const x = Store.exercises.find((e) => e.id === Router.params.id) || Store.exercises[0];
    return {
      chrome: "app",
      title: L(x.name),
      back: "#/exercises",
      body: `
      <article class="article stack stack-6">
        <header class="stack stack-3">
          <div class="tile-media" style="border-radius:var(--radius-md);aspect-ratio:16/8">${icon("dumbbell", "icon icon-lg")}</div>
          <h1>${esc(L(x.name))}</h1>
          <div class="row wrap">
            <span class="badge badge-brand">${esc(L(x.primary))}</span>
            <span class="badge">${esc(L(x.secondary))}</span>
          </div>
          <button class="btn btn-primary" data-action="proto-only">
            ${icon("plus", "icon icon-sm")} ${esc(t("exercises.addToWorkout"))}
          </button>
        </header>

        <section class="card">
          <h2 style="font-size:var(--text-base);margin-bottom:var(--sp-3)">${esc(t("exercises.technique"))}</h2>
          <ol class="stack stack-3">
            ${L(x.technique).map((s, i) => `
              <li class="row" style="align-items:flex-start">
                <span class="avatar num" style="width:26px;height:26px;font-size:var(--text-xs)">${i + 1}</span>
                <span class="grow text-secondary">${esc(s)}</span>
              </li>`).join("")}
          </ol>
        </section>

        <section class="notice notice-warn">
          ${icon("alert")}
          <div>
            <p style="font-weight:600;margin-bottom:var(--sp-2)">${esc(t("exercises.mistakes"))}</p>
            <ul class="stack stack-1">
              ${L(x.mistakes).map((m) => `<li>• ${esc(m)}</li>`).join("")}
            </ul>
          </div>
        </section>

        <section>
          <h2 style="margin-bottom:var(--sp-3);font-size:var(--text-base)">${esc(t("exercises.alternatives"))}</h2>
          <div class="row wrap">
            ${L(x.alts).map((a) => `<span class="badge badge-info">${esc(a)}</span>`).join("")}
          </div>
        </section>
      </article>`
    };
  },

  /* ======================================================================
     PROGRESS / HABITS
     ====================================================================== */
  progress() {
    const w = Store.weightTrend;
    const delta = (w.at(-1).value - w[0].value).toFixed(1);
    return {
      chrome: "app",
      title: t("progress.title"),
      body: `
      <header class="page-head">
        <h1>${esc(t("progress.title"))}</h1>
        <p>${esc(t("progress.subtitle"))}</p>
      </header>

      <div class="stat-grid" style="margin-bottom:var(--sp-6)">
        <div class="stat">
          <p class="stat-label">${esc(t("progress.weight"))}</p>
          <p class="stat-value num">${I18n.num(w.at(-1).value, 1)} <span class="stat-unit">${esc(t("common.kg"))}</span></p>
          <p class="stat-delta down">${icon("arrowDown", "icon icon-sm")} <span class="num">${delta}</span> ${esc(t("common.kg"))}</p>
        </div>
        <div class="stat">
          <p class="stat-label">${esc(t("progress.consistency"))}</p>
          <p class="stat-value num">86<span class="stat-unit">%</span></p>
          <p class="stat-delta up">${icon("arrowUp", "icon icon-sm")} +7%</p>
        </div>
        <div class="stat">
          <p class="stat-label">${esc(t("train.sessions"))}</p>
          <p class="stat-value num">${Store.user.stats.workouts}</p>
          <p class="stat-delta flat">${esc(t("common.month"))}</p>
        </div>
      </div>

      <section class="card">
        <div class="card-head">
          <h2 class="card-title" style="font-size:var(--text-base)">${esc(t("progress.weight"))}</h2>
          <button class="btn btn-secondary btn-sm" data-action="add-measurement">
            ${icon("plus", "icon icon-sm")} ${esc(t("progress.addEntry"))}
          </button>
        </div>
        ${lineChart(w, { unit: " " + t("common.kg"), digits: 1 })}
      </section>

      <section class="section">
        <div class="section-head"><h2>${esc(t("progress.consistency"))}</h2></div>
        <div class="card stack stack-4">
          ${Store.habits.map((h) => `
            <div class="stack stack-2">
              <div class="row-between">
                <span class="text-sm" style="font-weight:600">${esc(L(h.name))}</span>
                <span class="badge">${icon("flame", "icon icon-sm")}<span class="num">${h.streak}</span></span>
              </div>
              ${weekDots(h.week)}
            </div>`).join("")}
        </div>
      </section>`
    };
  },

  habits() {
    return {
      chrome: "app",
      title: t("habits.title"),
      body: `
      <header class="page-head">
        <h1>${esc(t("habits.title"))}</h1>
        <p>${esc(t("habits.subtitle"))}</p>
      </header>

      <div class="stack stack-4">
        ${Store.habits.map((h) => `
          <section class="card stack stack-3">
            <div class="row">
              <button class="check-row" style="padding:0;min-height:auto;flex:1" role="checkbox"
                aria-checked="${h.done}" data-action="toggle-habit" data-id="${h.id}">
                <span class="check-box">${icon("check", "icon icon-sm")}</span>
                <span class="grow">
                  <span class="check-label" style="display:block;font-weight:600">${esc(L(h.name))}</span>
                  <span class="text-xs text-muted">${esc(t("habits.streak"))}:
                    <span class="num">${h.streak}</span></span>
                </span>
              </button>
              <span style="color:var(--brand)">${icon(h.icon)}</span>
            </div>
            ${weekDots(h.week)}
          </section>`).join("")}
      </div>

      <button class="btn btn-secondary btn-block" style="margin-top:var(--sp-5)" data-action="proto-only">
        ${icon("plus", "icon icon-sm")} ${esc(t("habits.addHabit"))}
      </button>`
    };
  },

  /* ======================================================================
     LEARN
     ====================================================================== */
  learn() {
    const cat = Router.params.cat || "all";
    const cats = ["all", "nutrition", "training", "sleep", "recovery", "habits", "anatomy"];
    const list = Store.articles.filter((a) => cat === "all" || a.cat === cat);
    const featured = Store.articles.find((a) => a.featured);

    return {
      chrome: "app",
      title: t("learn.title"),
      body: `
      <header class="page-head">
        <h1>${esc(t("learn.title"))}</h1>
        <p>${esc(t("learn.subtitle"))}</p>
      </header>

      <a class="card card-link stack stack-3" href="#/article?id=${featured.id}" style="margin-bottom:var(--sp-6)">
        <span class="badge badge-accent">${esc(t("learn.featured"))}</span>
        <h2 style="font-size:var(--text-xl)">${esc(L(featured.title))}</h2>
        <p class="text-secondary">${esc(L(featured.excerpt))}</p>
        <span class="text-xs text-muted">${esc(t("learn.readTime", { n: featured.read }))}</span>
      </a>

      <div class="chips" role="group" aria-label="${esc(t("learn.categories"))}">
        ${cats.map((c) => `
          <button class="chip" aria-pressed="${cat === c}" data-action="filter-cat" data-id="${c}">
            ${esc(c === "all" ? t("common.all") : t("learn.cat." + c))}
          </button>`).join("")}
      </div>

      <div class="tile-grid" style="margin-top:var(--sp-5)">
        ${list.map((a) => `
          <a class="card card-link stack stack-2" href="#/article?id=${a.id}">
            <span class="badge">${esc(t("learn.cat." + a.cat))}</span>
            <h3 class="tile-title" style="font-size:var(--text-base)">${esc(L(a.title))}</h3>
            <p class="text-sm text-muted">${esc(L(a.excerpt))}</p>
            <span class="text-xs text-muted num">${esc(t("learn.readTime", { n: a.read }))}</span>
          </a>`).join("")}
      </div>`
    };
  },

  article() {
    const a = Store.articles.find((x) => x.id === Router.params.id) || Store.articles[0];
    const saved = Store.state.bookmarks.has(a.id);
    const related = Store.articles.filter((x) => x.id !== a.id).slice(0, 2);

    return {
      chrome: "app",
      title: L(a.title),
      back: "#/learn",
      body: `
      <div class="read-progress" aria-hidden="true"><div class="read-progress-fill" id="read-fill"></div></div>

      <article class="article article-reading">
        <header class="stack stack-3">
          <span class="badge badge-brand">${esc(t("learn.cat." + a.cat))}</span>
          <h1>${esc(L(a.title))}</h1>
          <div class="row-between">
            <span class="text-xs text-muted num">${esc(t("learn.readTime", { n: a.read }))}</span>
            <button class="btn btn-ghost btn-sm" data-action="bookmark" data-id="${a.id}" aria-pressed="${saved}">
              ${icon("bookmark", "icon icon-sm")} ${esc(saved ? t("learn.bookmarked") : t("learn.bookmark"))}
            </button>
          </div>
        </header>

        <div class="article-body">
          ${ArticleContent.render(a)}
        </div>

        <p class="notice notice-info">${icon("info")} <span>${esc(t("learn.disclaimer"))}</span></p>

        <section class="article-related">
          <h2>${esc(t("learn.related"))}</h2>
          <div class="card card-flush">
            ${related.map((r) => `
              <a class="list-row" href="#/article?id=${r.id}">
                <span class="grow">
                  <span style="display:block;font-weight:600">${esc(L(r.title))}</span>
                  <span class="text-xs text-muted num">${esc(t("learn.readTime", { n: r.read }))}</span>
                </span>
                ${icon("chevronRight", "icon icon-sm")}
              </a>`).join("")}
          </div>
        </section>
      </article>`
    };
  },

  /* ======================================================================
     AI ASSISTANT
     ====================================================================== */
  assistant() {
    const msgs = Store.state.chat;
    return {
      chrome: "app",
      title: t("ai.title"),
      body: `
      <header class="page-head">
        <h1>${esc(t("ai.title"))}</h1>
        <p>${esc(t("ai.subtitle"))}</p>
      </header>

      <div class="assistant-workspace">
        <aside class="assistant-suggestions section-stack" aria-label="${esc(t("ai.subtitle"))}">
          <div class="card flow"><span class="coach-icon">${icon("sparkles")}</span><h2>${esc(t("ai.title"))}</h2><p class="text-muted">${esc(t("ai.subtitle"))}</p></div>
          ${["ai.suggest1", "ai.suggest2", "ai.suggest3"].map((k) => `<button class="card card-link assistant-suggestion" data-action="ai-suggest" data-q="${esc(t(k))}"><span>${esc(t(k))}</span>${icon("arrowRight", "icon icon-sm")}</button>`).join("")}
        </aside>
        <section class="card assistant-conversation" aria-label="${esc(t("ai.title"))}">
      <div class="chat" id="chat-log" aria-live="polite">
        ${msgs.length === 0 ? `
          <div class="msg msg-ai">
            <span class="avatar" aria-hidden="true">${icon("sparkles", "icon icon-sm")}</span>
            <div class="msg-bubble">${esc(t("ai.subtitle"))}</div>
          </div>
          ` : msgs.map((m) => `
          <div class="msg msg-${m.role}">
            ${m.role === "ai" ? `<span class="avatar" aria-hidden="true">${icon("sparkles", "icon icon-sm")}</span>` : ""}
            <div class="msg-bubble">${esc(m.text)}</div>
          </div>`).join("")}
      </div>

      <form class="composer" data-action="ai-send">
        <label class="visually-hidden" for="ai-input">${esc(t("ai.placeholder"))}</label>
        <input class="input" id="ai-input" name="q" placeholder="${esc(t("ai.placeholder"))}" autocomplete="off">
        <button class="btn btn-primary" type="submit" aria-label="${esc(t("ai.send"))}">${icon("send")}</button>
      </form>
      <p class="hint assistant-disclaimer">${esc(t("ai.disclaimer"))}</p>
        </section>
      </div>`
    };
  },

  /* ======================================================================
     NOTIFICATIONS / PROFILE / SETTINGS
     ====================================================================== */
  notifications() {
    const list = Store.state.notifRead
      ? Store.notifications.map((n) => ({ ...n, unread: false }))
      : Store.notifications;
    return {
      chrome: "app",
      title: t("notif.title"),
      back: "#/today",
      body: `
      <header class="page-head row-between">
        <h1>${esc(t("notif.title"))}</h1>
        <button class="btn btn-ghost btn-sm" data-action="mark-read">${esc(t("notif.markAll"))}</button>
      </header>

      ${list.length ? `
        <div class="card card-flush">
          ${list.map((n) => `
            <div class="list-row" style="background:${n.unread ? "var(--brand-soft)" : "transparent"}">
              <span class="avatar" aria-hidden="true">${icon(n.icon, "icon icon-sm")}</span>
              <span class="grow">
                <span style="display:block;font-weight:600">${esc(L(n.title))}</span>
                <span class="text-sm text-muted">${esc(L(n.body))}</span>
              </span>
              <span class="text-xs text-muted num">${esc(splitLabel(n.time))}</span>
            </div>`).join("")}
        </div>`
      : emptyState("bell", t("notif.empty.title"), t("notif.empty.body"))}`
    };
  },

  me() {
    const u = Store.user;
    return {
      chrome: "app",
      title: t("me.title"),
      body: `
      <header class="page-head">
        <div class="row" style="gap:var(--sp-4)">
          <span class="avatar avatar-lg">${esc(u.initials)}</span>
          <div>
            <h1>${esc(L(u.name))}</h1>
            <p class="text-sm text-muted">${esc(t("me.member", { date: I18n.date(u.joined, { month: "long", year: "numeric" }) }))}</p>
          </div>
        </div>
      </header>

      <div class="stat-grid">
        <div class="stat"><p class="stat-label">${esc(t("me.stats.days"))}</p><p class="stat-value num">${u.stats.days}</p></div>
        <div class="stat"><p class="stat-label">${esc(t("me.stats.workouts"))}</p><p class="stat-value num">${u.stats.workouts}</p></div>
        <div class="stat"><p class="stat-label">${esc(t("me.stats.articles"))}</p><p class="stat-value num">${u.stats.articles}</p></div>
      </div>

      <section class="section">
        <div class="card card-flush">
          ${[["#/progress", "chart", "nav.progress"], ["#/habits", "target", "nav.habits"],
             ["#/notifications", "bell", "nav.notifications"], ["#/settings", "settings", "nav.settings"]]
            .map(([href, ic, key]) => `
            <a class="list-row" href="${href}">
              <span style="color:var(--brand)">${icon(ic)}</span>
              <span class="grow" style="font-weight:600">${esc(t(key))}</span>
              ${icon("chevronRight", "icon icon-sm")}
            </a>`).join("")}
        </div>
      </section>

      <button class="btn btn-secondary btn-block" style="margin-top:var(--sp-5)" data-action="sign-out">
        ${icon("logOut", "icon icon-sm")} ${esc(t("settings.signOut"))}
      </button>`
    };
  },

  settings() {
    const themes = [["light", "sun"], ["dark", "moon"], ["system", "monitor"]];
    const reduced = document.documentElement.hasAttribute("data-reduced-motion");

    return {
      chrome: "app",
      title: t("settings.title"),
      back: "#/me",
      body: `
      <header class="page-head"><h1>${esc(t("settings.title"))}</h1></header>

      <section class="card stack stack-5">
        <h2 style="font-size:var(--text-base)">${esc(t("settings.appearance"))}</h2>

        <div class="row-between wrap">
          <label class="label" id="lbl-theme">${esc(t("settings.theme"))}</label>
          <div class="segmented" role="radiogroup" aria-labelledby="lbl-theme">
            ${themes.map(([id, ic]) => `
              <button role="radio" aria-checked="${Theme.pref === id}" data-action="set-theme" data-id="${id}">
                ${icon(ic, "icon icon-sm")} ${esc(t("settings.theme." + id))}
              </button>`).join("")}
          </div>
        </div>

        <div class="row-between wrap">
          <label class="label" id="lbl-lang">${esc(t("settings.language"))}</label>
          <div class="segmented" role="radiogroup" aria-labelledby="lbl-lang">
            <button role="radio" aria-checked="${I18n.lang === "mk"}" data-action="set-lang" data-id="mk">Македонски</button>
            <button role="radio" aria-checked="${I18n.lang === "en"}" data-action="set-lang" data-id="en">English</button>
          </div>
        </div>

        <div class="row-between wrap">
          <label class="label" id="lbl-units">${esc(t("settings.units"))}</label>
          <div class="segmented" role="radiogroup" aria-labelledby="lbl-units">
            <button role="radio" aria-checked="true" data-action="proto-only">${esc(t("settings.units.metric"))}</button>
            <button role="radio" aria-checked="false" data-action="proto-only">${esc(t("settings.units.imperial"))}</button>
          </div>
        </div>
      </section>

      <section class="card stack stack-4" style="margin-top:var(--sp-4)">
        <h2 style="font-size:var(--text-base)">${esc(t("settings.notifications"))}</h2>
        ${[["settings.notif.reminders", true], ["settings.notif.weekly", false]].map(([key, on]) => `
          <div class="row-between">
            <span class="text-sm">${esc(t(key))}</span>
            <button class="switch" role="switch" aria-checked="${on}" aria-label="${esc(t(key))}"
              data-action="toggle-switch"></button>
          </div>`).join("")}
      </section>

      <section class="card stack stack-4" style="margin-top:var(--sp-4)">
        <h2 style="font-size:var(--text-base)">${esc(t("settings.accessibility"))}</h2>
        <div class="row-between">
          <span>
            <span class="text-sm" style="display:block">${esc(t("settings.reducedMotion"))}</span>
            <span class="hint">${esc(t("settings.reducedMotionHint"))}</span>
          </span>
          <button class="switch" role="switch" aria-checked="${reduced}" data-action="toggle-motion"
            aria-label="${esc(t("settings.reducedMotion"))}"></button>
        </div>
      </section>

      <section class="card stack stack-3" style="margin-top:var(--sp-4)">
        <h2 style="font-size:var(--text-base)">${esc(t("settings.account"))}</h2>
        <button class="btn btn-secondary btn-block" data-action="sign-out">
          ${icon("logOut", "icon icon-sm")} ${esc(t("settings.signOut"))}
        </button>
        <button class="btn btn-ghost btn-block" style="color:var(--danger)" data-action="confirm-delete-account">
          ${icon("trash", "icon icon-sm")} ${esc(t("settings.deleteAccount"))}
        </button>
      </section>`
    };
  },

  /* Deliberate demo of the loading + error states. */
  states() {
    return {
      chrome: "app",
      title: t("common.loading"),
      body: `
      <header class="page-head"><h1>${esc(t("common.loading"))}</h1></header>
      <div class="stack stack-4">
        ${skeletonCard()}
        ${errorState("retry-demo")}
        <div class="notice notice-warn">${icon("alert")} <span>${esc(t("state.offline"))}</span></div>
        <div class="card">${emptyState("bell", t("notif.empty.title"), t("notif.empty.body"))}</div>
      </div>`
    };
  }
};
