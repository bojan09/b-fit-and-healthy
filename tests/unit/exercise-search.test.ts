import { describe, expect, it } from "vitest";
import {
  buildExerciseDiscoveryEndpoint,
  effectiveExerciseQuery,
  filterConnectedExercises,
} from "@/features/fitness/exercise-search";
import type { DiscoveryExercise } from "@/features/discovery/types";

const exercise = (
  overrides: Partial<DiscoveryExercise>
    & Pick<DiscoveryExercise, "id" | "provider" | "title">,
): DiscoveryExercise => {
  const { id, provider, title, ...rest } = overrides;

  return {
    id,
    kind: "exercise",
    provider,
    externalId: id,
    title,
    normalizedTitle: title.toLocaleLowerCase(),
    sourceUrl: null,
    attribution: "Test source",
    retrievedAt: "2026-07-26T00:00:00.000Z",
    quality: "verified",
    completeness: [],
    alternates: [],
    license: {
      id: "Unlicense",
      name: "Unlicense",
      url: null,
      attribution: "Test source",
      commercialUse: true,
    },
    primaryMuscles: [],
    secondaryMuscles: [],
    equipment: [],
    difficulty: null,
    movementPattern: null,
    instructions: [],
    safety: null,
    media: [],
    ...rest,
  };
};

const bicepsBrachiiCurl = exercise({
  id: "wger:biceps-curl",
  provider: "wger",
  title: "Dumbbell biceps curl",
  primaryMuscles: ["Biceps brachii"],
  equipment: ["Dumbbell"],
  movementPattern: "strength",
});
const tricepsExtension = exercise({
  id: "wger:triceps-extension",
  provider: "wger",
  title: "Cable triceps extension",
  primaryMuscles: ["Triceps brachii"],
  equipment: ["Cable"],
  movementPattern: "strength",
});
const bodyOnlyCrunch = exercise({
  id: "exercise-api:crunch",
  provider: "exercise-api",
  title: "Bodyweight crunch",
  primaryMuscles: ["Rectus abdominis"],
  equipment: ["Body only"],
  movementPattern: "core stability",
});
const hamstringStretch = exercise({
  id: "local:hamstring-stretch",
  provider: "local",
  title: "Seated hamstring stretch",
  primaryMuscles: ["Hamstrings"],
  equipment: ["Body only"],
  movementPattern: "mobility",
});
const incompleteCurl = exercise({
  id: "wrkout:curl",
  provider: "wrkout",
  title: "Dumbbell curl",
  movementPattern: "strength",
});
const bicepsCurl = exercise({
  id: "exercise-api:biceps-curl",
  provider: "exercise-api",
  title: "Dumbbell curl",
  primaryMuscles: ["Biceps"],
  equipment: ["Dumbbell"],
  movementPattern: "strength",
});
const treadmillRun = exercise({
  id: "exercise-api:treadmill-run",
  provider: "exercise-api",
  title: "Treadmill run",
  primaryMuscles: ["Calves"],
  equipment: ["Treadmill"],
  movementPattern: "cardio",
});
const dumbbellFly = exercise({
  id: "exercise-api:dumbbell-fly",
  provider: "exercise-api",
  title: "Dumbbell fly",
  primaryMuscles: ["Chest"],
  equipment: ["Dumbbell"],
  movementPattern: null,
});
const yogaBlockBalance = exercise({
  id: "exercise-api:yoga-block-balance",
  provider: "exercise-api",
  title: "Yoga block balance",
  primaryMuscles: ["Core"],
  equipment: ["Yoga block"],
  movementPattern: "balance",
});
const yogaFlow = exercise({
  id: "exercise-api:yoga-flow",
  provider: "exercise-api",
  title: "Yoga flow",
  primaryMuscles: ["Core"],
  equipment: ["Body only"],
  movementPattern: "balance",
});
const bodyweightSquat = exercise({
  id: "exercise-api:bodyweight-squat",
  provider: "exercise-api",
  title: "Bodyweight squat",
  primaryMuscles: ["Quadriceps"],
  equipment: ["Body only"],
  movementPattern: "squat",
});

describe("exercise search contract", () => {
  it("uses typed text before structured exercise filters", () => {
    expect(effectiveExerciseQuery({
      query: "curl",
      muscle: "biceps",
      equipment: "Dumbbells",
      type: "strength",
    })).toBe("curl");
  });

  it("uses the muscle when no typed query was provided", () => {
    expect(effectiveExerciseQuery({
      query: "",
      muscle: "biceps",
      equipment: "",
      type: "",
    })).toBe("biceps");
  });

  it("keeps a valid selected facet active when typed text is one character", () => {
    expect(effectiveExerciseQuery({
      query: "b",
      muscle: "biceps",
      equipment: "",
      type: "",
    })).toBe("biceps");
  });

  it("keeps populated structured filters in the discovery URL", () => {
    expect(buildExerciseDiscoveryEndpoint({
      query: "",
      muscle: "biceps",
      equipment: "Dumbbells",
      type: "strength",
    })).toBe(
      "/api/discovery/exercises?muscle=biceps&equipment=Dumbbells&type=strength",
    );
  });

  it("matches a selected muscle against provider anatomical aliases", () => {
    expect(filterConnectedExercises(
      [bicepsBrachiiCurl, tricepsExtension],
      { query: "", muscle: "biceps", equipment: "", type: "" },
    ).map((item) => item.id)).toEqual(["wger:biceps-curl"]);
  });

  it("matches an anatomical muscle selection against a provider shorthand", () => {
    expect(filterConnectedExercises(
      [bicepsCurl, tricepsExtension],
      { query: "", muscle: "biceps brachii", equipment: "", type: "" },
    ).map((item) => item.id)).toEqual(["exercise-api:biceps-curl"]);
  });

  it("matches bodyweight and dumbbells against singular provider equipment", () => {
    expect(filterConnectedExercises(
      [bicepsBrachiiCurl, bodyOnlyCrunch],
      { query: "", muscle: "", equipment: "dumbbells", type: "" },
    ).map((item) => item.id)).toEqual(["wger:biceps-curl"]);

    expect(filterConnectedExercises(
      [bicepsBrachiiCurl, bodyOnlyCrunch],
      { query: "", muscle: "", equipment: "bodyweight", type: "" },
    ).map((item) => item.id)).toEqual(["exercise-api:crunch"]);
  });

  it("requires provider metadata for an explicitly selected facet", () => {
    expect(filterConnectedExercises(
      [bicepsBrachiiCurl, incompleteCurl],
      { query: "", muscle: "biceps", equipment: "", type: "" },
    ).map((item) => item.id)).toEqual(["wger:biceps-curl"]);
  });

  it("combines typed title text with muscle and equipment filters", () => {
    expect(filterConnectedExercises(
      [bicepsBrachiiCurl, tricepsExtension, incompleteCurl],
      { query: "curl", muscle: "biceps", equipment: "dumbbells", type: "" },
    ).map((item) => item.id)).toEqual(["wger:biceps-curl"]);
  });

  it("recognizes core, mobility, and strength exercise records", () => {
    expect(filterConnectedExercises(
      [bicepsBrachiiCurl, bodyOnlyCrunch, hamstringStretch],
      { query: "", muscle: "", equipment: "", type: "core" },
    ).map((item) => item.id)).toEqual(["exercise-api:crunch"]);

    expect(filterConnectedExercises(
      [bicepsBrachiiCurl, bodyOnlyCrunch, hamstringStretch],
      { query: "", muscle: "", equipment: "", type: "mobility" },
    ).map((item) => item.id)).toEqual(["local:hamstring-stretch"]);

    expect(filterConnectedExercises(
      [
        bicepsBrachiiCurl,
        bodyOnlyCrunch,
        hamstringStretch,
        treadmillRun,
        dumbbellFly,
        yogaBlockBalance,
        yogaFlow,
        bodyweightSquat,
      ],
      { query: "", muscle: "", equipment: "", type: "strength" },
    ).map((item) => item.id)).toEqual([
      "wger:biceps-curl",
      "exercise-api:crunch",
      "exercise-api:dumbbell-fly",
      "exercise-api:bodyweight-squat",
    ]);
  });
});
