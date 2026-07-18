/* ==========================================================================
   Theme — light / dark / system.
   The resolved theme is applied by an inline script in <head> BEFORE paint,
   so there is never a flash of the wrong theme. This file only handles
   changes made after load.
   ========================================================================== */

const THEME_KEY = "bfit.theme";
const MOTION_KEY = "bfit.reducedMotion";

const Theme = {
  pref: "system",          // what the user chose
  resolved: "light",       // what is actually rendered
  listeners: [],
  mql: window.matchMedia("(prefers-color-scheme: dark)"),

  init() {
    this.pref = localStorage.getItem(THEME_KEY) || "system";
    this.apply();
    // Follow the OS while the pref is "system".
    this.mql.addEventListener("change", () => {
      if (this.pref === "system") this.apply();
    });
    if (localStorage.getItem(MOTION_KEY) === "1") {
      document.documentElement.setAttribute("data-reduced-motion", "true");
    }
  },

  set(pref) {
    this.pref = pref;
    localStorage.setItem(THEME_KEY, pref);
    this.apply();
  },

  apply() {
    this.resolved = this.pref === "system"
      ? (this.mql.matches ? "dark" : "light")
      : this.pref;
    document.documentElement.setAttribute("data-theme", this.resolved);
    const meta = document.querySelector('meta[name="theme-color"]');
    // Must track --bg in tokens.css; a stale value here shows as the wrong
    // browser chrome colour on mobile after a theme switch.
    if (meta) meta.setAttribute("content", this.resolved === "dark" ? "#0B1220" : "#F4F7FA");
    this.listeners.forEach((fn) => fn(this.resolved));
  },

  onChange(fn) { this.listeners.push(fn); },

  setReducedMotion(on) {
    localStorage.setItem(MOTION_KEY, on ? "1" : "0");
    document.documentElement.toggleAttribute("data-reduced-motion", on);
  },

  reducedMotion() {
    return document.documentElement.hasAttribute("data-reduced-motion")
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
};
