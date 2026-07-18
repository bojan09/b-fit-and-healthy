const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('the document and first visit are English-first', () => {
  const html = read('prototype/index.html');
  const i18n = read('prototype/js/i18n.js');
  assert.match(html, /<html lang="en"/);
  assert.match(html, /localStorage\.getItem\("bfit\.lang"\) \|\| "en"/);
  assert.match(i18n, /const DEFAULT_LANG = "en"/);
});

test('current runtime is framework-free and loads the anatomy modules', () => {
  const html = read('prototype/index.html');
  assert.doesNotMatch(html, /shader\.js|gsap|three(?:\.min)?\.js/i);
  assert.match(html, /js\/anatomy-data\.js/);
  assert.match(html, /js\/anatomy\.js/);
});

test('Warm Sage and reusable spacing contracts are defined', () => {
  const tokens = read('prototype/css/tokens.css');
  const base = read('prototype/css/base.css');
  assert.match(tokens, /--bg:\s*#F4F4EE/i);
  assert.match(tokens, /--surface:\s*#FCFCF8/i);
  assert.match(tokens, /--brand:\s*#397458/i);
  assert.match(tokens, /\[data-theme="dark"\][\s\S]*--bg:\s*#18201C/i);
  assert.match(tokens, /--space-1:\s*0\.25rem/);
  assert.match(tokens, /--space-16:\s*4rem/);
  for (const selector of ['.flow', '.cluster', '.page-stack', '.section-stack']) {
    assert.ok(base.includes(selector), `missing composition selector ${selector}`);
  }
});

test('English and Macedonian dictionaries have exact key parity', () => {
  const source = read('prototype/js/i18n.js');
  const context = {
    console,
    Intl,
    localStorage: { getItem: () => null, setItem: () => {} },
    document: { documentElement: { lang: '' } }
  };
  vm.createContext(context);
  vm.runInContext(`${source}; globalThis.__dict = DICT;`, context);
  assert.deepEqual(Object.keys(context.__dict.en).sort(), Object.keys(context.__dict.mk).sort());
});

test('Anatomy is a canonical Training route and palette destination', () => {
  const app = read('prototype/js/app.js');
  assert.match(app, /"\/anatomy":\s*Anatomy\.screen/);
  assert.match(app, /\["#\/anatomy",\s*"nav\.anatomy"/);
  assert.match(app, /"\/anatomy":\s*"train"/);
});

test('flagged screens expose the approved layout contracts', () => {
  const appScreens = read('prototype/js/screens-app.js');
  const recordScreens = read('prototype/js/screens-records.js');
  for (const className of ['daily-canvas', 'daily-balance', 'daily-timeline', 'coach-panel',
    'nutrition-summary', 'program-focus', 'training-summary', 'coverage-anatomy-link',
    'assistant-workspace', 'assistant-conversation', 'assistant-suggestions']) {
    assert.ok(appScreens.includes(className), `missing screen contract ${className}`);
  }
  assert.ok(recordScreens.includes('blog-lead'), 'missing lead story');
  assert.ok(recordScreens.includes('blog-story-grid'), 'missing supporting story grid');
  assert.doesNotMatch(appScreens, /coverageMap\(/);
});

