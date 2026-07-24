const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('local credentials are ignored and browser code contains no server-only secret names', () => {
  const ignore = read('.gitignore');
  assert.match(ignore, /^\.env\.local$/m);
  const browserSources = [
    'src/lib/env/public.ts',
    'src/lib/supabase/client.ts'
  ].map(read).join('\n');
  assert.doesNotMatch(browserSources, /SERVICE_ROLE|GROQ_API_KEY|USDA_FDC_API_KEY/);
});

test('README documents the production workflow and current motion boundary', () => {
  const readme = read('README.md');
  assert.match(readme, /npm(?:\.cmd)? run dev/);
  assert.match(readme, /http:\/\/localhost:3000/);
  assert.match(readme, /prototype.+visual reference/is);
  assert.match(readme, /Phase 1.+foundation/is);
  assert.match(readme, /Phase 9.+GSAP.+Three\.js/is);
  assert.match(readme, /SVG atlas remains the active renderer/is);
});
