# Sky Dusk Palette Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the green-heavy brand and yellow-toned secondary buttons with the approved Sky Dusk light/dark token system.

**Architecture:** Keep all component styles unchanged and update only semantic custom properties in `globals.css`. A repository contract locks the chosen values so future page work cannot silently reintroduce unrelated button colors.

**Tech Stack:** Next.js 16, CSS custom properties, Node test runner.

## Global Constraints

- Do not change layout, components, copy, routes, or behaviour.
- Do not add dependencies.
- Do not commit, push, merge, reset, or perform any other Git operation.

---

### Task 1: Palette contract

**Files:**
- Modify: `tests/phase-2-public-experience.test.js`
- Test: `tests/phase-2-public-experience.test.js`

- [ ] Add a contract asserting `#287eac`, `#176b95`, `#e5eef3`, `#75c5e9`, and `#2a424f`, and rejecting the former cream secondary-button values.
- [ ] Run `node --test tests/phase-2-public-experience.test.js` and confirm it fails because the current palette is still Sage Dusk.

### Task 2: Shared Sky Dusk tokens

**Files:**
- Modify: `src/app/globals.css`

- [ ] Replace the light root’s background, surface, text, border, brand, button, mineral, focus, logo, gradient, shadow, and halo tokens with the approved Sky Dusk values.
- [ ] Replace the dark root’s equivalent tokens with the matched blue-charcoal Sky Dusk values.
- [ ] Keep ochre out of all button tokens and preserve anatomy/status accent semantics.
- [ ] Run the focused contract and confirm it passes.

### Task 3: Full verification and runtime

**Files:**
- No production file changes expected.

- [ ] Run `npm.cmd run test`, `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build`; require exit code 0 for every command.
- [ ] Restart the production server on port 3000 without touching unrelated processes.
- [ ] Verify `/` and `/sign-in` return 200; protected product routes redirect to sign-in; confirm `dist` and `.env.example` remain absent.
