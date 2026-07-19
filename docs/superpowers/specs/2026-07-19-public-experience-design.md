# B Fit & Healthy Phase 2 Public Experience Design

Date: 2026-07-19  
Status: Approved through the production architecture and Phase 1 approval gate

## Purpose

Turn the Phase 1 foundation into a credible public product experience without implying that authenticated tracking features are already available. Preserve Sage Dusk, the approved brand, English-first bilingual behavior, and the calm athletic editorial tone.

## Chosen approach

Use a server-rendered ecosystem narrative rather than a dashboard preview or generic marketing template. The landing page explains how daily guidance, nutrition, training, anatomy, knowledge, and future coaching connect. Feature pages provide enough education to stand alone. Calls to action lead to real public destinations or clearly identify later availability.

Two alternatives were rejected:

- A dashboard-led landing page would falsely imply Phase 4 functionality is ready.
- A highly animated campaign page would introduce Phase 9 technology early and weaken content accessibility.

## Public information architecture

- `/` — premium ecosystem overview with meaningful product demonstrations.
- `/features` — connected-system overview.
- `/features/nutrition` and `/features/training` — focused educational feature pages.
- `/blog` and `/blog/[slug]` — searchable-looking but server-rendered editorial index and six approved articles.
- `/anatomy` and `/anatomy/[muscle]` — front/back SVG explorer and muscle detail pages.
- `/about`, `/contact`, `/privacy`, `/terms` — honest company and policy foundations.
- `/states` and `/~offline` remain the system-state references.

## Shared composition

The public header gains desktop navigation and a compact accessible mobile disclosure. The footer becomes a structured product, education, and legal directory. Reusable page headers, section intros, feature cards, article cards, disclaimers, and CTA bands use the existing semantic tokens rather than page-specific colors.

The landing page flows from promise to connected modules, then nutrition/training demonstrations, Anatomy, knowledge, trust, and a final honest CTA. It should feel rich but breathable: large section gaps, restrained card counts, 68-character reading measure, and no decorative card wall.

## Blog architecture

Six approved prototype articles become paired English and Macedonian Markdown files with shared stable IDs and slugs. A Zod-validated loader parses frontmatter at build/request time, sanitizes rendered HTML, generates reading metadata, resolves related articles, and exposes Article and Breadcrumb structured data. The full 30–40 article corpus is not generated in this phase; an editorial topic plan is documented separately.

## Anatomy architecture

The SVG baseline uses a recognizable continuous athletic silhouette with separately interactive muscle regions. A client-owned explorer manages front/back view, selected muscle, hover/focus state, and synchronized HTML controls. Each muscle also has a server-rendered detail route with function, benefit, training guidance, mistakes, and related exercises. URL slugs remain the stable bridge to later Three.js meshes.

Phase 2 ships a representative public foundation rather than the complete encyclopedia. The full 17-muscle editorial depth remains Phase 7, but every region exposed now must have useful copy and a real detail route.

## SEO and content safety

Public pages receive canonical metadata, Open Graph defaults, sitemap inclusion, robots rules, Organization/WebSite structured data, and Article/Breadcrumb schema. Protected and callback route families are excluded. Health content uses educational language, references where appropriate, and a consistent non-medical disclaimer. No ratings, outcomes, testimonials, or scientific citations are fabricated.

## Interaction and accessibility

CSS handles hover, focus, disclosure, and subtle atmospheric feedback. No GSAP or Three.js is installed. Essential content exists without animation. The mobile menu, Anatomy controls, article links, theme control, and locale switcher are keyboard and touch usable. Reduced motion disables nonessential transitions.

## Error handling and testing

Unknown article and muscle slugs use `notFound()`. Content schemas fail builds with readable errors. Tests cover route inventory, bilingual parity, frontmatter requirements, sanitized Markdown, Anatomy slug resolution, SEO outputs, and navigation honesty. The phase ends with type-check, lint, tests, production build, live route checks, and the mandatory review report.

## Scope exclusions

No real authentication UI, dashboard, user tracking, USDA integration, exercise database, AI, GSAP, Three.js, or remote content management is included. Those remain behind later approval gates.

## Self-review

- No placeholders or undefined product decisions remain.
- The route, content, SEO, and Anatomy boundaries match the approved architecture.
- Phase 3–9 functionality is not represented as complete.
- English remains default and every new user-facing string requires Macedonian parity.
- The design is independently testable and small enough for one phased implementation plan.
