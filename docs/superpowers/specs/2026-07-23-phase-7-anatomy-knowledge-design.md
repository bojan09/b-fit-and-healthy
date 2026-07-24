# Phase 7 Anatomy and Knowledge Design

## Objective

Turn the existing public anatomy prototype and six-article blog into a connected, bilingual anatomy encyclopedia and production-ready local knowledge system. Preserve the approved Clinical Atlas and Sky Dusk direction while improving depth, relationships, readability, search, accessibility, and future data portability.

## Scope

Phase 7 includes:

- A searchable anatomy encyclopedia with front/back views and body-region filtering.
- Accessible SVG muscle selection for pointer, keyboard, and touch input.
- Detailed muscle guides with location, function, attachments, movements, activation, training levels, mistakes, mobility, stretching, recovery, injury-prevention education, related muscles, exercises, and articles.
- Stable muscle-to-exercise relationships using the Phase 6 exercise catalogue.
- A richer local Markdown schema with references, related muscles, related exercises, and optional featured-image metadata.
- A filterable knowledge library and readable article pages with table of contents, references, related articles, and related anatomy/exercises.
- A corrected bilingual editorial roadmap for 36 future paired articles.

Phase 7 does not include Three.js, GSAP, medical diagnosis, personalized treatment, Supabase article storage, or mass generation of the editorial roadmap.

## Anatomy Architecture

`src/features/anatomy/data.ts` remains the source of truth for anatomy records. Each record uses stable ASCII identifiers and bilingual copy. Relationships contain exercise slugs, article slugs, and muscle IDs; invalid relationships are removed by resolver functions rather than causing route failures.

`AnatomyExplorer` owns view, search, region, and selection state. `AnatomyFigure` remains a semantic SVG group with named focusable muscle regions. A directory beside the atlas provides equivalent access when a muscle region is small or unavailable in the current view.

The atlas remains stylized clinical illustration rather than claiming medical-image accuracy. Its silhouette, landmarks, paired paths, neutral tissue ground, and restrained selected color should read as a recognizable adult body in light and dark themes.

## Muscle Guide Composition

Each `/anatomy/[muscle]` page contains:

1. Identity and location.
2. Primary and secondary movements.
3. Origin and insertion where useful.
4. Activation cues.
5. Beginner and advanced exercise links.
6. Common training mistakes.
7. Mobility, stretching, and recovery guidance.
8. General injury-prevention education and a medical boundary.
9. Related muscles.
10. Related exercises and articles.

Exercise relationships resolve against the typed Phase 6 catalogue so labels and routes cannot drift.

## Knowledge Architecture

Markdown remains stored as paired files under `content/articles/en` and `content/articles/mk`. The parser validates locale, dates, SEO copy, references, and relationship slugs. It sanitizes HTML and generates deterministic heading IDs and a table of contents.

The repository boundary in `src/lib/content/articles.ts` exposes article retrieval, category discovery, and safe relationship resolution. Its consumers do not depend on filesystem details, allowing later Supabase synchronization without rewriting pages.

The blog library uses a client filter component for search and category selection. Article pages render references only from validated metadata, show meaningful updated dates, and connect readers to muscles, exercises, and related guides.

## Content Safety

- Anatomy and articles are general education only.
- Copy does not diagnose pain, prescribe treatment, promise prevention, or imply clinical assessment.
- Persistent, severe, or new symptoms direct readers toward qualified care.
- Reference entries must include a human-readable label and HTTPS URL.
- The 36-topic roadmap is planning material, not published health guidance.

## Accessibility and Responsive Behavior

- Every atlas region is keyboard focusable and has selected state.
- Search and region filters have visible labels and clear controls.
- Touch targets are at least 44 pixels.
- Mobile places the atlas above a compact information panel and directory.
- Detail-page relationships remain navigable without relying on the SVG.
- Focus, contrast, and reduced-motion behavior use the global design system.

## Verification

Phase 7 requires contract tests, resolver/parser unit tests, explorer and library component tests, typecheck, lint, production build, anonymous route probes, and responsive visual inspection. Existing Phase 2 through Phase 6 behavior must remain green.

## Delivery Constraints

- English is primary; Macedonian receives matching supported UI and content fields.
- No new runtime dependencies.
- No Git operations or commits.
- Existing environment files remain untouched.
