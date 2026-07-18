# B-Fit and Healthy UI/UX Redesign Design Specification

Status: Approved design, pending implementation-plan approval

Date: 2026-07-18

Technology: HTML, CSS, and vanilla JavaScript only

## 1. Purpose

Redesign the complete B-Fit and Healthy website as one coherent health and
fitness product. The finished experience must make daily tracking, nutrition,
training, education, and account management feel like parts of the same
system. Existing product functionality must remain intact unless a currently
simulated control is explicitly clarified as a prototype action.

The redesign also adds a dedicated interactive anatomy page. A user can select
a muscle on a front or back body map and learn what it does, why it matters,
how to train it, and which existing exercises target it.

## 2. Product and Audience

The subject is a bilingual healthy-living companion for Macedonian and English
speakers who want one approachable place to track meals, training, habits, and
progress and to learn enough anatomy to train with confidence.

The product is not an elite bodybuilding console, a medical application, or a
generic wellness landing page. It should feel credible to a regular gym user
without intimidating a beginner.

## 3. Goals

- Establish one visual identity across every route.
- Make the user's next useful action obvious on every screen.
- Reduce decorative motion and visual noise.
- Preserve light, dark, and system themes.
- Preserve Macedonian and English localization.
- Standardize navigation, typography, spacing, cards, forms, buttons, status
  treatments, and responsive behavior.
- Fix misleading controls and data flows discovered during the audit.
- Make charts, muscle status, habit status, and anatomy information accessible
  without relying on color or pointer hover.
- Support 320, 375, 480, 768, 1024, 1280, and 1440-pixel viewport widths.
- Keep the codebase build-free and framework-free.

## 4. Non-Goals

- No React, Vue, Angular, Svelte, TypeScript, CSS framework, package manager, or
  build system.
- No backend, authentication service, AI service, or synchronization service.
- No medical diagnosis or individualized medical advice.
- No random stock photography.
- No 3D anatomy engine, WebGL anatomy model, or external anatomy library.
- No unrelated product features beyond the approved redesign and anatomy
  explorer.

## 5. Existing Architecture to Preserve

- `prototype/index.html` is the application shell.
- Hash routes are owned by `prototype/js/app.js`.
- Screens return `{ chrome, title, body }` objects and render HTML strings.
- Shared HTML helpers and overlays live in `prototype/js/ui.js`.
- Record CRUD and date filtering live in `crud.js` and `records.js`.
- Bilingual static content lives in `data.js` and `i18n.js`.
- CSS remains separated into tokens, base styles, components, layout, and
  motion.

Targeted refactoring may improve these boundaries, but the renderer and hash
router remain intact.

## 6. Visual Direction: Measured Vitality

The visual direction is a calm coaching ledger: friendly enough for daily
healthy-living habits and precise enough for nutrition and training data.

The signature element is the daily rhythm rail, a time-based vertical ledger
that connects meals, hydration, movement, habits, and training. It is used on
the Today screen and in the landing-page product preview because it encodes a
real daily sequence. Numbering is reserved for genuine sequences such as
recipe steps, workout sets, and ranked exercise recommendations.

### 6.1 Deliberate aesthetic risk

The design borrows the ruled structure of a coach's paper log rather than the
usual gradient wellness dashboard. Fine rules, time markers, aligned numeric
data, and deliberate annotations provide identity. This is restrained to the
daily rail and anatomy detail panel so the rest of the interface stays quiet.

### 6.2 Generic treatments to remove

- Continuous WebGL hero shader
- Magnetic buttons
- 3D preview-card tilt
- Cursor-following card spotlights
- Unsubstantiated marketing-number band
- Decorative numbering for unordered features
- Excessive reveal effects and count-up animations
- Large empty media boxes containing the same generic icon

One short homepage entrance sequence may remain. Application transitions are
limited to functional feedback, overlays, and state changes.

## 7. Design Tokens

### 7.1 Core light palette

| Role | Name | Value |
| --- | --- | --- |
| Primary text / deep panels | Pine Ink | `#12231A` |
| Primary action | Evergreen | `#176B45` |
| Primary hover | Deep Evergreen | `#0F5336` |
| Restrained highlight | Fresh Leaf | `#A7CF50` |
| Secondary data | Mineral Blue | `#3D6F7A` |
| Page background | Morning Mist | `#F2F7F4` |
| Surface | Clean White | `#FFFFFF` |
| Secondary text | Field Gray | `#586A60` |
| Border | Soft Sage | `#D6E2DA` |

Semantic colors are separate from decorative and data colors:

- Success: `#1B7A4D`
- Warning: `#A96212`
- Danger: `#B9363E`
- Information: `#3269A8`

### 7.2 Dark palette

Dark mode retains the same hue families and changes lightness:

- Background: `#0C1510`
- Surface: `#142019`
- Raised surface: `#1B2A21`
- Primary text: `#F0F6F2`
- Secondary text: `#A7B7AD`
- Border: `#304337`
- Primary: `#55C68B`
- Accent: `#C2DF6A`

Every text/background combination and every meaningful control boundary must
meet WCAG AA. Danger buttons require separate on-danger tokens in each theme;
hardcoded white text is not assumed to pass.

### 7.3 Typography

- Manrope: headings, body, navigation, buttons, labels, and controls
- JetBrains Mono: measurements, times, chart axes, and aligned numeric data

Inter is removed so the product uses no more than two families. Both selected
families must include the required Cyrillic characters.

Type scale:

- Marketing display: `clamp(2.5rem, 6vw, 3.75rem)`
- Page title: `clamp(1.75rem, 3vw, 2.25rem)`
- Section title: `1.375rem`
- Card title: `1.0625rem`
- Body: `1rem`
- Secondary body: `0.875rem`
- Caption: `0.78125rem`

No essential text is smaller than approximately 12.5 pixels. Heading levels
are semantic; CSS classes control presentation without demoting headings to
body size through inline styles.

### 7.4 Spacing and shape

Spacing scale: 4, 8, 12, 16, 24, 32, 48, and 64 pixels.

- Control radius: 8px
- Card radius: 14px
- Feature radius: 20px
- Full radius: reserved for chips, status dots, and avatars
- Application container: 1240px
- Reading measure: 68ch
- Forms, settings, and simple lists: 760px
- Mobile page padding: 16px
- Tablet page padding: 24px
- Desktop page padding: 32px

Shadows are limited to modals, elevated summaries, and hoverable cards. Borders
and spacing create most of the hierarchy.

## 8. Navigation and Page Shell

### 8.1 Primary navigation

The five primary destinations remain Today, Nutrition, Training, Blog, and Me.
Anatomy belongs to Training because its primary continuation is exercise
selection and training education.

Training sub-navigation becomes:

1. Training overview
2. Workouts
3. Exercises
4. Anatomy

Anatomy is also included in the command palette and the public footer.

Desktop primary navigation and mobile bottom navigation switch at the same
1024px breakpoint. They must never appear together. If rendered testing finds
an individual label collision, the header contents must simplify rather than
creating a second navigation breakpoint.

### 8.2 Mobile app bar

At narrow widths the app bar contains only:

- Compact brand link
- Current page context where needed
- Search / command palette
- Notifications or profile access

Language and theme controls remain available in Settings and may appear in an
overflow menu, but they do not compete with primary actions at 320px.

### 8.3 Route behavior

- Route changes update the document title.
- Route changes move focus to the new `main` landmark, which retains
  `tabindex="-1"`.
- Legacy `/learn` and `/article` routes resolve to canonical Blog routes.
- Unknown routes present a useful not-found state instead of silently showing
  the homepage.

## 9. Shared Component System

### 9.1 Buttons

Variants: primary, secondary, quiet, danger, and icon-only.

- Minimum touch target: 44 by 44 pixels
- Consistent label and icon alignment
- Hover, focus, active, loading, and disabled states
- No magnetic motion or decorative sheen
- Destructive actions include both icon and text where space permits

### 9.2 Cards

Only four structural variants:

- Standard surface
- Summary / emphasized surface
- Actionable linked card
- Flush list container

Cards do not nest without an information-hierarchy reason. Card headings,
padding, border, and interactive states are consistent across routes.

### 9.3 Forms

- Visible labels
- Shared field height and spacing
- Help and error areas that do not cause large layout shifts
- Correct input types and autocomplete values
- Manual validation enforces required, numeric, minimum, and meaningful range
  rules
- Errors set `aria-invalid` and connect with `aria-describedby`
- Modal actions wrap or stack on narrow screens
- Successful record mutations use a concise status message

### 9.4 Lists and records

Record rows become responsive components. Desktop can show metadata, value,
edit, and delete controls in one row. Mobile stacks metadata and moves actions
to a second aligned row so content does not compress or clip.

### 9.5 Charts and status visuals

- Each chart has a visible title and concise textual summary.
- Detailed data is available as an accessible list or table.
- Missing data is labelled, not represented only by an outline.
- Habit dots and muscle coverage expose status text in the DOM.
- Color supports status but never carries it alone.

### 9.6 Modals and notifications

- Modal background becomes inert while the dialog is open.
- Initial focus goes to the first meaningful field or confirmation control.
- Focus is trapped and restored on close.
- Timed actionable toasts pause while hovered or focused.
- Unread notifications use a marker and accessible label in addition to a
  tinted background.

## 10. Page Designs

### 10.1 Landing

The hero states the concrete product value: plan meals, log training, build
habits, and understand progress in one daily system. The primary action is
account creation; the secondary action opens the product demo.

The right side shows the real daily rhythm rail rather than an effects-heavy
dashboard collage. Product sections use real component examples and plain
copy. The unsourced number band is removed. The final CTA and footer retain
language, theme, explicitly simulated legal links, and the health disclaimer.

### 10.2 Authentication and onboarding

Sign-in and sign-up use one quiet centered surface instead of nested cards.
Sign-up requires a name, valid email, and password of the stated minimum.

Onboarding retains four steps. Goal and experience selections are required
before continuing. Navigation actions stack safely at 320px. The progress
indicator has a text alternative and each selection remains keyboard operable.

### 10.3 Today

Today is the main expression of the daily coaching ledger. It contains:

- Greeting and short status sentence
- One primary next action
- Time-based rhythm rail
- Compact daily summary for energy, protein, movement, water, and streak
- Clear logged, current, and upcoming states

Nested card density is reduced. Desktop uses a primary ledger column and a
narrow summary rail. Mobile places the summary before the full timeline.

### 10.4 Nutrition and meals

Nutrition emphasizes today's energy and macro status, the add-food action,
meal records, and the weekly trend in that order. Meals uses the same summary
grammar but adds date scope and full CRUD.

The date controller adapts into stacked groups on mobile. It must not depend on
global horizontal clipping.

### 10.5 Recipes and recipe detail

Recipe cards receive a restrained category illustration system or ingredient
motif created as local SVG/CSS artwork. No random photography is introduced.
Cards share image ratio, title height, and metadata placement.

Recipe detail keeps nutrition, ingredients, and ordered preparation steps.
Save state is explicit. “Add to day” opens the meal form prefilled with the
recipe name, energy, and macros; the user chooses the meal slot and time before
saving a real local meal record.

### 10.6 Training and workouts

Training prioritizes current program, next session, muscle coverage, weekly
metrics, trend, and history. Workouts retains date-filtered CRUD using the
shared record and form components.

Every muscle-coverage group maps to a stable Anatomy muscle ID and links to the
matching Anatomy selection.

### 10.7 Active session

Desktop retains exercise tables. Mobile renders each set as a readable set
card with log state, weight, and repetitions. Session progress is visible and
the finish action remains reachable without covering content or the bottom
navigation.

### 10.8 Exercises and exercise detail

Exercise search becomes functional and combines with muscle filters. Exercise
details provide functional diagrams or muscle highlights, technique, common
mistakes, alternatives, and a link to the relevant Anatomy muscle.

### 10.9 Blog and post

Blog search and categories remain. Article cards gain a consistent editorial
hierarchy without adopting a separate design system. Article measure stays at
approximately 68 characters. The reading progress bar accounts for both the
app bar and contextual navigation.

### 10.10 Assistant

The assistant remains a simulated general-guidance experience. The disclaimer
is visible before or immediately after the first response. Composer controls
respect mobile safe areas and the on-screen keyboard. New messages are
announced without re-announcing the entire conversation.

### 10.11 Profile, progress, habits, settings, and notifications

These routes use the narrower 760px content tier.

- Progress reads actual measurement records so a new measurement updates the
  current value and chart.
- Habits expose weekly states as text and preserve clear completion state.
- Settings uses keyboard-correct radio groups or native controls and persists
  real settings.
- Notifications clearly identify unread entries.
- Profile groups statistics, navigation, and account actions without overly
  wide rows.

### 10.12 States

The states route remains an internal component regression page. It demonstrates
loading, error, offline, empty, success, warning, and disabled states using the
final shared components.

## 11. Interactive Anatomy Page

### 11.1 Route and purpose

Canonical route: `#/anatomy`

Deep-link examples:

- `#/anatomy?muscle=serratus&view=front`
- `#/anatomy?muscle=hamstrings&view=back`

The page helps a user identify a muscle, understand its role, and continue to
appropriate exercise guidance.

### 11.2 Layout

Desktop uses a two-panel layout inspired by the approved reference:

- Left: front/back body map, prompt, view switch, and search
- Right: selected muscle details and exercise recommendations

The panels share one outer surface and a clear divider. The redesign uses the
Measured Vitality palette and Manrope typography rather than copying the
reference's red/serif visual identity.

Mobile stacks the controls, map, and detail panel. Selecting a muscle updates
the panel in place and announces the selected name through a polite live
status; it does not automatically move focus or scroll the page.

### 11.3 Illustration

The body map is a local inline SVG with front and back views. Each selectable
region corresponds to a stable muscle ID. The active region uses brand color,
a visible outline, and a text state. Hover alone is never required.

The illustration covers these initial groups:

- Pectorals
- Front, side, and rear deltoids
- Biceps
- Triceps
- Forearms
- Trapezius
- Latissimus dorsi
- Rhomboids
- Serratus anterior
- Rectus abdominis
- Obliques
- Spinal erectors
- Glutes
- Quadriceps
- Hamstrings
- Adductors
- Calves
- Tibialis anterior

Small anatomical regions may use a larger invisible hit target while retaining
the visible shape. The minimum practical pointer target is 44px on mobile.

### 11.4 Interaction model

- Pointer hover previews a region name.
- Click selects the muscle.
- Keyboard users can select through a synchronized textual muscle list.
- Enter and Space activate muscle buttons.
- A front/back segmented control updates visible regions.
- Search filters or jumps to matching common and anatomical names.
- Selection updates the query string through the existing hash router.
- Browser back and forward restore muscle and view state.
- An unknown muscle ID falls back to the default overview and displays no
  error toast.

The SVG is not the sole interaction surface because focus behavior on complex
SVG paths is inconsistent across browser and assistive-technology combinations.
The synchronized HTML list is the canonical accessible control set; SVG
regions mirror its state.

### 11.5 Detail content

Each muscle entry contains:

- Stable ID
- Front or back view membership
- Common name in Macedonian and English
- Anatomical name
- Plain-language overview
- Primary function and movement
- Why the muscle matters
- Everyday and training benefits
- How to train it effectively
- Common training mistake
- Related muscle IDs
- Recommended exercise IDs

Recommended exercises are genuine links to existing exercise-detail pages.
If an exercise has no detail record, it links to the filtered exercise library
instead of producing a dead action.

### 11.6 Data shape

Muscle content belongs in `Store.muscles` and follows the repository's
bilingual object convention. Exercise relationships use stable IDs rather than
duplicated titles. Screen code selects data and renders it but does not contain
long anatomy copy.

Conceptual record:

```text
muscle = {
  id,
  views,
  name: { mk, en },
  anatomicalName,
  overview: { mk, en },
  function: { mk, en },
  benefits: { mk, en },
  training: { mk, en },
  commonMistake: { mk, en },
  relatedMuscleIds,
  exerciseIds
}
```

All user-facing anatomy strings are bilingual. The content remains educational
and avoids diagnosis, injury treatment, or claims of guaranteed outcomes.

### 11.7 Anatomy states

- Default: no selected muscle; the detail panel explains how to use the map
- Selected: active map region and full detail panel
- Search no-results: clear message and reset action
- Unknown deep link: reset to overview without breaking the page
- No mapped exercises: link to the exercise library with the muscle filter
- SVG unavailable: textual muscle list and details remain fully usable

### 11.8 Anatomy acceptance criteria

- Every visible muscle region has a matching text control.
- Front and back selection work at all required viewport widths.
- Search matches both languages and anatomical names.
- URL state restores after refresh and back/forward navigation.
- Active state is perceivable without color.
- Every exercise recommendation resolves to a valid route.
- The page works with keyboard only.
- The detail panel is readable in both themes and both languages.

## 12. JavaScript Behavior and Data Flow

### 12.1 Rendering flow

1. Router parses path and query parameters.
2. Screen renderer selects localized records from Store or Records.
3. Screen returns semantic markup.
4. Shared post-render hooks mount charts and limited motion.
5. Route focus is placed on the `main` landmark.

### 12.2 Event lifecycle

Global event delegation remains. Route-specific listeners and observers must
have explicit cleanup paths. Reading-progress listeners, chart observers, and
any anatomy listeners may not accumulate after repeated navigation.

### 12.3 Prototype-only actions

Controls that cannot perform their stated action in this static prototype must
be handled consistently:

- Implement the action when it can use existing local data safely.
- Otherwise label it as a demo or disabled action before interaction.
- Do not show a normal success message for an action that changed nothing.

## 13. Responsive Strategy

The CSS is mobile-first. Component-level scrolling is allowed for tables,
filter rails, and charts. Global `overflow-x: hidden` is removed after actual
overflow defects are fixed.

Required checks:

- 320px: app bar, onboarding controls, date controls, modal actions, anatomy
  map targets
- 375px: record rows, stat layout, bottom labels, anatomy details
- 480px: wordmark and app tools, two-column opportunities
- 768px: tablet content measure and navigation
- 1024px: single navigation-mode handoff and desktop anatomy split
- 1280px: application container and dashboard proportions
- 1440px+: maximum widths and avoidance of overly long rows

Macedonian is used for worst-case label-width testing. Dark mode and 200%
text zoom are included in responsive validation.

## 14. Accessibility Requirements

- Semantic landmarks and ordered heading hierarchy
- One `h1` per routed screen
- Visible focus indicator on every interactive element
- Route-change focus management
- Minimum 44px touch targets for primary controls
- Proper form labels and descriptions
- Keyboard-operable modal, menus, custom selections, and anatomy controls
- Status communicated through text or icon plus text, not color alone
- Accessible alternatives for charts, habit grids, muscle coverage, and SVG
  anatomy regions
- Reduced-motion behavior for CSS and JavaScript motion
- Contrast validation in light and dark themes
- No duplicate accessible logo names
- Health information presented as general education

## 15. Repository Security and Hygiene

Before release:

- Remove tracked `.env.local` credentials from the repository.
- Add `.env.local` and appropriate secret patterns to `.gitignore`.
- Rotate every credential that was committed.
- Document local serving in `README.md`.

Credential rotation is an external owner action and cannot be completed by UI
code changes. No credential value belongs in browser JavaScript.

## 16. Expected File Impact

- `prototype/index.html`: font loading, metadata, and script list
- `prototype/css/tokens.css`: final tokens
- `prototype/css/base.css`: typography, focus, overflow, and utilities
- `prototype/css/components.css`: shared controls and states
- `prototype/css/layout.css`: shell, routes, anatomy, and responsive layouts
- `prototype/css/motion.css`: reduced motion vocabulary
- `prototype/js/app.js`: route, navigation, focus, and cleanup behavior
- `prototype/js/ui.js`: shared accessible UI helpers
- `prototype/js/charts.js`: chart accessibility and lifecycle
- `prototype/js/crud.js`: validation and responsive records
- `prototype/js/screens-public.js`: landing, auth, onboarding
- `prototype/js/screens-app.js`: application and anatomy screens
- `prototype/js/screens-records.js`: record and blog screens
- `prototype/js/data.js`: bilingual muscles and relationships
- `prototype/js/i18n.js`: new labels and messages
- `prototype/js/records.js`: measurement and persistence integration where
  required
- `prototype/js/motion.js`: simplified motion lifecycle
- `prototype/js/shader.js`: removed from the runtime after the CSS fallback is
  replaced by the new static hero treatment
- `.gitignore`, `.env.local`, and `README.md`: security and project hygiene

The existing `frontend-skill.md` is a local workspace instruction file and is
not part of the product deliverable.

## 17. Implementation Grouping

The later implementation plan will break work into testable groups:

1. Repository hygiene and global design tokens
2. Shared shell, navigation, and components
3. Public pages and onboarding
4. Today, nutrition, meals, and records
5. Training, workouts, sessions, and exercises
6. Anatomy explorer and anatomy/exercise relationships
7. Blog, post, and assistant
8. Profile, progress, habits, settings, notifications, and states
9. Full responsive, accessibility, functional, and console QA

Each group must preserve a runnable site and report changed files, functional
behavior, responsive validation, and unresolved issues.

## 18. Definition of Done

- All routes use the same token, typography, spacing, and component systems.
- Navigation has one active mode at every width and exposes a clear current
  route.
- No essential content clips or depends on global overflow hiding.
- Buttons, cards, forms, lists, states, and navigation are consistent.
- Every existing meaningful function still works.
- Misleading simulated controls are implemented locally or clearly labelled.
- New measurements update Progress.
- Exercise search works.
- Charts and status visuals have accessible alternatives.
- Anatomy supports front/back, pointer, keyboard, search, deep links, both
  languages, both themes, and valid exercise continuations.
- No avoidable browser-console errors remain.
- Browser QA passes at all required widths.
- The final site looks like one intentional health and fitness product rather
  than a marketing template attached to a separate dashboard.
