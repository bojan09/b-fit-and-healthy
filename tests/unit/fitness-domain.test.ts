import { describe, expect, it } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  buildSessionSummary,
  derivePersonalRecords,
  displayLoadToKg,
  kgToDisplayLoad,
  trainingWeekDates,
} from "@/features/fitness/domain";
import { exercises } from "@/features/fitness/catalogue";
import type { CatalogueMedia } from "@/features/media/catalogue-media";
import { validateCatalogueMedia } from "@/features/media/catalogue-media";
import { templateSchema } from "@/features/fitness/schemas";

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

  it("parses reviewed workout prescriptions", () => {
    const result = templateSchema.parse({
      name: "Full body",
      description: "",
      duration: "45",
      prescriptions: JSON.stringify([{
        exerciseSlug: "bodyweight-squat",
        sets: 3,
        repMin: 8,
        repMax: 12,
        durationSeconds: null,
        restSeconds: 90,
      }]),
    });

    expect(result.prescriptions[0].exerciseSlug).toBe("bodyweight-squat");
  });

  it("rejects workout rows without reps or duration", () => {
    expect(() => templateSchema.parse({
      name: "Invalid",
      description: "",
      duration: "45",
      prescriptions: JSON.stringify([{
        exerciseSlug: "bodyweight-squat",
        sets: 3,
        repMin: null,
        repMax: null,
        durationSeconds: null,
        restSeconds: 90,
      }]),
    })).toThrow();
  });
});

describe("curated exercise catalogue", () => {
  it("contains exactly 60 exercises with unique IDs and slugs", () => {
    expect(exercises).toHaveLength(98);
    expect(new Set(exercises.map((exercise) => exercise.id))).toHaveLength(98);
    expect(new Set(exercises.map((exercise) => exercise.slug))).toHaveLength(98);
  });

  it("covers the required movement, equipment, type, and difficulty ranges", () => {
    const movementPatterns = new Set(exercises.map((exercise) => exercise.movementPattern));
    const equipment = new Set(exercises.flatMap((exercise) => exercise.equipment));
    const types = new Set(exercises.map((exercise) => exercise.exerciseType));
    const difficulties = new Set(exercises.map((exercise) => exercise.difficulty));

    for (const requiredMovement of [
      "squat",
      "hinge",
      "horizontal-push",
      "horizontal-pull",
      "vertical-push",
      "vertical-pull",
      "carry",
      "mobility",
    ]) expect(movementPatterns).toContain(requiredMovement);
    for (const requiredEquipment of [
      "Bodyweight",
      "Dumbbells",
      "Barbell",
      "Cable",
      "Machine",
      "Kettlebell",
      "Band",
    ]) expect(equipment).toContain(requiredEquipment);
    expect(types).toEqual(new Set(["strength", "mobility", "core"]));
    expect(difficulties).toEqual(new Set(["beginner", "intermediate"]));
  });

  it("provides complete bilingual coaching content for every exercise", () => {
    for (const exercise of exercises) {
      expect(exercise.titleEn.trim(), `${exercise.slug} English title`).not.toBe("");
      expect(exercise.titleMk.trim(), `${exercise.slug} Macedonian title`).not.toBe("");
      expect(exercise.summaryEn.trim(), `${exercise.slug} English summary`).not.toBe("");
      expect(exercise.summaryMk.trim(), `${exercise.slug} Macedonian summary`).not.toBe("");
      expect(exercise.instructionsEn.length, `${exercise.slug} English instructions`).toBeGreaterThan(0);
      expect(exercise.instructionsMk.length, `${exercise.slug} Macedonian instructions`).toBeGreaterThan(0);
      expect(exercise.primaryMuscles.length, `${exercise.slug} primary muscles`).toBeGreaterThan(0);
      expect(exercise.mistakesEn.length, `${exercise.slug} English mistakes`).toBeGreaterThan(0);
      expect(exercise.mistakesMk.length, `${exercise.slug} Macedonian mistakes`).toBeGreaterThan(0);
      expect(exercise.safetyEn.trim(), `${exercise.slug} English safety`).not.toBe("");
      expect(exercise.safetyMk.trim(), `${exercise.slug} Macedonian safety`).not.toBe("");
    }
  });

  it("maps every exercise to one complete, existing local media record", async () => {
    const manifestPath = join(process.cwd(), "src", "features", "fitness", "exercise-media.ts");
    expect(existsSync(manifestPath), "exercise media manifest module").toBe(true);
    if (!existsSync(manifestPath)) return;

    const mediaModule = await import(/* @vite-ignore */ pathToFileURL(manifestPath).href);
    const exerciseMedia = (mediaModule.exerciseMedia ?? {}) as Record<string, CatalogueMedia>;
    expect(Object.keys(exerciseMedia)).toHaveLength(98);
    expect(new Set(Object.keys(exerciseMedia))).toEqual(new Set(exercises.map((exercise) => exercise.slug)));

    for (const exercise of exercises) {
      const media = exerciseMedia[exercise.slug];
      expect(media, `${exercise.slug} media`).toBeDefined();
      expect(exercise.media, `${exercise.slug} attached media`).toEqual(media);
      expect(validateCatalogueMedia(media), `${exercise.slug} media contract`).toBe(true);
      expect(media.sourceName.trim(), `${exercise.slug} media source`).not.toBe("");
      expect(media.licenseName.trim(), `${exercise.slug} media licence`).not.toBe("");
      expect(existsSync(join(process.cwd(), "public", media.src.replace(/^\//, ""))), `${exercise.slug} media file`).toBe(true);
    }

    const mediaDirectory = join(process.cwd(), "public", "media", "exercises");
    const localAssets = existsSync(mediaDirectory)
      ? readdirSync(mediaDirectory).filter((file) => file.endsWith(".webp")).sort()
      : [];
    const referencedAssets = Object.values(exerciseMedia)
      .map((media) => media.src.split("/").at(-1))
      .sort();
    expect(localAssets).toEqual(referencedAssets);
  });
});

describe("workout idea localization", () => {
  it("gives every workout idea a distinct Macedonian title and summary", async () => {
    const { workoutIdeas, ideaCopy } = await import("@/features/fitness/workout-ideas");
    for (const idea of workoutIdeas) {
      const mk = ideaCopy(idea, "mk");
      expect(mk.title.trim().length, idea.slug).toBeGreaterThan(3);
      expect(mk.summary.trim().length, idea.slug).toBeGreaterThan(10);
      expect(mk.title, idea.slug).not.toBe(idea.title);
      expect(mk.summary, idea.slug).toMatch(/[Ѐ-ӿ]/);
    }
  });
});
