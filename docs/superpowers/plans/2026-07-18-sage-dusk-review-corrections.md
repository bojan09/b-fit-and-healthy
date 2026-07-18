# Sage Dusk Review Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct button contrast, brand prominence, theme cohesion, Blog reading rhythm, and the compact Training anatomy illustration using the approved Sage Dusk and Athletic Anatomy directions.

**Architecture:** Retune existing semantic CSS variables so both themes share hue families, then correct component rules that bypass those roles. Keep Blog rhythm in a dedicated reading composition and keep the Athletic Anatomy SVG isolated in `anatomy-preview.js` so no route or full-explorer logic changes.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js built-in test runner.

## Global Constraints

- Preserve the current HTML, CSS, and vanilla JavaScript architecture.
- Do not add Three.js, GSAP, frameworks, packages, or build tooling.
- Preserve routes, filters, bookmarks, forms, navigation, English default, and Macedonian content.
- Do not redesign page compositions beyond the reviewed corrections.
- Keep all changes uncommitted for user review.

---

### Task 1: Sage Dusk tokens, button contrast, and logo sizing

**Files:**
- Modify: `tests/ui-contract.test.js`
- Modify: `prototype/css/tokens.css`
- Modify: `prototype/css/components.css`
- Modify: `prototype/css/layout.css`
- Modify: `prototype/js/ui.js`
- Modify: `prototype/index.html`

**Interfaces:**
- Consumes: existing semantic roles `--brand`, `--brand-hover`, `--on-brand`, `--logo-body`, `--logo-leaf`, `--logo-mark`.
- Produces: paired Sage Dusk light/dark values; a 38-pixel default `brandmark()` with a 34-pixel narrow-screen CSS size; primary buttons that always use `--on-brand`.

- [ ] **Step 1: Add failing UI contracts**

Extend `tests/ui-contract.test.js` with assertions for dark `--bg: #14211C`, paired feature surfaces, `brandmark(size = 38)`, the absence of the hard-coded dark logo path override, light/dark logo tokens, and hero/CTA button text using `var(--on-brand)`.

```js
test('Sage Dusk shares hue families and semantic button contrast across modes', () => {
  const tokens = read('prototype/css/tokens.css');
  const components = read('prototype/css/components.css');
  const layout = read('prototype/css/layout.css');
  const ui = read('prototype/js/ui.js');
  assert.match(tokens, /\[data-theme="dark"\][\s\S]*--bg:\s*#14211C/i);
  assert.match(tokens, /--feature-training-surface:\s*#DCEBE1/i);
  assert.match(tokens, /\[data-theme="dark"\][\s\S]*--feature-training-surface:\s*#254438/i);
  assert.match(tokens, /--logo-body:\s*#397458/i);
  assert.match(tokens, /\[data-theme="dark"\][\s\S]*--logo-body:\s*#88C69D/i);
  assert.match(ui, /function brandmark\(size = 38\)/);
  assert.doesNotMatch(layout, /brandmark \.logo path:first-of-type/);
  assert.match(components, /\.hero-card \.btn-primary\s*\{[^}]*color:\s*var\(--on-brand\)/);
  assert.match(layout, /\.cta-block \.btn-primary\s*\{[^}]*color:\s*var\(--on-brand\)/);
});
```

- [ ] **Step 2: Run focused test and confirm RED**

Run: `node --test --test-name-pattern="Sage Dusk" tests/ui-contract.test.js`

Expected: FAIL on the current Active Dusk dark background and 30-pixel logo.

- [ ] **Step 3: Implement Sage Dusk and semantic contrast**

Update `prototype/css/tokens.css` to the exact spec values, including light feature surfaces `#DCEBE1`, `#F0E5D5`, `#E8E3ED`, `#DDE8EB` and dark counterparts `#254438`, `#433726`, `#373142`, `#263A40`. Use white `--on-brand` in light and deep forest `#10231A` in dark. Replace the dark page gradient with forest, mineral, and ochre fields.

In `prototype/css/components.css` and `prototype/css/layout.css`, replace logo-derived button foregrounds with `var(--on-brand)`. Delete the dark logo path override. Change `brandmark(size = 30)` to `brandmark(size = 38)` in `prototype/js/ui.js`, then cap `.appbar .brandmark .logo` at 34 by 34 pixels below 479 pixels. Update the dark theme-color meta value in `prototype/index.html` to `#14211C`.

- [ ] **Step 4: Run focused and full tests**

Run: `node --test --test-name-pattern="Sage Dusk" tests/ui-contract.test.js`

Expected: PASS.

Run: `node --test tests/*.test.js`

Expected: all tests PASS.

---

### Task 2: Dedicated Blog reading rhythm

**Files:**
- Modify: `tests/article-content.test.js`
- Modify: `prototype/js/screens-records.js`
- Modify: `prototype/js/screens-app.js`
- Modify: `prototype/css/layout.css`

**Interfaces:**
- Consumes: existing `.article`, `.article-body`, disclaimer, related-post section, and return button markup.
- Produces: `.article-reading` composition and `.article-related` section with explicit section-aware gaps.

- [ ] **Step 1: Add failing reading-rhythm contracts**

```js
test('Blog posts use a dedicated section-aware reading composition', () => {
  const records = read('prototype/js/screens-records.js');
  const legacy = read('prototype/js/screens-app.js');
  const layout = read('prototype/css/layout.css');
  assert.match(records, /article article-reading/);
  assert.match(legacy, /article article-reading/);
  assert.match(records, /class="article-related"/);
  assert.match(layout, /\.article-reading\s*>\s*\.article-body\s*\+\s*\.notice/);
  assert.match(layout, /\.article-section\s*\+\s*\.article-section/);
  assert.match(layout, /\.article-section p\s*\+\s*p/);
});
```

- [ ] **Step 2: Run focused test and confirm RED**

Run: `node --test --test-name-pattern="section-aware" tests/article-content.test.js`

Expected: FAIL because the dedicated composition classes do not exist.

- [ ] **Step 3: Implement explicit Blog rhythm**

Add `article-reading` to both post-route `<article>` elements and `article-related` to their related-content sections. In `prototype/css/layout.css`, set 40-pixel body-to-notice and notice-to-related gaps, a 24-pixel related-card-to-return gap, 48-pixel editorial section gaps, 20-pixel paragraph gaps, and 16-pixel heading-to-copy gaps. Reduce only the external section gaps at the existing mobile breakpoint.

- [ ] **Step 4: Run focused and full tests**

Run: `node --test tests/article-content.test.js`

Expected: all article tests PASS.

Run: `node --test tests/*.test.js`

Expected: all tests PASS.

---

### Task 3: Athletic Anatomy preview

**Files:**
- Modify: `tests/anatomy-preview.test.js`
- Modify: `prototype/js/anatomy-preview.js`
- Modify: `prototype/css/components.css`

**Interfaces:**
- Consumes: `AnatomyPreview.render()`, the existing Training gateway link, and Sage Dusk anatomy tokens.
- Produces: one decorative `viewBox="0 0 220 430"` SVG marked `data-figure="athletic"`, with a continuous `.preview-athletic-outline`, shaped hands and feet, and separate muscle overlays.

- [ ] **Step 1: Add failing Athletic Anatomy contracts**

```js
test('Athletic Anatomy uses a continuous human outline and shaped extremities', () => {
  const source = read('prototype/js/anatomy-preview.js');
  assert.match(source, /data-figure="athletic"/);
  assert.match(source, /viewBox="0 0 220 430"/);
  assert.match(source, /class="preview-athletic-outline"/);
  for (const region of ['hand-left', 'hand-right', 'foot-left', 'foot-right']) {
    assert.ok(source.includes(`data-region="${region}"`), `missing ${region}`);
  }
});
```

- [ ] **Step 2: Run focused test and confirm RED**

Run: `node --test --test-name-pattern="Athletic Anatomy" tests/anatomy-preview.test.js`

Expected: FAIL because the current preview uses the older 240 by 440 segmented schematic.

- [ ] **Step 3: Implement the approved athletic figure**

Replace the compact SVG with the selected Athletic Anatomy geometry: 7–7.5-head proportions, broader shoulders, tapered ribcage, narrow waist, defined pelvis, mid-thigh hands, shaped feet, and continuous outer silhouette. Keep deltoid, pectoral, abdominal, quadriceps, and calf overlays in `.preview-muscles`; keep landmarks in `.preview-landmarks`. Update CSS selectors for the new outline and retain the whole SVG as one accessible link.

- [ ] **Step 4: Run focused and full tests**

Run: `node --test tests/anatomy-preview.test.js`

Expected: all anatomy preview tests PASS.

Run: `node --test tests/*.test.js`

Expected: all tests PASS.

---

### Task 4: Verification and uncommitted handoff

**Files:**
- Modify only files already listed if verification exposes a defect.

- [ ] **Step 1: Run the complete test suite**

Run: `node --test tests/*.test.js`

Expected: zero failures.

- [ ] **Step 2: Parse all JavaScript**

```powershell
Get-ChildItem prototype/js,tests -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

Expected: exit code 0.

- [ ] **Step 3: Check repository hygiene**

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 4: Confirm no commit was created**

Run: `git rev-parse --short HEAD` and `git status --short`

Expected: HEAD remains `8236bec`; all correction files remain modified or untracked for user review.

