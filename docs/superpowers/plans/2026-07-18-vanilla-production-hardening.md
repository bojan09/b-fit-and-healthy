# B-Fit Vanilla Production Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the approved B-Fit application as a robust local-first HTML, CSS, and vanilla-JavaScript product while preserving the Sage Dusk visual system and accessible SVG Anatomy explorer.

**Architecture:** Keep `prototype/index.html` as the build-free application shell, the hash router in `app.js`, screen renderers as HTML-string modules, and `Records` as the user-record repository. Add a small `AppState` module for non-record preferences and session state, then close lifecycle, route, persistence, and misleading-action gaps through focused source and behavior tests.

**Tech Stack:** Semantic HTML, CSS custom properties, vanilla JavaScript, browser `localStorage`, inline SVG, and the Node.js built-in test runner. No framework, package manager, backend, Three.js, GSAP, or build system.

## Global Constraints

- Preserve the approved Sage Dusk visual direction and current responsive compositions.
- English remains the first-visit language; Macedonian keeps exact translation-key parity.
- Preserve all current routes, CRUD records, anatomy deep links, theme modes, accessibility behavior, and reduced-motion handling.
- Three.js and GSAP remain deferred; the SVG and synchronized text controls are the production baseline for this pass.
- Authentication and the AI assistant remain explicitly local simulations because the original scope excludes backend services.
- Do not commit. Leave all implementation changes available for user review.
- Never read, print, copy, or expose values from `.env.local`.

---

### Task 1: Repository security and serving documentation

**Files:**
- Create: `.gitignore`
- Modify index only: `.env.local`
- Modify: `README.md`
- Create: `tests/repository-hygiene.test.js`

**Interfaces:**
- Consumes: the current static application under `prototype/`.
- Produces: a repository that no longer tracks local credentials and has exact local-serving instructions.

- [ ] **Step 1: Write the failing repository-hygiene test**

Assert that `.gitignore` contains `.env.local`, README documents `python -m http.server 8765`, and no `.env.local` path is returned by `git ls-files`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/repository-hygiene.test.js`

Expected: FAIL because `.gitignore` is absent, README is empty, and `.env.local` is tracked.

- [ ] **Step 3: Implement the repository hardening**

Create `.gitignore` with local-secret, editor, OS, and generated-output patterns. Run `git rm --cached -- .env.local` so the file stays on disk but is scheduled for removal from version control. Document local serving, supported routes, local-only storage, browser requirements, testing, and the explicit absence of real authentication/AI services.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/repository-hygiene.test.js`

Expected: PASS without exposing any credential value.

---

### Task 2: Router lifecycle, not-found state, focus, and theme chrome

**Files:**
- Modify: `prototype/js/app.js`
- Modify: `prototype/js/charts.js`
- Modify: `prototype/js/theme.js`
- Modify: `prototype/js/i18n.js`
- Create: `prototype/js/units.js`
- Modify: `prototype/index.html`
- Modify: `tests/ui-contract.test.js`
- Create: `tests/router-lifecycle.test.js`

**Interfaces:**
- Consumes: `Router.render()`, `Actions.afterRender()`, `Motion.teardownRoute()`, and `Charts.mountAll()`.
- Produces: `Actions.beforeRender()`, `Actions.registerCleanup(fn)`, `Charts.unmount()`, a real not-found screen, and correct Sage Dusk mobile browser colors.

- [ ] **Step 1: Add failing lifecycle and route contracts**

Require `Router.render()` to distinguish unknown paths, call cleanup before replacing markup, focus `#main` with `{ preventScroll: true }`, and use `#14211C` / `#F4F4EE` in `Theme.apply()`.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `node --test tests/router-lifecycle.test.js tests/ui-contract.test.js`

Expected: FAIL because unknown paths fall back to the landing page, article scroll listeners accumulate, charts have no explicit unmount method, and theme chrome still uses the old blue palette.

- [ ] **Step 3: Implement lifecycle ownership**

Add an `Actions.cleanups` array. `beforeRender()` removes registered listeners, calls `Charts.unmount()`, and calls `Motion.teardownRoute()`. The reading-progress scroll handler registers its removal function. `Router.render()` calls `Actions.beforeRender()` before changing `root.innerHTML`, then scrolls to the top, runs post-render hooks, and focuses the new main landmark without scrolling.

- [ ] **Step 4: Implement not-found and theme behavior**

Render a localized app-style not-found state for unknown authenticated-looking routes and a public not-found state otherwise. Keep legacy Blog redirects canonical. Update theme-color synchronization to `#14211C` dark and `#F4F4EE` light.

- [ ] **Step 5: Verify GREEN**

Run: `node --test tests/router-lifecycle.test.js tests/ui-contract.test.js`

Expected: PASS.

---

### Task 3: Persistent non-record application state

**Files:**
- Create: `prototype/js/app-state.js`
- Modify: `prototype/index.html`
- Modify: `prototype/js/app.js`
- Modify: `prototype/js/data.js`
- Modify: `prototype/js/screens-app.js`
- Modify: `prototype/js/screens-public.js`
- Create: `tests/app-state.test.js`

**Interfaces:**
- Consumes: `Store.user`, `Store.today`, `Store.habits`, and `Store.state` after `data.js` loads.
- Produces: `AppState.init()`, `AppState.save()`, `AppState.patchSettings(patch)`, `AppState.toggleHabit(id)`, `AppState.setWater(value)`, `AppState.toggleBookmark(id)`, `AppState.toggleRecipe(id)`, and `AppState.reset()`.

- [ ] **Step 1: Write failing AppState behavior tests**

Use a VM-backed in-memory `localStorage` double to prove valid state hydrates, corrupt state falls back safely, sets serialize as arrays and hydrate as sets, settings merge without deleting defaults, and reset removes only B-Fit application keys.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/app-state.test.js`

Expected: FAIL because `app-state.js` does not exist.

- [ ] **Step 3: Implement versioned state persistence**

Store a versioned payload under `bfit.appState.v1`. Persist water, habits, bookmarks, saved recipes, notification read state, onboarding goal/level, unit preference, notification toggles, and active-session set state. Validate each collection before hydrating and catch storage/quota errors without breaking rendering.

- [ ] **Step 4: Route existing actions through AppState**

Replace direct mutation for habits, water, bookmarks, recipes, notifications, onboarding, and settings. Load `app-state.js` after `data.js`, then call `AppState.init()` before the first router render.

- [ ] **Step 5: Verify GREEN and regressions**

Run: `node --test tests/app-state.test.js tests/*.test.js`

Expected: all tests PASS.

---

### Task 4: Functional settings, exercise search, and derived progress

**Files:**
- Modify: `prototype/js/app.js`
- Modify: `prototype/js/records.js`
- Modify: `prototype/js/screens-app.js`
- Modify: `prototype/js/i18n.js`
- Modify: `prototype/css/layout.css`
- Create: `tests/functional-flows.test.js`

**Interfaces:**
- Consumes: `AppState.data.settings`, `Records.all("measurements")`, `Router.params.q`, and `Store.exercises`.
- Produces: `Records.measurementTrend()`, `Records.monthWorkoutCount()`, query-aware exercise filtering, persisted settings controls, and explicit no-result rendering.

- [ ] **Step 1: Write failing functional contracts**

Require exercise search to use a dedicated `exercise-search` input action and match localized name, primary muscle, secondary muscle, and muscle group. Require Progress to consume `Records.measurementTrend()` rather than `Store.weightTrend`. Require unit and notification settings to render from `AppState` rather than hard-coded booleans.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `node --test tests/functional-flows.test.js`

Expected: FAIL because exercise search is currently `proto-only`, Progress is static, and settings are hard-coded.

- [ ] **Step 3: Implement exercise search and filters**

Normalize case and diacritics, preserve the selected muscle when updating `q`, preserve `q` when changing muscle, restore focus after filtering, and render a resettable empty state. Keep hash history compact with `history.replaceState` while typing.

- [ ] **Step 4: Implement record-derived Progress**

Sort actual measurements by date, localize compact labels, calculate the latest value and delta, render an empty state when none exist, and calculate the current-month workout count from `Records`.

- [ ] **Step 5: Implement real settings persistence**

Use `set-units` and `set-notification-setting` actions backed by `AppState`. Keep the stored canonical measurements metric; use display helpers for kilograms/pounds and litres/fluid ounces so switching units changes labels and values without mutating records.

- [ ] **Step 6: Verify GREEN**

Run: `node --test tests/functional-flows.test.js tests/*.test.js`

Expected: all tests PASS.

---

### Task 5: Complete local recipe, exercise, session, habit, and account actions

**Files:**
- Modify: `prototype/js/crud.js`
- Modify: `prototype/js/app.js`
- Modify: `prototype/js/screens-app.js`
- Modify: `prototype/js/i18n.js`
- Modify: `prototype/css/components.css`
- Modify: `tests/functional-flows.test.js`

**Interfaces:**
- Consumes: `Crud.open(kind, id)`, `Records.create()`, `AppState` active-session state, and the selected recipe/exercise records.
- Produces: `Crud.open(kind, id, preset)`, recipe-prefilled meal logging, exercise-prefilled workout creation, persistent set completion, real session recording, a small add-habit flow, and local account-data deletion.

- [ ] **Step 1: Add failing continuation contracts**

Require recipe and exercise actions to open meaningful prefilled forms, session set buttons to expose stable exercise/set IDs, session completion to create a workout record, add-habit to open a real form, and delete-account confirmation to call an explicit local-data reset action rather than `proto-only`.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `node --test tests/functional-flows.test.js`

Expected: FAIL on the current placeholder actions.

- [ ] **Step 3: Add safe preset support to Crud**

Extend `Crud.open(kind, id, preset = null)` so creation fields and workout exercises can be initialized without affecting edit behavior. Recipe “Add to day” opens the meal form with name, energy, macros, current time, and a user-selectable meal slot. Exercise “Add to workout” opens the workout form with one mapped exercise row.

- [ ] **Step 4: Make the active session record real data**

Give every set a stable `${exerciseId}:${setIndex}` key, persist completion in `AppState`, show text and icon state, and on Finish create one workout containing the program exercises and logged set counts. Clear the active-session keys and navigate to Workouts after saving.

- [ ] **Step 5: Complete local habits and account reset**

Add a compact bilingual-safe habit form that stores user-authored text in both locale fields. Account deletion clears B-Fit record, state, language, theme, and motion keys only after explicit confirmation, then reseeds the local demo and returns to the public landing page.

- [ ] **Step 6: Make unavoidable simulations explicit**

Label sign-in/sign-up and the assistant as local demonstrations before submission. Keep privacy/terms/contact links clearly unavailable rather than reporting a false success. Remove `proto-only` from actions that now have local implementations.

- [ ] **Step 7: Verify GREEN**

Run: `node --test tests/functional-flows.test.js tests/*.test.js`

Expected: all tests PASS.

---

### Task 6: Final accessibility, responsive, and source quality gate

**Files:**
- Modify only files already listed if verification reveals a defect.
- Modify: `tests/viewport-audit.html` only if its route matrix is incomplete.

**Interfaces:**
- Consumes: the completed local-first application.
- Produces: fresh test, syntax, contrast, route, persistence, and repository-hygiene evidence.

- [ ] **Step 1: Run the complete automated suite**

Run: `node --test tests/*.test.js`

Expected: zero failures.

- [ ] **Step 2: Parse every JavaScript source**

Run: `Get-ChildItem prototype\js,tests -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }`

Expected: exit code 0.

- [ ] **Step 3: Verify localization and route coverage**

Confirm exact English/Macedonian key parity, every route returns one `h1`, legacy Blog paths remain valid, unknown paths render not-found, and all Anatomy exercise links resolve.

- [ ] **Step 4: Verify source and secret hygiene**

Run: `git diff --check` and `git ls-files .env.local`.

Expected: no whitespace errors and no tracked `.env.local` result. Do not inspect the file contents.

- [ ] **Step 5: Verify local serving and visual review access**

Serve `prototype/` at `http://127.0.0.1:8765/`. If a controllable browser is available, review light/dark and English/Macedonian at 320, 375, 480, 768, 1024, 1280, and 1440 pixels. If unavailable, provide direct route URLs and explicitly hand visual breakpoint review to the user.

- [ ] **Step 6: Confirm uncommitted handoff**

Run: `git status --short` and `git log -1 --oneline`.

Expected: implementation changes are present and HEAD remains unchanged.
