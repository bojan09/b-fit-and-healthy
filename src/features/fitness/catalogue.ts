export type Exercise = {
  id: string; slug: string; titleEn: string; titleMk: string; summaryEn: string; summaryMk: string;
  equipment: string[]; difficulty: "beginner" | "intermediate"; movementPattern: string; exerciseType: "strength" | "mobility" | "core";
  primaryMuscles: string[]; secondaryMuscles: string[]; instructionsEn: string[]; instructionsMk: string[];
  mistakesEn: string[]; mistakesMk: string[]; safetyEn: string; safetyMk: string; homeFriendly: boolean;
};

const make = (slug: string, titleEn: string, titleMk: string, summaryEn: string, summaryMk: string, equipment: string[], movementPattern: string, exerciseType: Exercise["exerciseType"], primaryMuscles: string[], homeFriendly = true): Exercise => ({
  id: slug, slug, titleEn, titleMk, summaryEn, summaryMk, equipment, difficulty: "beginner", movementPattern, exerciseType, primaryMuscles, secondaryMuscles: [], homeFriendly,
  instructionsEn: ["Set a stable starting position and brace gently.", "Move with control through a comfortable range.", "Finish the repetition without rushing."],
  instructionsMk: ["Поставете се стабилно и нежно затегнете го трупот.", "Движете се контролирано низ удобен опсег.", "Завршете го повторувањето без брзање."],
  mistakesEn: ["Rushing the range of motion", "Losing a stable trunk position"], mistakesMk: ["Пребрзо движење", "Губење стабилна положба на трупот"],
  safetyEn: "Stop if you feel sharp pain, dizziness, or loss of control.", safetyMk: "Застанете ако почувствувате остра болка, вртоглавица или губење контрола.",
});

export const exercises: Exercise[] = [
  make("bodyweight-squat", "Bodyweight squat", "Чучнување со сопствена тежина", "Build lower-body control and everyday leg strength.", "Развијте контрола и сила во долниот дел од телото.", ["Bodyweight"], "squat", "strength", ["quadriceps", "glutes"]),
  make("goblet-squat", "Goblet squat", "Пехар чучнување", "A front-loaded squat that encourages an upright torso.", "Чучнување со предно оптоварување за исправен труп.", ["Dumbbell"], "squat", "strength", ["quadriceps", "glutes"]),
  make("romanian-deadlift", "Romanian deadlift", "Романско мртво кревање", "Train the hip hinge and posterior chain.", "Тренирајте го движењето од колк и задниот синџир.", ["Dumbbells"], "hinge", "strength", ["hamstrings", "glutes"], false),
  make("hip-bridge", "Hip bridge", "Мост со колкови", "A floor-based glute exercise with a small footprint.", "Вежба на под за глутеус со малку простор.", ["Bodyweight"], "hinge", "strength", ["glutes"]),
  make("push-up", "Push-up", "Склек", "Develop pushing strength with scalable body angles.", "Развијте сила на туркање со прилагодлив агол.", ["Bodyweight"], "horizontal-push", "strength", ["chest", "triceps", "front-delts"]),
  make("dumbbell-bench-press", "Dumbbell bench press", "Потисок со тегови на клупа", "Independent-arm chest pressing for strength and control.", "Потисок за гради со независна работа на рацете.", ["Dumbbells", "Bench"], "horizontal-push", "strength", ["chest", "triceps"], false),
  make("overhead-press", "Overhead press", "Потисок над глава", "Build controlled overhead strength.", "Изградете контролирана сила над глава.", ["Dumbbells"], "vertical-push", "strength", ["shoulders", "triceps"]),
  make("one-arm-row", "One-arm row", "Веслање со една рака", "Train the upper back one side at a time.", "Тренирајте го горниот грб еднострано.", ["Dumbbell"], "horizontal-pull", "strength", ["lats", "mid-back"]),
  make("seated-cable-row", "Seated cable row", "Седечко веслање на кабел", "A stable horizontal pull for the middle back.", "Стабилно хоризонтално влечење за средниот грб.", ["Cable"], "horizontal-pull", "strength", ["mid-back", "lats"], false),
  make("lat-pulldown", "Lat pulldown", "Лат повлекување", "Build vertical pulling strength with an adjustable load.", "Изградете сила на вертикално влечење.", ["Cable"], "vertical-pull", "strength", ["lats", "biceps"], false),
  make("farmer-carry", "Farmer carry", "Фармерско носење", "Train grip, posture, and whole-body bracing.", "Тренирајте стисок, држење и стабилност.", ["Dumbbells"], "carry", "strength", ["forearms", "core"]),
  make("dead-bug", "Dead bug", "Мртва бубачка", "Practice trunk control while the limbs move.", "Вежбајте контрола на трупот додека се движат екстремитетите.", ["Bodyweight"], "anti-extension", "core", ["abdominals"]),
  make("side-plank", "Side plank", "Страничен планк", "Develop lateral trunk endurance.", "Развијте странична издржливост на трупот.", ["Bodyweight"], "anti-lateral-flexion", "core", ["obliques"]),
  make("thoracic-rotation", "Thoracic rotation", "Торакална ротација", "Explore comfortable upper-back rotation.", "Истражете удобна ротација на горниот грб.", ["Bodyweight"], "rotation", "mobility", ["thoracic-spine"]),
  make("hip-flexor-mobility", "Hip-flexor mobility", "Мобилност на флексорите на колкот", "Restore a comfortable hip-extension position.", "Подобрете ја удобната екстензија на колкот.", ["Bodyweight"], "mobility", "mobility", ["hip-flexors"]),
];

export const equipmentOptions = [...new Set(exercises.flatMap((exercise) => exercise.equipment))].sort();
export const movementOptions = [...new Set(exercises.map((exercise) => exercise.movementPattern))].sort();
export const getExercise = (slug: string) => exercises.find((exercise) => exercise.slug === slug);
