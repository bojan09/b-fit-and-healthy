# Workout Builder and Commercial Exercise Mesh Design

**Status:** Approved direction, awaiting written-spec review  
**Date:** 2026-07-26  
**Scope:** Workout builder row controls, full-body presets, and commercially permitted exercise discovery  
**Constraint:** Do not commit changes; the user will review and commit.

## Objective

Correct the workout builder's misaligned row controls, make every full-body preset a credible ten-movement routine, and expand exercise discovery using only sources whose free data may be used commercially.

The application must remain fast and fully usable when every external source is unavailable.

## Workout Builder Row

Each builder row uses two explicit layout regions:

1. A flexible exercise-information region containing its position, name, and prescription.
2. A fixed action rail containing move-up, move-down, and remove controls.

Desktop and tablet controls are three equal 36 by 36 pixel icon buttons in a fixed-width grid. Disabled controls retain their dimensions so adjacent buttons never shift. Icons use one consistent size and optical alignment.

At narrow mobile widths, the row may place the action rail beneath the exercise information. The controls remain grouped, right-aligned, and at least 40 pixels in effective touch height. Exercise names and prescriptions must wrap without colliding with the action rail.

The controls keep visible focus indicators, descriptive accessible names, disabled semantics, and keyboard operation.

## Full-body Presets

Every preset whose title or description identifies it as full-body contains exactly ten unique catalogue exercises:

- Bodyweight Foundations
- Dumbbell Full Body
- Full-body Warm-up Flow
- Steady Full-body Circuit

Each sequence covers the major movement needs appropriate to its purpose:

- Knee-dominant lower body
- Hip-dominant lower body
- Horizontal push
- Horizontal pull or upper-back work
- Vertical push or shoulder work
- Vertical pull or an available substitute
- Single-leg movement
- Anterior or anti-extension core
- Lateral or anti-rotation core
- Carry, mobility, or conditioning movement appropriate to the preset

The warm-up preset uses mobility and low-load movements instead of representing ten exercises as three hard working sets. Preset durations and summaries must be updated to match their expanded sequence.

The preset model will support per-exercise prescriptions so strength, mobility, carry, and warm-up movements do not all inherit the same sets, repetitions, and rest.

## Commercially Permitted Sources

### Local clinical catalogue

The local catalogue remains the highest-trust source and the guaranteed fallback. It is rendered immediately and never waits for network providers.

### ExerciseAPI dataset

Use its versioned CC BY 4.0 dataset or API responses with the required attribution. Prefer versioned snapshots for production stability and predictable request usage.

Attribution:

> Exercise data by ExerciseAPI (https://exercise-api.com), licensed under CC BY 4.0.

### wrkout/exercises.json

Use the public-domain dataset under the Unlicense as a server-ingested catalogue source. Preserve the upstream project reference in provenance even though attribution is not legally required.

### wger

Continue using the public API, but accept only records carrying a known license that permits commercial use. Exclude records with non-commercial, missing, or unrecognized licenses. Preserve the record's exact license and attribution.

## Excluded Production Providers

The following remain unavailable in production unless their commercial terms change or the project obtains an eligible paid plan:

- ExerciseDB/Ascend free V1
- API Ninjas free
- exerciseapi.dev free
- MuscleWiki free/playground
- TheMealDB development key

Adapters may not silently enable these providers in production.

The previously exposed MuscleWiki key must be revoked. No exposed credential will be written to the repository or local environment.

## Provider Architecture

Each source has an isolated server-only adapter that returns the existing normalized `DiscoveryExercise` contract. Provider-specific response types do not enter client components.

The orchestrator:

1. Searches the local catalogue immediately.
2. Searches eligible external sources concurrently.
3. Validates provider payloads.
4. Filters commercially incompatible records before merging.
5. Normalizes titles, muscle names, equipment, difficulty, instructions, media, license, and attribution.
6. Deduplicates by provider ID and material exercise identity.
7. Prefers local curated content, then complete commercially licensed records.
8. Returns partial results when one source fails or times out.

Provider calls remain server-side, use short timeouts, and do not run during ordinary page navigation.

## Snapshot and Refresh Strategy

Versioned downloadable datasets are synchronized into private server-owned catalogue snapshots rather than fetched for every user query. Live APIs supplement those snapshots where permitted.

Snapshots record:

- Provider and external ID
- Dataset version
- Retrieval timestamp
- Source URL
- License identifier and URL
- Required attribution
- Normalized exercise payload

Refreshes are explicit administrative or scheduled operations. A failed refresh keeps the last valid snapshot. Invalid or incompatible records are rejected without damaging the current catalogue.

## Discovery UI

The exercise library keeps its current editorial visual direction while gaining:

- A meaningful result count across local and connected sources
- Source and license labels in text
- Consistent muscle, equipment, and movement filters
- Provider-status messaging without blocking local results
- Review-before-save behavior
- No media download until a detail or review surface is opened

The UI must not communicate source quality using color alone.

## Performance

- Local results render synchronously.
- Search is debounced and stale requests are aborted.
- Dataset-backed sources are queried locally after synchronization.
- External provider requests run concurrently with strict timeouts.
- Result cards do not preload videos or large animated media.
- Provider failures never delay navigation or hide local exercises.

## Accessibility

- All reorder and removal controls have descriptive names.
- Focus order follows exercise order.
- Reordering announces or visibly reflects the new position.
- Review surfaces support Escape, focus return, and touch interaction.
- Provider and license details remain readable to assistive technology.
- Reduced-motion settings disable nonessential movement.

## Verification

Automated checks must cover:

- Fixed action-rail structure and disabled-position stability.
- Keyboard reordering and removal.
- Every full-body preset contains ten unique valid exercise IDs.
- Each preset covers its required movement categories.
- Per-exercise prescriptions survive builder initialization and saving.
- Commercial-license allowlisting rejects incompatible and unknown licenses.
- Local, ExerciseAPI, wrkout, and eligible wger results merge deterministically.
- Provider failure retains local and cached results.
- Attribution remains visible.
- No horizontal overflow at 320, 375, 768, 1024, and 1440 pixels.
- Type checking, lint, unit tests, production build, and browser smoke checks pass.

## Out of Scope

- Purchasing commercial provider subscriptions.
- Using the exposed MuscleWiki credential.
- Shipping provider media binaries from B Fit & Healthy storage.
- Replacing the existing anatomy atlas.
- Rebuilding the workout builder with drag-and-drop.
