import { redirect } from "next/navigation";
import { TodayCanvas } from "@/features/dashboard/today-canvas";
import { buildNutritionTotals } from "@/features/nutrition/domain";
import { loadNutritionDay } from "@/features/nutrition/repository";
import { buildDailySummary } from "@/features/tracking/domain";
import { loadTodayData, loadTrackingContext } from "@/features/tracking/repository";
import { requireUser } from "@/features/auth/session";
import { getLocale } from "@/lib/i18n/server";

export default async function TodayPage() {
  const user = await requireUser(); const context = await loadTrackingContext(user.id); if (!context.profile?.onboarding_complete) redirect("/onboarding");
  const data = await loadTodayData(user.id, context.settings); const nutrition = await loadNutritionDay(user.id, data.date); const nutritionTotals = buildNutritionTotals(nutrition.entries.map((entry) => ({ energyKcal: Number(entry.energy_kcal), proteinG: Number(entry.protein_g), carbohydrateG: Number(entry.carbohydrate_g), fatG: Number(entry.fat_g), fibreG: Number(entry.fibre_g) }))); const locale = await getLocale(); const checkins = new Map(data.checkins.map((item) => [item.habit_id, item.status]));
  const habits = data.habits.map((habit) => ({ id: habit.id, title: habit.title, status: checkins.get(habit.id) ?? null })); const waterMl = data.water.reduce((sum, entry) => sum + entry.amount_ml, 0);
  const summary = buildDailySummary({ waterMl, waterTargetMl: context.target?.water_ml ?? null, habits, goals: data.goals, latestWeightKg: data.latestWeight ? Number(data.latestWeight.weight_kg) : null });
  return <TodayCanvas locale={locale} name={context.profile.display_name || user.email || ""} date={data.date} units={context.settings.units} summary={{ waterMl, waterTargetMl: context.target?.water_ml ?? null, energyKcal: nutritionTotals.energyKcal, energyTargetKcal: context.target?.energy_kcal ?? null, completedHabits: summary.completedHabits, totalHabits: summary.totalHabits, activeGoals: summary.activeGoals, latestWeightKg: data.latestWeight ? Number(data.latestWeight.weight_kg) : null, waterRatio: summary.waterRatio, habitRatio: summary.habitRatio, nextAction: summary.nextAction }} waterEntries={data.water.map((entry) => ({ id: entry.id, amountMl: entry.amount_ml, loggedAt: entry.logged_at }))} habits={habits} />;
}
