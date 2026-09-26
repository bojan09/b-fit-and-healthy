const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');

const root = path.resolve(__dirname, '..');
const exists = (file) => fs.existsSync(path.join(root, file));
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Phase 2 exposes the complete approved public route foundation', () => {
  for (const file of [
    'src/app/(marketing)/features/page.tsx',
    'src/app/(marketing)/features/nutrition/page.tsx',
    'src/app/(marketing)/features/training/page.tsx',
    'src/app/(marketing)/blog/page.tsx',
    'src/app/(marketing)/blog/[slug]/page.tsx',
    'src/app/(marketing)/anatomy/page.tsx',
    'src/app/(marketing)/anatomy/[muscle]/page.tsx',
    'src/app/(marketing)/about/page.tsx',
    'src/app/(marketing)/contact/page.tsx',
    'src/app/(marketing)/privacy/page.tsx',
    'src/app/(marketing)/terms/page.tsx'
  ]) assert.ok(exists(file), `missing ${file}`);
});

test('six approved articles have paired English and Macedonian Markdown sources', () => {
  const locales = ['en', 'mk'];
  const slugs = [
    'protein-without-the-myths',
    'why-sleep-is-part-of-training',
    'small-habits-beat-motivation',
    'progressive-overload-for-beginners',
    'muscle-soreness-normal-or-warning',
    'muscles-of-the-back-made-simple'
  ];
  for (const locale of locales) {
    for (const slug of slugs) {
      const file = `content/articles/${locale}/${slug}.md`;
      assert.ok(exists(file), `missing ${file}`);
      const source = read(file);
      for (const field of ['id', 'title', 'excerpt', 'category', 'publishedAt', 'readingTime', 'seoTitle', 'seoDescription']) {
        assert.match(source, new RegExp(`^${field}:`, 'm'), `${file} missing ${field}`);
      }
    }
  }
  assert.ok(exists('src/lib/content/articles.ts'));
});

test('every paired article has parseable YAML frontmatter', () => {
  for (const locale of ['en', 'mk']) {
    const directory = path.join(root, 'content', 'articles', locale);
    for (const file of fs.readdirSync(directory).filter((name) => name.endsWith('.md'))) {
      assert.doesNotThrow(() => matter(read(`content/articles/${locale}/${file}`)), `${locale}/${file} has invalid frontmatter`);
    }
  }
});

test('Blog routes use the validated repository, readable composition, and JSON-LD', () => {
  const index = read('src/app/(marketing)/blog/page.tsx');
  const detail = read('src/app/(marketing)/blog/[slug]/page.tsx');
  assert.match(index, /getArticles/);
  assert.match(detail, /getArticle/);
  assert.match(detail, /ArticleJsonLd/);
  assert.match(detail, /article-body/);
  assert.match(detail, /notFound\(\)/);
});

test('Anatomy uses stable muscle records and an accessible front/back SVG explorer', () => {
  for (const file of [
    'src/features/anatomy/data.ts',
    'src/features/anatomy/anatomy-explorer.tsx',
    'src/features/anatomy/anatomy-figure.tsx'
  ]) assert.ok(exists(file), `missing ${file}`);
  const explorer = read('src/features/anatomy/anatomy-explorer.tsx');
  const figure = read('src/features/anatomy/anatomy-figure.tsx');
  assert.match(explorer, /aria-pressed/);
  assert.match(explorer, /front/);
  assert.match(explorer, /back/);
  assert.match(figure, /<svg/);
  assert.match(figure, /role="group"/);
  assert.match(read('src/features/anatomy/data.ts'), /getMuscle/);
  assert.ok(exists('src/features/anatomy/atlas-paths.ts'));
  const atlas = read('src/features/anatomy/atlas-paths.ts');
  assert.match(atlas, /front:/);
  assert.match(atlas, /back:/);
  assert.match(atlas, /landmarks/);
  assert.match(figure, /atlasViews/);
});

test('public discoverability includes sitemap, robots, RSS, and structured data', () => {
  for (const file of [
    'src/app/sitemap.ts',
    'src/app/robots.ts',
    'src/app/feed.xml/route.ts',
    'src/components/seo/json-ld.tsx',
    'content/editorial/topic-plan.md'
  ]) assert.ok(exists(file), `missing ${file}`);
  assert.match(read('src/app/robots.ts'), /\/today/);
  assert.match(read('src/app/sitemap.ts'), /getArticleSlugs/);
  assert.match(read('src/app/feed.xml/route.ts'), /application\/rss\+xml/);
});

test('public navigation points only to implemented routes', () => {
  const header = read('src/components/shell/public-header.tsx');
  const footer = read('src/components/shell/public-footer.tsx');
  const navigation = read('src/components/shell/public-navigation.tsx');
  for (const destination of ['/features', '/anatomy', '/blog']) {
    assert.match(`${header}\n${footer}`, new RegExp(`href=["']${destination}["']`));
  }
  assert.doesNotMatch(`${header}\n${footer}`, /href=["']\/(today|nutrition|train|assistant)["']/);
  assert.match(navigation, /aria-current/);
  assert.match(navigation, /mobile-nav/);
});

test('public visitors can always find sign-in and registration', () => {
  const header = read('src/components/shell/public-header.tsx');
  const navigation = read('src/components/shell/public-navigation.tsx');
  const home = read('src/app/(marketing)/page.tsx');
  const footer = read('src/components/shell/public-footer.tsx');
  assert.match(header, /href="\/sign-in"/);
  assert.match(header, /href="\/sign-up"/);
  assert.match(navigation, /\/sign-in/);
  assert.match(navigation, /\/sign-up/);
  assert.match(home, /href="\/sign-in"/);
  assert.match(home, /href="\/sign-up"/);
  assert.match(footer, /href="\/sign-in"/);
  assert.match(footer, /href="\/sign-up"/);
});

test('shared public compositions keep Macedonian parity instead of hardcoded English controls', () => {
  assert.match(read('src/app/(marketing)/features/nutrition/page.tsx'), /getLocale/);
  assert.match(read('src/app/(marketing)/features/training/page.tsx'), /getLocale/);
  assert.match(read('src/components/content/article-card.tsx'), /readLabel/);
  assert.match(read('src/components/content/feature-page.tsx'), /labels/);
  assert.match(read('src/components/shell/public-footer.tsx'), /c\.nav\.contact/);
});

test('shared buttons use the coordinated Voltage tokens in both themes', () => {
  const css = read('src/styles/tokens.css');
  const button = read('src/components/ui/button.tsx');
  for (const token of ['--button-primary', '--button-primary-hover', '--button-primary-text', '--button-secondary', '--button-secondary-hover']) {
    assert.ok(css.split(token).length >= 3, `${token} must be defined for light and dark themes`);
  }
  assert.match(button, /--button-primary/);
  assert.match(button, /--button-secondary/);
  assert.match(button, /ui-button-primary/);
  assert.match(button, /ui-button-secondary/);
  for (const value of ['#0a0a0a', '#d4ff2f', '#465100', '#bfe829', '#262626']) {
    assert.match(css, new RegExp(value, 'i'), `missing approved Voltage token ${value}`);
  }
  assert.match(css, /:root\s*\{[\s\S]*--button-primary:\s*#0a0a0a/i);
  assert.match(css, /\.dark\s*\{[\s\S]*--button-primary:\s*#d4ff2f/i);
});

test('ambient field sits below interactive content and never tracks the pointer', () => {
  const css = read('src/styles/motion.css');
  assert.match(css, /\.ambient-field\s*\{[^}]*z-index:\s*0;/s);
  assert.match(read('src/app/globals.css'), /body\s*>\s*:not\(\.ambient-field\):not\(\.skip-link\)\s*\{[^}]*z-index:\s*1;/s);
  assert.doesNotMatch(read('src/app/layout.tsx'), /AmbientPointer/);
});
