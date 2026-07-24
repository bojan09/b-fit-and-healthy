let pending: Promise<typeof import("gsap")> | null = null;

export function loadGsap() {
  pending ??= import("gsap");
  return pending;
}

export function resetGsapLoaderForTests() {
  pending = null;
}
