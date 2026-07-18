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
  assert.match(source, /viewBox="0 0 220 430"/);
});

test('Training screen renders the replaceable anatomy preview module', () => {
  const html = read('prototype/index.html');
  const screen = read('prototype/js/screens-app.js');
  assert.match(html, /js\/anatomy-preview\.js/);
  assert.match(screen, /AnatomyPreview\.render\(\)/);
  assert.doesNotMatch(screen, /<circle cx="80" cy="27" r="20"/);
});

test('preview keeps structure, muscle emphasis, and labelling separate', () => {
  const source = read('prototype/js/anatomy-preview.js');
  assert.match(source, /class="preview-structure"/);
  assert.match(source, /class="preview-muscles"/);
  assert.match(source, /class="preview-landmarks"/);
  assert.match(source, /aria-hidden="true" focusable="false"/);
});

test('Athletic Anatomy uses a continuous human outline and shaped extremities', () => {
  const source = read('prototype/js/anatomy-preview.js');
  assert.match(source, /data-figure="athletic"/);
  assert.match(source, /viewBox="0 0 220 430"/);
  assert.match(source, /class="preview-athletic-outline"/);
  for (const region of ['hand-left', 'hand-right', 'foot-left', 'foot-right']) {
    assert.ok(source.includes(`data-region="${region}"`), `missing ${region}`);
  }
});

