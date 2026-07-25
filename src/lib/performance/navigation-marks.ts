export const NAVIGATION_INTENT_MARK = "bfh:navigation-intent";
export const NAVIGATION_READY_MARK = "bfh:navigation-ready";

export function markNavigationIntent(href: string) {
  if (typeof window === "undefined") return;
  document.documentElement.dataset.navigationPending = href;
  performance.mark(NAVIGATION_INTENT_MARK, { detail: { href } });
}

export function markNavigationReady(href: string) {
  if (typeof window === "undefined") return;
  if (document.documentElement.dataset.navigationPending === href) {
    delete document.documentElement.dataset.navigationPending;
  }
  performance.mark(NAVIGATION_READY_MARK, { detail: { href } });
}
