# Marketing Pages i18n Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every page under `src/app/(marketing)/*` reads copy exclusively from
`src/lib/i18n/public-content.ts`. Delete all inline `locale === "en" ? ... : ...` /
`mk ? ... : ...` ternaries from marketing route files, and retire the orphaned
`src/app/(marketing)/states/page.tsx` (dead route, uses the old `config.ts` dictionary, linked
from nowhere).

**Architecture:** `public-content.ts` gains one new top-level key per page/page-family
(`about`, `contact`, `privacy`, `terms`, `anatomy`, `anatomyMuscle`, `blogIndex`, `blogArticle`,
`featuresShared`, `featuresNutrition`, `featuresTraining`), each present in both `en` and `mk`
under the existing `as const satisfies Record<Locale, object>` shape. Each page file then calls
`getPublicContent(locale)` (already imported in some files, newly imported in others) instead of
computing `mk`/`isEnglish`/`locale === "en"` ternaries inline. No visual/CSS changes — the Voltage
design tokens already apply automatically; this plan is copy-plumbing only.

**Tech Stack:** Next.js 16 App Router (Server Components, async `getLocale()`), TypeScript,
existing `src/lib/i18n/public-content.ts` module — no new dependencies.

---

### Task 1: Extend `public-content.ts` with all new sections

**Files:**
- Modify: `src/lib/i18n/public-content.ts`

- [ ] **Step 1: Add the new `en` sections**

In the `en` object, replace the closing of the `features` section (the line `    }` that closes
`features` and appears right before the `en` object's own closing `  },`) — i.e. replace:

```typescript
    features: {
      eyebrow: "The ecosystem",
      title: "Different health goals, one understandable rhythm.",
      body: "Each module is useful on its own and more helpful when it shares context with the rest of your day.",
      nutrition: "Food, meals, hydration, and nutrition knowledge without moral labels.",
      training: "Plans, sessions, exercise education, and steady progression.",
      anatomy: "A visual bridge between muscles, movement, and exercise choices.",
      knowledge: "Readable articles that explain the reasoning behind practical actions."
    }
  },
```

with:

```typescript
    features: {
      eyebrow: "The ecosystem",
      title: "Different health goals, one understandable rhythm.",
      body: "Each module is useful on its own and more helpful when it shares context with the rest of your day.",
      nutrition: "Food, meals, hydration, and nutrition knowledge without moral labels.",
      training: "Plans, sessions, exercise education, and steady progression.",
      anatomy: "A visual bridge between muscles, movement, and exercise choices.",
      knowledge: "Readable articles that explain the reasoning behind practical actions."
    },
    about: {
      eyebrow: "About the product",
      title: "Better decisions, not more noise.",
      intro: "B Fit & Healthy is being built as one connected system for daily health, fitness, and practical knowledge.",
      principleTitle: "Our principle",
      principleBody: "Every number should have context, every recommendation a clear limit, and every tool a useful next action.",
      claimsTitle: "What we do not claim",
      claimsBody: "The product does not replace a doctor, dietitian, physiotherapist, or qualified coach."
    },
    contact: {
      eyebrow: "Contact",
      title: "Start the conversation clearly.",
      intro: "This public foundation does not yet operate a production support desk.",
      duringTitle: "During development",
      duringBody: "Use the channel through which you are reviewing this project to report an accessibility, content, or design issue.",
      medicalTitle: "Medical questions",
      medicalBody: "Do not send urgent or personal medical questions. Contact an appropriate healthcare service."
    },
    privacy: {
      eyebrow: "Privacy",
      title: "Privacy is an architectural boundary.",
      intro: "This is the public-foundation position, not the final launch policy.",
      currentTitle: "Current public site",
      currentBody: "The site uses a locale cookie and a local theme preference. It does not collect personal health records in this phase.",
      futureTitle: "Future private data",
      futureBody: "Future user records will require authentication, server authorization, and database ownership policies."
    },
    terms: {
      eyebrow: "Terms",
      title: "Clear boundaries for an educational product.",
      intro: "These foundation terms explain the current phase and require legal review before public launch.",
      useTitle: "Educational use",
      useBody: "Content is general education and is not diagnosis, treatment, or personalized medical advice.",
      statusTitle: "Feature status",
      statusBody: "Only publicly accessible pages are currently delivered. Personal features arrive in separately approved phases."
    },
    anatomy: {
      eyebrow: "Athletic anatomy",
      title: "Understand the muscle behind the movement.",
      lede: "Choose a highlighted region to learn what it does, why it matters, and practical ways to train it.",
      disclaimerTitle: "Educational anatomy",
      disclaimerBody: "This explorer supports general movement education. It does not diagnose pain, injury, or medical conditions."
    },
    anatomyMuscle: {
      backLink: "Anatomy encyclopedia",
      guideSectionsLabel: "Guide sections",
      location: "Location",
      structure: "Structure",
      movement: "Movement",
      training: "Training",
      care: "Care",
      attachmentsEyebrow: "Attachments",
      whereConnects: "Where it connects",
      origin: "Origin",
      insertion: "Insertion",
      functionEyebrow: "Function",
      howItContributes: "How it contributes",
      primaryMovements: "Primary movements",
      secondaryRoles: "Secondary roles",
      practicalTrainingEyebrow: "Practical training",
      activateAndTrain: "Activate and train with control",
      activationCue: "Activation cue",
      progression: "Progression",
      commonMistake: "Common mistake",
      mobilityEyebrow: "Mobility and recovery",
      supportMovement: "Support the movement",
      mobility: "Mobility",
      stretching: "Stretching",
      recovery: "Recovery",
      educationNotDiagnosis: "Education, not diagnosis",
      guideDisclaimer: "This guide does not diagnose injury or replace qualified professional assessment."
    },
    blogIndex: {
      eyebrow: "Knowledge library",
      title: "Understand more. Choose with confidence.",
      lede: "Reviewed starter guides connect training, nutrition, recovery, habits, and anatomy without miracle claims or unnecessary jargon.",
      signalSuffix: "reviewed bilingual guides",
      featuredEyebrow: "Editor’s starting point",
      minRead: "min read",
      browseEyebrow: "Browse by question",
      browseTitle: "Build understanding one useful topic at a time.",
      browseBody: "Search by a question or narrow the full reviewed collection by topic.",
      noteTitle: "A note about health content",
      noteBody: "This library provides general education, not diagnosis or individualized care. Persistent symptoms or personal health concerns deserve qualified professional assessment."
    },
    blogArticle: {
      backLink: "Knowledge library",
      onThisPage: "On this page",
      inThisGuide: "In this guide",
      references: "References",
      published: "Published",
      updated: "Updated",
      furtherReading: "Further reading",
      useEducationTitle: "Use this as education",
      useEducationBody: "This content does not diagnose conditions or replace advice or assessment from a qualified professional.",
      connectEyebrow: "Connect the knowledge",
      connectTitle: "From understanding to movement",
      anatomyLabel: "Anatomy",
      exercisesLabel: "Exercises",
      continueEyebrow: "Continue learning",
      relatedGuides: "Related guides",
      readGuide: "Read guide"
    },
    featuresShared: {
      connects: "How it connects",
      processTitle: "A clear path from information to action.",
      continueTitle: "Continue exploring",
      continueBody: "The public experience explains the system without pretending personal tracking is already connected."
    },
    featuresNutrition: {
      eyebrow: "Nutrition",
      title: "Food information that helps you decide what comes next.",
      body: "Move beyond isolated calorie totals. B Fit & Healthy is designed to explain meals, hydration, nutrients, and patterns in a calm daily context.",
      principles: [
        { title: "Meals before metrics", body: "Start with recognizable meals and routines, then use numbers to answer useful questions." },
        { title: "No moral labels", body: "Food is described by its role and nutrient context—not as good, bad, clean, or guilty." },
        { title: "Honest data", body: "Sources, serving bases, and missing nutrient values remain visible instead of implying false precision." }
      ],
      workflow: [
        "See the shape of the day and the next meal that needs attention.",
        "Understand energy, protein, hydration, and nutrient context.",
        "Use patterns across days to make one manageable adjustment."
      ],
      destinationLabel: "Read the protein guide"
    },
    featuresTraining: {
      eyebrow: "Training",
      title: "Know what to do—and why it belongs in the plan.",
      body: "Training becomes easier to repeat when the session has a purpose, the exercises connect to movement, and progress is recorded without noise.",
      principles: [
        { title: "A useful next session", body: "The system prioritizes the next action instead of filling the screen with unrelated statistics." },
        { title: "Progress with context", body: "Repetitions, load, technique, recovery, and consistency all contribute to progress." },
        { title: "Anatomy connected", body: "Exercise education links directly to the muscles and movements it trains." }
      ],
      workflow: [
        "Choose a clear training goal and manageable weekly rhythm.",
        "Follow a session built around movement patterns and progression.",
        "Review the record and adjust the smallest useful variable."
      ],
      destinationLabel: "Explore athletic anatomy"
    }
  },
```

- [ ] **Step 2: Add the matching `mk` sections**

In the `mk` object, apply the identical replacement pattern — replace:

```typescript
    features: {
      eyebrow: "Екосистемот",
      title: "Различни здравствени цели, еден разбирлив ритам.",
      body: "Секој модул е корисен самостојно и уште покорисен кога споделува контекст со остатокот од денот.",
      nutrition: "Храна, оброци, хидратација и знаење без морални етикети.",
      training: "Планови, сесии, едукација за вежби и постепен напредок.",
      anatomy: "Визуелен мост меѓу мускулите, движењето и изборот на вежби.",
      knowledge: "Читливи статии што го објаснуваат размислувањето зад практичните чекори."
    }
  }
} as const satisfies Record<Locale, object>;
```

with:

```typescript
    features: {
      eyebrow: "Екосистемот",
      title: "Различни здравствени цели, еден разбирлив ритам.",
      body: "Секој модул е корисен самостојно и уште покорисен кога споделува контекст со остатокот од денот.",
      nutrition: "Храна, оброци, хидратација и знаење без морални етикети.",
      training: "Планови, сесии, едукација за вежби и постепен напредок.",
      anatomy: "Визуелен мост меѓу мускулите, движењето и изборот на вежби.",
      knowledge: "Читливи статии што го објаснуваат размислувањето зад практичните чекори."
    },
    about: {
      eyebrow: "За производот",
      title: "Подобри одлуки, не повеќе бучава.",
      intro: "B Fit & Healthy се гради како поврзан систем за секојдневно здравје, фитнес и практично знаење.",
      principleTitle: "Нашиот принцип",
      principleBody: "Секоја бројка треба да има контекст, секоја препорака јасна граница, а секоја алатка корисен следен чекор.",
      claimsTitle: "Што не тврдиме",
      claimsBody: "Производот не заменува лекар, диететичар, физиотерапевт или квалификуван тренер."
    },
    contact: {
      eyebrow: "Контакт",
      title: "Разговорот започнува јасно.",
      intro: "Оваа јавна основа сè уште нема продукциски систем за поддршка.",
      duringTitle: "За време на развојот",
      duringBody: "Користи го каналот преку кој го прегледуваш проектот за да пријавиш проблем со пристапност, содржина или дизајн.",
      medicalTitle: "Медицински прашања",
      medicalBody: "Не испраќај итни или лични медицински прашања. Обрати се кај соодветна здравствена служба."
    },
    privacy: {
      eyebrow: "Приватност",
      title: "Приватноста е архитектонска граница.",
      intro: "Ова е почетна информација за фазата на јавната основа, не конечна политика за лансирање.",
      currentTitle: "Тековна јавна страница",
      currentBody: "Страницата користи колаче за избор на јазик и локална поставка за тема. Не собира здравствени записи во оваа фаза.",
      futureTitle: "Идни приватни податоци",
      futureBody: "Идните кориснички записи ќе бараат автентикација, серверска авторизација и политики за сопственост во базата."
    },
    terms: {
      eyebrow: "Услови",
      title: "Јасни граници за едукативен производ.",
      intro: "Овие почетни услови ја објаснуваат тековната фаза и ќе бидат правно прегледани пред јавно лансирање.",
      useTitle: "Едукативна употреба",
      useBody: "Содржината е општа едукација и не претставува дијагноза, третман или персонализиран медицински совет.",
      statusTitle: "Статус на можностите",
      statusBody: "Само јавно достапните страници се тековно испорачани. Личните функции се додаваат во одделни одобрени фази."
    },
    anatomy: {
      eyebrow: "Атлетска анатомија",
      title: "Разбери го мускулот зад движењето.",
      lede: "Избери означен регион за да научиш што прави, зошто е важен и како практично да го тренираш.",
      disclaimerTitle: "Едукативна анатомија",
      disclaimerBody: "Овој преглед служи за општа едукација за движењето. Не дијагностицира болка, повреда или медицинска состојба."
    },
    anatomyMuscle: {
      backLink: "Анатомска енциклопедија",
      guideSectionsLabel: "Секции на водичот",
      location: "Локација",
      structure: "Градба",
      movement: "Движење",
      training: "Тренинг",
      care: "Грижа",
      attachmentsEyebrow: "Припојувања",
      whereConnects: "Каде се поврзува",
      origin: "Почеток",
      insertion: "Припој",
      functionEyebrow: "Функција",
      howItContributes: "Како придонесува",
      primaryMovements: "Главни движења",
      secondaryRoles: "Споредни улоги",
      practicalTrainingEyebrow: "Практичен тренинг",
      activateAndTrain: "Активирај и тренирај со контрола",
      activationCue: "Насока за активирање",
      progression: "Прогресија",
      commonMistake: "Честа грешка",
      mobilityEyebrow: "Мобилност и опоравување",
      supportMovement: "Поддржи го движењето",
      mobility: "Мобилност",
      stretching: "Истегнување",
      recovery: "Опоравување",
      educationNotDiagnosis: "Едукација, не дијагноза",
      guideDisclaimer: "Овој водич не дијагностицира повреда и не заменува професионална проценка."
    },
    blogIndex: {
      eyebrow: "Библиотека на знаење",
      title: "Разбери повеќе. Избери со сигурност.",
      lede: "Прегледани почетни водичи ги поврзуваат тренингот, исхраната, опоравувањето, навиките и анатомијата без чудесни тврдења и непотребен жаргон.",
      signalSuffix: "прегледани двојазични водичи",
      featuredEyebrow: "Избор на уредникот",
      minRead: "мин читање",
      browseEyebrow: "Истражи по прашање",
      browseTitle: "Гради разбирање, една корисна тема по една.",
      browseBody: "Пребарај по прашање или филтрирај ја целата прегледана колекција по тема.",
      noteTitle: "Белешка за здравствената содржина",
      noteBody: "Оваа библиотека нуди општа едукација, а не дијагноза или индивидуална грижа. Постојаните симптоми и личните здравствени грижи заслужуваат стручна проценка."
    },
    blogArticle: {
      backLink: "Библиотека",
      onThisPage: "На оваа страница",
      inThisGuide: "Во овој водич",
      references: "Извори",
      published: "Објавено",
      updated: "Обновено",
      furtherReading: "Понатамошно читање",
      useEducationTitle: "Користи го како едукација",
      useEducationBody: "Оваа содржина не поставува дијагноза и не заменува совет или проценка од квалификувано стручно лице.",
      connectEyebrow: "Поврзи го знаењето",
      connectTitle: "Од разбирање до движење",
      anatomyLabel: "Анатомија",
      exercisesLabel: "Вежби",
      continueEyebrow: "Продолжи со учење",
      relatedGuides: "Поврзани водичи",
      readGuide: "Прочитај"
    },
    featuresShared: {
      connects: "Како се поврзува",
      processTitle: "Јасен пат од информација до активност.",
      continueTitle: "Продолжи со истражување",
      continueBody: "Јавното искуство го објаснува системот без да тврди дека личното следење е веќе поврзано."
    },
    featuresNutrition: {
      eyebrow: "Исхрана",
      title: "Информации за храна што помагаат во следната одлука.",
      body: "Надмини ги изолираните калориски збирови. Системот ги објаснува оброците, хидратацијата, нутриентите и навиките во мирен дневен контекст.",
      principles: [
        { title: "Оброци пред метрики", body: "Почни со препознатливи оброци и рутини, а бројките користи ги за корисни прашања." },
        { title: "Без морални етикети", body: "Храната се опишува според улога и нутритивен контекст, не како добра, лоша или виновна." },
        { title: "Искрени податоци", body: "Изворите, порциите и недостапните вредности остануваат видливи." }
      ],
      workflow: [
        "Погледни го обликот на денот и следниот оброк што бара внимание.",
        "Разбери ја енергијата, протеинот, хидратацијата и нутритивниот контекст.",
        "Користи обрасци низ повеќе денови за една изводлива промена."
      ],
      destinationLabel: "Прочитај го водичот за протеин"
    },
    featuresTraining: {
      eyebrow: "Тренинг",
      title: "Знај што да правиш и зошто е во планот.",
      body: "Тренингот полесно се повторува кога сесијата има цел, вежбите се поврзани со движењето, а напредокот се бележи без бучава.",
      principles: [
        { title: "Корисна следна сесија", body: "Системот ја истакнува следната активност наместо неповрзани статистики." },
        { title: "Напредок со контекст", body: "Повторувања, тежина, техника, опоравување и доследност придонесуваат за напредок." },
        { title: "Поврзана анатомија", body: "Едукацијата за вежби директно се поврзува со мускулите и движењата." }
      ],
      workflow: [
        "Избери јасна цел и изводлив неделен ритам.",
        "Следи сесија изградена околу движења и напредок.",
        "Прегледај го записот и приспособи ја најмалата корисна променлива."
      ],
      destinationLabel: "Истражи атлетска анатомија"
    }
  }
} as const satisfies Record<Locale, object>;
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS — `publicContent` is inferred as a `const` object; no consumer references these
new keys yet, so nothing else should break.

- [ ] **Step 4: Commit**

```bash
git add src/lib/i18n/public-content.ts
git commit -m "feat(i18n): add public-content sections for about/contact/privacy/terms/anatomy/blog/features pages"
```

---

### Task 2: Migrate about/contact/privacy/terms to `public-content.ts`

**Files:**
- Modify: `src/app/(marketing)/about/page.tsx`
- Modify: `src/app/(marketing)/contact/page.tsx`
- Modify: `src/app/(marketing)/privacy/page.tsx`
- Modify: `src/app/(marketing)/terms/page.tsx`

- [ ] **Step 1: Rewrite `src/app/(marketing)/about/page.tsx`**

Replace the full file with:

```typescript
import { InformationPage } from "@/components/content/information-page";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
export const metadata=publicMetadata("About B Fit & Healthy","Why B Fit & Healthy is being built as a connected, trustworthy health education and tracking system.","/about");
export default async function AboutPage(){const c=getPublicContent(await getLocale()).about;return <InformationPage eyebrow={c.eyebrow} title={c.title} intro={c.intro}><section><h2>{c.principleTitle}</h2><p>{c.principleBody}</p></section><section><h2>{c.claimsTitle}</h2><p>{c.claimsBody}</p></section></InformationPage>}
```

- [ ] **Step 2: Rewrite `src/app/(marketing)/contact/page.tsx`**

Replace the full file with:

```typescript
import { InformationPage } from "@/components/content/information-page";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
export const metadata=publicMetadata("Contact B Fit & Healthy","Contact information and current support boundaries for B Fit & Healthy.","/contact");
export default async function ContactPage(){const c=getPublicContent(await getLocale()).contact;return <InformationPage eyebrow={c.eyebrow} title={c.title} intro={c.intro}><section><h2>{c.duringTitle}</h2><p>{c.duringBody}</p></section><section><h2>{c.medicalTitle}</h2><p>{c.medicalBody}</p></section></InformationPage>}
```

- [ ] **Step 3: Rewrite `src/app/(marketing)/privacy/page.tsx`**

Replace the full file with:

```typescript
import { InformationPage } from "@/components/content/information-page";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
export const metadata=publicMetadata("Privacy foundation","The current B Fit & Healthy privacy position during the public foundation phase.","/privacy");
export default async function PrivacyPage(){const c=getPublicContent(await getLocale()).privacy;return <InformationPage eyebrow={c.eyebrow} title={c.title} intro={c.intro}><section><h2>{c.currentTitle}</h2><p>{c.currentBody}</p></section><section><h2>{c.futureTitle}</h2><p>{c.futureBody}</p></section></InformationPage>}
```

- [ ] **Step 4: Rewrite `src/app/(marketing)/terms/page.tsx`**

Replace the full file with:

```typescript
import { InformationPage } from "@/components/content/information-page";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
export const metadata=publicMetadata("Terms foundation","Educational-use and product-status terms for the B Fit & Healthy public foundation.","/terms");
export default async function TermsPage(){const c=getPublicContent(await getLocale()).terms;return <InformationPage eyebrow={c.eyebrow} title={c.title} intro={c.intro}><section><h2>{c.useTitle}</h2><p>{c.useBody}</p></section><section><h2>{c.statusTitle}</h2><p>{c.statusBody}</p></section></InformationPage>}
```

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Manual verification**

Run: `npm run dev`, visit `/about`, `/contact`, `/privacy`, `/terms` in both English and Macedonian
(use the locale switcher in the header). Confirm the exact same copy renders as before the change
(no visible regression — this is a pure refactor of where the strings come from, not what they say).

- [ ] **Step 7: Commit**

```bash
git add src/app/\(marketing\)/about/page.tsx src/app/\(marketing\)/contact/page.tsx src/app/\(marketing\)/privacy/page.tsx src/app/\(marketing\)/terms/page.tsx
git commit -m "refactor(i18n): migrate about/contact/privacy/terms pages to public-content.ts"
```

---

### Task 3: Migrate anatomy pages to `public-content.ts`

**Files:**
- Modify: `src/app/(marketing)/anatomy/page.tsx`
- Modify: `src/app/(marketing)/anatomy/[muscle]/page.tsx`

- [ ] **Step 1: Rewrite `src/app/(marketing)/anatomy/page.tsx`**

Replace the full file with:

```typescript
import { Activity } from "lucide-react";
import { AnatomyExplorer } from "@/features/anatomy/anatomy-explorer";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";

export const metadata = publicMetadata("Interactive athletic anatomy", "Explore major muscle groups, understand their function, and discover practical training guidance.", "/anatomy");
export default async function AnatomyPage() { const locale = await getLocale(); const c = getPublicContent(locale).anatomy; return <main id="main-content" tabIndex={-1}><section className="shell page-hero anatomy-hero"><div><p className="eyebrow"><Activity aria-hidden="true" size={18} />{c.eyebrow}</p><h1>{c.title}</h1><p className="lede">{c.lede}</p></div></section><section className="shell anatomy-section"><AnatomyExplorer locale={locale} /></section><section className="shell health-disclaimer"><strong>{c.disclaimerTitle}</strong><p>{c.disclaimerBody}</p></section></main>; }
```

- [ ] **Step 2: Rewrite `src/app/(marketing)/anatomy/[muscle]/page.tsx`**

Replace the full file with:

```typescript
import type{Metadata}from"next";import Link from"next/link";import{ArrowLeft,Activity,MapPin,ShieldCheck}from"lucide-react";import{notFound}from"next/navigation";import{getMuscle,muscles}from"@/features/anatomy/data";import{AnatomyRelatedContent}from"@/features/anatomy/related-content";import{getArticles}from"@/lib/content/articles";import{getLocale}from"@/lib/i18n/server";import{getPublicContent}from"@/lib/i18n/public-content";
type Props={params:Promise<{muscle:string}>};export function generateStaticParams(){return muscles.map(muscle=>({muscle:muscle.id}))}export async function generateMetadata({params}:Props):Promise<Metadata>{const locale=await getLocale();const{muscle:id}=await params;const muscle=getMuscle(id);if(!muscle)return{};return{title:`${muscle.name[locale]} anatomy`,description:muscle.summary[locale],alternates:{canonical:`/anatomy/${id}`}}}
export default async function MusclePage({params}:Props){const locale=await getLocale();const{muscle:id}=await params;const muscle=getMuscle(id);if(!muscle)notFound();const articles=await getArticles(locale);const c=getPublicContent(locale).anatomyMuscle;return <main id="main-content" tabIndex={-1}><article className="shell muscle-encyclopedia"><Link className="back-link" href="/anatomy"><ArrowLeft aria-hidden="true"/>{c.backLink}</Link><header className="muscle-identity"><div><p className="eyebrow">{muscle.region}</p><h1>{muscle.name[locale]}</h1><p className="scientific-name">{muscle.scientific}</p><p className="article-deck">{muscle.summary[locale]}</p></div><aside><MapPin/><strong>{c.location}</strong><p>{muscle.location[locale]}</p></aside></header><nav className="muscle-page-nav" aria-label={c.guideSectionsLabel}><a href="#structure">{c.structure}</a><a href="#movement">{c.movement}</a><a href="#training">{c.training}</a><a href="#care">{c.care}</a></nav><div className="muscle-reference-grid"><section id="structure"><p className="eyebrow">{c.attachmentsEyebrow}</p><h2>{c.whereConnects}</h2><dl><div><dt>{c.origin}</dt><dd>{muscle.origin[locale]}</dd></div><div><dt>{c.insertion}</dt><dd>{muscle.insertion[locale]}</dd></div></dl></section><section id="movement"><p className="eyebrow">{c.functionEyebrow}</p><h2>{c.howItContributes}</h2><dl><div><dt>{c.primaryMovements}</dt><dd>{muscle.primaryMovements[locale]}</dd></div><div><dt>{c.secondaryRoles}</dt><dd>{muscle.secondaryMovements[locale]}</dd></div></dl></section><section id="training" className="wide"><p className="eyebrow">{c.practicalTrainingEyebrow}</p><h2><Activity/>{c.activateAndTrain}</h2><div className="guide-columns"><div><h3>{c.activationCue}</h3><p>{muscle.activation[locale]}</p></div><div><h3>{c.progression}</h3><p>{muscle.training[locale]}</p></div><div><h3>{c.commonMistake}</h3><p>{muscle.mistake[locale]}</p></div></div></section><section id="care" className="wide"><p className="eyebrow">{c.mobilityEyebrow}</p><h2>{c.supportMovement}</h2><div className="guide-columns"><div><h3>{c.mobility}</h3><p>{muscle.mobility[locale]}</p></div><div><h3>{c.stretching}</h3><p>{muscle.stretching[locale]}</p></div><div><h3>{c.recovery}</h3><p>{muscle.recovery[locale]}</p></div></div></section></div><aside className="health-disclaimer"><ShieldCheck/><div><strong>{c.educationNotDiagnosis}</strong><p>{muscle.prevention[locale]} {c.guideDisclaimer}</p></div></aside><AnatomyRelatedContent muscle={muscle} locale={locale} articles={articles}/></article></main>}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, visit `/anatomy` and any muscle detail page (e.g. `/anatomy/biceps` — check
`src/features/anatomy/data.ts` for a valid slug if that one doesn't exist) in both locales.
Confirm identical copy to before.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(marketing)/anatomy/page.tsx" "src/app/(marketing)/anatomy/[muscle]/page.tsx"
git commit -m "refactor(i18n): migrate anatomy pages to public-content.ts"
```

---

### Task 4: Migrate blog pages to `public-content.ts`

**Files:**
- Modify: `src/app/(marketing)/blog/page.tsx`
- Modify: `src/app/(marketing)/blog/[slug]/page.tsx`

- [ ] **Step 1: Rewrite `src/app/(marketing)/blog/page.tsx`**

Replace the full file with:

```typescript
import { BookOpen, Search } from "lucide-react";
import Link from "next/link";
import { MotionKnowledgeLibrary as KnowledgeLibrary } from "@/features/knowledge/motion-knowledge-library";
import { getArticles } from "@/lib/content/articles";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";

export const metadata = publicMetadata(
  "Knowledge for healthier decisions",
  "Readable guides about nutrition, training, recovery, habits, and anatomy.",
  "/blog",
);

export default async function BlogPage() {
  const locale = await getLocale();
  const articles = await getArticles(locale);
  const featured = articles[0];
  const c = getPublicContent(locale).blogIndex;

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="shell page-hero blog-hero">
        <div>
          <p className="eyebrow">
            <BookOpen aria-hidden="true" />
            {c.eyebrow}
          </p>
          <h1>{c.title}</h1>
          <p className="lede">{c.lede}</p>
        </div>
        <div className="library-signal">
          <Search aria-hidden="true" />
          <span>{articles.length}</span>
          <small>{c.signalSuffix}</small>
        </div>
      </section>

      {featured && (
        <section className="shell featured-article">
          <div>
            <p className="eyebrow">{c.featuredEyebrow}</p>
            <h2>
              <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <p>{featured.excerpt}</p>
            <div className="article-meta">
              <span>{featured.category}</span>
              <span>
                {featured.readingTime} {c.minRead}
              </span>
            </div>
          </div>
          <div className="featured-mark">
            <BookOpen aria-hidden="true" />
          </div>
        </section>
      )}

      <section className="shell public-section" aria-labelledby="article-library">
        <div className="library-heading">
          <div>
            <p className="eyebrow">{c.browseEyebrow}</p>
            <h2 id="article-library">{c.browseTitle}</h2>
          </div>
          <p>{c.browseBody}</p>
        </div>
        <KnowledgeLibrary
          locale={locale}
          articles={articles.map(
            ({ slug, title, excerpt, category, readingTime, updatedAt }) => ({
              slug,
              title,
              excerpt,
              category,
              readingTime,
              updatedAt,
            }),
          )}
        />
      </section>

      <section className="shell health-disclaimer">
        <strong>{c.noteTitle}</strong>
        <p>{c.noteBody}</p>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Rewrite `src/app/(marketing)/blog/[slug]/page.tsx`**

Replace the full file with:

```typescript
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Dumbbell,
  ExternalLink,
} from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/content/article-card";
import { ArticleJsonLd } from "@/components/seo/json-ld";
import { getMuscle } from "@/features/anatomy/data";
import { exercises } from "@/features/fitness/catalogue";
import { resolveArticleRelationships } from "@/lib/content/article-relationships";
import {
  getArticle,
  getArticles,
  getArticleSlugs,
} from "@/lib/content/articles";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { siteUrl } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getArticleSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocale();
  const { slug } = await params;
  const article = await getArticle(locale, slug);
  if (!article) return {};

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: article.seoTitle,
      description: article.seoDescription,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      url: `/blog/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const locale = await getLocale();
  const { slug } = await params;
  const article = await getArticle(locale, slug);
  if (!article) notFound();

  const all = await getArticles(locale);
  const related = resolveArticleRelationships(article, all);
  const muscles = related.muscles
    .map(getMuscle)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedExercises = related.exercises
    .map((id) => exercises.find((item) => item.slug === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const dateLocale = locale === "mk" ? "mk-MK" : "en-GB";
  const c = getPublicContent(locale).blogArticle;

  return (
    <main id="main-content" tabIndex={-1}>
      <ArticleJsonLd
        value={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          author: { "@type": "Organization", name: article.author },
          publisher: { "@type": "Organization", name: "B Fit & Healthy" },
          mainEntityOfPage: new URL(
            `/blog/${article.slug}`,
            siteUrl,
          ).href,
        }}
      />
      <article className="article-layout shell">
        <aside className="article-rail">
          <Link className="back-link" href="/blog">
            <ArrowLeft aria-hidden="true" />
            {c.backLink}
          </Link>
          <nav aria-label={c.onThisPage}>
            <strong>{c.inThisGuide}</strong>
            {article.headings.map((heading) => (
              <a key={heading.id} href={`#${heading.id}`}>
                {heading.label}
              </a>
            ))}
            {article.references.length > 0 && (
              <a href="#references">{c.references}</a>
            )}
          </nav>
        </aside>

        <div className="article-main">
          <div className="article-reading-column">
            <header className="article-header">
              <p className="eyebrow">{article.category}</p>
              <h1>{article.title}</h1>
              <p className="article-deck">{article.excerpt}</p>
              <div className="article-byline">
                <span>{article.author}</span>
                <span>
                  <Clock aria-hidden="true" />
                  {article.readingTime} min
                </span>
                <span>
                  {c.published}{" "}
                  <time dateTime={article.publishedAt}>
                    {new Intl.DateTimeFormat(dateLocale, {
                      dateStyle: "medium",
                    }).format(new Date(article.publishedAt))}
                  </time>
                </span>
                <span>
                  {c.updated}{" "}
                  <time dateTime={article.updatedAt}>
                    {new Intl.DateTimeFormat(dateLocale, {
                      dateStyle: "medium",
                    }).format(new Date(article.updatedAt))}
                  </time>
                </span>
              </div>
            </header>
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />
          </div>

          <div className="article-supporting-content">
            {article.references.length > 0 && (
              <section id="references" className="article-references">
                <p className="eyebrow">{c.references}</p>
                <h2>{c.furtherReading}</h2>
                <ol>
                  {article.references.map((reference) => (
                    <li key={reference.url}>
                      <a
                        href={reference.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {reference.label}
                        <ExternalLink aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}
            <aside className="health-disclaimer">
              <strong>{c.useEducationTitle}</strong>
              <p>{c.useEducationBody}</p>
            </aside>
          </div>
        </div>
      </article>

      {(muscles.length > 0 || relatedExercises.length > 0) && (
        <section className="shell article-connections">
          <header>
            <p className="eyebrow">{c.connectEyebrow}</p>
            <h2>{c.connectTitle}</h2>
          </header>
          <div>
            {muscles.length > 0 && (
              <section>
                <h3>
                  <BookOpen aria-hidden="true" />
                  {c.anatomyLabel}
                </h3>
                {muscles.map((item) => (
                  <Link href={`/anatomy/${item.id}`} key={item.id}>
                    {item.name[locale]}
                    <span>{item.scientific}</span>
                  </Link>
                ))}
              </section>
            )}
            {relatedExercises.length > 0 && (
              <section>
                <h3>
                  <Dumbbell aria-hidden="true" />
                  {c.exercisesLabel}
                </h3>
                {relatedExercises.map((item) => (
                  <Link href={`/exercises/${item.slug}`} key={item.slug}>
                    {locale === "mk" ? item.titleMk : item.titleEn}
                    <span>{item.equipment.join(" · ")}</span>
                  </Link>
                ))}
              </section>
            )}
          </div>
        </section>
      )}

      {related.articles.length > 0 && (
        <section className="shell related-section">
          <p className="eyebrow">{c.continueEyebrow}</p>
          <h2>{c.relatedGuides}</h2>
          <div className="article-grid compact-grid">
            {related.articles.map((item) => (
              <ArticleCard
                key={item.id}
                article={item}
                minutes="min"
                readLabel={c.readGuide}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
```

Note: `locale === "mk" ? item.titleMk : item.titleEn` on the exercise-link line is kept as a
direct locale check rather than moved into `public-content.ts` — it's selecting between two
fields on an exercise *data* object (`titleMk`/`titleEn`), not translating UI chrome, so it isn't
in scope for this consolidation (same category as `muscle.name[locale]` a few lines above, which
was already locale-indexed data, not a ternary).

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, visit `/blog` and one article detail page in both locales. Confirm identical
copy to before.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(marketing)/blog/page.tsx" "src/app/(marketing)/blog/[slug]/page.tsx"
git commit -m "refactor(i18n): migrate blog pages to public-content.ts"
```

---

### Task 5: Migrate features/nutrition and features/training to `public-content.ts`

**Files:**
- Modify: `src/app/(marketing)/features/nutrition/page.tsx`
- Modify: `src/app/(marketing)/features/training/page.tsx`

- [ ] **Step 1: Rewrite `src/app/(marketing)/features/nutrition/page.tsx`**

Replace the full file with:

```typescript
import { Apple } from "lucide-react";
import { FeaturePage } from "@/components/content/feature-page";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";

export const metadata = publicMetadata("Nutrition with useful context", "Understand meals, energy, protein, hydration, and food patterns without moral labels.", "/features/nutrition");
export default async function NutritionFeaturePage() { const content = getPublicContent(await getLocale()); const c = content.featuresNutrition; const shared = content.featuresShared; return <FeaturePage eyebrow={c.eyebrow} title={c.title} body={c.body} Icon={Apple} principles={c.principles} workflow={c.workflow} destination={{href:"/blog/protein-without-the-myths",label:c.destinationLabel}} labels={shared} />; }
```

- [ ] **Step 2: Rewrite `src/app/(marketing)/features/training/page.tsx`**

Replace the full file with:

```typescript
import { Dumbbell } from "lucide-react";
import { FeaturePage } from "@/components/content/feature-page";
import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";

export const metadata = publicMetadata("Training you can understand", "Connect plans, exercises, muscle groups, and gradual progression in one training system.", "/features/training");
export default async function TrainingFeaturePage() { const content = getPublicContent(await getLocale()); const c = content.featuresTraining; const shared = content.featuresShared; return <FeaturePage eyebrow={c.eyebrow} title={c.title} body={c.body} Icon={Dumbbell} principles={c.principles} workflow={c.workflow} destination={{href:"/anatomy",label:c.destinationLabel}} labels={shared} />; }
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS. If `FeaturePage`'s `principles`/`workflow`/`labels` prop types don't structurally
match the shape now coming from `public-content.ts` (e.g. `principles` typed as a mutable array
vs. the `as const` readonly tuple from `publicContent`), fix by widening the prop types in
`src/components/content/feature-page.tsx` to accept `readonly` arrays — do not cast or use `any`.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, visit `/features/nutrition` and `/features/training` in both locales. Confirm
identical copy to before, including the 3 principle cards and 3 workflow steps.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(marketing)/features/nutrition/page.tsx" "src/app/(marketing)/features/training/page.tsx"
git commit -m "refactor(i18n): migrate features/nutrition and features/training pages to public-content.ts"
```

---

### Task 6: Migrate home page's remaining inline ternaries

**Files:**
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Add a small `visuals` section to `public-content.ts` for the 7 remaining strings**

These 7 strings (breakfast/squat/pull/carry visual labels) don't fit the `home` section's existing
keys and aren't shared elsewhere, so add a nested `home.visuals` key. In
`src/lib/i18n/public-content.ts`, in the `en.home` object, replace:

```typescript
      finalTitle: "Start by understanding the system.",
      finalBody: "Explore the public foundation now. Personal tracking and coaching arrive only after their own quality and approval gates."
    },
```

with:

```typescript
      finalTitle: "Start by understanding the system.",
      finalBody: "Explore the public foundation now. Personal tracking and coaching arrive only after their own quality and approval gates.",
      nutritionVisualLabel: "Nutrition",
      breakfastLabel: "Breakfast",
      breakfastNote: "A useful start, not a score",
      trainingVisualLabel: "Training",
      squatLabel: "Squat pattern",
      pullLabel: "Horizontal pull",
      carryLabel: "Loaded carry"
    },
```

And in the `mk.home` object, replace:

```typescript
      finalTitle: "Почни со разбирање на системот.",
      finalBody: "Истражи ја јавната основа. Личното следење и советување доаѓаат по сопствените проверки и одобрувања."
    },
```

with:

```typescript
      finalTitle: "Почни со разбирање на системот.",
      finalBody: "Истражи ја јавната основа. Личното следење и советување доаѓаат по сопствените проверки и одобрувања.",
      nutritionVisualLabel: "Исхрана",
      breakfastLabel: "Појадок",
      breakfastNote: "Корисен почеток, не оцена",
      trainingVisualLabel: "Тренинг",
      squatLabel: "Чучнување",
      pullLabel: "Хоризонтално влечење",
      carryLabel: "Носење товар"
    },
```

- [ ] **Step 2: Update `src/app/(marketing)/page.tsx`**

Replace:

```typescript
      <div className="feature-visual nutrition-visual"><div><span>07:40</span><strong>{locale === "en" ? "Breakfast" : "Појадок"}</strong><small>{locale === "en" ? "A useful start, not a score" : "Корисен почеток, не оцена"}</small></div><div className="nutrient-lines"><i /><i /><i /></div></div>
      <SectionIntro eyebrow={locale === "en" ? "Nutrition" : "Исхрана"} title={c.home.nutritionTitle} body={c.home.nutritionBody} action={<Button asChild variant="secondary"><Link href="/features/nutrition">{c.common.learnMore}<ArrowRight aria-hidden="true" size={17} /></Link></Button>} />
    </section></MotionReveal>

    <MotionReveal className="landing-reveal"><section className="public-section feature-story feature-story-reverse shell" data-motion-section>
      <div className="feature-visual training-visual"><div className="training-row"><span>01</span><strong>{locale === "en" ? "Squat pattern" : "Чучнување"}</strong><small>3 × 8</small></div><div className="training-row"><span>02</span><strong>{locale === "en" ? "Horizontal pull" : "Хоризонтално влечење"}</strong><small>3 × 10</small></div><div className="training-row"><span>03</span><strong>{locale === "en" ? "Loaded carry" : "Носење товар"}</strong><small>4 × 30 m</small></div></div>
      <SectionIntro eyebrow={locale === "en" ? "Training" : "Тренинг"} title={c.home.trainingTitle} body={c.home.trainingBody} action={<Button asChild variant="secondary"><Link href="/features/training">{c.common.learnMore}<ArrowRight aria-hidden="true" size={17} /></Link></Button>} />
```

with:

```typescript
      <div className="feature-visual nutrition-visual"><div><span>07:40</span><strong>{c.home.breakfastLabel}</strong><small>{c.home.breakfastNote}</small></div><div className="nutrient-lines"><i /><i /><i /></div></div>
      <SectionIntro eyebrow={c.home.nutritionVisualLabel} title={c.home.nutritionTitle} body={c.home.nutritionBody} action={<Button asChild variant="secondary"><Link href="/features/nutrition">{c.common.learnMore}<ArrowRight aria-hidden="true" size={17} /></Link></Button>} />
    </section></MotionReveal>

    <MotionReveal className="landing-reveal"><section className="public-section feature-story feature-story-reverse shell" data-motion-section>
      <div className="feature-visual training-visual"><div className="training-row"><span>01</span><strong>{c.home.squatLabel}</strong><small>3 × 8</small></div><div className="training-row"><span>02</span><strong>{c.home.pullLabel}</strong><small>3 × 10</small></div><div className="training-row"><span>03</span><strong>{c.home.carryLabel}</strong><small>4 × 30 m</small></div></div>
      <SectionIntro eyebrow={c.home.trainingVisualLabel} title={c.home.trainingTitle} body={c.home.trainingBody} action={<Button asChild variant="secondary"><Link href="/features/training">{c.common.learnMore}<ArrowRight aria-hidden="true" size={17} /></Link></Button>} />
```

Note: `locale` is still used elsewhere in this file (`<GuidedHealthPath locale={locale} />`,
`<KnowledgeLibrary locale={locale}>` if present) — do not remove the `const locale = await
getLocale();` line, only the two ternary blocks above are being replaced.

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, visit `/` in both locales, confirm the nutrition/training feature-story
sections render identical copy to before.

- [ ] **Step 5: Commit**

```bash
git add src/lib/i18n/public-content.ts "src/app/(marketing)/page.tsx"
git commit -m "refactor(i18n): migrate homepage feature-story visual labels to public-content.ts"
```

---

### Task 7: Delete the orphaned `states` page

**Files:**
- Delete: `src/app/(marketing)/states/page.tsx`

- [ ] **Step 1: Confirm it's still unreferenced**

Run: `grep -rn "states" src/components/shell/ src/app/\(marketing\)/ src/app/\(product\)/ --include=*.tsx | grep -iv "statesTitle\|statesBody\|useState\|states/page"`

Expected: no output referencing a `/states` link or route (this re-confirms the prior research
finding before deleting).

- [ ] **Step 2: Delete the file**

```bash
git rm "src/app/(marketing)/states/page.tsx"
```

- [ ] **Step 3: Run the full contract test suite**

Run: `node --test tests/*.test.js`
Expected: PASS. If a contract test references `/states` or `src/app/(marketing)/states`
specifically, read it and remove/update that specific assertion in the same commit — do not leave
a test asserting the existence of a route you just deleted.

- [ ] **Step 4: Typecheck and build**

Run: `npm run typecheck && npm run build`
Expected: both PASS — deleting an unreferenced route file should not affect either.

- [ ] **Step 5: Commit**

```bash
git commit -m "chore: remove orphaned /states foundation-showcase page (unreferenced, legacy dictionary system)"
```

---

### Task 8: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: PASS (contract tests + Vitest unit/component tests). The pre-existing, unrelated
`tests/component/ambient-pointer.test.tsx` flaky failure is expected and not caused by this work
— confirm no *other* failures appear.

- [ ] **Step 2: Typecheck, lint, build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: all PASS.

- [ ] **Step 3: Full manual bilingual sweep**

Run: `npm run dev`. Visit every one of the 12 remaining marketing routes (`/`, `/about`,
`/anatomy`, `/anatomy/<any-valid-slug>`, `/blog`, `/blog/<any-valid-slug>`, `/contact`,
`/features`, `/features/nutrition`, `/features/training`, `/privacy`, `/terms`) in both English
and Macedonian via the locale switcher. Confirm: no missing/undefined text, no `[object Object]`
renders, no console errors, copy matches what existed before this plan (a pure refactor — nothing
should read differently to a user).

- [ ] **Step 4: Grep for any remaining inline ternaries in the marketing tree**

Run: `grep -rn "locale === \"en\"\|locale===\"en\"\|mk ?\|mk?" "src/app/(marketing)"`

Expected: no output (or only the one intentionally-kept `locale === "mk" ? item.titleMk :
item.titleEn` data-field selection in `blog/[slug]/page.tsx`, per the note in Task 4 — confirm
that's the only remaining match).

---

## Self-Review Notes

- **Spec coverage:** all 13 marketing routes accounted for — 4 InformationPage-style pages
  (Task 2), 2 anatomy pages (Task 3), 2 blog pages (Task 4), 2 feature detail pages (Task 5), the
  home page's remaining ternaries (Task 6), `features/page.tsx` needed no changes (already used
  `getPublicContent` exclusively, confirmed in research), and the orphaned `states/page.tsx` is
  deleted rather than migrated (Task 7) since it's unreachable dead code using the legacy system.
- **Placeholder scan:** none — every task has complete before/after code, no "similar to Task N".
- **Type consistency:** every page-level consumer calls `getPublicContent(locale).<section>` the
  same way; the one structural risk (readonly-array typing between `public-content.ts`'s `as
  const` output and `FeaturePage`'s prop types) is called out explicitly in Task 5 Step 3 with a
  concrete fix direction (widen to `readonly`, no `any`/casts).
- **Scope boundary:** `src/lib/i18n/config.ts` and `src/components/providers/locale-provider.tsx`
  are explicitly OUT of scope — they still serve `layout.tsx`, `not-found.tsx`, `error.tsx`, and
  `~offline/page.tsx`, none of which are marketing content pages. Removing `states/page.tsx` in
  Task 7 does not require touching `config.ts` itself, since other consumers remain.
