# Phase 6 — Fitness design

## Outcome

Add a strength-first, extensible fitness system that lets an authenticated member discover exercises, build and schedule workouts, log sessions quickly on a phone, review history, and understand genuine personal records. It must feel like part of the existing Guided Daily Canvas rather than a separate gym application.

## Product principles

- Make the next training action obvious without turning the page into a dense performance dashboard.
- Optimize the active-session interface for one-handed mobile entry and large touch targets.
- Preserve historical truth: editing a template must never rewrite a completed session.
- Derive records only from completed sets; never fabricate activity or achievements.
- Keep exercise guidance educational, practical, and non-diagnostic.
- Use the approved Sky Dusk tokens and the existing English-primary, Macedonian-parity content strategy.

## Information architecture

### `/training`

The training home provides:

- the next scheduled workout;
- a resume card when a session is in progress;
- quick access to create or start a workout;
- a compact seven-day training rhythm;
- recent completed sessions;
- links to the exercise library, planner, history, and records.

It does not duplicate the complete planner, history, or record views.

### `/exercises`

The exercise library supports explicit search and filters for movement pattern, primary muscle, equipment, difficulty, exercise type, and training goal. Results use readable list/cards with no unrelated stock photography.

### `/exercises/[slug]`

Exercise detail contains:

- bilingual name and description;
- step-by-step instructions;
- primary and secondary muscles;
- equipment and difficulty;
- movement pattern, exercise type, and training goals;
- common mistakes and safety guidance;
- variations and alternatives;
- home and gym options where they genuinely differ;
- a clear action to add the exercise to a workout.

Initial media uses owned CSS/SVG movement diagrams and icons. No third-party exercise imagery is required for Phase 6.

### `/workouts`

The workout library lists private templates and lightweight programs. A program is an optional named grouping of workout templates; it does not introduce coaching automation.

### `/workouts/new` and `/workouts/[id]/edit`

The builder supports:

- workout name, description, difficulty, expected duration, goal, and optional program;
- ordered exercise selection;
- target set count, minimum and maximum reps, rest seconds, optional RPE target, and notes;
- keyboard-accessible move-up, move-down, and remove controls;
- validation that prevents an empty workout from being saved.

Drag-and-drop is deliberately excluded so keyboard and touch behaviour remain reliable.

### `/workouts/[id]`

The detail view presents the complete ordered template, expected duration/equipment, edit access, scheduling, and Start workout action.

### `/training/planner`

The planner uses a seven-day agenda rather than a horizontally scrolling table. Members can schedule a template, reschedule it, remove it, or mark it skipped. Repeating rules and automated programming are excluded from this phase.

### `/session/[id]`

The active workout is a focused logger with:

- sticky workout identity and elapsed time;
- one prominently expanded exercise at a time;
- previous completed performance displayed as reference only;
- large set rows for reps, load, duration, RPE, completion, and notes;
- bodyweight-only support;
- a repeat-previous-set convenience action;
- add-set and remove-set actions;
- explicit Finish workout and Discard session actions;
- safe resume after navigation or refresh.

The server is the source of truth. Phase 6 does not promise offline mutation or background synchronization.

### `/workout-history`

History shows completed sessions in reverse chronological order with duration, exercises, total completed sets, and volume where meaningful. Session detail is available through `/workout-history/[id]` and shows the preserved set log.

### `/personal-records`

Records are derived from completed strength sets and grouped by exercise:

- heaviest external load;
- highest completed repetitions;
- highest single-set volume (`load × repetitions`) when load exists;
- best completed session volume.

Estimated one-repetition maximum is excluded because it would add an inferred metric that users may misinterpret.

## Data model

### Public catalogue

- `exercises`: stable slug, bilingual content, difficulty, equipment, movement pattern, type, goals, instructions, mistakes, safety, variations, alternatives, and home/gym guidance.
- `exercise_muscles`: exercise-to-muscle relationship with `primary` or `secondary` role. Muscle keys match the anatomy domain so Phase 7 can connect the systems without remapping.

Public catalogue rows are readable by authenticated users and are not editable through the browser.

### Private planning

- `workout_programs`: user-owned optional groups.
- `workout_templates`: user-owned workout identity and summary fields.
- `workout_template_exercises`: ordered exercises and target prescription.
- `planned_workouts`: dated template reference with status `planned`, `complete`, or `skipped`.

### Private execution

- `workout_sessions`: session identity, source template, status `active`, `complete`, or `discarded`, start/finish timestamps, duration, notes, and preserved template name.
- `workout_session_exercises`: ordered exercise snapshot including exercise name and target guidance.
- `workout_sets`: ordered set log with reps, load in canonical kilograms, duration seconds, RPE, bodyweight-only flag, notes, and completion state.

All private rows carry `user_id`. Child-row policies verify ownership through their parent as well as the stored user ID. Tables have bounded text, non-negative numeric constraints, useful indexes, updated timestamps, and row-level security. Anonymous access is revoked.

## Session lifecycle

1. Starting a template creates one active session and copies its ordered exercises and target sets into session snapshots.
2. A partial unique database index allows only one `active` session per user. Starting while one exists redirects to that session instead of creating a duplicate.
3. Each set update validates ownership and values on the server and revalidates only relevant training routes.
4. Finishing requires at least one completed set, stamps completion time, calculates duration, and marks a linked planned workout complete.
5. Discarding marks the session discarded; it does not hard-delete an audit-relevant workout after logging begins.
6. Only completed sessions participate in history summaries and personal-record calculations.

## Units and calculations

- Store external load canonically in kilograms and format it using existing metric/imperial settings.
- Repetitions are whole numbers from 0 to a bounded maximum.
- Duration and rest are stored in seconds.
- RPE is optional and constrained to 1–10 in half-point increments.
- Session volume sums `load_kg × reps` for completed, non-bodyweight sets with a load.
- Bodyweight sets remain valid but do not claim external-load volume.

## Exercise catalogue scope

The initial bilingual catalogue covers the primary movement patterns with a compact, useful foundation:

- squat: bodyweight squat, goblet squat;
- hinge: Romanian deadlift, hip bridge;
- horizontal push: push-up, dumbbell bench press;
- vertical push: overhead press;
- horizontal pull: one-arm row, seated cable row;
- vertical pull: lat pulldown;
- carry: farmer carry;
- core: dead bug, side plank;
- mobility: thoracic rotation, hip-flexor mobility.

Content must be original, concise, and reviewed for clear educational language. It must not promise injury prevention or treatment.

## Navigation

- Add Training as a primary product destination on desktop.
- Keep the mobile bar to five high-frequency destinations; Training replaces Recipes in the bar, while Recipes remains under More and within nutrition pages.
- More continues to expose all implemented secondary destinations.
- Training pages provide local links between exercises, workouts, planner, history, and records.

## Responsive and accessible behaviour

- No horizontal page scrolling at 320px and above.
- Planner days stack vertically below tablet width.
- Builder exercise prescriptions collapse into labelled rows on narrow screens.
- Active-session controls remain at least 44px tall and keep numeric labels visible.
- Every icon-only action has an accessible name.
- Focus order follows visual order; move controls work with keyboard and touch.
- Status is communicated with text/icon as well as color.
- Elapsed-time display does not continuously announce to screen readers.
- Reduced-motion settings disable nonessential transitions.

## Error and empty states

- Missing Phase 6 migration produces an explicit setup state rather than a page crash.
- Empty exercise searches explain which filters can be cleared.
- Empty workout/template/planner/history/record views provide one relevant next action.
- Failed set saves retain entered values and show a nearby error message.
- Invalid or foreign IDs return not found or authorization-safe redirects without leaking ownership information.
- A stale active session offers Resume or Discard rather than silently creating another.

## Testing

- Contract tests cover routes, navigation, schema, RLS, session server authorization, bilingual catalogue, and protected prefixes.
- Unit tests cover prescription validation, unit conversion, session volume, record derivation, and planner dates.
- Component tests cover the exercise filters, empty training home, set rows, and record summaries.
- Manual runtime review covers starting, updating, resuming, finishing, discarding, history, records, theme parity, keyboard flow, and mobile layouts.
- Final gate runs all tests, TypeScript, lint, and the production build.

## Deliberate exclusions

- Automated workout programming or progressive-overload prescriptions;
- live coaching, AI recommendations, and medical advice;
- social sharing, leaderboards, achievements, and gamified pressure;
- wearable integrations;
- offline workout mutation/synchronization;
- drag-and-drop builder ordering;
- estimated one-repetition maximum;
- GSAP and Three.js work reserved for Phase 9.

## Acceptance criteria

- Every Phase 6 route is protected and reachable from the product experience.
- Members can create, edit, schedule, start, log, resume, finish, and review a workout.
- Completed history remains unchanged when its source template is edited.
- Exercise search/filter and bilingual detail content work without external media dependencies.
- Personal records use completed real data only.
- All private tables enforce ownership through RLS.
- The active logger is comfortable at 320px, keyboard accessible, and free from horizontal overflow.
- Sky Dusk light/dark styling is consistent and secondary buttons remain free of yellow/cream tones.
- The complete automated verification gate passes before phase review.
