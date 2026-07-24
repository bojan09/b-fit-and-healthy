# Anatomy and knowledge content strategy

## Source standards

Prefer public-health agencies, professional bodies, systematic reviews, peer-reviewed research, and established anatomy texts. References must use HTTPS and identify the supporting source clearly. A reference indicates further reading; it does not transfer authority to unsupported claims elsewhere in an article.

## Editorial workflow

Topics remain unpublished until their English draft, evidence review, Macedonian translation, language review, relationships, SEO metadata, and medical boundary have been approved. English and Macedonian files use the same slug and relationship keys.

## Health boundaries

Content explains general anatomy, movement, nutrition, recovery, and health literacy. It does not diagnose symptoms, prescribe treatment, promise injury prevention, or replace individualized care. New, severe, or persistent concerns should be assessed by a qualified professional.

## Anatomy references and imagery

The current Clinical Atlas is an owned SVG educational illustration. It communicates regions and relationships without claiming diagnostic or surgical accuracy. Future images or 3D models must be owned, public domain, or covered by a documented compatible license with attribution where required.

## Local content and future Supabase synchronization

Paired Markdown files remain the current source of truth. Pages consume repository functions rather than filesystem paths. A future synchronization layer can map validated article metadata, Markdown bodies, references, and relationship keys into public Supabase tables while preserving the repository interface and URLs.

## Review commands

Run `npm.cmd run test`, `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build` before publishing content or anatomy changes.
