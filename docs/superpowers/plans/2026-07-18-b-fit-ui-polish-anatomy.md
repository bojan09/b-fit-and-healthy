# B-Fit UI Polish and Anatomy Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan.

**Goal:** Polish the approved Warm Sage feature-page direction across the existing vanilla application, remove responsive clipping, introduce the Guided Daily Canvas, and add a recognizable accessible SVG anatomy explorer.

**Architecture:** Preserve the hash router and HTML-string screen renderers. Consolidate visual rules in the existing token/base/component/layout layers, add small composition utilities, and keep anatomy records, SVG rendering, and interaction hooks in dedicated modules. Use delegated document events and the existing route lifecycle; no framework, build step, GSAP, or Three.js.

**Tech Stack:** HTML5, CSS custom properties and media queries, vanilla JavaScript, inline SVG, Node's built-in `node:test`, headless Chrome for responsive screenshots.

## Global Constraints

- Preserve the approved Warm Sage visual identity and existing product content.
- English is the first-visit language; Macedonian remains complete.
- Do not add packages, CDNs, frameworks, GSAP, Three.js, or a build system.
- Fix actual layout overflow rather than hiding it globally.
- Keep every primary control at least 44 by 44 pixels.
- Treat the SVG as one renderer over stable muscle data, not as the data source.
- Honor `prefers-reduced-motion` and coarse pointers.
- Keep `frontend-skill.md` and unrelated untracked preview artifacts out of commits.

---

### Task 1: Add executable UI contracts

**Files:**
- Create: `tests/ui-contract.test.js`
- Create: `tests/anatomy-data.test.js`
- Reference: `prototype/index.html`
- Reference: `prototype/js/app.js`
- Reference: `prototype/js/i18n.js`
- Reference: `prototype/css/tokens.css`

**Step 1: Write failing shell-level UI tests**

Use `node:test`, `node:assert/strict`, and `fs.readFileSync`. Assert:

- `index.html` starts with `lang="en"`.
- app routes contain `/anatomy`.
- training navigation exposes Anatomy.
- current runtime does not load `shader.js`, GSAP, or Three.js.
- Warm Sage light/dark token values exist.
- shared spacing/composition selectors exist.
- English and Macedonian translation objects have recursive key parity.

**Step 2: Write failing anatomy-data tests**

Require `prototype/js/anatomy-data.js` and assert:

- exported records have unique stable IDs;
- every record has at least one of `front` or `back`;
- English and Macedonian fields exist for name, overview, function, benefits,
  training, and common mistake;
- recommended exercise IDs exist in the exported relationship table;
- the initial set covers upper body, core, hips, and legs on both views.

**Step 3: Run the tests and confirm RED**

Run: `node --test tests/*.test.js`

Expected: failures for missing anatomy modules/routes and current English/token contracts.

**Step 4: Commit only the tests**

```powershell
git add tests/ui-contract.test.js tests/anatomy-data.test.js
git commit -m "test: define redesign and anatomy contracts"
```

---

### Task 2: Establish Warm Sage tokens and reusable composition rules

**Files:**
- Modify: `prototype/css/tokens.css`
- Modify: `prototype/css/base.css`
- Modify: `prototype/css/components.css`
- Modify: `prototype/css/layout.css`
- Modify: `prototype/css/motion.css`

**Step 1: Implement the approved light/dark semantic tokens**

Define the exact background, surface, raised surface, primary/muted text,
border, control-border, brand, soft-brand, mineral, ochre, anatomy-clay, and
on-brand tokens. Retain compatibility aliases only where existing components
still consume them.

**Step 2: Normalize the spacing system**

Define 4/8/12/16/24/32/48/64px variables and semantic aliases for control gap,
card gap, card padding, feature padding, section rhythm, and page padding.
Add `.flow`, `.cluster`, `.page-stack`, `.section-stack`, and `.auto-grid`
composition utilities. Wrapping clusters must have both row and column gaps.

**Step 3: Normalize shared primitives**

Standardize buttons, fields, chips, cards, focus states, headings, supporting
copy, and disabled states. Remove inverted light-mode card dependence and
ensure action groups wrap cleanly.

**Step 4: Add responsive shell rules**

Use one 1024px navigation handoff. Below 480px reduce app-bar controls rather
than compressing them. Remove global `overflow-x: hidden` after component-level
overflow rules are in place.

**Step 5: Run contract and syntax checks**

Run: `node --test tests/*.test.js`

Expected: token and composition assertions pass; anatomy assertions still fail.

**Step 6: Commit**

```powershell
git add prototype/css/tokens.css prototype/css/base.css prototype/css/components.css prototype/css/layout.css prototype/css/motion.css
git commit -m "style: establish warm sage design system"
```

---

### Task 3: Make the shell English-first and implement the ambient halo

**Files:**
- Modify: `prototype/index.html`
- Modify: `prototype/js/i18n.js`
- Modify: `prototype/js/motion.js`
- Modify: `prototype/js/app.js`
- Modify: `prototype/css/base.css`
- Modify: `prototype/css/motion.css`
- Stop loading: `prototype/js/shader.js`

**Step 1: Set the language contract**

Set document language to English and initialize English when no explicit saved
choice exists. Preserve a saved English or Macedonian choice and update
`document.documentElement.lang` on switch.

**Step 2: Replace decorative runtime effects**

Remove `shader.js` from the runtime and remove card spotlight/tilt/magnetic
initialization. Implement one fixed `.ambient-halo` behind the shell. Pointer
movement writes `--halo-x`/`--halo-y` through one queued animation frame.
Disable the listener for coarse pointers and reduced motion, and expose a
cleanup method.

**Step 3: Tighten route lifecycle and app shell**

Ensure route renders cancel route-specific observers/frames, set page titles,
and focus `main`. Make the Training sub-navigation and command palette capable
of linking to Anatomy.

**Step 4: Verify**

Run:

```powershell
node --test tests/*.test.js
Get-ChildItem prototype/js/*.js | ForEach-Object { node --check $_.FullName }
```

Expected: non-anatomy UI contracts pass and all scripts parse.

**Step 5: Commit**

```powershell
git add prototype/index.html prototype/js/i18n.js prototype/js/motion.js prototype/js/app.js prototype/css/base.css prototype/css/motion.css
git commit -m "feat: add english-first shell and ambient halo"
```

---

### Task 4: Implement the Guided Daily Canvas

**Files:**
- Modify: `prototype/js/screens-app.js`
- Modify: `prototype/js/ui.js`
- Modify: `prototype/js/i18n.js`
- Modify: `prototype/css/components.css`
- Modify: `prototype/css/layout.css`

**Step 1: Write a failing markup contract**

Extend `tests/ui-contract.test.js` to assert the Today renderer contains the
`daily-canvas`, `daily-balance`, `daily-timeline`, and `coach-panel` contracts
and no longer uses the old three-ring summary.

**Step 2: Confirm RED**

Run: `node --test tests/ui-contract.test.js`

**Step 3: Recompose Today**

Render:

- one page heading and status sentence;
- one next-workout action surface;
- one Daily Balance with labelled linear energy, protein, movement, and water
  metrics plus a textual status;
- one chronological day timeline;
- one contextual coach panel linking to Assistant.

Use semantic `section`, `ol`, `progress` or equivalent accessible value text.
Keep existing Start Workout, Later, Add Water, meal, and navigation behavior.

**Step 4: Implement desktop/tablet/mobile layout**

Use a minmax grid on desktop and a single source-order column below 1024px.
Action controls wrap below content below 480px. Avoid fixed-height cards.

**Step 5: Verify and commit**

Run: `node --test tests/*.test.js`

```powershell
git add tests/ui-contract.test.js prototype/js/screens-app.js prototype/js/ui.js prototype/js/i18n.js prototype/css/components.css prototype/css/layout.css
git commit -m "feat: build guided daily canvas"
```

---

### Task 5: Polish Nutrition and Training

**Files:**
- Modify: `prototype/js/screens-app.js`
- Modify: `prototype/js/ui.js`
- Modify: `prototype/js/i18n.js`
- Modify: `prototype/css/components.css`
- Modify: `prototype/css/layout.css`

**Step 1: Add failing markup assertions**

Assert Nutrition has one canonical macro summary, aligned `metric-row`
components, and a mobile-safe page action. Assert Training has `program-focus`,
`training-summary`, and `coverage-anatomy-link` and no `coverage-map` pill cloud.

**Step 2: Confirm RED**

Run: `node --test tests/ui-contract.test.js`

**Step 3: Recompose Nutrition**

Replace duplicated ring/bar/stacked summaries with a calm energy total, three
macro metric rows, meal records, and weekly trend. Keep the add-food and chart
behaviors. Use sage, mineral, and ochre only.

**Step 4: Recompose Training**

Combine program and next session into one action surface. Align weekly stats in
one compact summary. Replace the pill cloud with a simplified human mini-map
and textual coverage links whose IDs match Anatomy. Preserve session start,
history, workout, and exercise routes.

**Step 5: Verify and commit**

Run: `node --test tests/*.test.js`

```powershell
git add tests/ui-contract.test.js prototype/js/screens-app.js prototype/js/ui.js prototype/js/i18n.js prototype/css/components.css prototype/css/layout.css
git commit -m "feat: refine nutrition and training experiences"
```

---

### Task 6: Redesign Blog and Assistant within the approved style

**Files:**
- Modify: `prototype/js/screens-records.js`
- Modify: `prototype/js/screens-app.js`
- Modify: `prototype/js/i18n.js`
- Modify: `prototype/css/components.css`
- Modify: `prototype/css/layout.css`

**Step 1: Add failing markup assertions**

Assert Blog exposes a lead story and supporting editorial grid. Assert Assistant
has a bounded conversation region, topic starters, suggestion cards, a labelled
composer, and a visible disclaimer.

**Step 2: Confirm RED**

Run: `node --test tests/ui-contract.test.js`

**Step 3: Implement Blog hierarchy**

Keep search, categories, post routes, and existing articles. Give the lead
article a wider layout and clear metadata. Use a balanced two/three-column grid
for supporting stories that becomes one column on mobile. Let filters wrap
without clipping.

**Step 4: Implement the coaching Assistant workspace**

Keep simulated responses and prompt behavior. Add scope copy, topic starters,
context suggestions, a polite conversation log, a clearly labelled composer,
and guidance disclaimer. Use one two-column workspace on desktop and a single
column below 900px.

**Step 5: Verify and commit**

Run: `node --test tests/*.test.js`

```powershell
git add tests/ui-contract.test.js prototype/js/screens-records.js prototype/js/screens-app.js prototype/js/i18n.js prototype/css/components.css prototype/css/layout.css
git commit -m "feat: improve blog and assistant ux"
```

---

### Task 7: Build the anatomy data and recognizable SVG renderer

**Files:**
- Create: `prototype/js/anatomy-data.js`
- Create: `prototype/js/anatomy.js`
- Modify: `prototype/index.html`
- Modify: `prototype/js/app.js`
- Modify: `prototype/js/i18n.js`
- Modify: `prototype/css/components.css`
- Modify: `prototype/css/layout.css`
- Test: `tests/anatomy-data.test.js`
- Test: `tests/ui-contract.test.js`

**Step 1: Implement the data module until data tests pass**

Expose a browser global and CommonJS export containing stable bilingual records
for pectorals, deltoids, biceps, triceps, forearms, trapezius, lats, serratus,
abdominals, obliques, spinal erectors, glutes, quadriceps, hamstrings,
adductors, calves, and tibialis anterior. Include valid exercise relationships.

Run: `node --test tests/anatomy-data.test.js`

**Step 2: Create the SVG renderer**

Build front and back SVG views with one recognizable continuous silhouette and
bilateral organic muscle paths. Each visible path includes `data-muscle-id`,
an accessible label, and a matching canonical HTML list control. Keep renderer
functions pure where possible:

```js
Anatomy.renderFigure(view, selectedId)
Anatomy.renderMuscleList(records, view, selectedId, query)
Anatomy.renderDetail(record)
Anatomy.screen(routeQuery)
```

**Step 3: Register route and scripts**

Load data before the renderer. Add `#/anatomy`, Training subnav, command palette
entry, localized page metadata, and query parsing for `muscle` and `view`.

**Step 4: Implement delegated interactions**

Support front/back controls, SVG click, list click, Enter/Space on controls,
search, selection state, `aria-pressed`, live status, query-string updates, and
unknown-ID fallback. Ensure touch targets are at least 44px through invisible
hit paths or the synchronized list.

**Step 5: Style responsive anatomy composition**

Use one shared outer surface with map/detail split at 1024px and source-order
stack below. Maintain figure aspect ratio, cap its height, and preserve readable
details in both themes.

**Step 6: Verify and commit**

Run:

```powershell
node --test tests/*.test.js
Get-ChildItem prototype/js/*.js | ForEach-Object { node --check $_.FullName }
```

```powershell
git add prototype/js/anatomy-data.js prototype/js/anatomy.js prototype/index.html prototype/js/app.js prototype/js/i18n.js prototype/css/components.css prototype/css/layout.css tests/anatomy-data.test.js tests/ui-contract.test.js
git commit -m "feat: add accessible anatomy explorer"
```

---

### Task 8: Responsive and accessibility hardening across every route

**Files:**
- Modify as defects require: `prototype/css/base.css`
- Modify as defects require: `prototype/css/components.css`
- Modify as defects require: `prototype/css/layout.css`
- Modify as defects require: `prototype/js/app.js`
- Modify as defects require: `prototype/js/screens-app.js`
- Modify as defects require: `prototype/js/screens-records.js`
- Test: `tests/ui-contract.test.js`

**Step 1: Add a browser audit helper**

Create a development-only test script or headless-console expression that
reports elements whose bounding boxes exceed the viewport. Do not solve reports
by adding page-level overflow hiding.

**Step 2: Audit required widths**

Open Today, Nutrition, Training, Blog, Assistant, and Anatomy at 320, 375, 480,
768, 1024, 1280, and 1440 pixels in light and dark mode. Test Macedonian at 320
and 768 as the longer-label case.

**Step 3: Correct layout defects**

Fix wrapping, grid minimums, min-width defaults, chart/table local scrolling,
app-bar simplification, body-map sizing, composer actions, and card padding.
Verify 200% zoom and keyboard focus order.

**Step 4: Verify semantics**

Check one `h1` per route, label/control associations, landmark order, live
regions, keyboard activation, non-color selected state, alt text, and visible
focus.

**Step 5: Commit**

```powershell
git add prototype tests
git commit -m "fix: harden responsive and accessible layouts"
```

---

### Task 9: Final functional and visual verification

**Files:**
- Modify only files needed to correct discovered regressions
- Update: `docs/superpowers/specs/2026-07-18-b-fit-redesign-design.md` if final
  behavior differs from an approved detail

**Step 1: Run the automated suite**

```powershell
node --test tests/*.test.js
Get-ChildItem prototype/js/*.js | ForEach-Object { node --check $_.FullName }
```

Expected: all tests pass and all scripts parse.

**Step 2: Run route-level functional checks**

Verify primary navigation, Training subnavigation, search/filter controls,
theme and language persistence, Today actions, food/workout routes, Blog post
links, assistant prompts/composer, Anatomy view/search/select/deep-link/back
behavior, modals, and forms.

**Step 3: Inspect console output**

Navigate every route in headless Chrome and confirm no avoidable errors,
unhandled rejections, missing resources, duplicate IDs, or listener-related
warnings.

**Step 4: Compare screenshots**

Capture desktop and mobile screenshots for the six redesigned routes in both
themes. Confirm Warm Sage continuity, intentional spacing, no inverted
light-mode cards, no clipped controls, balanced card density, recognizable
anatomy, and visible selected/focus states.

**Step 5: Review the diff and repository state**

```powershell
git diff --check
git status --short
git log --oneline -12
```

Confirm no credentials, generated screenshots, `frontend-skill.md`, or
unrelated preview artifacts are included.

**Step 6: Commit final corrections**

```powershell
git add prototype tests docs/superpowers/specs/2026-07-18-b-fit-redesign-design.md
git commit -m "fix: complete redesign quality review"
```

---

## Plan Self-Review

- Coverage: every user-flagged route, spacing system, mobile behavior, ambient
  halo, English-first behavior, and anatomy interaction has an implementation
  and verification task.
- Architecture: the hash router and screen renderer are preserved; anatomy is
  isolated behind stable data and rendering interfaces.
- Accessibility: keyboard, touch, labels, focus, live status, non-color states,
  reduced motion, and text fallbacks are explicit acceptance checks.
- Technology: the current phase contains no GSAP, Three.js, framework, package,
  or build-system dependency.
- Placeholders: none. All required routes, modules, selectors, data fields, and
  validation commands are named.
- Type consistency: stable muscle and exercise IDs are strings in data, SVG
  attributes, URLs, tests, and screen selection logic.
- Regression control: each page group starts with a failing markup/data contract
  and ends with automated plus browser verification.
