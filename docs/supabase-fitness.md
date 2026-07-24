# Phase 6 fitness storage

Apply migrations in filename order, ending with `202607220001_fitness.sql`. The exercise catalogue is public read-only data; programs, templates, plans, sessions, snapshots, and sets are private to their owner through row-level security.

The TypeScript catalogue mirrors the seeded foundation so the exercise library remains reviewable before a database migration. Templates reference database exercise UUIDs, while completed sessions copy names and prescriptions into immutable snapshots.

Loads are stored canonically in kilograms. The interface may display pounds from the user setting without rewriting stored history. Records use completed sessions and completed sets only; no estimated one-repetition maximum is calculated.

Verify locally with `npm.cmd run test`, `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build`. Keep using the existing local and Vercel environment configuration; no example environment file is needed.
