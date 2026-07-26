export type WorkoutGoal = "strength" | "mobility" | "conditioning";

export type WorkoutIdea = {
  slug: string;
  title: string;
  summary: string;
  goal: WorkoutGoal;
  durationMinutes: number;
  level: "beginner" | "intermediate";
  equipment: string[];
  exerciseSlugs: string[];
};

export const workoutIdeas: WorkoutIdea[] = [
  { slug: "bodyweight-foundations", title: "Bodyweight foundations", summary: "A calm full-body strength session for learning the core movement patterns.", goal: "strength", durationMinutes: 25, level: "beginner", equipment: ["Bodyweight"], exerciseSlugs: ["bodyweight-squat", "push-up", "hip-bridge", "dead-bug"] },
  { slug: "lower-body-control", title: "Lower-body control", summary: "Build confident squatting, hinging and single-session trunk control.", goal: "strength", durationMinutes: 30, level: "beginner", equipment: ["Bodyweight"], exerciseSlugs: ["bodyweight-squat", "hip-bridge", "side-plank"] },
  { slug: "dumbbell-full-body", title: "Dumbbell full body", summary: "A balanced push, pull, squat and carry session with minimal equipment.", goal: "strength", durationMinutes: 40, level: "beginner", equipment: ["Dumbbells"], exerciseSlugs: ["goblet-squat", "one-arm-row", "overhead-press", "farmer-carry"] },
  { slug: "posterior-chain-builder", title: "Posterior-chain builder", summary: "Train the hips, hamstrings, glutes and upper back with controlled loading.", goal: "strength", durationMinutes: 38, level: "intermediate", equipment: ["Dumbbells"], exerciseSlugs: ["romanian-deadlift", "hip-bridge", "one-arm-row", "dead-bug"] },
  { slug: "upper-body-basics", title: "Upper-body basics", summary: "Straightforward pushing and pulling with scalable beginner movements.", goal: "strength", durationMinutes: 28, level: "beginner", equipment: ["Bodyweight", "Dumbbell"], exerciseSlugs: ["push-up", "one-arm-row", "side-plank"] },
  { slug: "gym-strength-starter", title: "Gym strength starter", summary: "A first gym routine using stable, adjustable resistance exercises.", goal: "strength", durationMinutes: 45, level: "beginner", equipment: ["Cable", "Dumbbells"], exerciseSlugs: ["goblet-squat", "seated-cable-row", "overhead-press", "lat-pulldown"] },
  { slug: "desk-reset", title: "Desk-day reset", summary: "Gentle rotation and hip work to restore comfortable movement.", goal: "mobility", durationMinutes: 12, level: "beginner", equipment: ["Bodyweight"], exerciseSlugs: ["thoracic-rotation", "hip-flexor-mobility", "dead-bug"] },
  { slug: "hips-and-spine", title: "Hips and spine mobility", summary: "A short mobility flow focused on hips, trunk control and upper-back rotation.", goal: "mobility", durationMinutes: 18, level: "beginner", equipment: ["Bodyweight"], exerciseSlugs: ["hip-flexor-mobility", "thoracic-rotation", "hip-bridge"] },
  { slug: "warm-up-flow", title: "Full-body warm-up flow", summary: "Prepare the major joints and movement patterns before a main workout.", goal: "mobility", durationMinutes: 10, level: "beginner", equipment: ["Bodyweight"], exerciseSlugs: ["thoracic-rotation", "bodyweight-squat", "hip-bridge"] },
  { slug: "steady-circuit", title: "Steady full-body circuit", summary: "Alternate simple movements at a sustainable pace without chasing exhaustion.", goal: "conditioning", durationMinutes: 20, level: "beginner", equipment: ["Bodyweight"], exerciseSlugs: ["bodyweight-squat", "push-up", "dead-bug", "hip-bridge"] },
  { slug: "carry-and-core", title: "Carry and core circuit", summary: "Short work blocks for posture, grip and trunk endurance.", goal: "conditioning", durationMinutes: 24, level: "intermediate", equipment: ["Dumbbells"], exerciseSlugs: ["farmer-carry", "goblet-squat", "side-plank"] },
  { slug: "strength-density", title: "Strength density session", summary: "A compact dumbbell circuit that keeps quality high and rest intentional.", goal: "conditioning", durationMinutes: 30, level: "intermediate", equipment: ["Dumbbells"], exerciseSlugs: ["goblet-squat", "one-arm-row", "overhead-press", "farmer-carry"] },
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
