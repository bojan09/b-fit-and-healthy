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

test('Blog post routes use the shared structured renderer', () => {
  const html = read('prototype/index.html');
  const records = read('prototype/js/screens-records.js');
  const legacy = read('prototype/js/screens-app.js');
  assert.match(html, /js\/article-content\.js/);
  assert.match(records, /ArticleContent\.render\(a\)/);
  assert.match(legacy, /ArticleContent\.render\(a\)/);
});

test('structured renderer exposes readable editorial landmarks', () => {
  const source = read('prototype/js/article-content.js');
  for (const className of ['article-standfirst', 'article-takeaways', 'article-section', 'article-example', 'article-summary']) {
    assert.ok(source.includes(className), `missing ${className}`);
  }
});

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

