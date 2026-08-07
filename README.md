# B Fit & Healthy

B Fit & Healthy is an English-first, bilingual health and fitness product built with Next.js App Router, TypeScript, Tailwind CSS, customized shadcn/ui primitives, Supabase, and Serwist. The approved Sky Dusk visual system remains the design foundation.

## Current delivery status

Phase 1 established the production foundation; Phases 2–4 added the public experience, authentication/onboarding, and real-data Guided Daily Canvas. Phase 5 adds private nutrition logging, recipes, meal planning, groceries, and USDA-backed search. Phase 6 adds the exercise library, workout planning, active sessions, history, and personal records. Phase 7 adds the Anatomy encyclopedia, richer SVG atlas, content relationships, and bilingual knowledge depth. Phase 8 adds the private Groq AI Coach with minimized context, 30-day history, safety boundaries, and reviewable drafts.

Phase 9 adds progressive GSAP motion and a licensed-asset-gated Three.js integration boundary. The accessible SVG atlas remains the active renderer; a live clinical 3D model is not claimed or enabled. Provider-backed features require their documented Supabase migrations and valid server credentials.

See `docs/motion-and-three-operations.md` for capability gates, reduced-motion behavior, model licensing requirements, and renderer cleanup.

## Local development

Use Node.js 24 (see `.nvmrc`), then install the pinned dependencies and start the application from this repository root:

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000/`. Authentication begins at `/sign-in`; the offline fallback is available at `/~offline`.

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
