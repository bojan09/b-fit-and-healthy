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
      finalBody: "Explore the public foundation now. Personal tracking and coaching arrive only after their own quality and approval gates."
    },
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
      finalBody: "Истражи ја јавната основа. Личното следење и советување доаѓаат по сопствените проверки и одобрувања."
    },
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

export function getPublicContent(locale: Locale) {
  return publicContent[locale];
}
