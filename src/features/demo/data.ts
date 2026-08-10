import type { Locale } from "@/lib/i18n/config";

export type LocalizedText = { en: string; mk: string };

export function localized(value: LocalizedText, locale: Locale) {
  return value[locale];
}

export type DemoHabit = { id: string; title: LocalizedText; done: boolean };

export const demoHabits: DemoHabit[] = [
  { id: "water", title: { en: "Drink 2L of water", mk: "Испиј 2Л вода" }, done: true },
  { id: "walk", title: { en: "10-minute walk", mk: "10-минутна прошетка" }, done: true },
  { id: "sleep", title: { en: "Lights out by 11pm", mk: "Легнување до 23ч" }, done: false },
  { id: "stretch", title: { en: "Evening stretch", mk: "Вечерно истегнување" }, done: false }
];

export type DemoMeal = {
  id: string;
  time: string;
  name: LocalizedText;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export const demoMeals: DemoMeal[] = [
  { id: "breakfast", time: "07:40", name: { en: "Oats with berries", mk: "Овес со бобинки" }, kcal: 420, proteinG: 18, carbsG: 62, fatG: 11 },
  { id: "lunch", time: "12:30", name: { en: "Chicken & rice bowl", mk: "Пилешко со ориз" }, kcal: 610, proteinG: 42, carbsG: 70, fatG: 15 },
  { id: "dinner", time: "19:10", name: { en: "Salmon & vegetables", mk: "Лосос со зеленчук" }, kcal: 540, proteinG: 38, carbsG: 28, fatG: 26 }
];

export const demoAddableMeal: DemoMeal = {
  id: "snack",
  time: "16:00",
  name: { en: "Greek yogurt & almonds", mk: "Грчки јогурт со бадеми" },
  kcal: 260,
  proteinG: 16,
  carbsG: 14,
  fatG: 15
};

export type DemoExercise = { id: string; name: LocalizedText; sets: string; done: boolean };

export const demoWorkoutSession: { title: LocalizedText; duration: LocalizedText; exercises: DemoExercise[] } = {
  title: { en: "Full-body strength", mk: "Силов тренинг за цело тело" },
  duration: { en: "38 min", mk: "38 мин" },
  exercises: [
    { id: "squat", name: { en: "Back squat", mk: "Клек со шипка" }, sets: "4 × 6", done: true },
    { id: "bench", name: { en: "Bench press", mk: "Потисок од клупа" }, sets: "4 × 8", done: true },
    { id: "row", name: { en: "Barbell row", mk: "Веслање со шипка" }, sets: "3 × 10", done: false },
    { id: "plank", name: { en: "Plank hold", mk: "Плоча" }, sets: "3 × 45s", done: false }
  ]
};

export const demoWeightPoints: Array<{ date: string; value: number }> = [
  { date: "2026-07-08", value: 82.4 },
  { date: "2026-07-15", value: 81.9 },
  { date: "2026-07-22", value: 81.3 },
  { date: "2026-07-29", value: 80.8 },
  { date: "2026-08-05", value: 80.2 }
];
