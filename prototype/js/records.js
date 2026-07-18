/* ==========================================================================
   Records — the prototype's data layer.

   One generic store behind every user-entered thing (meals, workouts,
   measurements). Gives each collection: create, read, update, delete, undo,
   date filtering, and localStorage persistence so a refresh doesn't wipe what
   you typed. Screens never touch localStorage or mutate arrays directly.
   ========================================================================== */

const KEY = "bfit.records";

/* ---- date helpers --------------------------------------------------------
   ISO yyyy-mm-dd is the storage format. Built from local parts, never
   toISOString(), which shifts across the UTC boundary and silently files an
   evening meal under the following day. ----------------------------------- */
const DateUtil = {
  iso(d = new Date()) {
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  },
  parse(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  },
  addDays(iso, n) {
    const d = this.parse(iso);
    d.setDate(d.getDate() + n);
    return this.iso(d);
  },
  isToday(iso) { return iso === this.iso(); },
  isFuture(iso) { return this.parse(iso) > this.parse(this.iso()); },

  /** Monday-first week containing `iso`. */
  weekRange(iso) {
    const d = this.parse(iso);
    const dow = (d.getDay() + 6) % 7;
    const start = this.addDays(iso, -dow);
    return { start, end: this.addDays(start, 6) };
  },
  monthRange(iso) {
    const d = this.parse(iso);
    return {
      start: this.iso(new Date(d.getFullYear(), d.getMonth(), 1)),
      end: this.iso(new Date(d.getFullYear(), d.getMonth() + 1, 0))
    };
  },

  /** Range for the active scope — used by every date-filtered list. */
  range(iso, scope) {
    if (scope === "week") return this.weekRange(iso);
    if (scope === "month") return this.monthRange(iso);
    return { start: iso, end: iso };
  },

  inRange(iso, { start, end }) { return iso >= start && iso <= end; },

  /** "Wednesday, 18 July" / "Today" — the label on the date bar. */
  label(iso, scope) {
    if (scope === "week") {
      const { start, end } = this.weekRange(iso);
      return `${I18n.date(this.parse(start), { day: "numeric", month: "short" })} – ${I18n.date(this.parse(end), { day: "numeric", month: "short" })}`;
    }
    if (scope === "month") return I18n.date(this.parse(iso), { month: "long", year: "numeric" });
    if (this.isToday(iso)) return t("common.today");
    if (iso === this.addDays(this.iso(), -1)) return t("date.yesterday");
    return I18n.date(this.parse(iso), { weekday: "long", day: "numeric", month: "long" });
  }
};

/* ========================================================================== */

const Records = {
  data: { meals: [], workouts: [], measurements: [] },
  date: DateUtil.iso(),
  scope: "day",          // day | week | month
  _undo: null,

  init() {
    const stored = this._load();
    this.data = stored || this._seed();
    if (!stored) this._save();
  },

  _load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Shape check — a half-written or older payload gets discarded rather
      // than crashing every screen that reads it.
      if (!parsed || !Array.isArray(parsed.meals) || !Array.isArray(parsed.workouts)) return null;
      return { meals: parsed.meals, workouts: parsed.workouts, measurements: parsed.measurements || [] };
    } catch (e) {
      console.warn("[records] unreadable store, reseeding", e);
      return null;
    }
  },

  _save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch (e) {
      // Quota or private mode: the app keeps working from memory this session.
      console.warn("[records] could not persist", e);
    }
  },

  id() { return Math.random().toString(36).slice(2, 10); },

  /* ---- seed: a few days of history so lists aren't empty on first run ---- */
  _seed() {
    const today = DateUtil.iso();
    const d = (n) => DateUtil.addDays(today, -n);
    return {
      meals: [
        { id: this.id(), date: today, slot: "breakfast", name: { mk: "Овесна каша со банана", en: "Oat porridge with banana" }, kcal: 420, p: 18, c: 62, f: 11, time: "08:10" },
        { id: this.id(), date: today, slot: "lunch", name: { mk: "Пилешко со леќа и салата", en: "Chicken with lentils and salad" }, kcal: 620, p: 46, c: 54, f: 20, time: "13:25" },
        { id: this.id(), date: today, slot: "snack", name: { mk: "Јогурт со ореви", en: "Yoghurt with walnuts" }, kcal: 270, p: 10, c: 22, f: 10, time: "16:40" },
        { id: this.id(), date: d(1), slot: "breakfast", name: { mk: "Јајца со леб", en: "Eggs on toast" }, kcal: 380, p: 24, c: 30, f: 17, time: "08:00" },
        { id: this.id(), date: d(1), slot: "dinner", name: { mk: "Печена риба со компир", en: "Baked fish with potatoes" }, kcal: 480, p: 38, c: 42, f: 16, time: "20:05" },
        { id: this.id(), date: d(2), slot: "lunch", name: { mk: "Салата со леблебија", en: "Chickpea salad" }, kcal: 430, p: 21, c: 44, f: 17, time: "13:00" }
      ],
      workouts: [
        { id: this.id(), date: d(2), name: { mk: "Горен дел", en: "Upper body" }, focus: "chest", minutes: 41, notes: "",
          exercises: [
            { id: this.id(), name: { mk: "Потисок на клупа", en: "Bench press" }, sets: 4, reps: "6–8", weight: 52.5, muscle: "muscle.chest" },
            { id: this.id(), name: { mk: "Згибови", en: "Pull-up" }, sets: 4, reps: "6–8", weight: 0, muscle: "muscle.lats" },
            { id: this.id(), name: { mk: "Потисок над глава", en: "Overhead press" }, sets: 3, reps: "8–10", weight: 30, muscle: "muscle.frontDelt" }
          ] },
        { id: this.id(), date: d(4), name: { mk: "Долен дел", en: "Lower body" }, focus: "legs", minutes: 44, notes: "",
          exercises: [
            { id: this.id(), name: { mk: "Чучањ со шипка", en: "Barbell squat" }, sets: 4, reps: "6–8", weight: 42.5, muscle: "muscle.quads" },
            { id: this.id(), name: { mk: "Романско мртво кревање", en: "Romanian deadlift" }, sets: 3, reps: "8–10", weight: 45, muscle: "muscle.hamstrings" }
          ] },
        { id: this.id(), date: d(7), name: { mk: "Цело тело", en: "Full body" }, focus: "full", minutes: 36, notes: "",
          exercises: [
            { id: this.id(), name: { mk: "Чучањ со шипка", en: "Barbell squat" }, sets: 3, reps: "8", weight: 40, muscle: "muscle.quads" },
            { id: this.id(), name: { mk: "Планк", en: "Plank" }, sets: 3, reps: "40 сек", weight: 0, muscle: "muscle.core" }
          ] }
      ],
      measurements: [
        { id: this.id(), date: d(28), weight: 74.8 }, { id: this.id(), date: d(21), weight: 74.3 },
        { id: this.id(), date: d(14), weight: 73.9 }, { id: this.id(), date: d(7), weight: 73.4 },
        { id: this.id(), date: today, weight: 73.1 }
      ]
    };
  },

  /* ---- read -------------------------------------------------------------- */
  all(kind) { return this.data[kind] || []; },

  /** Everything in the active date scope, newest first. */
  list(kind, { date = this.date, scope = this.scope } = {}) {
    const range = DateUtil.range(date, scope);
    return this.all(kind)
      .filter((r) => DateUtil.inRange(r.date, range))
      .sort((a, b) => (a.date === b.date
        ? (b.time || "").localeCompare(a.time || "")
        : b.date.localeCompare(a.date)));
  },

  get(kind, id) { return this.all(kind).find((r) => r.id === id); },

  count(kind, opts) { return this.list(kind, opts).length; },

  /* ---- write ------------------------------------------------------------- */
  create(kind, record) {
    const row = { id: this.id(), date: this.date, ...record };
    this.data[kind].push(row);
    this._save();
    return row;
  },

  update(kind, id, patch) {
    const row = this.get(kind, id);
    if (!row) return null;
    Object.assign(row, patch);
    this._save();
    return row;
  },

  /** Deletes, but keeps the row and its position so undo can put it back. */
  remove(kind, id) {
    const i = this.data[kind].findIndex((r) => r.id === id);
    if (i < 0) return null;
    const [row] = this.data[kind].splice(i, 1);
    this._undo = { kind, row, index: i };
    this._save();
    return row;
  },

  undo() {
    if (!this._undo) return false;
    const { kind, row, index } = this._undo;
    this.data[kind].splice(index, 0, row);
    this._undo = null;
    this._save();
    return true;
  },

  /* ---- date navigation --------------------------------------------------- */
  setDate(iso) { this.date = iso; },
  setScope(scope) { this.scope = scope; },
  step(n) {
    const unit = this.scope === "month" ? 30 : this.scope === "week" ? 7 : 1;
    const next = DateUtil.addDays(this.date, n * unit);
    // No logging into the future — there is nothing to record there.
    if (DateUtil.isFuture(next)) return false;
    this.date = next;
    return true;
  },
  goToday() { this.date = DateUtil.iso(); },

  /* ---- derived ----------------------------------------------------------- */
  /** Macro + energy totals for the meals in scope. */
  totals(opts) {
    return this.list("meals", opts).reduce((sum, m) => ({
      kcal: sum.kcal + (+m.kcal || 0),
      p: sum.p + (+m.p || 0),
      c: sum.c + (+m.c || 0),
      f: sum.f + (+m.f || 0)
    }), { kcal: 0, p: 0, c: 0, f: 0 });
  },

  /** Total volume (kg lifted) for one workout. */
  volume(workout) {
    return (workout.exercises || []).reduce(
      (sum, ex) => sum + (+ex.sets || 0) * (parseFloat(ex.reps) || 0) * (+ex.weight || 0), 0);
  },

  /** Sets per muscle group across the scope — feeds the coverage map. */
  coverage(opts) {
    const tally = {};
    this.list("workouts", opts).forEach((w) =>
      (w.exercises || []).forEach((ex) => {
        if (!ex.muscle) return;
        tally[ex.muscle] = (tally[ex.muscle] || 0) + (+ex.sets || 0);
      }));
    // Groups the user trained, plus the ones they didn't — the gaps are the point.
    const tracked = ["muscle.chest", "muscle.lats", "muscle.frontDelt", "muscle.rearDelt",
      "muscle.triceps", "muscle.quads", "muscle.hamstrings", "muscle.glutes", "muscle.core"];
    return tracked.map((key) => ({ key, sets: tally[key] || 0 }))
      .sort((a, b) => b.sets - a.sets);
  }
};
