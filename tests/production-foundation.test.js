const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const exists = (file) => fs.existsSync(path.join(root, file));
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('production package pins the approved Phase 1 stack and quality commands', () => {
  assert.ok(exists('package.json'), 'missing production package.json');
  const pkg = JSON.parse(read('package.json'));

  assert.equal(pkg.scripts.dev, 'next dev --webpack --port 3000');
  for (const script of ['build', 'start', 'lint', 'typecheck', 'test']) {
    assert.ok(pkg.scripts[script], `missing ${script} script`);
  }
  for (const dependency of ['next', 'react', 'react-dom', '@supabase/ssr',
    '@supabase/supabase-js', '@serwist/next', 'serwist', 'zod']) {
    assert.ok(pkg.dependencies[dependency] || pkg.devDependencies[dependency],
      `missing ${dependency}`);
  }
});

test('App Router exposes accessible foundation, state, and offline routes', () => {
  for (const file of [
    'src/app/layout.tsx',
    'src/app/(marketing)/page.tsx',
    'src/app/~offline/page.tsx',
    'src/app/loading.tsx',
    'src/app/error.tsx',
    'src/app/not-found.tsx'
  ]) assert.ok(exists(file), `missing ${file}`);

  const layout = read('src/app/layout.tsx');
  assert.match(layout, /<html[^>]+lang=\{locale\}/);
  assert.match(read('src/lib/i18n/config.ts'), /defaultLocale:\s*Locale\s*=\s*"en"/);
  assert.match(layout, /SkipLink/);
  assert.match(layout, /ThemeProvider/);
});

test('Balanced Daily Canvas tokens and customized UI primitives are production-owned', () => {
  const css = read('src/styles/tokens.css');
  assert.match(css, /--background:\s*#f3f4f1/i);
  assert.match(css, /\.dark[\s\S]*--background:\s*#10161a/i);
  assert.match(css, /--brand:\s*#347fa8/i);
  assert.match(css, /--space-16:\s*4rem/i);
  assert.ok(exists('components.json'));
  assert.ok(exists('src/components/ui/button.tsx'));
  assert.ok(exists('src/components/ui/card.tsx'));
});

test('Supabase SSR boundaries validate environment and never expose service role', () => {
  for (const file of [
    'src/lib/env/server.ts',
    'src/lib/env/public.ts',
    'src/lib/supabase/client.ts',
    'src/lib/supabase/server.ts',
    'src/lib/supabase/proxy.ts',
    'src/proxy.ts'
  ]) assert.ok(exists(file), `missing ${file}`);

  const client = read('src/lib/supabase/client.ts');
  const publicEnv = read('src/lib/env/public.ts');
  assert.doesNotMatch(`${client}\n${publicEnv}`, /SERVICE_ROLE|GROQ_API_KEY|USDA_FDC_API_KEY/);
  assert.match(read('src/lib/supabase/server.ts'), /createServerClient/);
});

test('Vercel uses the Next.js adapter instead of a stale static dist directory', () => {
  assert.ok(exists('vercel.json'), 'missing vercel.json');
  const config = JSON.parse(read('vercel.json'));
  assert.equal(config.framework, 'nextjs');
  assert.equal(config.outputDirectory, null);
  assert.equal(exists('.env.example'), false, 'do not ship a local environment template');
});

test('initial database migration enables RLS and ownership policies', () => {
  const migration = read('supabase/migrations/202607190001_foundation.sql');
  for (const table of ['profiles', 'user_settings', 'goals', 'daily_targets']) {
    assert.match(migration, new RegExp(`create table public\\.${table}`, 'i'));
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`, 'i'));
  }
  assert.match(migration, /auth\.uid\(\)\s*=\s*user_id/i);
  assert.ok(exists('supabase/tests/foundation_rls.sql'));
});

test('PWA foundation defines manifest, offline fallback, and private network-only caching', () => {
  for (const file of ['src/app/manifest.ts', 'src/app/sw.ts', 'src/components/pwa/pwa-register.tsx']) {
    assert.ok(exists(file), `missing ${file}`);
  }
  const sw = read('src/app/sw.ts');
  assert.match(sw, /NetworkOnly/);
  assert.match(sw, /\/auth\/|\/rest\/v1\/|\/api\//);
  assert.match(sw, /~offline/);
  assert.ok(exists('public/icons/icon-192.png'));
  assert.ok(exists('public/icons/icon-512.png'));
  assert.ok(exists('public/icons/maskable-512.png'));
});

test('the application shell sends a restrictive baseline Content Security Policy', () => {
  const config = read('next.config.mjs');
  assert.match(config, /Content-Security-Policy/);
  assert.match(config, /frame-ancestors 'none'/);
  assert.match(config, /connect-src 'self' https:\/\/\*\.supabase\.co/);
  assert.match(config, /object-src 'none'/);
});

test('quality tooling excludes preserved worktree and generated artifacts', () => {
  const config = read('eslint.config.mjs');
  assert.match(config, /\.worktrees\/\*\*/);
  assert.match(config, /\.next\/\*\*/);
  assert.match(read('.gitignore'), /^\.worktrees\/$/m);
});
