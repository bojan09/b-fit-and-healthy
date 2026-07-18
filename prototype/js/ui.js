/* ==========================================================================
   UI kit — icons, html templating, charts, toasts, modals.
   Everything renders to a string; screens compose strings. Deliberately
   simple: this is a prototype meant to be edited quickly.
   ========================================================================== */

/* ---- html escaping + tagged template ------------------------------------- */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
));

/** html`` escapes interpolations. Use ${raw(x)} to opt out for nested markup. */
function html(strings, ...vals) {
  return strings.reduce((out, s, i) => {
    const v = vals[i - 1];
    const piece = v === undefined || v === null || v === false ? ""
      : v && v.__raw ? v.value
      : Array.isArray(v) ? v.map((x) => (x && x.__raw ? x.value : esc(x))).join("")
      : esc(v);
    return out + piece + s;
  });
}
const raw = (value) => ({ __raw: true, value });

/* ---- icons (Lucide-style geometry, drawn inline: no CDN, no font) --------- */
const ICON_PATHS = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
  apple: '<path d="M12 7c0-2.2 1.8-4 4-4 0 2.2-1.8 4-4 4z"/><path d="M12 7c-3 0-5 2.2-5 5.5S9 21 12 21s5-5.2 5-8.5S15 7 12 7z"/>',
  dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
  book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 19.5h16"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7z"/><path d="M10.5 20a2 2 0 0 0 3 0"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H2a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 3.7 7.9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V2a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H22a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1.3z"/>',
  check: '<path d="M4.5 12.5 9.5 17.5 19.5 6.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevronRight: '<path d="M9 5l7 7-7 7"/>',
  chevronLeft: '<path d="M15 5l-7 7 7 7"/>',
  chevronDown: '<path d="M5 9l7 7 7-7"/>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  flame: '<path d="M12 22c4 0 7-2.6 7-6.5 0-4.5-4-5.5-4-9.5-3 1-4 3.5-4 5.5-1-.7-1.5-2-1.5-3.5C7 10 5 12 5 15.5 5 19.4 8 22 12 22z"/>',
  droplet: '<path d="M12 3s6 6.2 6 10a6 6 0 0 1-12 0c0-3.8 6-10 6-10z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  sparkles: '<path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M18.5 15.5l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z"/>',
  bookmark: '<path d="M6 3.5h12v17l-6-4-6 4z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"/>',
  logOut: '<path d="M15 17l5-5-5-5"/><path d="M20 12H9M12 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/>',
  alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
  play: '<path d="M7 4.5v15l13-7.5z"/>',
  scale: '<path d="M12 3v18M5 8h14"/><path d="M5 8 2 15h6zM19 8l-3 7h6z"/>',
  leaf: '<path d="M4 20c0-8 6-14 16-14 0 10-6 14-12 14H4z"/><path d="M4 20c4-6 8-8 12-9"/>',
  moonStar: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/><path d="M18 3.5l.6 1.5 1.5.6-1.5.6L18 8l-.6-1.8-1.5-.6 1.5-.6z"/>',
  send: '<path d="M4 12l16-8-6 16-2.5-6.5z"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/>',
  google: '<path d="M21 12.2c0-.7-.06-1.3-.18-1.9H12v3.6h5.05c-.22 1.2-.88 2.2-1.88 2.88v2.4h3.04C19.98 17.5 21 15.1 21 12.2z"/><path d="M12 21.5c2.55 0 4.7-.85 6.26-2.3l-3.05-2.4c-.85.57-1.93.9-3.2.9-2.46 0-4.55-1.66-5.3-3.9H3.55v2.45A9.5 9.5 0 0 0 12 21.5z"/><path d="M6.7 13.8a5.7 5.7 0 0 1 0-3.6V7.75H3.55a9.5 9.5 0 0 0 0 8.5z"/><path d="M12 6.3c1.39 0 2.63.48 3.6 1.4l2.7-2.7C16.7 3.5 14.55 2.5 12 2.5a9.5 9.5 0 0 0-8.45 5.25L6.7 10.2c.75-2.24 2.84-3.9 5.3-3.9z"/>'
};

/**
 * Brand mark — a heart-shaped apple with a leaf and the "B", traced from
 * favicon.ico. Vector so it stays crisp at any size and can take theme
 * colours; the .ico is still what the browser tab uses.
 *
 * NOTE: traced by eye from the 48px raster. If the original vector turns up,
 * swap this path data for it.
 */
function brandmark(size = 30) {
  return `<svg class="logo" width="${size}" height="${size}" viewBox="0 0 48 48" role="img"
    aria-label="${esc(t("app.name"))}">
    <!-- apple/heart body -->
    <path fill="var(--logo-body)" d="M24 13.6c2.6-3.3 6.2-4.6 9.6-3.6 4.4 1.3 6.9 5.9 6.2 11-.5 3.9-2.6 7.7-5.6 10.9-3 3.2-6.7 5.7-10.2 7.6-3.5-1.9-7.2-4.4-10.2-7.6-3-3.2-5.1-7-5.6-10.9-.7-5.1 1.8-9.7 6.2-11 3.4-1 7 .3 9.6 3.6z"/>
    <!-- leaf -->
    <path fill="var(--logo-leaf)" d="M24.6 12.4c-.5-3 .8-5.6 3.2-7 1.5-.9 3.2-1.2 4.6-1.2.3 2.6-.5 5-2.3 6.5-1.5 1.3-3.5 1.9-5.5 1.7z"/>
    <!-- the B -->
    <text x="24" y="31.5" text-anchor="middle" fill="var(--logo-mark)"
      font-family="Manrope, Inter, Helvetica, Arial, sans-serif" font-size="17" font-weight="800">B</text>
  </svg>`;
}

function icon(name, cls = "icon") {
  const path = ICON_PATHS[name] || ICON_PATHS.info;
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

/* ==========================================================================
   Charts — hand-built SVG. Consistent grammar across the whole app:
   muted grid, mono tick labels, one accent per series, gray for "no data".
   ========================================================================== */

/** Progress ring. pct may exceed 100 — the overflow renders in --warn. */
function ring(pct, { size = 78, stroke = 8, value, label, color = "var(--data-1)" } = {}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(pct, 100);
  const offset = c - (clamped / 100) * c;
  const isOver = pct > 100;
  return html`
    <div class="ring" role="img" aria-label="${label}: ${Math.round(pct)}%">
      ${raw(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle class="ring-track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"/>
        <circle class="ring-value" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"
          stroke="${isOver ? "var(--warn)" : color}"
          stroke-dasharray="${c}" stroke-dashoffset="${offset}"/>
      </svg>`)}
      <span class="ring-center">
        <span class="ring-num num">${value}</span>
        <span class="ring-label">${label}</span>
      </span>
    </div>`;
}

/** Macro split — stacked single bar + legend. Cheaper to read than a donut. */
function macroBar(macros) {
  const total = macros.reduce((s, m) => s + m.value, 0) || 1;
  let x = 0;
  const segs = macros.map((m, i) => {
    const wpc = (m.value / total) * 100;
    const s = `<rect x="${x}%" y="0" width="${wpc}%" height="14" fill="var(--data-${i + 1})">
      <title>${esc(m.label)}: ${m.value}g</title></rect>`;
    x += wpc;
    return s;
  }).join("");
  const legend = macros.map((m, i) =>
    `<li><span class="legend-swatch" style="background:var(--data-${i + 1})"></span>
      ${esc(m.label)} <span class="num text-muted">${m.value}g</span></li>`).join("");
  return `<div><svg class="chart" viewBox="0 0 100 14" preserveAspectRatio="none" height="14"
      style="border-radius:7px;overflow:hidden" role="img" aria-label="macros">${segs}</svg>
    <ul class="chart-legend">${legend}</ul></div>`;
}

/** 7-day consistency grid. Missed days are gray, never red. */
function weekDots(days) {
  const labels = I18n.weekdays();
  return `<div class="row" style="gap:var(--sp-2)">${days.map((d, i) => {
    const bg = d === "done" ? "var(--brand)" : d === "rest" ? "var(--data-track)" : "var(--data-neutral)";
    const key = d === "done" ? "habits.done" : d === "rest" ? "habits.rest" : "habits.missed";
    return `<div class="stack stack-2" style="align-items:center;flex:1">
        <div title="${esc(labels[i])}: ${esc(t(key))}" aria-label="${esc(labels[i])}: ${esc(t(key))}"
          style="width:100%;height:28px;border-radius:8px;background:${bg};
                 opacity:${d === "done" ? 1 : d === "rest" ? 0.6 : 0.45}"></div>
        <span class="text-2xs text-muted" style="font-size:var(--text-2xs)">${esc(labels[i])}</span>
      </div>`;
  }).join("")}</div>`;
}

/**
 * Coverage map — sets per muscle group for the training week.
 * Thresholds: 0 = gap, 1–5 = light, 6+ = covered. Status is spelled out in
 * the label too, so the meaning survives without colour.
 */
function coverageMap(groups) {
  return `<div class="coverage-grid">${groups.map((g) => {
    const level = g.sets === 0 ? "none" : g.sets <= 5 ? "low" : "good";
    const status = t("coverage." + level);
    return `<span class="coverage-chip coverage-${level}"
      title="${esc(t(g.key))}: ${esc(t("coverage.sets", { n: g.sets }))} — ${esc(status)}">
      ${esc(t(g.key))}
      <span class="num">${esc(t("coverage.sets", { n: I18n.num(g.sets) }))}</span>
    </span>`;
  }).join("")}</div>`;
}

/* ==========================================================================
   Toasts
   ========================================================================== */
function toast(message, kind = "ok") {
  const region = document.getElementById("toasts");
  const el = document.createElement("div");
  el.className = `toast toast-${kind}`;
  el.setAttribute("role", "status");
  el.innerHTML = `<span class="toast-icon">${icon(kind === "ok" ? "check" : kind === "warn" ? "alert" : "info")}</span>
    <span class="grow">${esc(message)}</span>`;
  region.appendChild(el);
  setTimeout(() => {
    el.classList.add("is-leaving");
    el.addEventListener("animationend", () => el.remove(), { once: true });
  }, 2600);
}

/* ==========================================================================
   Modal / bottom sheet — focus-trapped, Esc closes, restores focus.
   ========================================================================== */
const Modal = {
  lastFocus: null,

  /**
   * @param size  "md" (default) | "lg" — lg is for forms with tabular rows,
   *              which are unusable squeezed into 520px.
   * @param guard when true, a dismiss attempt with a dirty form asks first.
   */
  open({ title, body, actions = "", labelledBy = "modal-title", size = "md", guard = false }) {
    this.close(true);
    this.lastFocus = document.activeElement;
    this.guarded = guard;
    const wrap = document.createElement("div");
    wrap.className = "overlay";
    wrap.id = "overlay";
    wrap.innerHTML = `
      <div class="modal modal-${size}" role="dialog" aria-modal="true" aria-labelledby="${labelledBy}">
        <div class="modal-head">
          <div class="sheet-grip"></div>
          <div class="row-between">
            <h2 id="${labelledBy}" style="font-size:var(--text-lg)">${esc(title)}</h2>
            <button class="btn-icon" data-close aria-label="${esc(t("common.close"))}">${icon("x")}</button>
          </div>
        </div>
        <div class="modal-body stack stack-4">${body}</div>
        ${actions ? `<div class="modal-actions">${actions}</div>` : ""}
      </div>`;
    document.body.appendChild(wrap);
    document.body.style.overflow = "hidden";

    wrap.addEventListener("click", (e) => { if (e.target === wrap) this.tryClose(); });
    wrap.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", (e) => {
      // Links that also close (e.g. "Done") should still navigate.
      if (b.tagName !== "A") e.preventDefault();
      this.tryClose();
    }));
    document.addEventListener("keydown", this._onKey);

    // Snapshot the form so "dirty" is a fact, not a guess.
    const form = wrap.querySelector("form");
    this.snapshot = form ? this._serialize(form) : null;

    const focusables = this._focusables(wrap);
    (focusables[1] || focusables[0])?.focus();
    return wrap;
  },

  _serialize(form) {
    return [...form.querySelectorAll("input,select,textarea")]
      .map((el) => `${el.name || el.className}=${el.value}`).join("|");
  },

  isDirty() {
    const form = document.querySelector("#overlay form");
    if (!form || this.snapshot === null) return false;
    return this._serialize(form) !== this.snapshot;
  },

  /** Dismiss path — respects the unsaved-changes guard. */
  tryClose() {
    if (this.guarded && this.isDirty()) {
      if (!window.confirm(t("crud.discardConfirm"))) return;
    }
    this.close();
  },

  _focusables(root) {
    return [...root.querySelectorAll(
      'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'
    )];
  },

  _onKey(e) {
    const wrap = document.getElementById("overlay");
    if (!wrap) return;
    if (e.key === "Escape") { Modal.tryClose(); return; }
    // Cmd/Ctrl+Enter saves from anywhere in the form, including a textarea.
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      const submit = wrap.querySelector('[data-action="crud-submit"]');
      if (submit) { e.preventDefault(); submit.click(); }
      return;
    }
    if (e.key !== "Tab") return;
    const f = Modal._focusables(wrap);
    if (!f.length) return;
    const first = f[0], last = f.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  },

  close(silent) {
    const wrap = document.getElementById("overlay");
    if (wrap) wrap.remove();
    document.body.style.overflow = "";
    document.removeEventListener("keydown", this._onKey);
    this.guarded = false;
    this.snapshot = null;
    if (!silent && this.lastFocus) this.lastFocus.focus();
  }
};

/* ---- shared partials ------------------------------------------------------ */
/* The title is a <p>, not a heading: this renders at every depth of the page
   and a fixed heading level would break the document outline somewhere. */
function emptyState(iconName, title, body, action = "") {
  return `<div class="empty">
    <span class="empty-art">${icon(iconName, "icon")}</span>
    <p class="empty-title">${esc(title)}</p>
    <p>${esc(body)}</p>
    ${action}
  </div>`;
}

function skeletonCard() {
  return `<div class="card stack stack-3" aria-hidden="true">
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-line"></div>
    <div class="skeleton skeleton-line" style="width:80%"></div>
    <div class="skeleton skeleton-block"></div>
  </div>`;
}

function errorState(onRetryAction) {
  return `<div class="empty">
    <span class="empty-art">${icon("alert")}</span>
    <h3>${esc(t("state.error.title"))}</h3>
    <p>${esc(t("state.error.body"))}</p>
    <button class="btn btn-secondary" data-action="${onRetryAction}">
      ${icon("refresh", "icon icon-sm")} ${esc(t("common.retry"))}
    </button>
  </div>`;
}
