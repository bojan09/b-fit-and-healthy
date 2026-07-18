/* ==========================================================================
   Screens backed by user-entered records: Workouts, Meals, Blog.
   All three read through Records, so the date bar filters them for free.
   ========================================================================== */

const RecordScreens = {

  /* ======================================================================
     WORKOUTS — full CRUD, date filtered
     ====================================================================== */
  workouts() {
    const list = Records.list("workouts");
    const totalVolume = list.reduce((s, w) => s + Records.volume(w), 0);
    const totalMin = list.reduce((s, w) => s + (+w.minutes || 0), 0);
    const cov = Records.coverage();

    return {
      chrome: "app",
      section: "train",
      title: t("workouts.title"),
      body: `
      <header class="page-head row-between wrap">
        <div>
          <h1>${esc(t("workouts.title"))}</h1>
          <p>${esc(t("workouts.subtitle"))}</p>
        </div>
        <button class="btn btn-primary" data-action="crud-new" data-kind="workouts">
          ${icon("plus", "icon icon-sm")} ${esc(t("workouts.new"))}
        </button>
      </header>

      ${dateBar({ count: list.length, countKey: "workouts.sessionsCount" })}

      <div class="stat-grid" style="margin:var(--sp-5) 0">
        <div class="stat">
          <p class="stat-label">${esc(t("train.sessions"))}</p>
          <p class="stat-value num">${I18n.num(list.length)}</p>
        </div>
        <div class="stat">
          <p class="stat-label">${esc(t("workouts.totalVolume"))}</p>
          <p class="stat-value num">${I18n.num(Math.round(totalVolume))}
            <span class="stat-unit">${esc(t("common.kg"))}</span></p>
        </div>
        <div class="stat">
          <p class="stat-label">${esc(t("common.min"))}</p>
          <p class="stat-value num">${I18n.num(totalMin)}</p>
        </div>
      </div>

      ${list.length ? `
        <ul class="record-list">
          ${list.map((w) => recordRow({
            kind: "workouts",
            id: w.id,
            icon: "dumbbell",
            title: L(w.name),
            meta: `<span class="num">${esc(I18n.date(DateUtil.parse(w.date), { day: "numeric", month: "short" }))}</span>
                   · <span class="num">${I18n.num(w.minutes || 0)}</span> ${esc(t("common.min"))}
                   · <span class="num">${I18n.num((w.exercises || []).length)}</span> ${esc(t("workouts.exercises").toLowerCase())}`,
            right: `<span class="num record-strong">${I18n.num(Math.round(Records.volume(w)))}
                    <span class="text-2xs text-muted">${esc(t("common.kg"))}</span></span>`
          })).join("")}
        </ul>`
        : emptyState("dumbbell", t("workouts.empty.title"), t("workouts.empty.body"),
            `<button class="btn btn-primary" data-action="crud-new" data-kind="workouts">
              ${esc(t("workouts.new"))}</button>`)}

      ${list.length ? `
        <section class="section" aria-labelledby="wcov-h">
          <div class="section-head">
            <h2 id="wcov-h">${esc(t("coverage.title"))}</h2>
            <span class="text-xs text-muted">${esc(t("coverage.subtitle"))}</span>
          </div>
          <div class="card-invert spotlight">${coverageMap(cov)}</div>
        </section>` : ""}`
    };
  },

  /* ======================================================================
     MEALS — full CRUD, date filtered
     ====================================================================== */
  meals() {
    const list = Records.list("meals");
    const totals = Records.totals();
    const tg = Store.targets;
    const isDay = Records.scope === "day";

    const macroRow = (labelKey, val, goal, idx) => `
      <div class="stack stack-2">
        <div class="row-between text-sm">
          <span>${esc(t(labelKey))}</span>
          <span class="num text-muted">${I18n.num(Math.round(val))}${isDay ? " / " + I18n.num(goal) : ""} ${esc(t("common.g"))}</span>
        </div>
        <span class="bar"><span class="bar-fill ${isDay && val > goal ? "is-over" : ""}"
          style="width:${Math.min(100, (val / goal) * 100)}%;background:var(--data-${idx})"></span></span>
      </div>`;

    const slots = ["breakfast", "lunch", "dinner", "snack"];

    return {
      chrome: "app",
      section: "nutrition",
      title: t("meals.title"),
      body: `
      <header class="page-head row-between wrap">
        <div>
          <h1>${esc(t("meals.title"))}</h1>
          <p>${esc(t("meals.subtitle"))}</p>
        </div>
        <button class="btn btn-primary" data-action="crud-new" data-kind="meals">
          ${icon("plus", "icon icon-sm")} ${esc(t("meals.new"))}
        </button>
      </header>

      ${dateBar({ count: list.length, countKey: "blog.postsCount" })}

      <div class="card stack stack-5" style="margin-top:var(--sp-5)">
        <div class="row" style="gap:var(--sp-5);align-items:center">
          ${ring(isDay ? Math.round((totals.kcal / tg.energy) * 100) : 100, {
            size: 96, stroke: 10, value: I18n.num(totals.kcal), label: t("common.kcal") })}
          <div class="grow stack stack-3">
            ${macroRow("nutrition.protein", totals.p, isDay ? tg.protein : Math.max(totals.p, 1), 1)}
            ${macroRow("nutrition.carbs", totals.c, isDay ? tg.carbs : Math.max(totals.c, 1), 2)}
            ${macroRow("nutrition.fat", totals.f, isDay ? tg.fat : Math.max(totals.f, 1), 3)}
          </div>
        </div>
      </div>

      ${list.length ? slots.map((slot) => {
        const rows = list.filter((m) => m.slot === slot);
        if (!rows.length) return "";
        return `
        <section class="section" style="margin-top:var(--sp-6)">
          <div class="section-head">
            <h2 style="font-size:var(--text-base)">${esc(t("today." + slot))}</h2>
            <span class="text-xs text-muted num">
              ${I18n.num(rows.reduce((s, m) => s + (+m.kcal || 0), 0))} ${esc(t("common.kcal"))}
            </span>
          </div>
          <ul class="record-list">
            ${rows.map((m) => recordRow({
              kind: "meals",
              id: m.id,
              icon: "apple",
              title: L(m.name),
              meta: `<span class="num">${esc(m.time || "—")}</span>
                     ${!isDay ? `· <span class="num">${esc(I18n.date(DateUtil.parse(m.date), { day: "numeric", month: "short" }))}</span>` : ""}
                     · <span class="num">${I18n.num(m.p || 0)}${esc(t("common.g"))}</span> P`,
              right: `<span class="num record-strong">${I18n.num(m.kcal || 0)}
                      <span class="text-2xs text-muted">${esc(t("common.kcal"))}</span></span>`
            })).join("")}
          </ul>
        </section>`;
      }).join("")
      : emptyState("apple", t("meals.empty.title"), t("meals.empty.body"),
          `<button class="btn btn-primary" data-action="crud-new" data-kind="meals">
            ${esc(t("meals.new"))}</button>`)}`
    };
  },

  /* ======================================================================
     BLOG — index
     ====================================================================== */
  blog() {
    const cat = Router.params.cat || "all";
    const q = (Router.params.q || "").toLowerCase();
    const cats = ["all", "nutrition", "training", "sleep", "recovery", "habits", "anatomy"];

    let posts = Store.articles.filter((a) => cat === "all" || a.cat === cat);
    if (q) {
      posts = posts.filter((a) =>
        (L(a.title) + " " + L(a.excerpt)).toLowerCase().includes(q));
    }
    const featured = posts.find((a) => a.featured) || posts[0];
    const rest = posts.filter((a) => a !== featured);

    return {
      chrome: "app",
      section: "blog",
      title: t("blog.title"),
      body: `
      <header class="page-head">
        <h1>${esc(t("blog.title"))}</h1>
        <p>${esc(t("blog.subtitle"))}</p>
      </header>

      <div class="row wrap" style="gap:var(--sp-3);margin-bottom:var(--sp-5)">
        <div class="field grow" style="max-width:360px">
          <label class="visually-hidden" for="blog-q">${esc(t("blog.searchPlaceholder"))}</label>
          <input class="input" id="blog-q" type="search" value="${esc(Router.params.q || "")}"
            placeholder="${esc(t("blog.searchPlaceholder"))}" data-action="blog-search">
        </div>
        <span class="text-xs text-muted num" style="align-self:center">
          ${esc(t("blog.postsCount", { n: I18n.num(posts.length) }))}
        </span>
      </div>

      <div class="chips" role="group" aria-label="${esc(t("learn.categories"))}">
        ${cats.map((c) => `
          <button class="chip" aria-pressed="${cat === c}" data-action="blog-cat" data-id="${c}">
            ${esc(c === "all" ? t("common.all") : t("learn.cat." + c))}
          </button>`).join("")}
      </div>

      ${!posts.length ? emptyState("search", t("blog.empty.title"), t("blog.empty.body"),
          `<button class="btn btn-secondary" data-action="blog-cat" data-id="all">${esc(t("common.all"))}</button>`)
      : `
        ${featured ? `
        <a class="card card-link blog-featured spotlight" href="#/post?id=${featured.id}"
          style="margin-top:var(--sp-5)">
          <span class="badge badge-accent">${esc(t("blog.latest"))}</span>
          <h2 style="font-size:var(--text-xl);margin:var(--sp-3) 0">${esc(L(featured.title))}</h2>
          <p class="text-secondary" style="max-width:60ch">${esc(L(featured.excerpt))}</p>
          <span class="row text-xs text-muted" style="margin-top:var(--sp-4)">
            <span class="badge">${esc(t("learn.cat." + featured.cat))}</span>
            <span class="num">${esc(t("blog.minRead", { n: featured.read }))}</span>
          </span>
        </a>` : ""}

        ${rest.length ? `
        <section class="section">
          <div class="section-head"><h2>${esc(t("blog.allPosts"))}</h2></div>
          <div class="tile-grid">
            ${rest.map((a) => `
              <a class="card card-link stack stack-2 spotlight" href="#/post?id=${a.id}">
                <span class="badge">${esc(t("learn.cat." + a.cat))}</span>
                <h3 class="tile-title" style="font-size:var(--text-base)">${esc(L(a.title))}</h3>
                <p class="text-sm text-muted">${esc(L(a.excerpt))}</p>
                <span class="text-xs text-muted num">${esc(t("blog.minRead", { n: a.read }))}</span>
              </a>`).join("")}
          </div>
        </section>` : ""}`}`
    };
  },

  /* ======================================================================
     BLOG — post
     ====================================================================== */
  post() {
    const a = Store.articles.find((x) => x.id === Router.params.id) || Store.articles[0];
    const saved = Store.state.bookmarks.has(a.id);
    const related = Store.articles.filter((x) => x.id !== a.id && x.cat === a.cat).slice(0, 2);
    const fallback = Store.articles.filter((x) => x.id !== a.id).slice(0, 2);

    return {
      chrome: "app",
      section: "blog",
      title: L(a.title),
      back: "#/blog",
      body: `
      <div class="read-progress" aria-hidden="true"><div class="read-progress-fill" id="read-fill"></div></div>

      <article class="article stack stack-5">
        <header class="stack stack-3">
          <span class="badge badge-brand">${esc(t("learn.cat." + a.cat))}</span>
          <h1>${esc(L(a.title))}</h1>
          <div class="row-between">
            <span class="text-xs text-muted num">${esc(t("blog.minRead", { n: a.read }))}</span>
            <button class="btn btn-ghost btn-sm" data-action="bookmark" data-id="${a.id}" aria-pressed="${saved}">
              ${icon("bookmark", "icon icon-sm")} ${esc(saved ? t("learn.bookmarked") : t("learn.bookmark"))}
            </button>
          </div>
        </header>

        <div class="article-body">
          <p style="font-family:var(--font-display);font-size:var(--text-lg);color:var(--ink)">${esc(L(a.excerpt))}</p>
          ${L(a.body).map((p) => `<p>${esc(p)}</p>`).join("")}
        </div>

        <p class="notice notice-info">${icon("info")} <span>${esc(t("learn.disclaimer"))}</span></p>

        <section>
          <h2 style="font-size:var(--text-base);margin-bottom:var(--sp-3)">${esc(t("learn.related"))}</h2>
          <div class="card card-flush">
            ${(related.length ? related : fallback).map((r) => `
              <a class="list-row" href="#/post?id=${r.id}">
                <span class="grow">
                  <span style="display:block;font-weight:600">${esc(L(r.title))}</span>
                  <span class="text-xs text-muted num">${esc(t("blog.minRead", { n: r.read }))}</span>
                </span>
                ${icon("chevronRight", "icon icon-sm icon-nudge")}
              </a>`).join("")}
          </div>
        </section>

        <a class="btn btn-secondary" href="#/blog">
          ${icon("chevronLeft", "icon icon-sm")} ${esc(t("blog.backToBlog"))}
        </a>
      </article>`
    };
  }
};
