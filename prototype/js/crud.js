/* ==========================================================================
   Shared CRUD + date-filter UI.

   Every screen that holds user-entered data uses these three pieces, so the
   interaction is identical whether you're editing a meal or a workout:
     dateBar()   — scope toggle + day stepper + "today"
     recordRow() — a row with edit / delete affordances
     Crud        — form modal, validation, delete-with-undo
   ========================================================================== */

/* ---- date bar ------------------------------------------------------------ */
function dateBar({ count, countKey } = {}) {
  const iso = Records.date;
  const scope = Records.scope;
  const atToday = DateUtil.isToday(iso) && scope === "day";
  const nextDisabled = DateUtil.isFuture(DateUtil.addDays(iso, 1));

  const scopes = ["day", "week", "month"];

  return `
  <div class="date-bar">
    <div class="date-nav">
      <button class="btn-icon" data-action="date-step" data-n="-1"
        aria-label="${esc(t("date.prev"))}">${icon("chevronLeft")}</button>

      <div class="date-current">
        <span class="date-label">${esc(DateUtil.label(iso, scope))}</span>
        ${count !== undefined && countKey
          ? `<span class="date-count num">${esc(t(countKey, { n: I18n.num(count) }))}</span>` : ""}
      </div>

      <button class="btn-icon" data-action="date-step" data-n="1"
        ${nextDisabled ? "disabled" : ""} aria-label="${esc(t("date.next"))}">${icon("chevronRight")}</button>
    </div>

    <div class="date-tools">
      ${!atToday ? `<button class="btn btn-ghost btn-sm" data-action="date-today">
        ${icon("target", "icon icon-sm")} ${esc(t("common.today"))}</button>` : ""}

      <label class="visually-hidden" for="date-pick">${esc(t("date.pick"))}</label>
      <input class="input date-input" id="date-pick" type="date" value="${esc(iso)}"
        max="${esc(DateUtil.iso())}" data-action="date-pick">

      <div class="segmented" role="radiogroup" aria-label="${esc(t("date.day"))}">
        ${scopes.map((s) => `
          <button role="radio" aria-checked="${scope === s}" data-action="date-scope" data-id="${s}">
            ${esc(t("date." + s))}
          </button>`).join("")}
      </div>
    </div>
  </div>`;
}

/* ---- a record row with actions ------------------------------------------- */
function recordRow({ kind, id, title, meta, right = "", icon: ic = "clock" }) {
  return `
  <li class="record-row">
    <span class="record-icon" aria-hidden="true">${icon(ic, "icon icon-sm")}</span>
    <button class="record-main" data-action="crud-edit" data-kind="${kind}" data-id="${id}">
      <span class="record-title">${esc(title)}</span>
      <span class="record-meta">${meta}</span>
    </button>
    ${right ? `<span class="record-right">${right}</span>` : ""}
    <span class="record-actions">
      <button class="btn-icon" data-action="crud-edit" data-kind="${kind}" data-id="${id}"
        aria-label="${esc(t("crud.edit"))}">${icon("settings", "icon icon-sm")}</button>
      <button class="btn-icon btn-icon-danger" data-action="crud-delete" data-kind="${kind}" data-id="${id}"
        aria-label="${esc(t("crud.delete"))}">${icon("trash", "icon icon-sm")}</button>
    </span>
  </li>`;
}

/* ==========================================================================
   Crud — form modal + validation + delete/undo
   ========================================================================== */
const Crud = {
  /** Field schemas per collection. Screens describe data; this renders it. */
  schema: {
    meals: () => [
      { name: "name", label: t("meals.name"), type: "text", required: true, placeholder: t("meals.namePlaceholder") },
      { name: "slot", label: t("meals.slot"), type: "select", options: [
        ["breakfast", t("today.breakfast")], ["lunch", t("today.lunch")],
        ["dinner", t("today.dinner")], ["snack", t("today.snack")] ] },
      { name: "time", label: t("meals.time"), type: "time" },
      { name: "kcal", label: t("nutrition.energy") + " (" + t("common.kcal") + ")", type: "number", required: true, min: 0 },
      { name: "p", label: t("nutrition.protein") + " (" + t("common.g") + ")", type: "number", min: 0 },
      { name: "c", label: t("nutrition.carbs") + " (" + t("common.g") + ")", type: "number", min: 0 },
      { name: "f", label: t("nutrition.fat") + " (" + t("common.g") + ")", type: "number", min: 0 }
    ],
    workouts: () => [
      { name: "name", label: t("workouts.name"), type: "text", required: true, placeholder: t("workouts.namePlaceholder") },
      { name: "minutes", label: t("workouts.minutes"), type: "number", min: 0 },
      { name: "notes", label: t("workouts.notes"), type: "textarea", placeholder: t("workouts.notesPlaceholder") }
    ],
    measurements: () => [
      { name: "weight", label: t("progress.weight") + " (" + t("common.kg") + ")", type: "number", step: "0.1", required: true, min: 0 }
    ]
  },

  titleFor(kind, editing) {
    const map = {
      meals: editing ? "meals.edit" : "meals.new",
      workouts: editing ? "workouts.edit" : "workouts.new",
      measurements: editing ? "crud.edit" : "progress.addEntry"
    };
    return t(map[kind]);
  },

  field(f, value) {
    const v = value === undefined || value === null ? "" : value;
    const id = `f-${f.name}`;
    const req = f.required ? "required" : "";
    const err = `<p class="error-text" id="e-${f.name}" hidden>${icon("alert", "icon icon-sm")}
      <span>${esc(f.required ? t("crud.required") : t("crud.numberRequired"))}</span></p>`;

    if (f.type === "select") {
      return `<div class="field" data-field="${f.name}">
        <label class="label" for="${id}">${esc(f.label)}</label>
        <select class="select" id="${id}" name="${f.name}">
          ${f.options.map(([val, lab]) =>
            `<option value="${esc(val)}" ${val === v ? "selected" : ""}>${esc(lab)}</option>`).join("")}
        </select>${err}</div>`;
    }
    if (f.type === "textarea") {
      return `<div class="field" data-field="${f.name}">
        <label class="label" for="${id}">${esc(f.label)}</label>
        <textarea class="textarea" id="${id}" name="${f.name}"
          placeholder="${esc(f.placeholder || "")}">${esc(v)}</textarea>${err}</div>`;
    }
    return `<div class="field" data-field="${f.name}">
      <label class="label" for="${id}">${esc(f.label)}</label>
      <input class="input ${f.type === "number" ? "num" : ""}" id="${id}" name="${f.name}"
        type="${f.type}" value="${esc(v)}" ${req}
        ${f.type === "number" ? `inputmode="decimal" min="${f.min ?? 0}" step="${f.step || "1"}"` : ""}
        placeholder="${esc(f.placeholder || "")}">${err}</div>`;
  },

  /** Open the create/edit form. `id` omitted = create. */
  open(kind, id) {
    const editing = !!id;
    const row = editing ? Records.get(kind, id) : null;
    if (editing && !row) return;

    const fields = this.schema[kind]();
    const value = (f) => {
      if (!row) return f.name === "time" ? new Date().toTimeString().slice(0, 5) : "";
      const raw = row[f.name];
      return f.name === "name" ? L(raw) : raw;
    };

    const body = `
      <form class="stack stack-4" id="crud-form" data-kind="${kind}" data-id="${id || ""}" novalidate>
        <div class="form-grid">${fields.map((f) => this.field(f, value(f))).join("")}</div>
        ${kind === "workouts" ? this.exerciseEditor(row) : ""}
      </form>`;

    Modal.open({
      title: this.titleFor(kind, editing),
      body,
      // Workouts hold a tabular sub-form; 520px is unusable for it.
      size: kind === "workouts" ? "lg" : "md",
      guard: true,
      actions: `
        ${editing ? `<button class="btn btn-ghost" style="color:var(--danger);margin-right:auto"
          data-action="crud-delete" data-kind="${kind}" data-id="${id}">
          ${icon("trash", "icon icon-sm")} ${esc(t("crud.delete"))}</button>` : ""}
        <button class="btn btn-ghost" data-close>${esc(t("common.cancel"))}</button>
        <button class="btn btn-primary" data-action="crud-submit">
          ${esc(editing ? t("crud.saveChanges") : t("crud.save"))}</button>`
    });
  },

  /** Nested exercise rows inside the workout form. */
  exerciseEditor(row) {
    const list = (row && row.exercises) || [];
    return `
    <fieldset class="ex-editor">
      <legend class="label">${esc(t("workouts.exercises"))}</legend>

      <!-- Visible column headers on wide screens; each field keeps its own
           aria-label for the stacked mobile layout where these are hidden. -->
      <div class="ex-head" aria-hidden="true">
        <span></span>
        <span>${esc(t("workouts.exerciseName"))}</span>
        <span>${esc(t("workouts.muscle"))}</span>
        <span>${esc(t("train.sets"))}</span>
        <span>${esc(t("train.reps"))}</span>
        <span>${esc(t("common.kg"))}</span>
        <span></span>
      </div>

      <ul class="ex-list" id="ex-list">
        ${list.map((ex) => this.exerciseRow(ex)).join("")}
      </ul>
      ${list.length === 0 ? `<p class="hint" id="ex-empty">${esc(t("workouts.noExercises"))}</p>` : ""}
      <button type="button" class="btn btn-secondary btn-sm" data-action="ex-add">
        ${icon("plus", "icon icon-sm")} ${esc(t("workouts.addExercise"))}
      </button>
    </fieldset>`;
  },

  exerciseRow(ex = {}) {
    const muscles = ["muscle.chest", "muscle.lats", "muscle.frontDelt", "muscle.rearDelt",
      "muscle.triceps", "muscle.quads", "muscle.hamstrings", "muscle.glutes", "muscle.core"];
    return `
    <li class="ex-row">
      <span class="ex-num num" aria-hidden="true"></span>
      <label class="ex-field">
        <span class="ex-field-label">${esc(t("workouts.exerciseName"))}</span>
        <input class="input" name="ex-name" value="${esc(L(ex.name) || "")}"
          placeholder="${esc(t("workouts.exerciseName"))}">
      </label>
      <label class="ex-field">
        <span class="ex-field-label">${esc(t("workouts.muscle"))}</span>
        <select class="select" name="ex-muscle">
          ${muscles.map((m) => `<option value="${m}" ${ex.muscle === m ? "selected" : ""}>${esc(t(m))}</option>`).join("")}
        </select>
      </label>
      <label class="ex-field">
        <span class="ex-field-label">${esc(t("train.sets"))}</span>
        <input class="input num" name="ex-sets" type="number" inputmode="numeric" min="0"
          value="${esc(ex.sets ?? "")}" placeholder="0">
      </label>
      <label class="ex-field">
        <span class="ex-field-label">${esc(t("train.reps"))}</span>
        <input class="input num" name="ex-reps" value="${esc(ex.reps ?? "")}" placeholder="8–10">
      </label>
      <label class="ex-field">
        <span class="ex-field-label">${esc(t("common.kg"))}</span>
        <input class="input num" name="ex-weight" type="number" inputmode="decimal" min="0" step="0.5"
          value="${esc(ex.weight ?? "")}" placeholder="0">
      </label>
      <button type="button" class="btn-icon btn-icon-danger" data-action="ex-remove"
        aria-label="${esc(t("crud.delete"))}">${icon("x", "icon icon-sm")}</button>
    </li>`;
  },

  /** Validate + persist. Returns false and focuses the first bad field. */
  submit() {
    const form = document.getElementById("crud-form");
    if (!form) return;
    const kind = form.dataset.kind;
    const id = form.dataset.id || null;
    const fields = this.schema[kind]();

    let firstBad = null;
    const values = {};

    fields.forEach((f) => {
      const el = form.querySelector(`[name="${f.name}"]`);
      const wrap = form.querySelector(`[data-field="${f.name}"]`);
      const errEl = form.querySelector(`#e-${f.name}`);
      const raw = (el.value || "").trim();

      let bad = false;
      if (f.required && !raw) bad = true;
      if (!bad && f.type === "number" && raw !== "" && !isFinite(+raw)) bad = true;

      wrap.classList.toggle("field-error", bad);
      if (errEl) errEl.hidden = !bad;
      el.setAttribute("aria-invalid", String(bad));
      if (bad && !firstBad) firstBad = el;

      values[f.name] = f.type === "number" ? (raw === "" ? 0 : +raw) : raw;
    });

    if (firstBad) { firstBad.focus(); return; }

    // The name is authored bilingually in seed data; user input is one string.
    if (values.name !== undefined) values.name = { mk: values.name, en: values.name };

    if (kind === "workouts") {
      values.exercises = [...form.querySelectorAll(".ex-row")].map((r) => {
        const g = (n) => r.querySelector(`[name="${n}"]`).value.trim();
        const nm = g("ex-name");
        if (!nm) return null;
        return {
          id: Records.id(), name: { mk: nm, en: nm }, muscle: g("ex-muscle"),
          sets: +g("ex-sets") || 0, reps: g("ex-reps"), weight: +g("ex-weight") || 0
        };
      }).filter(Boolean);
    }

    if (id) Records.update(kind, id, values);
    else Records.create(kind, values);

    Modal.close();
    toast(id ? t("crud.updated") : t("crud.created"));
    Router.render();
  },

  /** Delete with a real undo path — nothing user-entered vanishes for good. */
  confirmDelete(kind, id) {
    Modal.open({
      title: t("confirm.delete.title"),
      body: `<p class="text-secondary">${esc(t("confirm.delete.body"))}</p>`,
      actions: `
        <button class="btn btn-ghost" data-close>${esc(t("common.cancel"))}</button>
        <button class="btn btn-danger" data-action="crud-delete-confirm"
          data-kind="${kind}" data-id="${id}">${esc(t("crud.delete"))}</button>`
    });
  },

  doDelete(kind, id) {
    Records.remove(kind, id);
    Modal.close();
    toastWithAction(t("crud.deleted"), t("crud.undo"), "crud-undo");
    Router.render();
  }
};

/** A toast carrying one action button (used for undo). */
function toastWithAction(message, actionLabel, action) {
  const region = document.getElementById("toasts");
  const el = document.createElement("div");
  el.className = "toast toast-ok";
  el.setAttribute("role", "status");
  el.innerHTML = `<span class="toast-icon">${icon("check")}</span>
    <span class="grow">${esc(message)}</span>
    <button class="btn btn-ghost btn-sm" data-action="${esc(action)}">${esc(actionLabel)}</button>`;
  region.appendChild(el);
  const kill = setTimeout(() => {
    el.classList.add("is-leaving");
    el.addEventListener("animationend", () => el.remove(), { once: true });
  }, 6000);   // longer than a normal toast: undo needs a real window
  el.addEventListener("click", () => clearTimeout(kill));
}
