export const publicHumanRoutes = [
  "/",
  "/features",
  "/features/nutrition",
  "/features/training",
  "/anatomy",
  "/anatomy/pectorals",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/states",
  "/sign-in",
  "/sign-up",
  "/magic-link",
  "/forgot-password",
  "/reset-password",
  "/~offline",
] as const;

export const machineRoutes = [
  "/manifest.webmanifest",
  "/robots.txt",
  "/sitemap.xml",
  "/feed.xml",
  "/sw.js",
] as const;

export const protectedRoutes = [
  "/today",
  "/nutrition",
  "/meal-planner",
  "/recipes",
  "/grocery-list",
  "/training",
  "/training/planner",
  "/workouts",
  "/exercises",
  "/workout-history",
  "/personal-records",
  "/progress",
  "/goals",
  "/habits",
  "/notifications",
  "/assistant",
] as const;

export const responsiveRoutes = [
  "/",
  "/features",
  "/anatomy",
  "/blog",
  "/blog/progressive-overload-for-beginners",
  "/sign-in",
  "/~offline",
] as const;
