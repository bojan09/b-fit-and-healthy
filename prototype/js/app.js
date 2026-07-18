/* ==========================================================================
   Shell + router + actions.

   Navigation model (replaces the old sidebar):
     - 5 primary sections in a top bar (desktop) / bottom tabs (mobile)
     - each section owns a contextual sub-nav row
     - everything else lives in the ⌘K command palette
   ========================================================================== */

const ROUTES = {
  "/": PublicScreens.landing,
  "/signin": PublicScreens.signIn,
  "/signup": PublicScreens.signUp,
  "/onboarding": PublicScreens.onboarding,

  "/today": AppScreens.today,

  "/nutrition": AppScreens.nutrition,
  "/meals": RecordScreens.meals,
  "/recipes": AppScreens.recipes,
  "/recipe": AppScreens.recipe,

  "/train": AppScreens.train,
  "/workouts": RecordScreens.workouts,
  "/session": AppScreens.session,
  "/exercises": AppScreens.exercises,
  "/exercise": AppScreens.exercise,
  "/anatomy": Anatomy.screen.bind(Anatomy),

  "/blog": RecordScreens.blog,
  "/post": RecordScreens.post,
  "/learn": RecordScreens.blog,        // legacy path → blog
  "/article": RecordScreens.post,      // legacy path → post
  "/assistant": AppScreens.assistant,

  "/me": AppScreens.me,
  "/progress": AppScreens.progress,
  "/habits": AppScreens.habits,
  "/settings": AppScreens.settings,
  "/notifications": AppScreens.notifications,
  "/states": AppScreens.states
};

/* Primary sections, in bar order. `sub` renders the contextual row. */
const SECTIONS = {
  today: { label: "nav.today", icon: "home", href: "#/today", sub: [] },
  nutrition: {
    label: "nav.nutrition", icon: "apple", href: "#/nutrition",
    sub: [["#/nutrition", "nutrition.title"], ["#/meals", "nav.meals"], ["#/recipes", "nav.recipes"]]
  },
  train: {
    label: "nav.train", icon: "dumbbell", href: "#/train",
    sub: [["#/train", "train.title"], ["#/workouts", "nav.workouts"], ["#/exercises", "nav.exercises"], ["#/anatomy", "nav.anatomy"]]
  },
  blog: {
    label: "nav.blog", icon: "book", href: "#/blog",
    sub: [["#/blog", "nav.blog"], ["#/assistant", "nav.assistant"]]
  },
  me: {
    label: "nav.me", icon: "user", href: "#/me",
    sub: [["#/me", "nav.profile"], ["#/progress", "nav.progress"],
          ["#/habits", "nav.habits"], ["#/settings", "nav.settings"]]
  }
};

/* Which section a route belongs to. */
const SECTION_OF = {
  "/today": "today",
  "/nutrition": "nutrition", "/meals": "nutrition", "/recipes": "nutrition", "/recipe": "nutrition",
  "/train": "train", "/workouts": "train", "/session": "train", "/exercises": "train", "/exercise": "train", "/anatomy": "train",
  "/blog": "blog", "/post": "blog", "/learn": "blog", "/article": "blog", "/assistant": "blog",
  "/me": "me", "/progress": "me", "/habits": "me", "/settings": "me", "/notifications": "me"
};

/* Everything reachable from the command palette. */
const PALETTE_PAGES = [
  ["#/today", "nav.today", "home"],
  ["#/meals", "nav.meals", "apple"],
  ["#/nutrition", "nutrition.title", "chart"],
  ["#/recipes", "nav.recipes", "leaf"],
  ["#/workouts", "nav.workouts", "dumbbell"],
  ["#/train", "train.title", "target"],
  ["#/exercises", "nav.exercises", "dumbbell"],
  ["#/anatomy", "nav.anatomy", "target"],
  ["#/blog", "nav.blog", "book"],
  ["#/assistant", "nav.assistant", "sparkles"],
  ["#/progress", "nav.progress", "chart"],
  ["#/habits", "nav.habits", "target"],
  ["#/me", "nav.profile", "user"],
  ["#/settings", "nav.settings", "settings"],
  ["#/notifications", "nav.notifications", "bell"]
];

const PALETTE_ACTIONS = [
  ["crud-new", "workouts", "workouts.new", "plus"],
  ["crud-new", "meals", "meals.new", "plus"],
  ["date-today", "", "date.jumpToday", "target"],
  ["cycle-theme", "", "settings.theme", "sun"]
];

/* ==========================================================================
   Shell
   ========================================================================== */
const Shell = {
  langToggle() {
    const next = I18n.lang === "mk" ? "en" : "mk";
    return `<button class="btn btn-ghost btn-sm" data-action="set-lang" data-id="${next}"
      aria-label="${esc(t("lang.switchTo"))}">
      ${icon("globe", "icon icon-sm")}<span class="num">${I18n.lang.toUpperCase()}</span>
    </button>`;
  },

  themeButton() {
    const ic = Theme.pref === "system" ? "monitor" : Theme.pref === "dark" ? "moon" : "sun";
    return `<button class="btn-icon" data-action="cycle-theme"
      aria-label="${esc(t("settings.theme"))}: ${esc(t("settings.theme." + Theme.pref))}">
      ${icon(ic)}
    </button>`;
  },

  /* Top bar: brand + primary sections + tools. */
  appbar(screen, section) {
    const unread = !Store.state.notifRead;
    return `
    <header class="appbar">
      <div class="appbar-inner">
        <a class="brandmark" href="#/today">
          ${brandmark()}
          <span class="brandmark-word">${esc(t("app.name"))}</span>
        </a>

        <nav class="primary-nav" aria-label="${esc(t("nav.menu"))}">
          ${Object.entries(SECTIONS).map(([key, s]) => `
            <a class="primary-link" href="${s.href}" ${section === key ? 'aria-current="page"' : ""}>
              ${icon(s.icon, "icon icon-sm")}<span>${esc(t(s.label))}</span>
            </a>`).join("")}
        </nav>

        <div class="appbar-tools">
          <button class="btn btn-secondary btn-sm search-trigger" data-action="palette-open">
            ${icon("search", "icon icon-sm")}
            <span class="search-label">${esc(t("palette.open"))}</span>
            <kbd class="kbd">⌘K</kbd>
          </button>
          ${Shell.langToggle()}
          ${Shell.themeButton()}
          <a class="btn-icon ${unread ? "notif-dot" : ""}" href="#/notifications"
            aria-label="${esc(t("nav.notifications"))}">${icon("bell")}</a>
          <a class="avatar avatar-link" href="#/me" aria-label="${esc(t("me.title"))}">${esc(Store.user.initials)}</a>
        </div>
      </div>
    </header>`;
  },

  /* Contextual row for the active section. Doubles as the mobile title bar. */
  subnav(screen, section, path) {
    const s = SECTIONS[section];
    const hasSub = s && s.sub.length > 1;
    if (!hasSub && !screen.back) return "";

    return `
    <div class="subnav">
      <div class="subnav-inner">
        ${screen.back ? `<a class="btn-icon" href="${screen.back}"
          aria-label="${esc(t("common.back"))}">${icon("chevronLeft")}</a>` : ""}
        ${hasSub ? `
          <nav class="subnav-links" aria-label="${esc(t(s.label))}">
            ${s.sub.map(([href, key]) => `
              <a class="subnav-link" href="${href}" ${href === "#" + path ? 'aria-current="page"' : ""}>
                ${esc(t(key))}
              </a>`).join("")}
          </nav>`
        : `<span class="subnav-title">${esc(screen.title)}</span>`}
      </div>
    </div>`;
  },

  tabbar(section) {
    return `
    <nav class="tabbar" aria-label="${esc(t("nav.menu"))}">
      ${Object.entries(SECTIONS).map(([key, s]) => `
        <a class="tab" href="${s.href}" ${section === key ? 'aria-current="page"' : ""}>
          ${icon(s.icon)}<span>${esc(t(s.label))}</span>
        </a>`).join("")}
    </nav>`;
  }
};

/* ==========================================================================
   Command palette
   ========================================================================== */
const Palette = {
  open() {
    const body = `
      <div class="field">
        <label class="visually-hidden" for="pal-q">${esc(t("palette.placeholder"))}</label>
        <input class="input" id="pal-q" type="search" autocomplete="off"
          placeholder="${esc(t("palette.placeholder"))}" data-action="palette-filter">
      </div>
      <div id="pal-results" class="palette-results">${this.results("")}</div>`;

    Modal.open({ title: t("palette.open"), body, labelledBy: "pal-title" });
    // Modal focuses its first control; make sure that's the query box.
    setTimeout(() => document.getElementById("pal-q")?.focus(), 0);
  },

  results(query) {
    const q = query.trim().toLowerCase();
    const match = (label) => !q || t(label).toLowerCase().includes(q);

    const pages = PALETTE_PAGES.filter(([, label]) => match(label));
    const actions = PALETTE_ACTIONS.filter(([, , label]) => match(label));

    if (!pages.length && !actions.length) {
      return `<p class="empty" style="padding:var(--sp-6)">${esc(t("palette.empty"))}</p>`;
    }

    const group = (title, rows) => rows.length ? `
      <p class="palette-group">${esc(title)}</p>
      <ul class="palette-list">${rows.join("")}</ul>` : "";

    return group(t("palette.pages"), pages.map(([href, label, ic]) => `
      <li><a class="palette-item" href="${href}" data-action="palette-go">
        ${icon(ic, "icon icon-sm")}<span class="grow">${esc(t(label))}</span>
        ${icon("arrowRight", "icon icon-sm")}
      </a></li>`))
      + group(t("palette.actions"), actions.map(([action, kind, label, ic]) => `
      <li><button class="palette-item" data-action="palette-run"
        data-run="${esc(action)}" data-kind="${esc(kind)}">
        ${icon(ic, "icon icon-sm")}<span class="grow">${esc(t(label))}</span>
      </button></li>`));
  },

  filter(value) {
    const box = document.getElementById("pal-results");
    if (box) box.innerHTML = this.results(value);
  }
};

/* ==========================================================================
   Router
   ========================================================================== */
const Router = {
  path: "/",
  params: {},

  start() {
    window.addEventListener("hashchange", () => this.render());
    I18n.onChange(() => this.render());
    Theme.onChange(() => this.render());
    this.render();
  },

  parse() {
    const hash = location.hash.slice(1) || "/";
    const [path, query] = hash.split("?");
    this.path = path || "/";
    this.params = Object.fromEntries(new URLSearchParams(query || ""));
  },

  render() {
    this.parse();
    const view = ROUTES[this.path] || ROUTES["/"];
    const screen = view();
    const root = document.getElementById("root");
    const section = screen.section || SECTION_OF[this.path];

    document.title = `${screen.title} · ${t("app.name")}`;

    if (screen.chrome === "app") {
      root.innerHTML = `
        <div class="app">
          ${Shell.appbar(screen, section)}
          ${Shell.subnav(screen, section, this.path)}
          <main class="main view-enter" id="main" tabindex="-1">${screen.body}</main>
          ${Shell.tabbar(section)}
        </div>`;
    } else {
      root.innerHTML = `<main class="view-enter" id="main" tabindex="-1">${screen.body}</main>`;
    }

    window.scrollTo(0, 0);
    Actions.afterRender();
  }
};

/* ==========================================================================
   Actions
   ========================================================================== */
const Actions = {
  init() {
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-action]");
      if (!el || el.tagName === "FORM") return;
      const fn = this.handlers[el.dataset.action];
      if (!fn) return;
      if (el.tagName === "BUTTON" && el.type !== "submit") e.preventDefault();
      fn(el, e);
    });

    document.addEventListener("submit", (e) => {
      const el = e.target.closest("form[data-action]");
      if (!el) return;
      e.preventDefault();
      this.handlers[el.dataset.action]?.(el, e);
    });

    document.addEventListener("input", (e) => {
      const el = e.target.closest("[data-action]");
      if (!el) return;
      const fn = this.inputHandlers[el.dataset.action];
      if (fn) fn(el, e);
    });

    // ⌘K / Ctrl+K anywhere except inside a text field.
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("overlay") ? Modal.close() : Palette.open();
      }
    });
  },

  afterRender() {
    const fill = document.getElementById("read-fill");
    if (fill) {
      const onScroll = () => {
        const max = document.body.scrollHeight - window.innerHeight;
        fill.style.width = `${Math.min(100, (window.scrollY / (max || 1)) * 100)}%`;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    const log = document.getElementById("chat-log");
    if (log) log.scrollTop = log.scrollHeight;

    // Charts measure their host, so they must draw after the tree is in place.
    Charts.mountAll();
    Motion.init();
  },

  /* ---- input-event handlers ---- */
  inputHandlers: {
    "palette-filter": (el) => Palette.filter(el.value),
    "date-pick": (el) => {
      if (!el.value) return;
      Records.setDate(el.value);
      Router.render();
    },
    "blog-search": (el) => {
      const cat = Router.params.cat || "all";
      // Replace rather than push so search typing doesn't flood history.
      history.replaceState(null, "", `#/blog?cat=${cat}&q=${encodeURIComponent(el.value)}`);
      Router.parse();
      const view = ROUTES["/blog"]();
      document.getElementById("main").innerHTML = view.body;
      const box = document.getElementById("blog-q");
      if (box) { box.focus(); box.setSelectionRange(box.value.length, box.value.length); }
      Motion.init();
    },
    "anatomy-search": (el) => Anatomy.filter(el.value)
  },

  handlers: {
    /* ---- theme + language ---- */
    "set-lang": (el) => { I18n.set(el.dataset.id); toast(t("toast.langChanged")); },
    "cycle-theme": () => {
      const order = ["light", "dark", "system"];
      Theme.set(order[(order.indexOf(Theme.pref) + 1) % 3]);
      toast(t("toast.themeChanged"));
    },
    "set-theme": (el) => { Theme.set(el.dataset.id); toast(t("settings.saved")); },
    "toggle-motion": (el) => {
      const on = el.getAttribute("aria-checked") !== "true";
      el.setAttribute("aria-checked", String(on));
      Theme.setReducedMotion(on);
      Motion.init();
    },
    "toggle-switch": (el) => {
      el.setAttribute("aria-checked", String(el.getAttribute("aria-checked") !== "true"));
      toast(t("settings.saved"));
    },

    /* ---- command palette ---- */
    "palette-open": () => Palette.open(),
    "palette-go": (el) => { Modal.close(); location.hash = el.getAttribute("href"); },
    "palette-run": (el) => {
      Modal.close();
      const run = Actions.handlers[el.dataset.run];
      if (run) run(el);
    },

    /* ---- date bar ---- */
    "date-step": (el) => {
      if (!Records.step(+el.dataset.n)) { toast(t("date.noFuture"), "info"); return; }
      Router.render();
    },
    "date-today": () => { Records.goToday(); Records.setScope("day"); Router.render(); },
    "date-scope": (el) => { Records.setScope(el.dataset.id); Router.render(); },

    /* ---- generic CRUD ---- */
    "crud-new": (el) => Crud.open(el.dataset.kind),
    "crud-edit": (el) => Crud.open(el.dataset.kind, el.dataset.id),
    "crud-submit": () => Crud.submit(),
    "crud-delete": (el) => Crud.confirmDelete(el.dataset.kind, el.dataset.id),
    "crud-delete-confirm": (el) => Crud.doDelete(el.dataset.kind, el.dataset.id),
    "crud-undo": (el) => {
      if (Records.undo()) { toast(t("crud.restored")); Router.render(); }
      el.closest(".toast")?.remove();
    },
    "ex-add": () => {
      const list = document.getElementById("ex-list");
      if (!list) return;
      list.insertAdjacentHTML("beforeend", Crud.exerciseRow());
      document.getElementById("ex-empty")?.remove();
      list.lastElementChild.querySelector("input")?.focus();
    },
    "ex-remove": (el) => el.closest(".ex-row")?.remove(),

    /* ---- blog ---- */
    "blog-cat": (el) => { location.hash = `#/blog?cat=${el.dataset.id}`; },

    /* ---- habits + quick logging ---- */
    "toggle-habit": (el) => {
      const h = Store.habits.find((x) => x.id === el.dataset.id);
      if (!h) return;
      h.done = !h.done;
      el.setAttribute("aria-checked", String(h.done));
      if (h.done) {
        h.streak += 1;
        el.querySelector(".check-box")?.classList.add("celebrate");
        toast(t("toast.habitDone"));
      } else {
        h.streak = Math.max(0, h.streak - 1);
      }
    },
    "add-water": () => {
      Store.today.water = Math.min(Store.targets.water + 500, Store.today.water + 250);
      toast(t("toast.logged"));
      Router.render();
    },
    "log-set": (el) => {
      el.classList.add("celebrate");
      el.innerHTML = `${icon("check", "icon icon-sm")} ${esc(t("habits.done"))}`;
      el.disabled = true;
    },
    "finish-session": () => {
      Modal.open({
        title: t("train.finished.title"),
        body: `<div style="text-align:center" class="stack stack-4">
            <span class="celebrate" style="color:var(--brand)">${icon("sparkles", "icon icon-lg")}</span>
            <p class="text-secondary">${esc(t("train.finished.body", { sets: 13, volume: I18n.num(8940), min: 38 }))}</p>
          </div>`,
        actions: `<a class="btn btn-primary" href="#/workouts" data-close>${esc(t("common.done"))}</a>`
      });
    },

    /* ---- meals from Today / recipes ---- */
    "log-meal": (el) => Actions.handlers["add-food"](el),
    "add-food": (el) => {
      const slot = el.dataset.slot || "snack";
      Modal.open({
        title: t("nutrition.addFood"),
        body: `
          <div class="field">
            <label class="label" for="food-q">${esc(t("nutrition.searchFood"))}</label>
            <input class="input" id="food-q" type="search" placeholder="${esc(t("nutrition.searchFood"))}">
          </div>
          <p class="eyebrow">${esc(t("nutrition.recent"))}</p>
          <div class="stack">
            ${Store.foods.map((f) => `
              <button class="list-row" data-action="pick-food" data-id="${f.id}" data-slot="${slot}">
                <span class="grow">
                  <span style="display:block;font-weight:600">${esc(L(f.name))}</span>
                  <span class="text-xs text-muted">${esc(L(f.unit))}</span>
                </span>
                <span class="num text-secondary">${I18n.num(f.kcal)}</span>
                ${icon("plus", "icon icon-sm")}
              </button>`).join("")}
          </div>
          <button class="btn btn-ghost btn-block" data-action="crud-new" data-kind="meals">
            ${icon("plus", "icon icon-sm")} ${esc(t("meals.new"))}
          </button>`
      });
    },
    "pick-food": (el) => {
      const f = Store.foods.find((x) => x.id === el.dataset.id);
      Records.create("meals", {
        slot: el.dataset.slot, name: f.name,
        kcal: f.kcal, p: Math.round(f.p), c: Math.round(f.c), f: Math.round(f.f),
        time: new Date().toTimeString().slice(0, 5)
      });
      Modal.close();
      toast(t("nutrition.added", { meal: t("today." + el.dataset.slot) }));
      Router.render();
    },

    "add-measurement": () => Crud.open("measurements"),
    "add-recipe": () => { toast(t("toast.logged")); },
    "save-recipe": (el) => {
      const s = Store.state.savedRecipes;
      s.has(el.dataset.id) ? s.delete(el.dataset.id) : s.add(el.dataset.id);
      toast(t("toast.saved"));
      Router.render();
    },
    "bookmark": (el) => {
      const b = Store.state.bookmarks;
      b.has(el.dataset.id) ? b.delete(el.dataset.id) : b.add(el.dataset.id);
      toast(t("toast.saved"));
      Router.render();
    },
    "filter-recipes": (el) => { location.hash = `#/recipes?tag=${el.dataset.id}`; },
    "filter-muscle": (el) => { location.hash = `#/exercises?muscle=${el.dataset.id}`; },
    "filter-cat": (el) => { location.hash = `#/blog?cat=${el.dataset.id}`; },

    /* ---- notifications / account ---- */
    "mark-read": () => { Store.state.notifRead = true; Router.render(); },
    "sign-out": () => { location.hash = "#/"; toast(t("toast.protoOnly"), "info"); },

    /* ---- assistant ---- */
    "ai-suggest": (el) => Actions.ask(el.dataset.q),
    "ai-send": (form) => {
      const input = form.querySelector("input");
      const q = input.value.trim();
      if (!q) return;
      input.value = "";
      Actions.ask(q);
    },

    /* ---- auth ---- */
    "auth-submit": (form) => {
      const email = form.querySelector('[name="email"]');
      const pass = form.querySelector('[name="password"]');
      const emailBad = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value);
      const passBad = pass.value.length < 8;

      form.querySelector("#f-email").classList.toggle("field-error", emailBad);
      form.querySelector("#e-email").hidden = !emailBad;
      email.setAttribute("aria-invalid", String(emailBad));
      form.querySelector("#f-password").classList.toggle("field-error", passBad);
      form.querySelector("#e-pass").hidden = !passBad;
      pass.setAttribute("aria-invalid", String(passBad));

      if (emailBad) { email.focus(); return; }
      if (passBad) { pass.focus(); return; }
      location.hash = "#/onboarding?step=1";
    },

    "confirm-delete": (el) => Crud.confirmDelete("meals", el.dataset.id),
    "confirm-delete-account": () => {
      Modal.open({
        title: t("settings.deleteAccount"),
        body: `<p class="text-secondary">${esc(t("confirm.delete.body"))}</p>`,
        actions: `
          <button class="btn btn-ghost" data-close>${esc(t("common.cancel"))}</button>
          <button class="btn btn-danger" data-action="proto-only">${esc(t("common.delete"))}</button>`
      });
    },

    "onb-goal": (el) => { Store.user.goal = el.dataset.id; Router.render(); },
    "onb-level": (el) => { Store.user.level = el.dataset.id; Router.render(); },

    "retry-demo": () => { toast(t("common.loading"), "info"); },
    "proto-only": () => { toast(t("toast.protoOnly"), "info"); }
  },

  ask(question) {
    Store.state.chat.push({ role: "user", text: question });
    Router.render();

    const log = document.getElementById("chat-log");
    if (log) {
      const wait = document.createElement("div");
      wait.className = "msg msg-ai";
      wait.innerHTML = `<span class="avatar">${icon("sparkles", "icon icon-sm")}</span>
        <div class="msg-bubble"><span class="typing"><i></i><i></i><i></i></span></div>`;
      log.appendChild(wait);
      wait.scrollIntoView({ block: "end", behavior: "smooth" });
    }

    setTimeout(() => {
      const answers = {
        mk: "Со тоа што го имаш, брз предлог: пилешко со леќа и салата — околу 620 ккал и 46 г протеин. Ако сакаш нешто полесно, супата од тиква е готова за 30 минути. Ова е општа насока, не медицински совет.",
        en: "With what you have, a quick option: chicken with lentils and salad — roughly 620 kcal and 46 g protein. If you want something lighter, the pumpkin soup takes 30 minutes. This is general guidance, not medical advice."
      };
      Store.state.chat.push({ role: "ai", text: answers[I18n.lang] });
      Router.render();
    }, 900);
  }
};

/* ---- boot ---------------------------------------------------------------- */
I18n.init();
Theme.init();
Records.init();
Actions.init();
Router.start();
