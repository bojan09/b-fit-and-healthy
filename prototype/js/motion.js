/* ==========================================================================
   Motion controller.

   Runs after every render (the router replaces innerHTML, so observers and
   listeners are rebuilt each time). Everything here is additive: if this file
   never runs, the page is still complete and readable — it just doesn't move.
   ========================================================================== */

const Motion = {
  observers: [],
  cleanups: [],

  allowed() {
    return !Theme.reducedMotion();
  },

  /** Called from Actions.afterRender(). */
  init() {
    this.teardown();

    if (!this.allowed()) {
      document.documentElement.classList.remove("js-motion");
      // Make sure nothing stays hidden or half-counted.
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      document.querySelectorAll("[data-count]").forEach((el) => this.setCount(el, +el.dataset.count));
      Shader.destroy();
      return;
    }

    document.documentElement.classList.add("js-motion");
    this.fills();      // must capture target widths before anything reveals
    this.reveals();
    this.spotlights();
    this.tilt();
    this.magnetic();
    this.condensingNav();
    this.mountShader();
  },

  teardown() {
    this.observers.forEach((o) => o.disconnect());
    this.observers = [];
    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];
  },

  /* ---- scroll reveal -----------------------------------------------------
     Two paths on purpose. IntersectionObserver drives the normal case, but it
     does not fire while the document is hidden — a page opened in a background
     tab would sit at opacity 0. So a cheap manual sweep runs alongside it on
     init, on scroll, and when the tab becomes visible. Whichever wins, wins. */
  reveals() {
    const items = [...document.querySelectorAll("[data-reveal]")];
    if (!items.length) return;

    const show = (el) => {
      if (el.classList.contains("is-in")) return;
      el.classList.add("is-in");
      el.querySelectorAll("[data-count]").forEach((c) => this.countUp(c));
    };

    // Manual sweep — reveals anything whose top edge is inside the viewport.
    const sweep = () => {
      const limit = window.innerHeight * 0.92;
      items.forEach((el) => {
        if (el.classList.contains("is-in")) return;
        const r = el.getBoundingClientRect();
        if (r.top < limit && r.bottom > 0) show(el);
      });
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          show(e.target);
          io.unobserve(e.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      items.forEach((el) => io.observe(el));
      this.observers.push(io);
    } else {
      items.forEach(show);      // no observer support: never hide anything
    }

    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { sweep(); queued = false; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", sweep);
    this.cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", sweep);
    });
    sweep();

    // Index children of a group so they stagger rather than arriving as a slab.
    document.querySelectorAll("[data-stagger]").forEach((group) => {
      [...group.children].forEach((child, i) => child.style.setProperty("--i", i));
    });
    document.querySelectorAll(".coverage-grid").forEach((grid) => {
      [...grid.children].forEach((chip, i) => chip.style.setProperty("--ci", i));
    });
  },

  /* ---- bars fill on entry ------------------------------------------------ */
  fills() {
    document.querySelectorAll("[data-fill]").forEach((wrap) => {
      const bar = wrap.querySelector(".bar-fill");
      if (bar && !wrap.style.getPropertyValue("--target-w")) {
        wrap.style.setProperty("--target-w", bar.style.width || "0%");
      }
    });
  },

  /* ---- numeric count-up -------------------------------------------------- */
  setCount(el, value) {
    const digits = +el.dataset.countDigits || 0;
    el.textContent = (el.dataset.countPrefix || "") + I18n.num(value, digits) + (el.dataset.countSuffix || "");
  },

  countUp(el) {
    if (el.dataset.counted === "1") return;
    el.dataset.counted = "1";
    const target = +el.dataset.count;
    if (!isFinite(target)) return;

    const dur = 900;
    const t0 = performance.now();
    el.classList.add("counting");

    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);          // ease-out cubic
      this.setCount(el, target * eased);
      if (p < 1) requestAnimationFrame(step);
      else this.setCount(el, target);                 // land on the exact value
    };
    requestAnimationFrame(step);
  },

  /* ---- cursor spotlight on cards ----------------------------------------- */
  spotlights() {
    const cards = [...document.querySelectorAll(".spotlight")];
    if (!cards.length || !matchMedia("(hover: hover)").matches) return;

    let frame = null;
    const onMove = (e) => {
      const card = e.currentTarget;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
        frame = null;
      });
    };

    cards.forEach((c) => c.addEventListener("pointermove", onMove));
    this.cleanups.push(() => cards.forEach((c) => c.removeEventListener("pointermove", onMove)));
  },

  /* ---- peek panel 3D tilt ------------------------------------------------ */
  tilt() {
    const panel = document.querySelector(".peek");
    const stage = document.querySelector(".peek-stage");
    if (!panel || !stage || !matchMedia("(hover: hover)").matches) return;

    const MAX = 3.5;   // degrees. Any more and it reads as a gimmick.
    let frame = null;

    const onMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const r = stage.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        panel.classList.add("is-tilting");
        panel.style.setProperty("--ry", `${px * MAX * 2}deg`);
        panel.style.setProperty("--rx", `${-py * MAX * 2}deg`);
        frame = null;
      });
    };
    const onLeave = () => {
      panel.classList.remove("is-tilting");
      panel.style.setProperty("--rx", "0deg");
      panel.style.setProperty("--ry", "0deg");
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    this.cleanups.push(() => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    });
  },

  /* ---- magnetic buttons -------------------------------------------------- */
  magnetic() {
    const btns = [...document.querySelectorAll(".btn-magnetic")];
    if (!btns.length || !matchMedia("(hover: hover)").matches) return;

    const PULL = 5;    // px
    const onMove = (e) => {
      const b = e.currentTarget;
      const r = b.getBoundingClientRect();
      b.style.setProperty("--pull-x", `${((e.clientX - r.left) / r.width - 0.5) * PULL * 2}px`);
      b.style.setProperty("--pull-y", `${((e.clientY - r.top) / r.height - 0.5) * PULL}px`);
    };
    const onLeave = (e) => {
      e.currentTarget.style.setProperty("--pull-x", "0px");
      e.currentTarget.style.setProperty("--pull-y", "0px");
    };

    btns.forEach((b) => {
      b.addEventListener("pointermove", onMove);
      b.addEventListener("pointerleave", onLeave);
    });
    this.cleanups.push(() => btns.forEach((b) => {
      b.removeEventListener("pointermove", onMove);
      b.removeEventListener("pointerleave", onLeave);
    }));
  },

  /* ---- landing nav condenses --------------------------------------------- */
  condensingNav() {
    const nav = document.querySelector(".landing-nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("is-condensed", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    this.cleanups.push(() => window.removeEventListener("scroll", onScroll));
  },

  /* ---- shader ------------------------------------------------------------ */
  mountShader() {
    const stage = document.querySelector(".hero-stage");
    if (stage) Shader.mount(stage);
    else Shader.destroy();
  }
};
