# Phase 2 Public Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete approved public experience, bilingual Blog foundation, accessible SVG Anatomy foundation, and public SEO layer.

**Architecture:** Server Components render public content and metadata. Focused client components own only mobile navigation and Anatomy interaction. Local paired Markdown is validated and sanitized behind a content repository so it can later move to Supabase without rewriting routes.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, Tailwind CSS 4, product-owned shadcn/ui primitives, Zod, local Markdown, Lucide, Supabase foundation, Serwist.

## Global Constraints

- Preserve Sage Dusk and the approved prototype direction.
- English is the default; Macedonian must have exact user-facing parity.
- Server Components by default and no false feature-completion claims.
- Do not install Three.js or GSAP before Phase 9.
- Do not perform any Git operation.
- Use test-first red/green cycles for every behavior.
- Stop after the Phase 2 report and wait for explicit approval.

## File structure

- `src/content/articles.ts` — validated article repository contract.
- `content/articles/{en,mk}/*.md` — paired local editorial sources.
- `src/features/anatomy/data.ts` — stable public muscle records.
- `src/features/anatomy/anatomy-explorer.tsx` — isolated interactive SVG experience.
- `src/components/content/*` — article and public content compositions.
- `src/components/shell/*` — public navigation and footer.
- `src/app/(marketing)/*` — public route compositions and metadata.
- `src/app/sitemap.ts`, `robots.ts`, `feed.xml/route.ts` — discoverability endpoints.
- `tests/phase-2-public-experience.test.js`, `tests/unit/content.test.ts` — public contracts.

### Task 1: Public contracts and content repository

**Interfaces:** Produces `getArticles(locale)`, `getArticle(locale, slug)`, `getArticleSlugs()`, and validated `Article` records.

- [x] Write route, locale parity, frontmatter, sanitization, and stable-slug tests.
- [x] Run them and confirm failure because the Phase 2 routes/content repository do not exist.
- [x] Install exact maintained Markdown parsing/sanitizing dependencies.
- [x] Add six paired Markdown samples and the Zod-backed repository.
- [x] Run focused tests until green, then the complete suite.

### Task 2: Public shell and landing ecosystem

**Interfaces:** Produces `PublicHeader`, `PublicFooter`, mobile navigation, `SectionIntro`, `FeatureCard`, and the `/`, `/features`, `/features/nutrition`, `/features/training` routes.

- [x] Add failing contracts for honest destinations, public routes, landmarks, locale parity, and footer structure.
- [x] Verify expected failures.
- [x] Extend the shared dictionaries and build the public shell/components.
- [x] Replace the Phase 1 placeholder hero with the approved ecosystem narrative and feature pages.
- [x] Add responsive section/container styles and verify focused/full tests.

### Task 3: Blog experience

**Interfaces:** Consumes the article repository and produces `/blog`, `/blog/[slug]`, article metadata, table of contents, related content, and JSON-LD.

- [x] Add failing tests for index/detail routes, article landmarks, metadata, schema, and unknown-slug handling.
- [x] Verify expected failures.
- [x] Implement reusable article cards, category treatment, readable article composition, disclaimers, and related links.
- [x] Render sanitized Markdown server-side and create Article/Breadcrumb structured data.
- [x] Verify focused/full tests.

### Task 4: Public Anatomy foundation

**Interfaces:** Produces stable `MuscleSummary` records, `getMuscle(id)`, `AnatomyExplorer`, `/anatomy`, and `/anatomy/[muscle]`.

- [x] Add failing tests for front/back controls, semantic muscle buttons, stable detail routes, useful educational fields, and unknown slugs.
- [x] Verify expected failures.
- [x] Build the recognizable continuous SVG silhouette and isolated client interaction state.
- [x] Build server-rendered muscle details and accessible synchronized controls.
- [x] Verify keyboard semantics, responsive CSS, focused/full tests.

### Task 5: Public SEO, legal pages, and editorial roadmap

**Interfaces:** Produces canonical metadata helpers, sitemap, robots, RSS feed, Organization/WebSite JSON-LD, legal/about/contact routes, and the article topic plan.

- [x] Add failing endpoint and route contracts.
- [x] Verify expected failures.
- [x] Implement metadata utilities, public sitemap, protected-route robots exclusions, RSS, and structured data.
- [x] Add honest company/legal/contact foundations and `content/editorial/topic-plan.md` with 30–40 bilingual topics grouped by category.
- [x] Verify focused/full tests and ensure no fake claims or unavailable actions appear.

### Task 6: Phase 2 quality gate

**Interfaces:** Produces verification evidence and the mandatory Phase 2 report.

- [ ] Run `npm.cmd test`, `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build` from current files.
- [ ] Start the production build at `http://localhost:53271/` without a visible helper window.
- [ ] Inspect every Phase 2 route, metadata endpoint, link target, theme, locale, content state, and console state using the available browser capability.
- [ ] Check mobile, tablet, laptop, desktop, and large desktop widths; fix failures and repeat affected checks.
- [ ] Report all 13 required sections, disclose any unavailable browser/Supabase verification, and stop for approval.

## Self-review

- Every Phase 2 requirement maps to one task.
- Every behavioral task begins with a failing test.
- The interfaces use consistent article locale/slug and muscle ID contracts.
- No future-phase package or feature is introduced.
- Git steps are omitted intentionally under the project’s explicit no-Git rule.
