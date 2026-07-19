const blockedDestinations = ["/sign-in", "/sign-up", "/magic-link", "/forgot-password", "/reset-password", "/auth/callback"];

export function sanitizeNextPath(value: string | null | undefined, fallback = "/today") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\u0000-\u001f]/.test(value)) return fallback;
  try {
    const url = new URL(value, "https://bfit.local");
    if (url.origin !== "https://bfit.local" || blockedDestinations.some((path) => url.pathname === path || url.pathname.startsWith(`${path}/`))) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function getAccountDestination(
  onboardingComplete: boolean,
  next?: string | null,
) {
  const destination = sanitizeNextPath(next);

  if (onboardingComplete) {
    return destination;
  }

  return destination === "/today"
    ? "/onboarding"
    : `/onboarding?next=${encodeURIComponent(destination)}`;
}
