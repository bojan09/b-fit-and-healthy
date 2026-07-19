# Public Account Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make sign-in and registration obvious from every important public landing-page region.

**Architecture:** Extend the existing bilingual public content and shell rather than creating a separate account banner. Shared routes remain `/sign-in` and `/sign-up`; CSS adapts the actions for desktop and mobile.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS 4, existing Sage Dusk primitives, Node contract tests.

## Global Constraints

- Preserve the current public visual direction and information architecture.
- English is primary with Macedonian parity.
- Keep 44px targets and 320px responsive behavior.
- Do not add routes, dependencies, Git operations, or fabricated authenticated previews.

---

### Task 1: Public account entry

**Files:**
- Modify: `src/lib/i18n/public-content.ts`
- Modify: `src/components/shell/public-header.tsx`
- Modify: `src/components/shell/public-navigation.tsx`
- Modify: `src/app/(marketing)/page.tsx`
- Modify: `src/components/shell/public-footer.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/phase-2-public-experience.test.js`

**Interfaces:**
- Produces bilingual `nav.signIn`, `nav.getStarted`, visible `/sign-in` and `/sign-up` links across desktop, mobile, hero, and footer.

- [ ] Add a contract that requires both authentication destinations in header/navigation, hero, and footer, then run it and confirm failure.
- [ ] Add matching English and Macedonian content keys.
- [ ] Implement desktop header buttons and mobile full-width account links.
- [ ] Replace the hero actions with Create account, Sign in, and a retained Explore features text link; add footer account links.
- [ ] Add responsive Sage Dusk spacing and action styling.
- [ ] Run the contract, full tests, typecheck, lint, build, and restart port 3000.

## Self-Review

- Every approved placement maps to the single task.
- Routes and copy keys are consistent.
- No future-phase behavior or Git step is included.
