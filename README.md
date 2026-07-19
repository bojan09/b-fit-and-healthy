# B Fit & Healthy

B Fit & Healthy is an English-first, bilingual health and fitness product built with Next.js App Router, TypeScript, Tailwind CSS, customized shadcn/ui primitives, Supabase, and Serwist. The approved Sage Dusk visual system remains the design foundation.

## Current delivery status

Phase 1 established the production foundation. Phase 2 adds the public landing and feature experience, six paired English/Macedonian Markdown articles, an accessible SVG Anatomy explorer, public muscle guides, sitemap, robots rules, RSS, structured data, and honest legal/information foundations.

Personal nutrition tracking, workout planning and logging, the full Anatomy encyclopedia, coaching, authentication screens, and dashboard workflows are not yet production-complete. The archived `.worktrees/active-dusk-refinement/prototype/` directory remains a visual reference and interaction specification; it is not the production runtime.

Three.js and GSAP are intentionally not loaded in the current production phases. They are reserved for the approved anatomy and motion phase after the accessible non-3D experience is established.

## Local development

Use Node.js 24 (see `.nvmrc`), then install the pinned dependencies and start the application from this repository root:

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:53271/`. Supporting foundation routes are available at `/states` and `/~offline`.

Keep local environment values in an untracked `.env.local` file. Configure deployment values in the hosting provider's environment settings. Never expose the service-role key or server integration credentials in `NEXT_PUBLIC_*` variables.

## Quality gates

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

The production build uses webpack because the current Serwist integration is configured for that bundler. Generated service-worker files under `public/` are ignored; their source of truth is `src/app/sw.ts`.

## Architecture boundaries

- `src/app/` — Next.js App Router pages, metadata, manifest, and service-worker source
- `src/components/` — product-owned components and customized UI primitives
- `src/lib/` — environment, locale, content, SEO, and Supabase boundaries
- `content/articles/` — paired English and Macedonian Markdown sources
- `supabase/migrations/` — versioned schema and ownership policies
- `supabase/tests/` — database and RLS contracts
- `tests/` — production repository contracts and unit tests
- `.worktrees/active-dusk-refinement/prototype/` — archived vanilla visual reference
- `.worktrees/pre-next-root-20260719/` — preserved pre-relocation root material

The service worker never caches Supabase, authentication, API, or private navigation responses. Protected data must remain server-authorized and user-owned through row-level security.
