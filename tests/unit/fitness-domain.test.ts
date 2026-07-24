import { describe, expect, it } from "vitest";
import {
  buildSessionSummary,
  derivePersonalRecords,
  displayLoadToKg,
  kgToDisplayLoad,
  trainingWeekDates,
} from "@/features/fitness/domain";

describe("fitness domain", () => {
  it("counts completed work but excludes incomplete and bodyweight sets from load volume", () => {
    expect(buildSessionSummary([
      { exerciseId: "squat", reps: 8, loadKg: 50, isComplete: true, isBodyweight: false },
      { exerciseId: "push-up", reps: 12, loadKg: 0, isComplete: true, isBodyweight: true },
      { exerciseId: "squat", reps: 10, loadKg: 50, isComplete: false, isBodyweight: false },
    ])).toEqual({ completedSets: 2, totalReps: 20, volumeKg: 400 });
  });

  it("derives genuine records from completed sessions only", () => {
    const records = derivePersonalRecords([
      { id: "active", status: "active", finishedAt: null, sets: [{ exerciseId: "squat", exerciseName: "Squat", reps: 20, loadKg: 100, isComplete: true, isBodyweight: false }] },
      { id: "done", status: "complete", finishedAt: "2026-07-21T10:00:00Z", sets: [
        { exerciseId: "squat", exerciseName: "Squat", reps: 5, loadKg: 80, isComplete: true, isBodyweight: false },
        { exerciseId: "squat", exerciseName: "Squat", reps: 8, loadKg: 60, isComplete: true, isBodyweight: false },
        { exerciseId: "squat", exerciseName: "Squat", reps: 10, loadKg: 90, isComplete: false, isBodyweight: false },
      ] },
    ]);
    expect(records).toEqual([{ exerciseId: "squat", exerciseName: "Squat", heaviestLoadKg: 80, maxReps: 8, bestSetVolumeKg: 480, bestSessionVolumeKg: 880, achievedAt: "2026-07-21T10:00:00Z" }]);
  });

  it("converts display loads without changing canonical kilograms", () => {
    expect(kgToDisplayLoad(100, "imperial")).toBe(220.5);
    expect(displayLoadToKg(220.5, "imperial")).toBeCloseTo(100, 1);
    expect(kgToDisplayLoad(42.5, "metric")).toBe(42.5);
  });

  it("returns a Monday-first seven-day training week", () => {
    expect(trainingWeekDates(new Date("2026-07-22T12:00:00Z"))).toEqual([
      "2026-07-20", "2026-07-21", "2026-07-22", "2026-07-23", "2026-07-24", "2026-07-25", "2026-07-26",
    ]);
  });
});
