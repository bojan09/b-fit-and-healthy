export type WorkoutGoal = "strength" | "mobility" | "conditioning";

export type WorkoutPrescription = {
  exerciseSlug: string;
  sets: number;
  repMin: number | null;
  repMax: number | null;
  durationSeconds: number | null;
  restSeconds: number;
};

export type WorkoutIdea = {
  slug: string;
  title: string;
  summary: string;
  goal: WorkoutGoal;
  durationMinutes: number;
  level: "beginner" | "intermediate";
  equipment: string[];
  isFullBody: boolean;
  exercises: WorkoutPrescription[];
};

const reps = (
  exerciseSlug: string,
  sets = 3,
  repMin = 8,
  repMax = 12,
  restSeconds = 90,
): WorkoutPrescription => ({
  exerciseSlug,
  sets,
  repMin,
  repMax,
  durationSeconds: null,
  restSeconds,
});

const timed = (
  exerciseSlug: string,
  durationSeconds = 40,
  restSeconds = 20,
): WorkoutPrescription => ({
  exerciseSlug,
  sets: 1,
  repMin: null,
  repMax: null,
  durationSeconds,
  restSeconds,
});

export const workoutIdeas: WorkoutIdea[] = [
  {
    slug: "bodyweight-foundations",
    title: "Bodyweight foundations",
    summary: "A calm full-body strength session for learning the core movement patterns.",
    goal: "strength",
    durationMinutes: 45,
    level: "beginner",
    equipment: ["Bodyweight"],
    isFullBody: true,
    exercises: [
      reps("bodyweight-squat", 3, 10, 15, 60),
      reps("reverse-lunge", 3, 8, 12, 60),
      reps("hip-bridge", 3, 12, 15, 60),
      reps("push-up", 3, 6, 12, 75),
      reps("incline-push-up", 2, 8, 12, 60),
      reps("pike-push-up", 2, 6, 10, 75),
      reps("bird-dog", 2, 8, 10, 30),
      reps("dead-bug", 2, 8, 10, 30),
      timed("side-plank", 30, 30),
      reps("standing-calf-raise", 3, 12, 20, 45),
    ],
  },
  {
    slug: "lower-body-control",
    title: "Lower-body control",
    summary: "Build confident squatting, hinging and single-session trunk control.",
    goal: "strength",
    durationMinutes: 30,
    level: "beginner",
    equipment: ["Bodyweight"],
    isFullBody: false,
    exercises: [
      reps("bodyweight-squat", 3, 10, 15, 60),
      reps("hip-bridge", 3, 12, 15, 60),
      timed("side-plank", 30, 30),
    ],
  },
  {
    slug: "dumbbell-full-body",
    title: "Dumbbell full body",
    summary: "A balanced push, pull, squat and carry session with minimal equipment.",
    goal: "strength",
    durationMinutes: 60,
    level: "beginner",
    equipment: ["Dumbbells"],
    isFullBody: true,
    exercises: [
      reps("goblet-squat", 3, 8, 12, 90),
      reps("romanian-deadlift", 3, 8, 12, 90),
      reps("split-squat", 3, 8, 10, 75),
      reps("dumbbell-bench-press", 3, 8, 12, 90),
      reps("one-arm-row", 3, 8, 12, 75),
      reps("overhead-press", 3, 8, 12, 90),
      reps("lateral-raise", 2, 12, 15, 60),
      reps("biceps-curl", 2, 10, 15, 60),
      reps("overhead-triceps-extension", 2, 10, 15, 60),
      timed("farmer-carry", 40, 60),
    ],
  },
  {
    slug: "posterior-chain-builder",
    title: "Posterior-chain builder",
    summary: "Train the hips, hamstrings, glutes and upper back with controlled loading.",
    goal: "strength",
    durationMinutes: 38,
    level: "intermediate",
    equipment: ["Dumbbells"],
    isFullBody: false,
    exercises: [
      reps("romanian-deadlift", 4, 6, 10, 120),
      reps("hip-bridge", 3, 10, 15, 75),
      reps("one-arm-row", 3, 8, 12, 90),
      reps("dead-bug", 3, 8, 10, 45),
    ],
  },
  {
    slug: "upper-body-basics",
    title: "Upper-body basics",
    summary: "Straightforward pushing and pulling with scalable beginner movements.",
    goal: "strength",
    durationMinutes: 28,
    level: "beginner",
    equipment: ["Bodyweight", "Dumbbell"],
    isFullBody: false,
    exercises: [
      reps("push-up", 3, 6, 12, 75),
      reps("one-arm-row", 3, 8, 12, 75),
      timed("side-plank", 30, 30),
    ],
  },
  {
    slug: "gym-strength-starter",
    title: "Gym strength starter",
    summary: "A first gym routine using stable, adjustable resistance exercises.",
    goal: "strength",
    durationMinutes: 45,
    level: "beginner",
    equipment: ["Cable", "Dumbbells"],
    isFullBody: false,
    exercises: [
      reps("goblet-squat"),
      reps("seated-cable-row"),
      reps("overhead-press"),
      reps("lat-pulldown"),
    ],
  },
  {
    slug: "desk-reset",
    title: "Desk-day reset",
    summary: "Gentle rotation and hip work to restore comfortable movement.",
    goal: "mobility",
    durationMinutes: 12,
    level: "beginner",
    equipment: ["Bodyweight"],
    isFullBody: false,
    exercises: [
      timed("thoracic-rotation"),
      timed("hip-flexor-mobility"),
      timed("dead-bug"),
    ],
  },
  {
    slug: "hips-and-spine",
    title: "Hips and spine mobility",
    summary: "A short mobility flow focused on hips, trunk control and upper-back rotation.",
    goal: "mobility",
    durationMinutes: 18,
    level: "beginner",
    equipment: ["Bodyweight"],
    isFullBody: false,
    exercises: [
      timed("hip-flexor-mobility", 45, 15),
      timed("thoracic-rotation", 45, 15),
      timed("hip-bridge", 40, 20),
    ],
  },
  {
    slug: "warm-up-flow",
    title: "Full-body warm-up flow",
    summary: "Prepare the major joints and movement patterns before a main workout.",
    goal: "mobility",
    durationMinutes: 18,
    level: "beginner",
    equipment: ["Bodyweight"],
    isFullBody: true,
    exercises: [
      timed("cat-cow"),
      timed("thoracic-rotation"),
      timed("hip-flexor-mobility"),
      timed("ankle-rock"),
      timed("bodyweight-squat"),
      timed("reverse-lunge"),
      timed("hip-bridge"),
      timed("incline-push-up"),
      timed("bird-dog"),
      timed("dead-bug"),
    ],
  },
  {
    slug: "steady-circuit",
    title: "Steady full-body circuit",
    summary: "Alternate simple movements at a sustainable pace without chasing exhaustion.",
    goal: "conditioning",
    durationMinutes: 35,
    level: "beginner",
    equipment: ["Bodyweight"],
    isFullBody: true,
    exercises: [
      reps("bodyweight-squat", 3, 12, 15, 30),
      reps("reverse-lunge", 3, 8, 12, 30),
      reps("hip-bridge", 3, 12, 15, 30),
      reps("push-up", 3, 6, 12, 30),
      reps("pike-push-up", 3, 6, 10, 30),
      reps("standing-calf-raise", 3, 15, 20, 30),
      timed("bird-dog", 40, 20),
      timed("dead-bug", 40, 20),
      timed("front-plank", 30, 30),
      timed("side-plank", 30, 30),
    ],
  },
  {
    slug: "carry-and-core",
    title: "Carry and core circuit",
    summary: "Short work blocks for posture, grip and trunk endurance.",
    goal: "conditioning",
    durationMinutes: 24,
    level: "intermediate",
    equipment: ["Dumbbells"],
    isFullBody: false,
    exercises: [
      timed("farmer-carry", 45, 45),
      reps("goblet-squat", 3, 10, 15, 45),
      timed("side-plank", 30, 30),
    ],
  },
  {
    slug: "strength-density",
    title: "Strength density session",
    summary: "A compact dumbbell circuit that keeps quality high and rest intentional.",
    goal: "conditioning",
    durationMinutes: 30,
    level: "intermediate",
    equipment: ["Dumbbells"],
    isFullBody: false,
    exercises: [
      reps("goblet-squat", 4, 8, 10, 45),
      reps("one-arm-row", 4, 8, 10, 45),
      reps("overhead-press", 4, 8, 10, 45),
      timed("farmer-carry", 40, 45),
    ],
  },
];

export function discoverWorkoutIdeas(filters: {
  goal?: WorkoutGoal | "all";
  maxMinutes?: number;
  equipment?: string | "all";
} = {}) {
  return workoutIdeas.filter((idea) => {
    if (filters.goal && filters.goal !== "all" && idea.goal !== filters.goal) return false;
    if (filters.maxMinutes && idea.durationMinutes > filters.maxMinutes) return false;
    if (filters.equipment && filters.equipment !== "all" && !idea.equipment.includes(filters.equipment)) return false;
    return true;
  });
}

export function getWorkoutIdea(slug?: string) {
  return workoutIdeas.find((idea) => idea.slug === slug);
}
