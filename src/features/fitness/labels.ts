import type { Locale } from "@/lib/i18n/config";

const humanize = (value: string) => {
  const text = value.replaceAll("-", " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const mk: Record<string, string> = {
  // exercise types and levels
  strength: "Сила",
  core: "Труп",
  mobility: "Мобилност",
  conditioning: "Кондиција",
  beginner: "Почетно",
  intermediate: "Средно",
  advanced: "Напредно",
  // equipment
  "Ab wheel": "Тркало за стомак",
  Band: "Ластик",
  Barbell: "Шипка",
  Bench: "Клупа",
  Bodyweight: "Сопствена тежина",
  Cable: "Сајла",
  Dumbbell: "Тег",
  Dumbbells: "Тегови",
  Kettlebell: "Kettlebell",
  Machine: "Машина",
  // muscles
  abdominals: "Стомачни мускули",
  back: "Грб",
  biceps: "Бицепс",
  calves: "Листови",
  chest: "Гради",
  forearms: "Подлактици",
  "front-delts": "Предни рамени",
  glutes: "Глутеуси",
  hamstrings: "Задни бутни",
  "hip-flexors": "Флексори на колкот",
  hips: "Колкови",
  lats: "Широк грбен",
  "mid-back": "Среден грб",
  obliques: "Коси стомачни",
  quadriceps: "Квадрицепс",
  "rear-delts": "Задни рамени",
  shoulders: "Рамена",
  "side-delts": "Странични рамени",
  spine: "'Рбет",
  "thoracic-spine": "Градна 'рбетница",
  traps: "Трапезиус",
  triceps: "Трицепс",
  // movement patterns
  "ankle-extension": "Екстензија на глужд",
  "ankle-mobility": "Мобилност на глужд",
  "anti-extension": "Анти-екстензија",
  "anti-lateral-flexion": "Анти-странично свиткување",
  "anti-rotation": "Анти-ротација",
  carry: "Носење",
  crawl: "Лазење",
  "elbow-extension": "Опружање на лакот",
  "elbow-flexion": "Свиткување на лакот",
  "full-body": "Цело тело",
  hinge: "Колкова панта",
  "horizontal-pull": "Хоризонтално влечење",
  "horizontal-push": "Хоризонтално туркање",
  jump: "Скок",
  lateral: "Странично",
  lunge: "Искорак",
  rotation: "Ротација",
  "shoulder-abduction": "Подигање на рамото",
  "spinal-flexion": "Свиткување на 'рбетот",
  "spinal-mobility": "Мобилност на 'рбетот",
  squat: "Чучањ",
  "vertical-pull": "Вертикално влечење",
  "vertical-push": "Вертикално туркање",
};

/** Display label for catalogue vocabulary (equipment, muscles, patterns, types, levels). */
export function fitnessLabel(value: string, locale: Locale) {
  if (locale === "mk" && mk[value]) return mk[value];
  return humanize(value);
}
