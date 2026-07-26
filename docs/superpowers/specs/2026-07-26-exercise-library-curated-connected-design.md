# Curated + Connected Exercise Library

**Date:** 2026-07-26  
**Status:** Approved design, awaiting written-spec review  
**Scope:** Protected exercise library and its commercial exercise-provider search path

## Objective

Extend the exercise library so users receive useful results from both the local B Fit & Healthy catalogue and commercially permitted connected providers. Search must respond to every meaningful filter, remain fast during rapid changes, clearly distinguish data provenance, and degrade gracefully when an external provider fails.

The extension preserves the current editorial visual direction. It improves discovery depth, filter behavior, result browsing, feedback, and responsive presentation without redesigning the surrounding product shell.

## Current Problem

The local catalogue filters in the browser, but connected discovery receives only manually typed search text. Selecting a muscle, equipment item, or exercise type does not update the provider query. For example, selecting `biceps` displays three local exercises and zero connected exercises even though the connected datasets contain many matching records.

The current connected section also exposes all returned records at once, provides limited partial-failure guidance, and does not distinguish the different meanings of “no local match” and “no provider match.”

## Approved Experience

### Search and filters

The library derives one effective connected query from:

1. Manually entered search text.
2. Selected muscle.
3. Selected equipment.
4. Selected exercise type.

Typed text remains the strongest intent signal. Filter values supplement it rather than replace it. A connected request is made whenever at least one search or filter value is active.

Changing filters updates local results immediately. Connected discovery begins asynchronously after the existing short debounce. An obsolete request is cancelled when a newer filter state supersedes it, preventing stale results from replacing current results.

Clearing all filters returns the library to its initial local-catalogue state and does not issue a broad, unbounded provider request.

### Result composition

Results remain separated into two sections:

- **Curated by B Fit & Healthy:** locally maintained exercise guidance with dedicated detail pages.
- **Connected libraries:** normalized, commercially permitted records from ExerciseAPI, wger, and wrkout.

Local and connected counts appear independently. Local content is not visually represented as provider content, and connected content never loses its source or license information.

The connected section initially reveals 12 ranked records. A “Show more” control reveals the next 12 records from the already loaded response. Changing the effective query resets the visible connected count to 12.

### Connected cards and review

Each connected card exposes:

- Exercise title.
- Primary target muscles when supplied.
- Equipment when supplied.
- Difficulty when supplied.
- Provider name.
- Commercial license badge.
- Whether useful instructions are available.

Selecting a card opens the existing review sheet. The sheet retains source attribution, original-source navigation, instructions, safety information, and the explicit save action.

No remote exercise is silently imported or treated as locally reviewed content.

### Status and failure states

The interface distinguishes:

- Loading connected sources.
- Local results with connected results still loading.
- Complete connected results.
- Partial connected results when one or more providers fail.
- No local matches but connected matches available.
- Local matches but no connected matches.
- No matches from either source.
- Connected search unavailable with local results still usable.

Provider failures remain isolated. One provider timing out or rejecting a request does not discard successful responses from other providers. A retry control repeats the current effective connected query.

Messages stay compact and actionable. Raw provider errors, credentials, and internal diagnostics are never shown to the user.

## Query Semantics

The client sends structured query parameters rather than flattening every filter into an ambiguous text string:

- `q`: manually typed text, or a filter-derived fallback when no text is entered.
- `muscle`: selected muscle.
- `equipment`: selected equipment.
- `type`: selected exercise type.

The route validates all fields. It passes the text intent to providers and applies normalized muscle, equipment, and type constraints during merging and ranking.

Provider adapters may translate common catalogue terms into provider-compatible aliases. Examples include pluralization and common anatomical variants such as `biceps` and `biceps brachii`. Alias handling lives in a provider-neutral normalization module rather than in the UI.

The route returns a bounded ranked result set. The client-side “Show more” control progressively reveals this bounded response; it does not repeatedly call providers.

## Architecture

### Client

The exercise library owns:

- Search and filter state.
- Effective connected-search parameters.
- Visible connected-result count.
- Selected review item.
- Retry intent.

The discovery hook accepts structured parameters and generates a stable request key. It cancels its active request whenever that key changes. Only the response associated with the latest key may update visible state.

### API route

The protected exercise discovery route:

1. Authenticates the user.
2. Validates structured search/filter parameters.
3. Loads user discovery context.
4. Runs commercial providers concurrently.
5. Applies commercial-license enforcement.
6. Normalizes aliases and exercise metadata.
7. Merges, deduplicates, filters, and ranks records.
8. Returns results plus safe provider-status metadata.

### Providers

The approved provider mesh remains:

- ExerciseAPI — CC BY 4.0.
- wger — accepted commercial Creative Commons records only.
- wrkout/exercises.json — Unlicense.

MuscleWiki exercise search remains excluded until explicit production-commercial permission and exercise-level provenance are available.

## Responsive Design

Desktop retains the spacious multi-column exercise layout.

On narrower screens:

- The primary search remains visible.
- Secondary filters move into a collapsible “Filters” region.
- Active-filter count remains visible when collapsed.
- Controls meet touch-target requirements.
- Exercise cards use one column.
- Provenance badges wrap without overflowing.
- The “Show more” action uses the content width without becoming oversized.

The filter disclosure uses a native button with `aria-expanded` and an associated region. All search, filter, retry, review, and progressive-disclosure controls remain keyboard accessible.

## Performance

- Local filtering remains synchronous and requires no network.
- Provider requests use the existing debounce and request cancellation.
- Providers continue to execute concurrently with independent timeouts.
- Cached provider datasets remain cached according to their existing policies.
- No exercise media loads in the result grid.
- Progressive disclosure operates on the returned result set without additional network calls.
- Route responses remain bounded to prevent oversized client payloads.

## Testing

Test-driven implementation must cover:

1. A muscle-only selection generates a connected request.
2. Equipment-only and type-only selections generate connected requests.
3. Typed text and filters are preserved together.
4. Clearing all controls stops connected search and resets results.
5. A superseded request cannot replace newer results.
6. Changing the effective query resets progressive disclosure to 12.
7. “Show more” reveals the next 12 connected records.
8. Partial provider failure preserves successful records and exposes retry.
9. Provider, license, instruction availability, and attribution remain visible.
10. Filter disclosure, retry, cards, review sheet, and “Show more” are keyboard operable.
11. Mobile layouts do not overflow at 320, 375, and 480 pixels.
12. Existing commercial-license filtering, deduplication, authentication, and save behavior remain intact.

## Non-goals

This phase does not:

- Replace the local catalogue with external data.
- Add unlicensed or commercially ambiguous sources.
- Enable MuscleWiki exercise results.
- Add remote exercise videos or image-heavy cards.
- Import connected records without explicit review.
- Introduce infinite scrolling.
- Redesign the global product shell.
- Change the existing technology stack.

## Definition of Done

The extension is complete when:

- Search, muscle, equipment, and type controls all drive connected discovery.
- A biceps-only filter returns commercially permitted connected matches when providers are available.
- Local and connected results remain clearly separated.
- Connected results support bounded progressive disclosure.
- Partial provider failures do not empty successful results.
- Rapid changes cannot surface stale results.
- Provenance and commercial license information remain visible.
- The experience is keyboard accessible and responsive.
- Unit, component, contract, type, lint, build, and relevant browser checks pass.
- All changes remain uncommitted for user review.
