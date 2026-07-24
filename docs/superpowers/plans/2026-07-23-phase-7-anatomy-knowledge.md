# Phase 7 Anatomy and Knowledge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a connected bilingual anatomy encyclopedia and production-ready local knowledge system.

**Architecture:** Expand stable local anatomy records and validated Markdown metadata, resolve all cross-feature links through pure functions, and keep interaction in focused client components. Public pages remain server-rendered and accessible while search/filter state stays local.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, accessible SVG, local Markdown, Zod 4, Marked, sanitize-html, Vitest, Node test runner.

## Global Constraints

- English is primary with matching Macedonian UI and supported content metadata.
- Keep Clinical Atlas SVG and Sky Dusk visual direction.
- Do not add dependencies, Three.js, GSAP, diagnosis, personalized treatment, Supabase content storage, or unreviewed mass-generated articles.
- Do not commit, push, merge, reset, or perform any Git operation.

---

### Task 1: Phase contracts and relationship domain

**Files:**
- Create: `tests/phase-7-anatomy-knowledge.test.js`
- Create: `tests/unit/anatomy-knowledge.test.ts`
- Modify: `src/features/anatomy/data.ts`

**Interfaces:**
- Produces `searchMuscles(query, region)`, `getAnatomyRegions()`, `resolveRelatedMuscles(record)`, and stable exercise/article slug arrays.

- [ ] Write failing tests for encyclopedia routes, required muscle fields, relationship integrity, expanded Markdown metadata, filters, references, and the 36-topic roadmap.
- [ ] Run the focused tests and confirm they fail because Phase 7 fields and components are missing.
- [ ] Expand the muscle type and all records with location, attachments, movements, activation, levelled exercise slugs, mobility, stretching, recovery, prevention, and relations.
- [ ] Implement deterministic search, region discovery, and safe relationship resolution.
- [ ] Re-run focused tests and require green output.

### Task 2: Interactive anatomy encyclopedia

**Files:**
- Modify: `src/features/anatomy/anatomy-explorer.tsx`
- Modify: `src/features/anatomy/anatomy-figure.tsx`
- Modify: `src/features/anatomy/atlas-paths.ts`
- Modify: `src/app/(marketing)/anatomy/page.tsx`
- Create: `tests/component/anatomy-directory.test.tsx`

**Interfaces:**
- Explorer consumes locale and local records; figure consumes view, selected ID, and selection callback.

- [ ] Write a failing component test for search, region filter, front/back switching, selection, and empty-result recovery.
- [ ] Build labelled filters and a complete muscle directory alongside the atlas.
- [ ] Improve figure proportions and clinical landmarks without changing the accessible SVG contract.
- [ ] Correct bilingual interface copy and preserve keyboard/touch behavior.
- [ ] Run component, contract, typecheck, and lint checks.

### Task 3: Encyclopedia muscle guides and cross-feature relationships

**Files:**
- Modify: `src/app/(marketing)/anatomy/[muscle]/page.tsx`
- Create: `src/features/anatomy/related-content.tsx`

**Interfaces:**
- Related content consumes one muscle record, locale, the Phase 6 exercise catalogue, and loaded articles.

- [ ] Build the complete muscle-guide information hierarchy from the expanded record.
- [ ] Resolve beginner/advanced exercise slugs to `/exercises/[slug]`.
- [ ] Resolve related muscles and articles safely and omit invalid relationships.
- [ ] Add explicit educational and medical-boundary language.
- [ ] Verify all generated anatomy paths and metadata.

### Task 4: Markdown schema and repository

**Files:**
- Modify: `src/lib/content/article-schema.ts`
- Modify: `src/lib/content/articles.ts`
- Modify: all 12 paired starter Markdown files.
- Create: `tests/unit/article-relationships.test.ts`

**Interfaces:**
- Article adds `references`, `relatedMuscles`, `relatedExercises`, and optional `featuredImage`.
- Repository produces `getArticleCategories(locale)` and `resolveArticleRelationships(article, allArticles)`.

- [ ] Write failing parser/resolver tests for valid references, safe URLs, missing related slugs, and deterministic headings.
- [ ] Extend frontmatter validation and sanitization without permitting unsafe protocols.
- [ ] Add reviewed relationship/reference metadata to every starter article in both locales.
- [ ] Implement category and safe relationship resolvers.
- [ ] Run content, relationship, and existing Phase 2 tests.

### Task 5: Filterable knowledge library and readable article pages

**Files:**
- Create: `src/features/knowledge/knowledge-library.tsx`
- Modify: `src/app/(marketing)/blog/page.tsx`
- Modify: `src/app/(marketing)/blog/[slug]/page.tsx`
- Create: `tests/component/knowledge-library.test.tsx`

**Interfaces:**
- `KnowledgeLibrary` consumes locale and serializable article summaries.

- [ ] Write a failing component test for text search, category filtering, clear filters, and empty results.
- [ ] Build the filterable article library with a featured entry and readable count.
- [ ] Add updated date, references, related anatomy, and related exercises to article pages.
- [ ] Remove obsolete phase-preview copy and correct bilingual UTF-8 strings.
- [ ] Run component, content, accessibility-contract, typecheck, and lint checks.

### Task 6: Editorial roadmap, styling, and documentation

**Files:**
- Modify: `content/editorial/topic-plan.md`
- Modify: `src/app/globals.css`
- Create: `docs/content-strategy.md`

- [ ] Correct the bilingual 36-topic roadmap and add category, review, evidence, translation, and publication status rules.
- [ ] Add responsive anatomy-directory, guide, relationship, knowledge-filter, reference, focus, and empty-state styles.
- [ ] Document source standards, legal image policy, medical boundaries, editorial workflow, and future Supabase migration boundary.
- [ ] Verify 320, 375, 768, 1024, and 1440 pixel layout rules are represented.

### Task 7: Final verification

**Files:**
- No production files unless a regression is found.

- [ ] Run `npm.cmd run test`, `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build`.
- [ ] Restart production on port 3000 and probe `/anatomy`, every anatomy detail route, `/blog`, and every starter article.
- [ ] Confirm `dist` and `.env.example` remain absent.
- [ ] Report implementation, test counts, content limitations, and Phase 8 recommendation without performing Git operations.
