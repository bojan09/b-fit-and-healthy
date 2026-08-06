# Voltage Redesign — Design Spec

Date: 2026-08-06
Status: approved by user, ready for implementation planning

## Summary

Full visual overhaul, replacing the current "Sage Dusk" editorial-calm system with a new
bold/athletic identity codenamed **Voltage**. Structure (routes, nav IA, component boundaries)
is preserved; palette, type, shape language, and motion are replaced wholesale. This also
retires the two legacy issues found in the prior audit: the dead `@layer legacy` CSS block in
`src/app/globals.css` and the stale "Sky Dusk" reference in `README.md`.

## Visual direction

- **Palette**: adaptive light/dark, no default lean. Base swaps near-black ↔ off-white by theme;
  accent is constant electric lime `#d4ff2f` in both themes. Existing semantic slots
  (success/warning/danger) get remapped to avoid collision with lime/accent usage.
- **Type**: display = Archivo Black, body = Inter, numerals/data = JetBrains Mono (kept from
  current system — already fits the new "data readout" stat style).
- **Shape**: angled-cut clip-path motif (`polygon(0 0, 100% 0, 92% 100%, 0 100%)` family) applied
  to buttons, cards, nav CTA, hero panels, section dividers — **except** dense data UI (tables,
  forms, list rows in tracking/nutrition/workout-log/history screens), which stays rectangular
  for readability and alignment. Implemented as a `.cut` utility + `cut` boolean prop on
  `Button`/`Card`, with `.no-cut` as the explicit escape hatch.
- **Motion**: kinetic — GSAP entrance slide+skew on hero/page load (~300-500ms, `power3.out`),
  stat count-up on mount for dashboard/progress/personal-records, snappy hover
  scale+shadow-punch (~150ms) on buttons/cards. Reuses existing `motion-preferences`
  reduced-motion hook and the existing scroll-reveal IntersectionObserver + fallback-sweep
  workaround — no new infra for either.

## Token system

Replaces `src/styles/tokens.css` in place (same file, new values) and deletes the dead
`@layer legacy` block (`src/app/globals.css:15-129`) entirely — no migration path needed since
that block was already inert.

New/changed custom properties: `--bg`, `--bg-inverse`, `--ink`, `--ink-inverse`, `--accent`
(`#d4ff2f`, constant), `--surface`, `--border`, remapped `--success/--warning/--danger`,
`--font-display`, `--font-body`, `--font-mono` (unchanged value, kept), `--cut-clip`. Spacing,
radii, shadow, and motion-duration scale values are **unchanged** — only what rides on top of
them changes.

## Component impact

- `ui/button.tsx`: primary/secondary variants get `.cut` + Archivo Black label treatment;
  quiet/danger stay rectangular (used inline near data/forms).
- `ui/card.tsx`: new `cut` boolean prop, default `true` for marketing/dashboard cards, `false`
  for data list-row cards (tracking, workout history, exercise library).
- `shell/*`: nav re-skinned per hero mockup (`B<span accent>FIT</span>` logo lockup, angled nav
  CTA). Mobile bottom-tab structure (5 tabs) unchanged, re-skinned only.
- `ui/empty-state.tsx`, `route-skeleton.tsx`: re-skin only, no structural change — these are
  already a strength per the prior audit.
- Stat displays (dashboard, progress, personal-records): new mono-numeral "readout" style
  (large weight + accent-colored unit suffix + count-up motion) — net-new pattern, not present
  in the current system.

## Scope fold-ins (from prior repo audit)

- **i18n consolidation**: the 3 parallel i18n systems (`lib/i18n/config.ts` flat dict,
  `lib/i18n/public-content.ts` nested dict, inline ternaries in `(marketing)/page.tsx`) get
  unified into one system as part of the page-by-page redesign pass, since every page's copy is
  being touched anyway. Target shape: extend `public-content.ts`'s nested structure to cover
  every page currently on the flat dict or inline ternaries; retire the other two.
- **README stale reference**: "Sky Dusk" line corrected to describe Voltage, folded into
  production-hardening (Phase 10) doc pass.
- **Supabase proxy.ts test gap** and **missing `.env.example`**: unrelated to visual redesign,
  stay as separate backlog items from the original audit, not part of this spec.

## Rollout order

1. Global foundations: tokens, `ui/button.tsx`, `ui/card.tsx`, `shell/*` nav/header components.
2. Page-by-page, product `(product)` and `(marketing)` groups (order TBD at planning time —
   likely marketing first since it's lower-risk/no-auth-required for QA), each page also gets
   its i18n consolidated during its pass.
3. Cleanup: delete dead CSS block, fix README, verify no dangling references to old token names.

## Out of scope

- Nav IA/route structure changes (explicitly preserved).
- Any change to `src/features/*` business logic, Supabase schema, or data flow.
- The two backlog items noted above (proxy.ts test, `.env.example`).

## Open questions for implementation planning

- Exact list of pages in "dense data UI" (`no-cut`) category vs standard — needs a per-page
  pass, not fully enumerable at spec time.
- Whether `--font-display`/`--font-body` need new `next/font` entries (currently loads Source
  Sans 3 + JetBrains Mono in `layout.tsx`) or reuse conventions from existing font-loading setup.
