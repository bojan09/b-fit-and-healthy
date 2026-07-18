/* ==========================================================================
   Public screens — landing, sign in, sign up, onboarding.
   Each screen returns { chrome, title, body }.
   chrome: "public" (no app nav) | "app" (sidebar + tabs) | "bare" (auth only)
   ========================================================================== */

const PublicScreens = {

  landing() {
    const d = Store.today, tg = Store.targets;

    const features = [
      { icon: "clock", t: "landing.f1.title", b: "landing.f1.body" },
      { icon: "apple", t: "landing.f2.title", b: "landing.f2.body" },
      { icon: "dumbbell", t: "landing.f3.title", b: "landing.f3.body" },
      { icon: "book", t: "landing.f4.title", b: "landing.f4.body" }
    ];

    const days = [
      ["07:20", "landing.day.d1.t", "landing.day.d1.b"],
      ["17:45", "landing.day.d2.t", "landing.day.d2.b"],
      ["21:10", "landing.day.d3.t", "landing.day.d3.b"],
      ["22:30", "landing.day.d4.t", "landing.day.d4.b"]
    ];

    const bands = [
      { n: 100, suffix: "%", key: "landing.band.s1" },
      { n: 2, suffix: "", key: "landing.band.s2" },
      { n: 40, prefix: "~", suffix: "", key: "landing.band.s3" }
    ];

    return {
      chrome: "public",
      title: t("app.name"),
      body: `
      <div class="landing">
        <nav class="landing-nav" aria-label="${esc(t("app.name"))}">
          <a class="brandmark" href="#/">
            ${brandmark()}
            <span>${esc(t("app.name"))}</span>
          </a>
          <span class="spacer"></span>
          ${Shell.langToggle()}
          ${Shell.themeButton()}
          <a class="btn btn-secondary btn-sm" href="#/signin">${esc(t("landing.signIn"))}</a>
        </nav>

        <div class="hero-stage">
        <header class="hero">
          <div>
            <span class="badge badge-brand" data-enter style="--i:0">
              ${icon("sparkles", "icon icon-sm")} ${esc(t("app.tagline"))}
            </span>
            <!-- Two masked lines, each rising from its own baseline. -->
            <h1 style="margin-top:var(--sp-4)">
              <span class="line"><span style="--i:0">${esc(t("landing.hero.pre"))}</span></span>
              <span class="line"><span style="--i:1" class="mark">${esc(t("landing.hero.mark"))}</span></span>
            </h1>
            <p class="hero-lede" data-enter style="--i:3">${esc(t("landing.hero.lede"))}</p>
            <div class="hero-cta" data-enter style="--i:4">
              <a class="btn btn-primary btn-lg btn-magnetic" href="#/signup">${esc(t("landing.getStarted"))}</a>
              <a class="btn btn-secondary btn-lg" href="#/today">
                ${esc(t("landing.hero.demo"))} ${icon("arrowRight", "icon icon-sm icon-nudge")}
              </a>
            </div>
            <p class="text-xs text-muted" style="margin-top:var(--sp-3)" data-enter>${esc(t("landing.hero.note"))}</p>
            <ul class="hero-proof" data-enter style="--i:5">
              ${["landing.proof.free", "landing.proof.langs", "landing.proof.privacy"].map((k) =>
                `<li class="row text-sm text-secondary">${icon("check", "icon icon-sm")} ${esc(t(k))}</li>`).join("")}
            </ul>
          </div>

          <!-- Not a screenshot. This is the real thing: the habit rows tick,
               the bars fill on entry, and the language/theme switches drive it. -->
          <div class="peek-stage" data-enter style="--i:5">
          <div class="peek">
            <div class="peek-bar">
              <span class="peek-dot"></span><span class="peek-dot"></span><span class="peek-dot"></span>
              <span class="peek-hint">${esc(t("landing.hero.tryIt"))}</span>
            </div>

            <div class="card-invert spotlight" data-reveal data-fill>
              <p class="stat-label">${esc(t("today.ring.energy"))}</p>
              <p class="num-hero">
                <span data-count="${d.energy}">${I18n.num(d.energy)}</span>
                <small>/ ${I18n.num(tg.energy)} ${esc(t("common.kcal"))}</small>
              </p>
              <span class="bar" style="margin-top:var(--sp-4)">
                <span class="bar-fill" style="width:${Math.min(100, pct(d.energy, tg.energy))}%;background:var(--invert-accent)"></span>
              </span>
            </div>

            <div class="row" style="gap:var(--sp-3)">
              <div class="card grow spotlight" style="padding:var(--sp-4)" data-reveal data-fill>
                <p class="stat-label">${esc(t("nutrition.protein"))}</p>
                <p class="stat-value num" style="color:var(--data-1)">
                  <span data-count="${d.protein}">${I18n.num(d.protein)}</span><span class="stat-unit">${esc(t("common.g"))}</span>
                </p>
                <span class="bar" style="margin-top:var(--sp-2)">
                  <span class="bar-fill" style="width:${pct(d.protein, tg.protein)}%"></span>
                </span>
              </div>
              <div class="card grow spotlight" style="padding:var(--sp-4)" data-reveal data-fill>
                <p class="stat-label">${esc(t("nutrition.water"))}</p>
                <p class="stat-value num" style="color:var(--data-2)">
                  <span data-count="${d.water / 1000}" data-count-digits="1">${I18n.num(d.water / 1000, 1)}</span><span class="stat-unit">L</span>
                </p>
                <span class="bar" style="margin-top:var(--sp-2)">
                  <span class="bar-fill" style="width:${pct(d.water, tg.water)}%;background:var(--data-2)"></span>
                </span>
              </div>
            </div>

            <div class="card" style="padding:var(--sp-4)">
              <div class="row-between" style="margin-bottom:var(--sp-2)">
                <p class="stat-label" style="margin:0">${esc(t("landing.peek.habits"))}</p>
                <span class="text-2xs" style="color:var(--accent-ink);font-weight:600">
                  ${esc(t("landing.peek.tap"))}
                </span>
              </div>
              ${Store.habits.slice(0, 3).map((hb) => `
                <button class="check-row" role="checkbox" aria-checked="${hb.done}"
                  data-action="toggle-habit" data-id="${hb.id}">
                  <span class="check-box">${icon("check", "icon icon-sm")}</span>
                  <span class="check-label grow text-sm">${esc(L(hb.name))}</span>
                  <span class="badge">${icon("flame", "icon icon-sm")}<span class="num">${hb.streak}</span></span>
                </button>`).join("")}
            </div>
          </div>
          </div>
        </header>
        </div>

        <!-- The differentiator, shown before the feature list. -->
        <section class="wrapper" aria-labelledby="gap-h">
          <div class="feature-row" style="border:0;padding-top:0">
            <div class="feature-copy" data-reveal="left">
              <span class="feature-num">${esc(t("landing.gap.eyebrow"))}</span>
              <h2 id="gap-h">${esc(t("landing.gap.title"))}</h2>
              <p>${esc(t("landing.gap.body"))}</p>
            </div>
            <div class="card-invert spotlight" data-reveal="right">
              <div class="row-between" style="margin-bottom:var(--sp-4)">
                <h3 style="color:var(--invert-ink);font-size:var(--text-base)">${esc(t("coverage.title"))}</h3>
                <span class="text-xs" style="color:var(--invert-muted)">${esc(t("coverage.subtitle"))}</span>
              </div>
              ${coverageMap(Store.coverage)}
            </div>
          </div>
        </section>

        <!-- Dark full-bleed band: breaks the light page, carries the numbers. -->
        <section class="band" aria-labelledby="band-h">
          <div class="wrapper">
            <h2 id="band-h" style="color:var(--invert-ink);margin-bottom:var(--sp-8)" data-reveal>
              ${esc(t("landing.band.title"))}
            </h2>
            <div class="band-grid" data-stagger>
              ${bands.map((b) => `
                <div class="band-stat" data-reveal>
                  <p class="num-hero">
                    <span data-count="${b.n}" data-count-prefix="${b.prefix || ""}"
                      data-count-suffix="${b.suffix || ""}">${esc((b.prefix || "") + I18n.num(b.n) + (b.suffix || ""))}</span>
                  </p>
                  <p>${esc(t(b.key))}</p>
                </div>`).join("")}
            </div>
          </div>
        </section>

        <section class="wrapper" aria-labelledby="feat-h">
          <h2 id="feat-h" style="margin:var(--sp-16) 0 0">${esc(t("landing.features.title"))}</h2>
          ${features.map((f, i) => `
            <article class="feature-row">
              <div class="feature-copy" data-reveal="${i % 2 ? "right" : "left"}">
                <span class="feature-num">${String(i + 1).padStart(2, "0")}</span>
                <h3>${esc(t(f.t))}</h3>
                <p>${esc(t(f.b))}</p>
              </div>
              <div class="feature-demo" data-reveal="${i % 2 ? "left" : "right"}">
                ${PublicScreens.featureDemo(i)}
              </div>
            </article>`).join("")}
        </section>

        <section class="wrapper" aria-labelledby="day-h" style="margin-top:var(--sp-16)">
          <span class="feature-num">${esc(t("landing.day.eyebrow"))}</span>
          <h2 id="day-h" style="margin:var(--sp-3) 0 var(--sp-6)">${esc(t("landing.day.title"))}</h2>
          <div class="day-strip" data-stagger>
            ${days.map(([time, tt, bb]) => `
              <article class="day-card" data-reveal="scale">
                <p class="day-time">${esc(time)}</p>
                <h3>${esc(t(tt))}</h3>
                <p>${esc(t(bb))}</p>
              </article>`).join("")}
          </div>
        </section>

        <section class="wrapper" style="margin-top:var(--sp-16)">
          <div class="cta-block spotlight" data-reveal="scale">
            <h2>${esc(t("landing.cta.title"))}</h2>
            <p>${esc(t("landing.cta.body"))}</p>
            <a class="btn btn-primary btn-lg btn-magnetic" href="#/signup">${esc(t("landing.getStarted"))}</a>
          </div>
        </section>

        <footer class="site-footer">
          <div class="wrapper">
            <div class="footer-grid">
              <div class="footer-brand">
                <a class="brandmark" href="#/">
                  ${brandmark()}
                  <span>${esc(t("app.name"))}</span>
                </a>
                <p>${esc(t("footer.blurb"))}</p>
              </div>

              <nav class="footer-col" aria-labelledby="f-product">
                <h3 id="f-product">${esc(t("footer.product"))}</h3>
                <ul>
                  <li><a href="#/today">${esc(t("footer.dashboard"))}</a></li>
                  <li><a href="#/nutrition">${esc(t("nav.nutrition"))}</a></li>
                  <li><a href="#/train">${esc(t("nav.train"))}</a></li>
                  <li><a href="#/progress">${esc(t("nav.progress"))}</a></li>
                </ul>
              </nav>

              <nav class="footer-col" aria-labelledby="f-explore">
                <h3 id="f-explore">${esc(t("footer.explore"))}</h3>
                <ul>
                  <li><a href="#/recipes">${esc(t("nav.recipes"))}</a></li>
                  <li><a href="#/exercises">${esc(t("nav.exercises"))}</a></li>
                  <li><a href="#/learn">${esc(t("nav.articles"))}</a></li>
                  <li><a href="#/assistant">${esc(t("nav.assistant"))}</a></li>
                </ul>
              </nav>

              <nav class="footer-col" aria-labelledby="f-company">
                <h3 id="f-company">${esc(t("footer.company"))}</h3>
                <ul>
                  <li><a href="#/" data-action="proto-only">${esc(t("footer.about"))}</a></li>
                  <li><a href="#/" data-action="proto-only">${esc(t("footer.privacy"))}</a></li>
                  <li><a href="#/" data-action="proto-only">${esc(t("footer.terms"))}</a></li>
                  <li><a href="#/" data-action="proto-only">${esc(t("footer.contact"))}</a></li>
                </ul>
              </nav>
            </div>

            <!-- Health disclaimer belongs on every public page, not buried in Terms. -->
            <p class="footer-note">
              ${icon("info", "icon icon-sm")}
              <span>${esc(t("footer.disclaimer"))}</span>
            </p>

            <div class="footer-base">
              <span class="num">© ${new Date().getFullYear()} ${esc(t("app.name"))}. ${esc(t("footer.rights"))}</span>
              <span class="row" style="gap:var(--sp-1)">${icon("leaf", "icon icon-sm")} ${esc(t("footer.madeIn"))}</span>
              <span class="spacer"></span>
              <span class="row" style="gap:var(--sp-1)">
                ${Shell.langToggle()}
                ${Shell.themeButton()}
              </span>
            </div>
          </div>
        </footer>
      </div>`
    };
  },

  /**
   * Each feature row shows the actual component it describes, not an icon in
   * an empty box. These are the real classes from the app, with sample data.
   */
  featureDemo(i) {
    const tg = Store.targets;

    // 00 — the daily rhythm: a fragment of the Today timeline.
    if (i === 0) {
      const rows = [
        ["07:20", "today.breakfast", true],
        ["13:25", "today.lunch", true],
        ["17:45", "today.hero.eyebrow", false]
      ];
      return `<div class="card stack stack-3">
        ${rows.map(([time, key, done]) => `
          <div class="row">
            <span class="tl-mini-dot ${done ? "is-done" : ""}" aria-hidden="true">
              ${done ? icon("check", "icon icon-sm") : ""}
            </span>
            <span class="grow">
              <span class="text-2xs text-muted num">${esc(time)}</span>
              <span style="display:block;font-weight:600;font-size:var(--text-sm)">${esc(t(key))}</span>
            </span>
            ${done ? `<span class="badge badge-ok">${esc(t("habits.done"))}</span>` : ""}
          </div>`).join("")}
      </div>`;
    }

    // 01 — nutrition: the real ring plus macro bars.
    if (i === 1) {
      const bar = (label, val, goal, idx) => `
        <div class="stack stack-2">
          <div class="row-between text-2xs">
            <span class="text-muted">${esc(label)}</span>
            <span class="num text-muted">${I18n.num(val)}/${I18n.num(goal)}${esc(t("common.g"))}</span>
          </div>
          <span class="bar"><span class="bar-fill"
            style="width:${Math.min(100, (val / goal) * 100)}%;background:var(--data-${idx})"></span></span>
        </div>`;
      return `<div class="card row" style="gap:var(--sp-5);align-items:center">
        ${ring(62, { size: 88, stroke: 9, value: I18n.num(1310), label: t("common.kcal") })}
        <div class="grow stack stack-3">
          ${bar(t("nutrition.protein"), 74, tg.protein, 1)}
          ${bar(t("nutrition.carbs"), 138, tg.carbs, 2)}
          ${bar(t("nutrition.fat"), 41, tg.fat, 3)}
        </div>
      </div>`;
    }

    // 02 — training: the coverage map, on the dark card it lives on in-app.
    if (i === 2) {
      return `<div class="card-invert">
        <div class="row-between" style="margin-bottom:var(--sp-4)">
          <span class="text-sm" style="font-weight:600">${esc(t("coverage.title"))}</span>
          <span class="text-2xs" style="color:var(--invert-muted)">${esc(t("coverage.subtitle"))}</span>
        </div>
        ${coverageMap(Store.coverage.slice(0, 6))}
      </div>`;
    }

    // 03 — learn: real article rows.
    return `<div class="card card-flush">
      ${Store.articles.slice(0, 3).map((a) => `
        <span class="list-row">
          <span class="grow">
            <span style="display:block;font-weight:600;font-size:var(--text-sm)">${esc(L(a.title))}</span>
            <span class="text-2xs text-muted num">${esc(t("blog.minRead", { n: a.read }))}</span>
          </span>
          <span class="badge">${esc(t("learn.cat." + a.cat))}</span>
        </span>`).join("")}
    </div>`;
  },

  /* ---- auth ------------------------------------------------------------- */
  signIn() { return PublicScreens._auth("signIn"); },
  signUp() { return PublicScreens._auth("signUp"); },

  _auth(mode) {
    const isUp = mode === "signUp";
    return {
      chrome: "bare",
      title: t(`auth.${mode}.title`),
      body: `
      <div class="auth-shell">
        <div class="auth-card stack stack-5">
          <div class="row" style="justify-content:space-between;margin-bottom:var(--sp-5)">
            <a class="brandmark" href="#/">
              ${brandmark()}
              <span>${esc(t("app.name"))}</span>
            </a>
            <span class="row" style="gap:var(--sp-1)">${Shell.langToggle()}${Shell.themeButton()}</span>
          </div>

          <div class="card stack stack-5">
            <div>
              <h1 style="font-size:var(--text-xl)">${esc(t(`auth.${mode}.title`))}</h1>
              <p class="text-sm text-muted" style="margin-top:var(--sp-1)">${esc(t(`auth.${mode}.subtitle`))}</p>
            </div>

            <button class="btn btn-secondary btn-block" data-action="proto-only">
              ${icon("google", "icon")} ${esc(t("auth.google"))}
            </button>

            <p class="or-divider">${esc(t("auth.or"))}</p>

            <form class="stack stack-4" data-action="auth-submit" novalidate>
              ${isUp ? `
              <div class="field">
                <label class="label" for="au-name">${esc(t("auth.name"))}</label>
                <input class="input" id="au-name" name="name" autocomplete="name"
                  placeholder="${esc(t("auth.namePlaceholder"))}">
              </div>` : ""}

              <div class="field" id="f-email">
                <label class="label" for="au-email">${esc(t("auth.email"))}</label>
                <input class="input" id="au-email" name="email" type="email" inputmode="email"
                  autocomplete="email" aria-describedby="e-email" required>
                <p class="error-text" id="e-email" hidden>${icon("alert", "icon icon-sm")} ${esc(t("auth.error.email"))}</p>
              </div>

              <div class="field" id="f-password">
                <div class="row-between">
                  <label class="label" for="au-pass">${esc(t("auth.password"))}</label>
                  ${!isUp ? `<a class="text-xs" href="#/signin" data-action="proto-only">${esc(t("auth.forgot"))}</a>` : ""}
                </div>
                <input class="input" id="au-pass" name="password" type="password"
                  autocomplete="${isUp ? "new-password" : "current-password"}" aria-describedby="h-pass e-pass" required>
                ${isUp ? `<p class="hint" id="h-pass">${esc(t("auth.passwordHint"))}</p>` : ""}
                <p class="error-text" id="e-pass" hidden>${icon("alert", "icon icon-sm")} ${esc(t("auth.error.password"))}</p>
              </div>

              <button class="btn btn-primary btn-block" type="submit">
                ${esc(isUp ? t("landing.getStarted") : t("landing.signIn"))}
              </button>
              ${isUp ? `<p class="hint" style="text-align:center">${esc(t("auth.terms"))}</p>` : ""}
            </form>
          </div>

          <p class="auth-alt">
            ${esc(isUp ? t("auth.hasAccount") : t("auth.noAccount"))}
            <a href="#/${isUp ? "signin" : "signup"}">${esc(isUp ? t("auth.signInLink") : t("auth.createOne"))}</a>
          </p>
        </div>
      </div>`
    };
  },

  /* ---- onboarding ------------------------------------------------------- */
  onboarding() {
    const step = Router.params.step ? Number(Router.params.step) : 1;
    const total = 4;
    const pips = Array.from({ length: total }, (_, i) =>
      `<span class="step-pip ${i + 1 < step ? "is-done" : i + 1 === step ? "is-current" : ""}"></span>`).join("");

    const goals = [
      ["lose", "onb.goal.lose", "onb.goal.loseDesc"],
      ["build", "onb.goal.build", "onb.goal.buildDesc"],
      ["habit", "onb.goal.habit", "onb.goal.habitDesc"],
      ["learn", "onb.goal.learn", "onb.goal.learnDesc"]
    ];
    const levels = [
      ["new", "onb.level.new", "onb.level.newDesc"],
      ["some", "onb.level.some", "onb.level.someDesc"],
      ["regular", "onb.level.regular", "onb.level.regularDesc"]
    ];

    let inner = "";
    if (step === 1) {
      inner = `
        <h1 style="font-size:var(--text-xl)">${esc(t("onb.goal.title"))}</h1>
        <p class="text-sm text-muted">${esc(t("onb.goal.subtitle"))}</p>
        <div class="choice-grid">
          ${goals.map(([id, tt, dd]) => `
            <button class="choice" data-action="onb-goal" data-id="${id}"
              aria-pressed="${Store.user.goal === id}">
              <span class="choice-title">${esc(t(tt))}</span>
              <span class="choice-desc">${esc(t(dd))}</span>
            </button>`).join("")}
        </div>`;
    } else if (step === 2) {
      inner = `
        <h1 style="font-size:var(--text-xl)">${esc(t("onb.level.title"))}</h1>
        <p class="text-sm text-muted">${esc(t("onb.level.subtitle"))}</p>
        <div class="choice-grid">
          ${levels.map(([id, tt, dd]) => `
            <button class="choice" data-action="onb-level" data-id="${id}"
              aria-pressed="${Store.user.level === id}">
              <span class="choice-title">${esc(t(tt))}</span>
              <span class="choice-desc">${esc(t(dd))}</span>
            </button>`).join("")}
        </div>`;
    } else if (step === 3) {
      inner = `
        <h1 style="font-size:var(--text-xl)">${esc(t("onb.habits.title"))}</h1>
        <p class="text-sm text-muted">${esc(t("onb.habits.subtitle"))}</p>
        <div class="stack" role="group">
          ${Store.habits.map((h) => `
            <button class="check-row" role="checkbox" aria-checked="${h.done}"
              data-action="toggle-habit" data-id="${h.id}">
              <span class="check-box">${icon("check", "icon icon-sm")}</span>
              <span class="check-label grow">${esc(L(h.name))}</span>
              ${icon(h.icon, "icon icon-sm")}
            </button>`).join("")}
        </div>`;
    } else {
      inner = `
        <div style="text-align:center" class="stack stack-4">
          <span class="celebrate" style="display:inline-flex;justify-content:center;color:var(--brand)">
            ${icon("sparkles", "icon icon-lg")}
          </span>
          <h1 style="font-size:var(--text-xl)">${esc(t("onb.ready.title"))}</h1>
          <p class="text-sm text-muted">${esc(t("onb.ready.body"))}</p>
        </div>`;
    }

    const nextHref = step < total ? `#/onboarding?step=${step + 1}` : "#/today";
    const backHref = step > 1 ? `#/onboarding?step=${step - 1}` : "#/signup";

    return {
      chrome: "bare",
      title: t("onb.step", { n: step, total }),
      body: `
      <div class="auth-shell">
        <div class="auth-card stack stack-5">
          <div class="stack stack-3">
            <div class="steps" role="progressbar" aria-valuenow="${step}" aria-valuemin="1" aria-valuemax="${total}"
              aria-label="${esc(t("onb.step", { n: step, total }))}">${pips}</div>
            <p class="text-xs text-muted num">${esc(t("onb.step", { n: step, total }))}</p>
          </div>

          <div class="card stack stack-5">${inner}</div>

          <div class="row" style="gap:var(--sp-3)">
            <a class="btn btn-ghost" href="${backHref}">${icon("chevronLeft", "icon icon-sm")} ${esc(t("common.back"))}</a>
            <span class="grow"></span>
            ${step < total ? `<a class="btn btn-ghost" href="#/today">${esc(t("common.skip"))}</a>` : ""}
            <a class="btn btn-primary" href="${nextHref}">
              ${esc(step === total ? t("onb.ready.cta") : t("common.continue"))}
              ${icon("chevronRight", "icon icon-sm")}
            </a>
          </div>
        </div>
      </div>`
    };
  }
};
