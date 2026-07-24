export type UnitSystem = "metric" | "imperial";
export type FitnessSet = { exerciseId: string; exerciseName?: string; reps: number | null; loadKg: number | null; isComplete: boolean; isBodyweight: boolean };
export type FitnessSession = { id: string; status: "active" | "complete" | "discarded"; finishedAt: string | null; sets: FitnessSet[] };

const finite = (value: number | null | undefined) => Number.isFinite(value) ? Math.max(0, Number(value)) : 0;
const rounded = (value: number, places = 1) => Number(value.toFixed(places));

export function buildSessionSummary(sets: FitnessSet[]) {
  const complete = sets.filter((set) => set.isComplete);
  return {
    completedSets: complete.length,
    totalReps: complete.reduce((sum, set) => sum + finite(set.reps), 0),
    volumeKg: rounded(complete.reduce((sum, set) => sum + (set.isBodyweight ? 0 : finite(set.reps) * finite(set.loadKg)), 0)),
  };
}

export type PersonalRecord = { exerciseId: string; exerciseName: string; heaviestLoadKg: number; maxReps: number; bestSetVolumeKg: number; bestSessionVolumeKg: number; achievedAt: string };

export function derivePersonalRecords(sessions: FitnessSession[]): PersonalRecord[] {
  const records = new Map<string, PersonalRecord>();
  for (const session of sessions.filter((item) => item.status === "complete" && item.finishedAt)) {
    const volumeByExercise = new Map<string, number>();
    for (const set of session.sets.filter((item) => item.isComplete)) {
      const reps = finite(set.reps); const load = set.isBodyweight ? 0 : finite(set.loadKg); const volume = reps * load;
      volumeByExercise.set(set.exerciseId, (volumeByExercise.get(set.exerciseId) ?? 0) + volume);
      const previous = records.get(set.exerciseId);
      records.set(set.exerciseId, {
        exerciseId: set.exerciseId,
        exerciseName: set.exerciseName ?? previous?.exerciseName ?? "Exercise",
        heaviestLoadKg: Math.max(previous?.heaviestLoadKg ?? 0, load),
        maxReps: Math.max(previous?.maxReps ?? 0, reps),
        bestSetVolumeKg: Math.max(previous?.bestSetVolumeKg ?? 0, volume),
        bestSessionVolumeKg: previous?.bestSessionVolumeKg ?? 0,
        achievedAt: session.finishedAt!,
      });
    }
    for (const [exerciseId, volume] of volumeByExercise) {
      const current = records.get(exerciseId)!;
      current.bestSessionVolumeKg = Math.max(current.bestSessionVolumeKg, volume);
    }
  }
  return [...records.values()].sort((a, b) => a.exerciseName.localeCompare(b.exerciseName));
}

export const kgToDisplayLoad = (kg: number, units: UnitSystem) => rounded(units === "imperial" ? kg * 2.2046226218 : kg);
export const displayLoadToKg = (value: number, units: UnitSystem) => rounded(units === "imperial" ? value / 2.2046226218 : value, 3);

export function trainingWeekDates(date: Date) {
  const base = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = base.getUTCDay() || 7;
  base.setUTCDate(base.getUTCDate() - day + 1);
  return Array.from({ length: 7 }, (_, index) => { const item = new Date(base); item.setUTCDate(base.getUTCDate() + index); return item.toISOString().slice(0, 10); });
}
