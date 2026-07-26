# Catalogue Media Expansion Design

**Date:** 2026-07-26  
**Status:** Approved direction; specification awaiting review  
**Scope:** Curated and connected exercise and recipe libraries  
**Technology:** Existing Next.js application and current provider architecture

## Objective

Make the exercise and recipe libraries more useful and visually scannable by:

- expanding the curated exercise catalogue from 30 to 60 entries;
- expanding the curated recipe catalogue from 24 to 40 entries;
- adding useful imagery to curated cards and detail pages;
- showing commercially permitted provider imagery on connected results;
- preserving accessibility, attribution, performance, and reliable fallbacks.

This phase does not replace the existing library information architecture or provider aggregation. It extends the approved Curated + Connected Library design.

## Design Direction

Use a hybrid media architecture:

1. Curated entries have stable, reviewed media metadata controlled by the application.
2. Connected entries may show provider media only when its commercial-use and attribution requirements are known.
3. Every media surface has a designed fallback, so missing or rejected remote content never produces an empty or broken card.

Recipe imagery should feel natural, appetizing, and editorial. Exercise imagery should prioritize an immediately readable body position and movement over decorative fitness photography.

## Catalogue Composition

### Exercises

The curated catalogue will contain 60 exercises distributed across:

- squat and lunge patterns;
- hip hinges and hip extension;
- horizontal and vertical pushing;
- horizontal and vertical pulling;
- carries;
- elbow flexion and extension;
- shoulder isolation and shoulder-blade control;
- anti-extension, anti-rotation, and anti-lateral-flexion core work;
- spinal, hip, ankle, and shoulder mobility;
- bodyweight, dumbbell, barbell, cable, machine, kettlebell, and resistance-band options;
- beginner and intermediate difficulty.

The expansion must avoid cosmetic duplicates. Variations are included only when their setup, training effect, accessibility, or equipment needs materially differ.

Each exercise retains:

- localized title and summary;
- equipment;
- difficulty;
- movement pattern and exercise type;
- primary and secondary muscles;
- instructions;
- common mistakes;
- safety guidance;
- home-friendly status.

### Recipes

The curated catalogue will contain 40 recipes:

- 10 breakfasts;
- 10 lunches;
- 12 dinners;
- 8 snacks.

The set should include meaningful coverage for:

- plant-forward;
- vegetarian;
- high-protein;
- quick meals;
- prepare-ahead meals;
- affordable pantry-led meals;
- familiar ingredients that can be found in the target market.

Each recipe retains:

- localized title and summary;
- meal category and dietary tags;
- preparation, cooking, and total time;
- servings;
- estimated nutrition;
- ingredients and steps;
- provenance and database readiness.

## Media Data Contract

Curated exercises and recipes receive a shared media shape:

```ts
type CatalogueMedia = {
  src: string;
  alt: Record<Locale, string>;
  width: number;
  height: number;
  focalPoint?: `${number}% ${number}%`;
  sourceName: string;
  sourceUrl?: string;
  creator?: string;
  licenseName: string;
  licenseUrl?: string;
};
```

Requirements:

- `alt` describes the useful visible content rather than repeating the title.
- Width and height are mandatory to prevent layout shift.
- Focal position may be supplied for safe responsive cropping.
- Source and licence metadata are mandatory even when attribution does not need to be visible on the card.
- Curated media paths must be stable.

Connected provider media continues to use the discovery media structures, extended only where needed to retain attribution and licence data.

## Image Sources and Licensing

### Curated media

Curated assets must be either:

- original assets owned by the project;
- generated assets with production usage rights;
- public-domain assets;
- or commercially reusable assets whose licence and attribution are recorded.

Every curated asset must be represented in a media manifest or directly in typed catalogue metadata. Assets with unclear provenance must not enter production.

All 60 curated exercises and all 40 curated recipes require an approved image. The fallback system is reserved for runtime failures and unexpected invalid media; it is not a substitute for unfinished catalogue imagery.

The preferred initial exercise source is the public-domain `wrkout/exercises.json` media set where an accurate match exists. Images will be copied into the local curated media set only after their paths and repository licence are verified. Any unmatched exercise requires another approved original, generated, public-domain, or commercially reusable asset.

Curated recipe images will use locally controlled original, generated, public-domain, or commercially reusable food imagery selected to represent the actual recipe. Generic category artwork is not sufficient for a completed curated recipe.

### Connected exercise media

- The currently integrated ExerciseAPI source remains a metadata source because its present response contract does not provide demonstration imagery.
- Public-domain media from the `wrkout/exercises.json` source may be used when the relevant record and asset are actually covered by that repository's licence.
- wger media may be displayed only when the individual asset's licence and attribution can be retained.
- MuscleWiki media remains disabled unless explicit commercial production rights are confirmed.

### Connected recipe media

- TheMealDB thumbnails may be rendered during development.
- Public commercial use requires the appropriate supporter/commercial access and source acknowledgement.
- The currently configured public test key does not qualify as production commercial access.
- If production credentials or commercial rights are unavailable, the connected recipe remains usable without its remote image and receives the designed fallback.

Provider availability must never change whether curated content can be used.

## Library Card Design

### Recipe cards

Recipe cards use:

- a 4:3 media region;
- responsive `sizes`;
- `object-fit: cover`;
- the stored focal position;
- a subtle category treatment that does not tint or obscure the food;
- title, summary, time, protein, calories, and provenance below the image.

The image is lazy-loaded except for the first visible row. Card dimensions remain stable while media loads.

### Exercise cards

Exercise cards use:

- a 4:3 instructional media region;
- a restrained neutral background behind transparent or isolated exercise imagery;
- a small movement-pattern label;
- title, summary, difficulty, and equipment below the image.

The body position must remain legible at card size. Decorative gym photography that does not demonstrate the exercise is not accepted.

### Connected cards

Connected cards display media when available and permitted. Provider name and licence remain available in the review flow. Cards without media use the same fallback system as curated cards.

## Detail and Review Views

Recipe and exercise detail pages replace their current abstract media blocks with the catalogue media component.

- Recipe detail imagery uses a wide editorial crop.
- Exercise detail imagery preserves the full body and avoids cropping hands, feet, or equipment.
- Visible attribution is placed below the media when required by the source licence.
- The connected-result review sheet displays source, creator, licence, and a source link.
- Media failure does not hide instructions, ingredients, safety guidance, or actions.

## Fallback System

Fallbacks are deterministic and local:

- exercise fallbacks vary by movement pattern;
- recipe fallbacks vary by meal category;
- fallbacks use the existing design tokens in light and dark themes;
- fallback text is not treated as an image replacement when the surrounding title already names the entry;
- fallback blocks preserve the same aspect ratio as real media.

Fallbacks should feel intentional but visually quieter than real imagery.

## Security

- Extend the existing safe-provider URL validation for every approved image host.
- Add only required hosts to the Next.js image configuration.
- Add only required hosts to the Content Security Policy `img-src`.
- Reject unexpected protocols, hosts, and malformed provider URLs.
- Do not expose private provider keys in image URLs or client-rendered markup.
- Prefer server-side normalization of remote media.

## Performance

- Use `next/image` for curated and approved connected imagery.
- Supply responsive `sizes` for one-, two-, and three-column layouts.
- Reserve dimensions to prevent cumulative layout shift.
- Lazy-load below-the-fold images.
- Prioritize only the first likely largest-contentful image.
- Use optimized local formats where feasible.
- Avoid loading exercise video on library cards.
- Do not proxy or download provider imagery during a user request unless a deliberate cached media route is introduced and tested.
- Preserve snappy client navigation and the current route-prefetch behavior.

## Accessibility

- Every meaningful image receives concise localized alternative text.
- Decorative fallbacks are hidden from assistive technology when the adjacent text provides the same information.
- Cards retain a single clear interactive target.
- Hover treatments are also available through keyboard focus.
- Imagery is not the only way meal category, exercise type, difficulty, or provenance is communicated.
- Loading and failure states do not cause focus movement.
- Connected-media attribution links are keyboard reachable.

## Responsive Behaviour

At 320–480 px:

- cards use one column;
- media retains its aspect ratio;
- text and metadata do not overlay the image;
- no controls are placed over essential parts of exercise demonstrations.

At tablet sizes:

- cards use two columns where space permits.

At desktop sizes:

- cards use three columns;
- detail-page media and text use a balanced two-column composition;
- image width is capped so instructions remain dominant.

## Error Handling

- A failed remote image is replaced with the local fallback without surfacing a browser broken-image icon.
- Provider search errors continue to use the existing partial-result and retry behavior.
- Invalid media is omitted during normalization rather than failing the whole provider response.
- Catalogue validation tests fail when curated entries lack required media metadata.
- Missing local files are caught by contract tests.

## Testing Strategy

### Unit and contract tests

- exactly 60 curated exercises;
- exactly 40 curated recipes;
- expected category and movement coverage;
- unique IDs and slugs;
- complete required content fields;
- valid media metadata;
- valid local asset paths;
- provider media URL allowlisting;
- preservation of media attribution and licence data;
- deterministic fallback selection.

### Component tests

- curated cards render their images and useful alt text;
- connected cards render allowed provider media;
- missing or invalid media renders a fallback;
- required attribution appears in detail/review views;
- image failure does not remove content or actions.

### Browser tests

- library layouts at 320, 375, 480, 768, 1024, 1280, and 1440 px;
- no horizontal overflow;
- stable card layout before and after images load;
- keyboard focus remains visible;
- light and dark theme presentation;
- provider failure with curated content still available;
- route navigation remains responsive.

### Quality gates

- typecheck;
- lint;
- unit/component suite;
- production build;
- focused Playwright checks;
- visual inspection of both libraries and representative detail pages;
- performance comparison before and after imagery.

## Implementation Boundaries

This phase will not:

- introduce autoplaying exercise video;
- make external media mandatory for core use;
- use imagery with unclear commercial rights;
- add a new image CMS;
- change authentication or saved-item policies;
- redesign unrelated product areas;
- commit changes on the user's behalf.

## Success Criteria

The work is complete when:

- 60 curated exercises and 40 curated recipes are available;
- every curated card has real approved imagery;
- allowed connected results show provider imagery;
- cards and detail pages show imagery without sacrificing readability;
- attribution and licences are preserved;
- no broken-image states appear;
- mobile layouts remain usable;
- image loading does not materially degrade navigation or layout stability;
- all relevant automated and manual checks pass.
