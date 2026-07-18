/* Restrained vanilla motion. Content never depends on this controller. */
const Motion = {
  observers: [],
  cleanups: [],
  haloMounted: false,

  allowed() { return !Theme.reducedMotion(); },

  init() {
    this.teardownRoute();
    document.documentElement.classList.toggle("js-motion", this.allowed());
    document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-in"));
    this.mountHalo();
    this.condensingNav();
  },

  teardownRoute() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.cleanups.forEach((cleanup) => cleanup());
    this.cleanups = [];
  },

  teardown() {
    this.teardownRoute();
    if (this.haloCleanup) this.haloCleanup();
    this.haloCleanup = null;
    this.haloMounted = false;
  },

  mountHalo() {
    if (this.haloMounted || !this.allowed() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let x = window.innerWidth * 0.72;
    let y = window.innerHeight * 0.18;
    const paint = () => {
      document.documentElement.style.setProperty("--halo-x", `${x}px`);
      document.documentElement.style.setProperty("--halo-y", `${y}px`);
      frame = 0;
    };
    const onPointerMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    this.haloCleanup = () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
    this.haloMounted = true;
  },

  condensingNav() {
    const nav = document.querySelector(".landing-nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("is-condensed", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    this.cleanups.push(() => window.removeEventListener("scroll", onScroll));
    onScroll();
  }
};
