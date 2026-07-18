# Active Dusk, Blog, and Anatomy Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved Active Dusk dark theme, correct light-mode discoloration, expand Blog posts into readable editorial pages, and replace the Training balloon figure with a recognizable anatomical preview.

**Architecture:** Extend the existing token system and component selectors without changing the layout architecture. Put rich article content/rendering and the compact anatomy preview in focused vanilla-JavaScript modules loaded before screen renderers, keeping both replaceable and independently testable.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js built-in test runner.

## Global Constraints

- Keep the existing HTML, CSS, and vanilla JavaScript architecture.
- Do not add React, Three.js, GSAP, a build system, or third-party UI libraries.
- English remains the primary language; Macedonian translations retain exact key parity.
- Preserve existing routes, search, filters, bookmarks, Training links, and Anatomy explorer behavior.
- Use gradients as atmospheric page and feature treatments, not on every control or card.
- Respect keyboard navigation, touch targets, reduced motion, and existing responsive breakpoints.

---

### Task 1: Active Dusk tokens and light-mode compositing

**Files:**
- Modify: `tests/ui-contract.test.js`
- Modify: `prototype/css/tokens.css`
- Modify: `prototype/css/base.css`
- Modify: `prototype/css/components.css`
- Modify: `prototype/css/layout.css`

**Interfaces:**
- Consumes: existing role tokens such as `--bg`, `--surface`, `--brand`, and feature classes already emitted by screen renderers.
- Produces: `--page-gradient`, `--feature-training-surface`, `--feature-nutrition-surface`, `--feature-blog-surface`, and `--feature-assistant-surface` CSS roles.

- [ ] **Step 1: Write failing theme contracts**

Add this test to `tests/ui-contract.test.js`:

```js
test('Active Dusk differentiates dark feature surfaces without muddy light blooms', () => {
  const tokens = read('prototype/css/tokens.css');
  const base = read('prototype/css/base.css');
  const components = read('prototype/css/components.css');
  assert.match(tokens, /\[data-theme="dark"\][\s\S]*--bg:\s*#0D1830/i);
  assert.match(tokens, /--page-gradient:[^;]*radial-gradient[\s\S]*linear-gradient/i);
  for (const role of ['training', 'nutrition', 'blog', 'assistant']) {
    assert.match(tokens, new RegExp(`--feature-${role}-surface:`));
  }
  assert.match(base, /background:\s*var\(--page-gradient\)/);
  assert.match(components, /:root:not\(\[data-theme="dark"\]\) \.hero-card::after\s*\{\s*display:\s*none/);
});
```

- [ ] **Step 2: Run the theme contract and confirm RED**

Run: `node --test --test-name-pattern="Active Dusk" tests/ui-contract.test.js`

Expected: FAIL because `#0D1830`, `--page-gradient`, and feature-surface roles do not exist.

- [ ] **Step 3: Implement the theme roles and compositing fix**

In `prototype/css/tokens.css`, define a neutral light `--page-gradient` and feature surfaces, then replace the dark token block with the approved Active Dusk values:

```css
--page-gradient: linear-gradient(180deg, var(--bg), var(--bg));
--feature-training-surface: var(--surface);
--feature-nutrition-surface: var(--surface);
--feature-blog-surface: var(--surface);
--feature-assistant-surface: var(--surface);

:root[data-theme="dark"] {
  --bg: #0D1830;
  --bg-sunken: #0A1428;
  --surface: #17274A;
  --surface-raised: #1B2B50;
  --surface-hover: #24365F;
  --ink: #F7F8FF;
  --ink-secondary: #D3D9E8;
  --ink-muted: #AEBBD3;
  --border: #30446D;
  --border-strong: #49618E;
  --brand: #5EE6A8;
  --brand-hover: #7DEDB9;
  --brand-soft: #183D3C;
  --accent: #F5A258;
  --accent-soft: #4A2B25;
  --mineral: #56C9E8;
  --mineral-soft: #143E51;
  --anatomy: #F27C75;
  --anatomy-soft: #4B292F;
  --feature-training-surface: #16453F;
  --feature-nutrition-surface: #4A2B25;
  --feature-blog-surface: #2C2858;
  --feature-assistant-surface: #143E51;
  --page-gradient:
    radial-gradient(circle at 84% 8%, rgba(47, 185, 188, 0.32), transparent 34%),
    radial-gradient(circle at 9% 88%, rgba(239, 126, 72, 0.18), transparent 36%),
    linear-gradient(140deg, #0D1830 0%, #17274A 52%, #262052 100%);
}
```

In `prototype/css/base.css`, use `background: var(--page-gradient)` on `body`, reduce the light halo to low-opacity sage/mineral color mixing, and retain the existing coarse-pointer and reduced-motion guards.

In `prototype/css/components.css`, disable `.hero-card::after` in light mode and add opaque light status-chip surfaces. In `prototype/css/layout.css`, apply the four feature-surface roles to the existing Training, Nutrition, Blog, and Assistant feature containers only under dark mode.

- [ ] **Step 4: Run the focused and full contracts**

Run: `node --test --test-name-pattern="Active Dusk" tests/ui-contract.test.js`

Expected: PASS.

Run: `node --test tests/*.test.js`

Expected: all tests PASS.

- [ ] **Step 5: Commit the theme unit**

```bash
git add tests/ui-contract.test.js prototype/css/tokens.css prototype/css/base.css prototype/css/components.css prototype/css/layout.css
git commit -m "feat: add active dusk theme"
```

---

### Task 2: Structured editorial Blog content

**Files:**
- Create: `prototype/js/article-content.js`
- Create: `tests/article-content.test.js`
- Modify: `prototype/index.html`
- Modify: `prototype/js/screens-records.js`
- Modify: `prototype/js/screens-app.js`
- Modify: `prototype/css/layout.css`

**Interfaces:**
- Consumes: article objects with `id`, `title`, `excerpt`, and existing bilingual `body`; global helpers `L()` and `esc()`.
- Produces: `ArticleContent.get(articleId)` and `ArticleContent.render(article)`; the renderer returns safe structured HTML with `.article-standfirst`, `.article-takeaways`, `.article-section`, `.article-example`, and `.article-summary` contracts.

- [ ] **Step 1: Write failing article-content tests**

Create `tests/article-content.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('every Blog article has structured bilingual editorial content', () => {
  const source = read('prototype/js/article-content.js');
  for (const id of ['a1', 'a2', 'a3', 'a4', 'a5', 'a6']) {
    assert.match(source, new RegExp(`${id}:\\s*\\{`));
  }
  assert.match(source, /takeaways:/);
  assert.match(source, /sections:/);
  assert.match(source, /summary:/);
  assert.match(source, /mk:/);
  assert.match(source, /en:/);
});

test('Blog post render uses the shared structured renderer', () => {
  const html = read('prototype/index.html');
  const records = read('prototype/js/screens-records.js');
  assert.match(html, /js\/article-content\.js/);
  assert.match(records, /ArticleContent\.render\(a\)/);
});
```

- [ ] **Step 2: Run the article tests and confirm RED**

Run: `node --test tests/article-content.test.js`

Expected: FAIL because `prototype/js/article-content.js` does not exist.

- [ ] **Step 3: Implement the structured content module**

Create `prototype/js/article-content.js` with six bilingual records. Each record must contain three takeaways, at least three titled sections with paragraph/list blocks, an example callout, and a summary. Article `a4` must cover overload variables, a beginner progression example, readiness signals, and a next-session checklist.

Expose this interface:

```js
const ArticleContent = {
  records: ARTICLE_RECORDS,
  get(id) { return this.records[id] || this.records.a1; },
  render(article) {
    const content = this.get(article.id);
    const takeaways = L(content.takeaways);
    const sections = L(content.sections);
    return `
      <p class="article-standfirst">${esc(L(article.excerpt))}</p>
      <aside class="article-takeaways" aria-labelledby="takeaway-title">
        <h2 id="takeaway-title">${esc(L(content.takeawayTitle))}</h2>
        <ul>${takeaways.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
      </aside>
      ${sections.map((section) => `
        <section class="article-section">
          <h2>${esc(section.title)}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}
          ${section.items ? `<ul>${section.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}
        </section>`).join('')}
      <aside class="article-example"><h2>${esc(L(content.example.title))}</h2><p>${esc(L(content.example.body))}</p></aside>
      <section class="article-summary"><h2>${esc(L(content.summary.title))}</h2><p>${esc(L(content.summary.body))}</p></section>`;
  }
};
```

`ARTICLE_RECORDS` is declared in the same file with the complete `a1`, `a2`, `a3`, `a4`, `a5`, and `a6` objects. Every object contains bilingual `takeawayTitle`, three `takeaways`, three or more `sections`, one `example`, and one `summary`; no article falls back to generated or placeholder copy.

Load it after `data.js` and before both screen files in `prototype/index.html`. Replace the paragraph-only article bodies in `screens-records.js` and the legacy article renderer in `screens-app.js` with `${ArticleContent.render(a)}`.

Add CSS in `prototype/css/layout.css` for a maximum `68ch` article column, a three-column takeaway list that stacks below 768 pixels, clear section rhythm, and differentiated example/summary surfaces using the Blog feature tokens.

- [ ] **Step 4: Run article and full tests**

Run: `node --test tests/article-content.test.js`

Expected: 2 tests PASS.

Run: `node --test tests/*.test.js`

Expected: all tests PASS.

- [ ] **Step 5: Commit the Blog unit**

```bash
git add tests/article-content.test.js prototype/js/article-content.js prototype/index.html prototype/js/screens-records.js prototype/js/screens-app.js prototype/css/layout.css
git commit -m "feat: expand blog reading experience"
```

---

### Task 3: Recognizable Training anatomy preview

**Files:**
- Create: `prototype/js/anatomy-preview.js`
- Create: `tests/anatomy-preview.test.js`
- Modify: `prototype/index.html`
- Modify: `prototype/js/screens-app.js`
- Modify: `prototype/css/components.css`
- Modify: `prototype/css/layout.css`

**Interfaces:**
- Consumes: global `t()`, `esc()`, and `icon()` helpers plus the existing `#/anatomy?view=front` route.
- Produces: `AnatomyPreview.render()` returning the compact linked SVG; SVG regions use `.preview-muscle` and `data-region` attributes.

- [ ] **Step 1: Write failing anatomy-preview tests**

Create `tests/anatomy-preview.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Training anatomy preview uses recognizable segmented body regions', () => {
  const source = read('prototype/js/anatomy-preview.js');
  for (const region of ['head', 'neck', 'deltoid-left', 'deltoid-right', 'pectorals', 'abdominals', 'pelvis', 'quadriceps-left', 'quadriceps-right', 'calf-left', 'calf-right']) {
    assert.ok(source.includes(`data-region="${region}"`), `missing ${region}`);
  }
  assert.match(source, /viewBox="0 0 240 440"/);
});

test('Training screen renders the replaceable anatomy preview module', () => {
  const html = read('prototype/index.html');
  const screen = read('prototype/js/screens-app.js');
  assert.match(html, /js\/anatomy-preview\.js/);
  assert.match(screen, /AnatomyPreview\.render\(\)/);
  assert.doesNotMatch(screen, /<circle cx="80" cy="27" r="20"/);
});
```

- [ ] **Step 2: Run the anatomy tests and confirm RED**

Run: `node --test tests/anatomy-preview.test.js`

Expected: FAIL because `prototype/js/anatomy-preview.js` does not exist.

- [ ] **Step 3: Implement the segmented anatomical schematic**

Create `prototype/js/anatomy-preview.js`:

```js
const AnatomyPreview = {
  render() {
    return `<a class="coverage-figure" href="#/anatomy?view=front" aria-label="${esc(t('coverage.title'))}">
      <svg class="training-anatomy-svg" viewBox="0 0 240 440" aria-hidden="true" focusable="false">
        <g class="preview-structure">
          <path data-region="head" d="M120 20C99 20 89 36 92 57c3 22 14 34 28 34s25-12 28-34c3-21-7-37-28-37Z" />
          <path data-region="neck" d="M105 84l3 24h24l3-24c-9 8-21 8-30 0Z" />
          <path data-region="deltoid-left" d="M108 105c-22-5-42 5-50 25l13 27 25-16 12-36Z" />
          <path data-region="deltoid-right" d="M132 105c22-5 42 5 50 25l-13 27-25-16-12-36Z" />
          <path data-region="pectorals" d="M96 112c7-5 15-7 24-7s17 2 24 7l-4 49c-13 8-27 8-40 0l-4-49Z" />
          <path data-region="abdominals" d="M101 164h38l6 69-25 21-25-21 6-69Z" />
          <path data-region="pelvis" d="M95 233l25 17 25-17 13 37-38 20-38-20 13-37Z" />
          <path data-region="quadriceps-left" d="M84 267l34 20-6 83-27 2-10-50 9-55Z" />
          <path data-region="quadriceps-right" d="M156 267l-34 20 6 83 27 2 10-50-9-55Z" />
          <path data-region="calf-left" d="M85 369h27l-2 50-18 15-11-8 4-57Z" />
          <path data-region="calf-right" d="M155 369h-27l2 50 18 15 11-8-4-57Z" />
        </g>
      </svg>
      <span>${esc(t('nav.anatomy'))} ${icon('arrowRight', 'icon icon-sm')}</span>
    </a>`;
  }
};
```

Use explicit smooth SVG paths for each named region, consistent bilateral proportions, a shoulder-to-head ratio near 3:1, a torso longer than the head, hands ending around mid-thigh, and feet wider than the ankles. Do not use one merged torso/leg blob.

Load the module before `screens-app.js`, replace the old inline SVG/link with `${AnatomyPreview.render()}`, and update `.coverage-figure` styles so the illustration is approximately 150 by 275 pixels on desktop and remains contained on mobile. Use feature tokens for structure and highlighted muscles.

- [ ] **Step 4: Run anatomy and full tests**

Run: `node --test tests/anatomy-preview.test.js`

Expected: 2 tests PASS.

Run: `node --test tests/*.test.js`

Expected: all tests PASS.

- [ ] **Step 5: Commit the anatomy unit**

```bash
git add tests/anatomy-preview.test.js prototype/js/anatomy-preview.js prototype/index.html prototype/js/screens-app.js prototype/css/components.css prototype/css/layout.css
git commit -m "feat: improve training anatomy preview"
```

---

### Task 4: Full quality gate

**Files:**
- Modify only if verification exposes a defect in files already listed above.

**Interfaces:**
- Consumes: the completed theme, Blog, and anatomy units.
- Produces: verification evidence for automated behavior, syntax, responsive layout, and both themes.

- [ ] **Step 1: Run all automated tests**

Run: `node --test tests/*.test.js`

Expected: all tests PASS with zero failures.

- [ ] **Step 2: Parse every JavaScript file**

Run:

```powershell
Get-ChildItem prototype/js,tests -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

Expected: exit code 0 and no syntax errors.

- [ ] **Step 3: Run whitespace and repository checks**

Run: `git diff --check`

Expected: no output and exit code 0.

- [ ] **Step 4: Run the responsive browser audit**

Open `tests/viewport-audit.html` through a local HTTP server and audit Today, Nutrition, Training, Blog, a Blog post, Assistant, and Anatomy at 320, 375, 480, 768, 1024, 1280, and 1440 pixels in both light and dark modes.

Expected: zero horizontal-overflow failures, no console errors, and all routes render content.

- [ ] **Step 5: Perform visual acceptance review**

Confirm:

- light hero and status chips have no muddy or neon discoloration;
- dark mode visibly differentiates Training, Nutrition, Blog, and Assistant while retaining readable text;
- the page background shows a restrained cobalt/cyan/orange/violet gradient;
- the progressive-overload post has takeaways, multiple sections, a practical example, and a summary;
- the compact Training figure has recognizable human proportions and segmented muscle regions;
- keyboard focus and reduced-motion behavior remain visible and usable.

- [ ] **Step 6: Commit any verification-only corrections**

```bash
git add prototype/css/tokens.css prototype/css/base.css prototype/css/components.css prototype/css/layout.css prototype/index.html prototype/js/article-content.js prototype/js/anatomy-preview.js prototype/js/screens-app.js prototype/js/screens-records.js tests
git commit -m "fix: resolve refinement qa findings"
```
