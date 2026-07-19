# Sage Dusk Review Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mismatched Active Dusk correction with the approved Sage Dusk pairing, repair button/logo contrast, improve Blog reading rhythm, and rebuild the compact Training figure as Athletic Anatomy.

**Execution status (18 July 2026):** Implemented and verified without committing. The full 21-test suite passes, all JavaScript sources parse, all bilingual article variants and the Athletic Anatomy preview render, `git diff --check` is clean, and primary-button contrast measures 5.51:1 in light mode and 8.31:1 in dark mode.

**Architecture:** Keep the existing token-driven CSS system and focused vanilla-JavaScript preview module. Extend source-contract tests first, then change one visual subsystem at a time while preserving the current routes and full Anatomy explorer.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js built-in test runner.

## Global Constraints

- Preserve the existing HTML, CSS, and vanilla JavaScript architecture.
- Do not add Three.js, GSAP, frameworks, packages, or build tooling.
- Keep English as the default and preserve Macedonian content.
- Preserve routes, filters, search, bookmarks, form behavior, navigation, and full Anatomy explorer interactions.
- Keep all changes uncommitted for user review.

---

### Task 1: Sage Dusk theme, button contrast, and logo scale

**Files:**
- Modify: `tests/ui-contract.test.js`
- Modify: `prototype/css/tokens.css`
- Modify: `prototype/css/base.css`
- Modify: `prototype/css/components.css`
- Modify: `prototype/css/layout.css`
- Modify: `prototype/js/ui.js`
- Modify: `prototype/index.html`

**Interfaces:**
- Consumes: existing semantic roles `--brand`, `--brand-hover`, `--on-brand`, `--feature-*-surface`, and `brandmark(size)`.
- Produces: paired Sage Dusk tokens, semantic hero-button foregrounds, and a 38-pixel default brand mark with a 34-pixel mobile override.

- [ ] **Step 1: Replace the Active Dusk contract with failing Sage Dusk contracts**

Update `tests/ui-contract.test.js` so the theme test requires:

```js
assert.match(tokens, /\[data-theme="dark"\][\s\S]*--bg:\s*#14211C/i);
assert.match(tokens, /--feature-training-surface:\s*#DCEBE1/i);
assert.match(tokens, /--feature-blog-surface:\s*#E8E3ED/i);
assert.match(tokens, /\[data-theme="dark"\][\s\S]*--feature-training-surface:\s*#254438/i);
assert.match(tokens, /\[data-theme="dark"\][\s\S]*--feature-blog-surface:\s*#373142/i);
assert.match(components, /\.hero-card \.btn-primary\s*\{[^}]*color:\s*var\(--on-brand\)/);
assert.doesNotMatch(layout, /brandmark \.logo path:first-of-type/);
assert.match(ui, /function brandmark\(size = 38\)/);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test --test-name-pattern="Sage Dusk" tests/ui-contract.test.js`

Expected: FAIL because the current dark background is `#0D1830`, light feature roles are neutral, the hero uses `--logo-body`, and the mark defaults to 30 pixels.

- [ ] **Step 3: Implement paired tokens and contrast roles**

In `prototype/css/tokens.css`, retain the approved Warm Sage light roles and set:

```css
--feature-training-surface: #DCEBE1;
--feature-nutrition-surface: #F0E5D5;
--feature-blog-surface: #E8E3ED;
--feature-assistant-surface: #DDE8EB;

:root[data-theme="dark"] {
  --logo-body: #73B98B;
  --logo-mark: #10231A;
  --logo-leaf: #D6AA68;
  --bg: #14211C;
  --bg-sunken: #101A16;
  --surface: #202E27;
  --surface-raised: #2A3A31;
  --surface-hover: #33463A;
  --ink: #F0F3EF;
  --ink-secondary: #D0D8D2;
  --ink-muted: #ACB8B0;
  --border: #3B4C42;
  --border-strong: #53675B;
  --brand: #88C69D;
  --brand-hover: #A0D5AF;
  --brand-soft: #254438;
  --brand-ink: #A9D9B8;
  --on-brand: #10231A;
  --accent: #D6AA68;
  --accent-soft: #433726;
  --mineral: #82AEB9;
  --mineral-soft: #263A40;
  --anatomy: #D98B7D;
  --anatomy-soft: #49312E;
  --feature-training-surface: #254438;
  --feature-nutrition-surface: #433726;
  --feature-blog-surface: #373142;
  --feature-assistant-surface: #263A40;
  --page-gradient:
    radial-gradient(circle at 84% 8%, rgba(82, 132, 112, 0.26), transparent 34%),
    radial-gradient(circle at 9% 88%, rgba(168, 120, 60, 0.12), transparent 36%),
    linear-gradient(145deg, #14211C 0%, #202A25 100%);
}
```

Use a pale sage hero gradient in light mode and the Training surface family in dark mode. Change hero and CTA primary-button text to `var(--on-brand)`. Update the initial dark `<meta name="theme-color">` value to `#14211C`.

In `prototype/js/ui.js`, change the default to `brandmark(size = 38)`. In `prototype/css/layout.css`, remove the hard-coded dark logo-path fill and set the app-bar logo to 34 pixels at widths below 480 pixels.

- [ ] **Step 4: Verify GREEN and full regression safety**

Run: `node --test --test-name-pattern="Sage Dusk" tests/ui-contract.test.js`

Expected: PASS.

Run: `node --test tests/*.test.js`

Expected: all tests PASS.

---

### Task 2: Blog reading rhythm

**Files:**
- Modify: `tests/article-content.test.js`
- Modify: `prototype/js/screens-records.js`
- Modify: `prototype/js/screens-app.js`
- Modify: `prototype/css/layout.css`

**Interfaces:**
- Consumes: `ArticleContent.render(a)` and the existing `.article` reading column.
- Produces: `.article-reading`, `.article-related`, and explicit section-aware spacing rules.

- [ ] **Step 1: Add failing reading-rhythm contracts**

Add to `tests/article-content.test.js`:

```js
test('Blog posts use dedicated reading rhythm instead of a generic tight stack', () => {
  const records = read('prototype/js/screens-records.js');
  const legacy = read('prototype/js/screens-app.js');
  const layout = read('prototype/css/layout.css');
  assert.match(records, /class="article article-reading"/);
  assert.match(legacy, /class="article article-reading"/);
  assert.match(records, /class="article-related"/);
  assert.match(layout, /\.article-reading\s*>\s*\*\s*\+\s*\*/);
  assert.match(layout, /\.article-section\s*\+\s*\.article-section/);
  assert.match(layout, /\.article-section p\s*\+\s*p/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test --test-name-pattern="reading rhythm" tests/article-content.test.js`

Expected: FAIL because posts still use `class="article stack stack-5"` and the related section has no dedicated class.

- [ ] **Step 3: Implement section-aware article spacing**

Change both post renderers to:

```html
<article class="article article-reading">
```

Add `class="article-related"` to the related-post section. Define:

```css
.article-reading { display: grid; gap: var(--space-8); }
.article-reading > header { margin-bottom: var(--space-2); }
.article-body { display: grid; gap: var(--space-8); }
.article-section { padding-top: 0; }
.article-section + .article-section { margin-top: var(--space-4); }
.article-section > * + * { margin-top: var(--space-4); }
.article-section p + p { margin-top: 1.375rem; }
.article-related { display: grid; gap: var(--space-4); margin-top: var(--space-2); }
.article-related + .btn { margin-top: calc(-1 * var(--space-2)); }
```

At widths below 768 pixels, reduce `.article-reading` and `.article-body` gaps to `var(--space-6)` while keeping paragraph separation at least `var(--space-4)`.

- [ ] **Step 4: Verify GREEN and full regression safety**

Run: `node --test --test-name-pattern="reading rhythm" tests/article-content.test.js`

Expected: PASS.

Run: `node --test tests/*.test.js`

Expected: all tests PASS.

---

### Task 3: Athletic Anatomy preview

**Files:**
- Modify: `tests/anatomy-preview.test.js`
- Modify: `prototype/js/anatomy-preview.js`
- Modify: `prototype/css/components.css`

**Interfaces:**
- Consumes: `AnatomyPreview.render()`, shared helpers `t()`, `esc()`, `icon()`, and the `#/anatomy?view=front` route.
- Produces: a continuous `.preview-body-outline` plus `.preview-muscles` and `.preview-landmarks` layers in a `240 × 460` view box.

- [ ] **Step 1: Add failing Athletic Anatomy contracts**

Update `tests/anatomy-preview.test.js` to require:

```js
assert.match(source, /viewBox="0 0 240 460"/);
assert.match(source, /class="preview-body-outline"/);
assert.match(source, /data-region="body-outline"/);
assert.match(source, /data-region="hand-left"/);
assert.match(source, /data-region="hand-right"/);
assert.match(source, /data-region="foot-left"/);
assert.match(source, /data-region="foot-right"/);
assert.match(source, /class="preview-muscles"/);
assert.match(source, /class="preview-landmarks"/);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/anatomy-preview.test.js`

Expected: FAIL because the current preview uses a `240 × 440` view box and disconnected `.preview-structure` paths without a continuous body outline.

- [ ] **Step 3: Implement the approved Athletic Anatomy geometry**

Replace the current robotic base paths with one smooth `data-region="body-outline"` path that establishes the head-to-body ratio, shoulder taper, waist, pelvis, arms, thighs, calves, hands, and feet. Keep the named muscle overlays for deltoids, pectorals, abdominals, quadriceps, and calves. Use Sage Dusk roles:

```css
.training-anatomy-svg .preview-body-outline {
  fill: color-mix(in srgb, var(--surface) 78%, var(--brand-soft));
  stroke: color-mix(in srgb, var(--brand) 58%, var(--border-strong));
  stroke-width: 1.8;
  stroke-linejoin: round;
}
.training-anatomy-svg .preview-muscles {
  fill: color-mix(in srgb, var(--brand) 62%, var(--surface));
  stroke: color-mix(in srgb, var(--brand) 78%, var(--ink));
  stroke-width: 1.35;
}
.training-anatomy-svg .preview-landmarks {
  fill: none;
  stroke: color-mix(in srgb, var(--border-strong) 72%, transparent);
  stroke-width: 1;
}
```

Keep the whole SVG decorative and retain the accessible link label on the enclosing anchor.

- [ ] **Step 4: Verify GREEN and full regression safety**

Run: `node --test tests/anatomy-preview.test.js`

Expected: all anatomy-preview tests PASS.

Run: `node --test tests/*.test.js`

Expected: all tests PASS.

---

### Task 4: Final uncommitted quality gate

**Files:**
- Modify only files already named above if verification reveals a defect.

**Interfaces:**
- Consumes: completed Sage Dusk, Blog rhythm, and Athletic Anatomy units.
- Produces: test, syntax, contrast, and repository-hygiene evidence.

- [ ] **Step 1: Run the full test suite**

Run: `node --test tests/*.test.js`

Expected: zero failures.

- [ ] **Step 2: Parse every JavaScript file**

Run:

```powershell
Get-ChildItem prototype\js,tests -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

Expected: exit code 0.

- [ ] **Step 3: Verify source hygiene and uncommitted state**

Run: `git diff --check`

Expected: no whitespace errors.

Run: `git status --short`

Expected: the implementation and documentation remain modified or untracked, with no new commit.

- [ ] **Step 4: Verify contrast mathematically**

Calculate WCAG ratios for `#FFFFFF` on `#397458` and `#10231A` on `#88C69D`.

Expected: both pairings are at least 4.5:1.

- [ ] **Step 5: Hand off rendered review**

Serve the isolated worktree locally and provide Today, Training, Blog, and Blog-post URLs. If no controllable browser is exposed, report the limitation instead of claiming multi-viewport visual completion.
