import type { Locale } from "@/lib/i18n/config";

export const publicContent = {
  en: {
    nav: { home: "Home", features: "Features", nutrition: "Nutrition", training: "Training", anatomy: "Anatomy", blog: "Knowledge", about: "About", contact: "Contact", privacy: "Privacy", terms: "Terms", information: "Information", account: "Account", signIn: "Sign in", getStarted: "Get started", menu: "Open menu" },
    common: { explore: "Explore the system", learnMore: "Learn more", readArticle: "Read article", minutes: "min read", educational: "Educational guidance only — not medical advice." },
    home: {
      eyebrow: "One connected health system",
      title: "Build healthier days with less guesswork.",
      body: "Nutrition, training, anatomy, habits, and trustworthy knowledge come together in one calm place—designed to help you choose the next useful action.",
      primary: "Explore what connects",
      secondary: "Read the knowledge library",
      signal: "Designed around real daily decisions",
      modulesTitle: "Your health is connected. Your tools should be too.",
      modulesBody: "B Fit & Healthy organizes the essentials without turning your wellbeing into an analytics dashboard.",
      nutritionTitle: "Nutrition that explains the day, not just the total",
      nutritionBody: "Understand meals, energy, protein, hydration, and patterns in context. Future tracking tools will build on a clear educational foundation.",
      trainingTitle: "Training built around progress you can understand",
      trainingBody: "Plan useful work, connect exercises to muscle groups, and learn why each movement belongs in the programme.",
      anatomyTitle: "Learn the body behind the movement",
      anatomyBody: "Explore recognizable muscle regions, what they do, and practical ways to train them—with keyboard and touch support from the start.",
      knowledgeTitle: "Clear answers before louder advice",
      knowledgeBody: "Read practical, carefully framed guidance about training, nutrition, recovery, habits, and anatomy.",
      finalTitle: "Start by understanding the system.",
      finalBody: "Explore the public foundation now. Personal tracking and coaching arrive only after their own quality and approval gates.",
      nutritionVisualLabel: "Nutrition",
      breakfastLabel: "Breakfast",
      breakfastNote: "A useful start, not a score",
      caloriesUnit: "kcal",
      proteinLabel: "Protein",
      carbsLabel: "Carbs",
      fatLabel: "Fat",
      trainingVisualLabel: "Training",
      workoutSessionLabel: "Full-body warmup",
      workoutDurationLabel: "22 min",
      squatLabel: "Squat pattern",
      pullLabel: "Horizontal pull",
      carryLabel: "Loaded carry",
      exerciseDoneLabel: "Done",
      exercisePendingLabel: "Up next"
    },
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
  mk: {
    nav: { home: "Почетна", features: "Можности", nutrition: "Исхрана", training: "Тренинг", anatomy: "Анатомија", blog: "Знаење", about: "За нас", contact: "Контакт", privacy: "Приватност", terms: "Услови", information: "Информации", account: "Сметка", signIn: "Најави се", getStarted: "Започни", menu: "Отвори мени" },
    common: { explore: "Истражи го системот", learnMore: "Дознај повеќе", readArticle: "Прочитај ја статијата", minutes: "мин читање", educational: "Само едукативни насоки — не медицински совет." },
    home: {
      eyebrow: "Еден поврзан здравствен систем",
      title: "Изгради поздрави денови со помалку претпоставки.",
      body: "Исхраната, тренингот, анатомијата, навиките и доверливото знаење се спојуваат на едно мирно место—создадено да ти помогне да го избереш следниот корисен чекор.",
      primary: "Истражи што се поврзува",
      secondary: "Отвори ја библиотеката",
      signal: "Создадено за вистински дневни одлуки",
      modulesTitle: "Твоето здравје е поврзано. И алатките треба да бидат.",
      modulesBody: "B Fit & Healthy ги организира основите без да ја претвори благосостојбата во финансиска контролна табла.",
      nutritionTitle: "Исхрана што го објаснува денот, не само збирот",
      nutritionBody: "Разбери ги оброците, енергијата, протеинот, хидратацијата и навиките во контекст.",
      trainingTitle: "Тренинг со напредок што можеш да го разбереш",
      trainingBody: "Планирај корисна работа, поврзи ги вежбите со мускулите и научи зошто секое движење припаѓа во програмата.",
      anatomyTitle: "Научи го телото зад движењето",
      anatomyBody: "Истражи препознатливи мускулни региони, нивната функција и практични начини за тренинг.",
      knowledgeTitle: "Јасни одговори пред погласни совети",
      knowledgeBody: "Читај практични и внимателно формулирани насоки за тренинг, исхрана, опоравување, навики и анатомија.",
      finalTitle: "Почни со разбирање на системот.",
      finalBody: "Истражи ја јавната основа. Личното следење и советување доаѓаат по сопствените проверки и одобрувања.",
      nutritionVisualLabel: "Исхрана",
      breakfastLabel: "Појадок",
      breakfastNote: "Корисен почеток, не оцена",
      caloriesUnit: "kcal",
      proteinLabel: "Протеини",
      carbsLabel: "Јаглехидрати",
      fatLabel: "Масти",
      trainingVisualLabel: "Тренинг",
      workoutSessionLabel: "Загревање за цело тело",
      workoutDurationLabel: "22 мин",
      squatLabel: "Чучнување",
      pullLabel: "Хоризонтално влечење",
      carryLabel: "Носење товар",
      exerciseDoneLabel: "Завршено",
      exercisePendingLabel: "Следно"
    },
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

export function getPublicContent(locale: Locale) {
  return publicContent[locale];
}
