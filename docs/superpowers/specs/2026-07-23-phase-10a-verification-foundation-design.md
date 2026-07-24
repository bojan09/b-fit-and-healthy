# Phase 10A Verification Foundation Design

**Status:** Approved for implementation  
**Date:** 2026-07-23  
**Phase:** 10A of Production Hardening

## 1. Purpose

Phase 10A creates a repeatable browser-verification foundation for the local Next.js production build. It turns the most important public, anonymous, responsive, accessibility, runtime, authentication-boundary, and PWA expectations into executable Playwright checks.

The phase does not redesign product surfaces. It establishes reliable evidence for the fix cycles that follow in later Phase 10 workstreams.

## 2. Approved decisions

- The suite targets the local production server at `http://localhost:3000`.
- Playwright is the primary browser test runner.
- `@axe-core/playwright` provides automated WCAG 2.2 A/AA checks.
- Chromium desktop, tablet, and mobile are the primary projects.
- Firefox desktop and WebKit mobile provide secondary smoke coverage.
- Public and anonymous-protection tests run without credentials.
- Authenticated tests run only when a dedicated Supabase test account is supplied.
- The suite never uses a personal account.
- Phase 10A authenticated coverage is read-only after sign-in.
- Lighthouse CI thresholds are deferred to Phase 10C.
- Visual snapshot baselines are deferred to the later visual-consistency workstream.
- Traces, screenshots, and videos are retained only when a test fails.
- No `.env.example` file is created.
- No Git operation is performed by Codex.

## 3. Scope

### Included

- Playwright configuration for the local production application.
- Desktop, tablet, mobile, Firefox, and WebKit projects with intentionally bounded coverage.
- Route inventory for covered public, authentication, protected, machine-readable, and offline routes.
- Shared runtime monitoring for page errors, severe console messages, failed document/application responses, and hydration failures.
- Public-route integrity checks.
- Internal-link and in-page-anchor checks.
- Responsive overflow and viewport-containment checks.
- Automated accessibility checks for rendered and explicitly opened interactive states.
- Keyboard checks for skip navigation, public navigation, mobile navigation, theme, locale, and Anatomy interactions.
- Reduced-motion verification.
- Anonymous protected-route redirect checks.
- Optional dedicated-account sign-in, session-restoration, and protected-page smoke checks.
- PWA manifest, service-worker, offline-route, and private-network-policy smoke checks.
- Verification that the SVG Anatomy atlas remains the active fallback without a licensed manifest.
- Failure artifacts and an HTML report.
- Local operating documentation.
- Integration with the existing contract, Vitest, typecheck, lint, and production-build gate.

### Excluded

- Product redesign or new product functionality.
- Data-changing authenticated E2E workflows.
- Personal or production-user credentials.
- Automatic creation or deletion of remote Supabase records.
- Lighthouse CI scoring and hard Core Web Vitals budgets.
- Pixel-diff visual regression baselines.
- Full seven-width screenshot coverage.
- Exhaustive screen-reader testing.
- Full manual WCAG conformance certification.
- Security penetration testing.
- Distributed rate limiting.
- New RLS policies or database migrations unless a later audit proves a concrete defect.
- A live Three.js anatomy model without a licensed, named-mesh asset manifest.
- CI-provider configuration.
- Vercel preview testing.

## 4. Architecture

### 4.1 Test runner

Pin these registry-verified versions:

- `@playwright/test` `1.61.1`
- `@axe-core/playwright` `4.12.1`

The Playwright configuration uses:

- `testDir: "./tests/e2e"`
- `baseURL: "http://127.0.0.1:3000"`
- an existing production build served with `npm run start`
- deterministic retries and worker counts appropriate for local execution
- HTML and concise terminal reporters
- screenshots only on failure
- traces on first retry
- videos retained only on failure
- no broad console-warning allowlist

The operating workflow builds the application before the browser suite and ensures port `3000` is not occupied by a stale process. Playwright starts the production server for the test run. The normal user-facing server can be restarted after verification.

### 4.2 Browser and viewport projects

Primary projects:

- `chromium-desktop`: 1440 by 1000
- `chromium-tablet`: 768 by 1024
- `chromium-mobile`: 375 by 812 with touch and mobile behavior

Secondary smoke projects:

- `firefox-desktop`: desktop public/runtime smoke
- `webkit-mobile`: mobile public/runtime smoke

The primary Chromium projects run the complete Phase 10A suite where applicable. Secondary projects run a tagged smoke subset so the quality gate remains useful rather than needlessly slow.

### 4.3 Test boundaries

Tests are divided by responsibility:

- `fixtures/runtime-monitor.ts` records browser and request failures.
- `fixtures/auth.ts` detects credential availability and provides dedicated-account sign-in helpers without logging secrets.
- `route-inventory.ts` is the single source of truth for covered routes and route categories.
- `public-routes.spec.ts` checks route responses, metadata basics, links, anchors, and landmarks.
- `accessibility.spec.ts` checks axe results and keyboard behavior.
- `responsive-layout.spec.ts` checks overflow and critical viewport containment.
- `public-interactions.spec.ts` checks navigation, theme, locale, Anatomy, and reduced motion.
- `auth-boundaries.spec.ts` checks anonymous redirects and sanitized `next` destinations.
- `authenticated-smoke.spec.ts` checks dedicated-account sign-in, session restoration, and protected read-only pages when credentials exist.
- `pwa-smoke.spec.ts` checks the manifest, service worker, offline route, private network policy, and SVG Anatomy fallback.

Each file has one clear responsibility. Shared helpers report actionable failures that include route, browser project, viewport, and offending element or message.

## 5. Route coverage

### 5.1 Public human-readable routes

- `/`
- `/features`
- `/features/nutrition`
- `/features/training`
- `/anatomy`
- representative `/anatomy/[muscle]`
- `/blog`
- every published `/blog/[slug]`
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/states`
- `/sign-in`
- `/sign-up`
- `/magic-link`
- `/forgot-password`
- `/reset-password`
- `/~offline`

### 5.2 Public machine-readable routes

- `/manifest.webmanifest`
- `/robots.txt`
- `/sitemap.xml`
- `/feed.xml`
- `/sw.js`

### 5.3 Anonymous-protected routes

- `/today`
- `/nutrition`
- `/meal-planner`
- `/recipes`
- `/grocery-list`
- `/training`
- `/training/planner`
- `/workouts`
- `/exercises`
- `/workout-history`
- `/personal-records`
- `/progress`
- `/goals`
- `/habits`
- `/notifications`
- `/assistant`

Parameterized product routes are tested through representative stable identifiers where public catalogue data provides one. Routes that require owned database identifiers remain outside anonymous route enumeration.

## 6. Runtime monitoring

Every navigated page attaches monitoring before application code runs.

The test fails on:

- uncaught `pageerror` events
- console errors
- React hydration failure messages
- unhandled promise rejection messages surfaced by the browser
- failed document, script, stylesheet, font, image, fetch, or XHR requests that belong to the application
- unexpected HTTP responses with status `500` or higher

Expected redirects and deliberately aborted navigation requests are handled narrowly. Third-party failures are not globally ignored; any exception must name the exact host, failure, and reason in code.

Failure messages include the original browser message and the route under test. Secret-bearing headers, request bodies, cookies, and authentication storage are never attached to reports.

## 7. Accessibility coverage

### 7.1 Automated rules

Axe runs with WCAG 2.2 Level A and AA tags against representative rendered states.

Phase 10A fails on `serious` or `critical` violations. Moderate violations are reported and triaged during the fix cycle; they are promoted to blocking when they affect navigation, labels, semantics, contrast, or comprehension.

No general rule is disabled. A rule may be excluded only for one documented element when automated evaluation cannot determine the result and a manual check is recorded.

### 7.2 Interactive states

Axe is rerun after:

- opening desktop or mobile navigation
- switching locale
- switching theme
- selecting an Anatomy muscle
- switching Anatomy front/back view
- exposing authentication validation

This is required because hidden content is not fully assessed before it becomes visible.

### 7.3 Keyboard and focus

Tests verify:

- the skip link becomes visible and moves focus to the main content
- navigation controls are keyboard reachable
- mobile navigation opens, contains focus appropriately, and closes predictably
- theme and locale controls expose understandable accessible names
- Anatomy view and muscle controls work without a pointer
- focus is not hidden behind fixed navigation
- focus indicators are visually present according to computed styles
- reduced-motion emulation preserves content and functionality

Automated tests complement rather than replace later manual screen-reader, forced-colors, zoom, and touch review.

## 8. Responsive verification

The representative route matrix covers:

- landing
- features
- Anatomy explorer
- Blog library
- long-form article
- sign-in
- offline fallback
- authenticated product shell when credentials are present

For each primary viewport, tests verify:

- document width does not exceed viewport width beyond a one-pixel rendering tolerance
- primary content is not positioned outside the viewport
- navigation does not obscure the focused main target
- critical buttons and form controls remain within the viewport
- mobile navigation is usable
- Anatomy controls and information panels remain reachable

Phase 10A does not hide overflow to make checks pass. Any failure must be fixed at its component or layout source.

## 9. Public interaction coverage

The suite verifies:

- the logo resolves to the correct anonymous destination
- public navigation reaches implemented pages
- sign-in and account-creation actions remain discoverable
- theme changes preserve the same product hue family and readable foregrounds
- locale switching changes shared interface language and persists across navigation
- mobile navigation opens, navigates, and closes
- Anatomy front/back controls, muscle selection, URL behavior, and information panel remain synchronized
- Blog cards and related links navigate correctly
- reduced-motion mode keeps all content immediately usable

Hover-only effects are never required to discover essential information.

## 10. Authentication model

Optional credentials are read from:

- `E2E_TEST_EMAIL`
- `E2E_TEST_PASSWORD`

They live in `.env.local`. No example environment file is created.

When either value is missing:

- public and anonymous suites run normally
- authenticated tests are marked skipped with an explicit reason
- the overall report does not misrepresent authenticated coverage as passed

When both values exist:

- Playwright signs in through the public form
- authentication state is stored only in the ignored Playwright output directory
- a new context verifies session restoration
- `/today`, `/nutrition`, `/training`, and `/assistant` load without an authentication redirect
- tests do not create, modify, or delete user data
- no credential, cookie, token, or storage-state content appears in logs

Invalid-credential behavior is tested with synthetic values that cannot expose a real password.

## 11. PWA and performance smoke coverage

Phase 10A verifies:

- the manifest returns successfully and includes required identity, display, icon, and theme fields
- the service-worker script returns successfully
- service-worker registration succeeds in a secure local browser context
- `/~offline` is directly usable
- protected routes, APIs, authentication, and Supabase requests remain network-only according to the authored service-worker policy
- no Three.js canvas activates when the anatomy asset manifest is absent
- the accessible SVG Anatomy renderer remains present
- page navigation timing can be recorded without enforcing unstable local-machine score thresholds

Lighthouse performance, accessibility, best-practice, PWA, and SEO thresholds belong to Phase 10C after functional browser defects have been removed.

## 12. Reports and artifacts

The suite produces:

- concise terminal output
- a local HTML report
- failure screenshots
- failure video
- first-retry traces

Generated directories are ignored:

- `playwright-report/`
- `test-results/`
- `.auth/` when a dedicated authentication state directory is used

Artifacts contain browser-visible UI only. Test helpers do not print secrets, cookies, request authorization headers, environment values, or storage-state JSON.

## 13. Commands

Package scripts provide:

- `test:e2e:install`: install Chromium, Firefox, and WebKit through Playwright.
- `test:e2e:smoke`: run `@smoke` tests in `chromium-desktop`.
- `test:e2e`: run the complete Chromium desktop, tablet, and mobile matrix.
- `test:e2e:all`: run every configured project, including secondary Firefox and WebKit smoke coverage.
- `verify:production`: run the existing automated gate, build, and `test:e2e:all`.

The complete production gate runs:

1. repository and phase contracts
2. Vitest unit/component tests
3. TypeScript
4. ESLint
5. Next.js production build
6. Playwright E2E against the local production server

The implementation plan must preserve these names and versions unless installation proves a concrete compatibility failure. Any necessary change requires an evidence-backed spec amendment before implementation continues.

## 14. Error handling

- Browser setup failure reports the missing browser and installation command.
- Occupied port failure identifies port `3000` without terminating unrelated processes.
- Missing authenticated credentials skips only authenticated tests.
- Authentication failure stops the authenticated project and preserves a trace without exposing credentials.
- Route failures identify URL and status.
- Axe failures identify rule, severity, help URL, and affected selectors.
- Overflow failures identify the widest offending element.
- Broken-link failures identify both source page and destination.
- Console failures include the browser message and source location when available.

No test silently retries a deterministic product defect. Retries exist only to preserve diagnostic traces and reveal flakiness.

## 15. Acceptance criteria

Phase 10A is accepted when:

1. Exact Playwright and axe dependencies are pinned and compatible with Node 24.
2. Required Playwright browsers install successfully.
3. The local production build starts under Playwright at port `3000`.
4. Public route integrity checks pass.
5. Internal links and tested anchors resolve.
6. Anonymous protected routes redirect to sanitized sign-in destinations.
7. Representative pages have no unintended horizontal overflow at primary viewports.
8. Covered rendered and opened states have no blocking axe violations.
9. Keyboard, focus, mobile navigation, theme, locale, Anatomy, and reduced-motion checks pass.
10. Covered pages have no unexpected runtime, hydration, console, request, or server failures.
11. Manifest, service worker, offline route, private-network policy, and SVG Anatomy fallback checks pass.
12. Authenticated tests pass when dedicated credentials are present or are explicitly reported as skipped when absent.
13. Existing contracts, unit/component tests, typecheck, lint, and production build remain green.
14. Failure reports are useful and generated artifacts are ignored.
15. No secret is exposed.
16. No `.env.example` file is created.
17. No Git operation is performed by Codex.

## 16. Manual review boundary

Automated coverage cannot prove full accessibility, visual quality, real-device behavior, or production performance. Phase 10A therefore prepares rather than replaces later:

- manual screen-reader and keyboard review
- forced-colors and 200% zoom review
- seven-width visual and touch review
- Lighthouse/Core Web Vitals audit
- deeper PWA offline/update review
- security and RLS adversarial testing
- final cross-browser visual consistency review

## 17. References

- [Playwright projects](https://playwright.dev/docs/test-projects)
- [Playwright running tests and reports](https://playwright.dev/docs/running-tests)
- [axe-core accessibility engine](https://github.com/dequelabs/axe-core)
- [Lighthouse overview](https://developer.chrome.com/docs/lighthouse/overview)
