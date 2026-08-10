import type { CatalogueMedia } from "@/features/media/catalogue-media";
import { exerciseMedia } from "@/features/fitness/exercise-media";

export type Exercise = {
  id: string; slug: string; titleEn: string; titleMk: string; summaryEn: string; summaryMk: string;
  equipment: string[]; difficulty: "beginner" | "intermediate"; movementPattern: string; exerciseType: "strength" | "mobility" | "core";
  primaryMuscles: string[]; secondaryMuscles: string[]; instructionsEn: string[]; instructionsMk: string[];
  mistakesEn: string[]; mistakesMk: string[]; safetyEn: string; safetyMk: string; homeFriendly: boolean; media: CatalogueMedia;
};

const make = (slug: string, titleEn: string, titleMk: string, summaryEn: string, summaryMk: string, equipment: string[], movementPattern: string, exerciseType: Exercise["exerciseType"], primaryMuscles: string[], homeFriendly = true, difficulty: Exercise["difficulty"] = "beginner"): Exercise => ({
  id: slug, slug, titleEn, titleMk, summaryEn, summaryMk, equipment, difficulty, movementPattern, exerciseType, primaryMuscles, secondaryMuscles: [], homeFriendly, media: exerciseMedia[slug],
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

exercises.push(
  make("reverse-lunge", "Reverse lunge", "Reverse lunge", "Build single-leg strength with a stable backward step.", "Build single-leg strength with a stable backward step.", ["Dumbbells"], "lunge", "strength", ["quadriceps", "glutes"]),
  make("split-squat", "Split squat", "Split squat", "Train each leg through a controlled, stationary stance.", "Train each leg through a controlled, stationary stance.", ["Dumbbells"], "lunge", "strength", ["quadriceps", "glutes"], false),
  make("standing-calf-raise", "Standing calf raise", "Standing calf raise", "Build ankle strength and calf endurance with a simple rise.", "Build ankle strength and calf endurance with a simple rise.", ["Machine"], "ankle-extension", "strength", ["calves"]),
  make("incline-push-up", "Incline push-up", "Incline push-up", "Scale the push-up with a higher hand position.", "Scale the push-up with a higher hand position.", ["Bodyweight"], "horizontal-push", "strength", ["chest", "triceps", "front-delts"]),
  make("pike-push-up", "Pike push-up", "Pike push-up", "A bodyweight overhead press variation for shoulder strength.", "A bodyweight overhead press variation for shoulder strength.", ["Bodyweight"], "vertical-push", "strength", ["shoulders", "triceps"]),
  make("lateral-raise", "Dumbbell lateral raise", "Dumbbell lateral raise", "Train the side delts with a light, controlled arc.", "Train the side delts with a light, controlled arc.", ["Dumbbells"], "shoulder-abduction", "strength", ["side-delts"]),
  make("biceps-curl", "Dumbbell biceps curl", "Dumbbell biceps curl", "Build elbow-flexion strength without swinging the torso.", "Build elbow-flexion strength without swinging the torso.", ["Dumbbells"], "elbow-flexion", "strength", ["biceps"]),
  make("overhead-triceps-extension", "Overhead triceps extension", "Overhead triceps extension", "Train the triceps through a comfortable overhead range.", "Train the triceps through a comfortable overhead range.", ["Dumbbell"], "elbow-extension", "strength", ["triceps"]),
  make("band-pull-apart", "Band pull-apart", "Band pull-apart", "Practice shoulder-blade control and upper-back endurance.", "Practice shoulder-blade control and upper-back endurance.", ["Band"], "horizontal-pull", "strength", ["rear-delts", "mid-back"]),
  make("assisted-pull-up", "Assisted pull-up", "Assisted pull-up", "Learn vertical pulling with support you can gradually reduce.", "Learn vertical pulling with support you can gradually reduce.", ["Band"], "vertical-pull", "strength", ["lats", "biceps"], false),
  make("bird-dog", "Bird dog", "Bird dog", "Coordinate opposite limbs while keeping the trunk quiet.", "Coordinate opposite limbs while keeping the trunk quiet.", ["Bodyweight"], "anti-rotation", "core", ["abdominals", "glutes"]),
  make("front-plank", "Front plank", "Front plank", "Develop whole-trunk endurance in a scalable position.", "Develop whole-trunk endurance in a scalable position.", ["Bodyweight"], "anti-extension", "core", ["abdominals"]),
  make("pallof-press", "Pallof press", "Pallof press", "Resist trunk rotation with a cable or resistance band.", "Resist trunk rotation with a cable or resistance band.", ["Band"], "anti-rotation", "core", ["obliques"], false),
  make("cat-cow", "Cat-cow", "Cat-cow", "Move the spine gently between comfortable flexion and extension.", "Move the spine gently between comfortable flexion and extension.", ["Bodyweight"], "spinal-mobility", "mobility", ["spine"]),
  make("ankle-rock", "Knee-to-wall ankle rock", "Knee-to-wall ankle rock", "Explore ankle dorsiflexion while keeping the heel grounded.", "Explore ankle dorsiflexion while keeping the heel grounded.", ["Bodyweight"], "ankle-mobility", "mobility", ["calves"]),
);

exercises.push(
  make("barbell-squat", "Barbell squat", "Чучнување со шипка", "Build full-body strength with a stable back-loaded squat.", "Развијте сила на целото тело со стабилно чучнување со шипка на грб.", ["Barbell"], "squat", "strength", ["quadriceps", "glutes"], false, "intermediate"),
  make("front-squat", "Front squat", "Предно чучнување", "Use a front rack to challenge the legs and upright trunk.", "Користете предно држење за поголем предизвик на нозете и исправен труп.", ["Barbell"], "squat", "strength", ["quadriceps", "glutes"], false, "intermediate"),
  make("step-up", "Step-up", "Качување на кутија", "Develop single-leg strength by stepping onto a stable box.", "Развијте сила на една нога со качување на стабилна кутија.", ["Dumbbells"], "squat", "strength", ["quadriceps", "glutes"], false),
  make("walking-lunge", "Walking lunge", "Одење со исчекори", "Link alternating lunges into controlled forward travel.", "Поврзете наизменични исчекори во контролирано движење напред.", ["Bodyweight"], "squat", "strength", ["quadriceps", "glutes"]),
  make("leg-press", "Leg press", "Потисок со нозе", "Train the legs with a guided machine pressing path.", "Тренирајте ги нозете со водена патека на машина.", ["Machine"], "squat", "strength", ["quadriceps", "glutes"], false, "intermediate"),
  make("conventional-deadlift", "Conventional deadlift", "Класично мртво кревање", "Lift a barbell from the floor with a coordinated hip hinge.", "Кренете шипка од под со координирано движење од колковите.", ["Barbell"], "hinge", "strength", ["hamstrings", "glutes", "back"], false, "intermediate"),
  make("kettlebell-deadlift", "Kettlebell deadlift", "Мртво кревање со кетлбел", "Learn a compact hip hinge with the load between the feet.", "Научете компактно наведнување од колковите со товар меѓу стапалата.", ["Kettlebell"], "hinge", "strength", ["hamstrings", "glutes"]),
  make("hip-thrust", "Hip thrust", "Потисок со колкови", "Train strong hip extension with the upper back supported.", "Тренирајте силно испружување на колковите со потпрен горен грб.", ["Barbell", "Bench"], "hinge", "strength", ["glutes", "hamstrings"], false, "intermediate"),
  make("hamstring-curl", "Hamstring curl", "Виткање за задни ложи", "Isolate knee flexion on a supported machine.", "Изолирајте го виткањето на коленото на потпрена машина.", ["Machine"], "hinge", "strength", ["hamstrings"], false),
  make("barbell-bench-press", "Barbell bench press", "Потисок со шипка на клупа", "Build horizontal pressing strength with a barbell.", "Развијте сила на хоризонтален потисок со шипка.", ["Barbell", "Bench"], "horizontal-push", "strength", ["chest", "triceps"], false, "intermediate"),
  make("cable-chest-press", "Cable chest press", "Кабелски потисок за гради", "Press independently against continuous cable resistance.", "Потиснувајте независно против постојан отпор од кабли.", ["Cable"], "horizontal-push", "strength", ["chest", "triceps"], false),
  make("chest-fly", "Chest fly", "Разлетување за гради", "Train chest adduction through a controlled wide arc.", "Тренирајте ги градите низ контролиран широк лак.", ["Dumbbells", "Bench"], "horizontal-push", "strength", ["chest"], false),
  make("pull-up", "Pull-up", "Згиб", "Lift the body to a bar with vertical pulling strength.", "Подигнете го телото кон вратило со вертикално влечење.", ["Bodyweight"], "vertical-pull", "strength", ["lats", "biceps"], false, "intermediate"),
  make("chest-supported-row", "Chest-supported row", "Веслање со потпрени гради", "Train the upper back while an incline bench supports the torso.", "Тренирајте го горниот грб додека накосена клупа го потпира трупот.", ["Dumbbells", "Bench"], "horizontal-pull", "strength", ["mid-back", "lats"], false),
  make("face-pull", "Face pull", "Влечење кон лице", "Train rear shoulders and shoulder-blade control with a cable.", "Тренирајте ги задните раменици и контролата на лопатките со кабел.", ["Cable"], "horizontal-pull", "strength", ["rear-delts", "mid-back"], false),
  make("landmine-press", "Landmine press", "Лендмајн потисок", "Press on an angled path that can be friendlier to the shoulder.", "Потиснувајте по коса патека што може да биде попријатна за рамото.", ["Barbell"], "vertical-push", "strength", ["shoulders", "triceps"], false, "intermediate"),
  make("machine-shoulder-press", "Machine shoulder press", "Потисок за раменици на машина", "Use a guided overhead press for stable shoulder training.", "Користете воден потисок над глава за стабилен тренинг на рамениците.", ["Machine"], "vertical-push", "strength", ["shoulders", "triceps"], false),
  make("rear-delt-fly", "Rear-delt fly", "Разлетување за задно рамо", "Move the arms outward to train the rear shoulders.", "Движете ги рацете нанадвор за да ги тренирате задните раменици.", ["Dumbbells"], "horizontal-pull", "strength", ["rear-delts", "mid-back"], false),
  make("hammer-curl", "Hammer curl", "Чекан-свиткување", "Curl with a neutral grip for the elbow flexors and forearms.", "Виткајте со неутрален фат за лактите и подлактиците.", ["Dumbbells"], "horizontal-pull", "strength", ["biceps", "forearms"]),
  make("cable-triceps-press-down", "Cable triceps press-down", "Кабелски потисок за трицепс", "Extend the elbows against steady cable resistance.", "Испружете ги лактите против постојан отпор од кабел.", ["Cable"], "horizontal-push", "strength", ["triceps"], false),
  make("kettlebell-carry", "Kettlebell carry", "Носење кетлбели", "Walk with balanced loads to train grip and posture.", "Одете со рамномерни товари за да тренирате стисок и држење.", ["Kettlebell"], "carry", "strength", ["forearms", "core"]),
  make("suitcase-carry", "Suitcase carry", "Еднострано носење товар", "Carry one load while resisting sideways trunk lean.", "Носете еден товар и спротивставете се на странично навалување.", ["Kettlebell"], "carry", "core", ["obliques", "forearms"]),
  make("hollow-hold", "Hollow hold", "Шупливо задржување", "Hold the trunk in controlled flexion with long limbs.", "Задржете го трупот во контролирано свиткување со испружени екстремитети.", ["Bodyweight"], "anti-extension", "core", ["abdominals"], false, "intermediate"),
  make("reverse-crunch", "Reverse crunch", "Обратно стомачно свиткување", "Curl the pelvis toward the ribs without momentum.", "Подвиткајте ја карлицата кон ребрата без замав.", ["Bodyweight"], "spinal-flexion", "core", ["abdominals"]),
  make("cable-chop", "Cable chop", "Дијагонално влечење со кабел", "Guide resistance diagonally while controlling trunk rotation.", "Водете го отпорот дијагонално со контролирана ротација на трупот.", ["Cable"], "rotation", "core", ["obliques"], false, "intermediate"),
  make("shoulder-wall-slide", "Shoulder wall slide", "Лизгање за раменици на ѕид", "Practice overhead shoulder motion with feedback from a wall.", "Вежбајте движење на рамениците над глава со поддршка од ѕид.", ["Bodyweight"], "mobility", "mobility", ["shoulders"]),
  make("90-90-hip-switch", "90/90 hip switch", "Промена 90/90 за колкови", "Rotate between seated hip positions with controlled range.", "Ротирајте меѓу седечки положби за колкови со контролиран опсег.", ["Bodyweight"], "mobility", "mobility", ["hips"]),
  make("calf-mobility", "Calf mobility", "Мобилност на листовите", "Explore calf length and ankle motion with the heel grounded.", "Истражете ја должината на листот и движењето на глуждот со петата на под.", ["Bodyweight"], "mobility", "mobility", ["calves"]),
  make("childs-pose-reach", "Child's-pose reach", "Детска положба со истегнување", "Reach long through the arms while settling the hips back.", "Испружете ги рацете напред додека колковите се движат наназад.", ["Bodyweight"], "mobility", "mobility", ["lats", "spine"]),
  make("deep-squat-hold", "Deep squat hold", "Задржување во длабоко чучнување", "Use a supported bottom position to explore hip and ankle range.", "Користете ја долната положба за да го истражите опсегот на колковите и глуждовите.", ["Bodyweight"], "mobility", "mobility", ["hips", "calves"]),
);

exercises.push(
  make("barbell-row", "Barbell row", "Веслање со шипка", "Bend at the hips and row a loaded barbell into the torso.", "Наведнете се од колковите и веслајте оптоварена шипка кон трупот.", ["Barbell"], "horizontal-pull", "strength", ["mid-back", "lats"], false, "intermediate"),
  make("v-bar-pulldown", "V-bar lat pulldown", "Лат повлекување со В-рачка", "A close, neutral-grip pulldown that emphasizes the lower lats.", "Тесно повлекување со неутрален фат кое ги нагласува долните лати.", ["Cable"], "vertical-pull", "strength", ["lats", "biceps"], false),
  make("dumbbell-pullover", "Dumbbell pullover", "Пулбек со тег", "Move a single dumbbell overhead in an arc to train the chest and lats.", "Движете еден тег над глава во лак за да ги тренирате градите и латите.", ["Dumbbell", "Bench"], "horizontal-pull", "strength", ["lats", "chest"], false),
  make("band-chest-press", "Band chest press", "Потисок за гради со лента", "Press a resistance band forward from a staggered stance.", "Турнете еластична лента напред од расчекорен став.", ["Band"], "horizontal-push", "strength", ["chest", "triceps"]),
  make("triceps-kickback", "Triceps kickback", "Трицепс изопнување наназад", "Extend the elbow behind the body to isolate the triceps.", "Испружете го лактот зад телото за да го изолирате трицепсот.", ["Dumbbell"], "elbow-extension", "strength", ["triceps"]),
  make("lying-triceps-extension", "Lying triceps extension", "Лежечко изопнување за трицепс", "Lower a dumbbell toward the forehead while lying on a bench.", "Спуштајте тег кон челото лежејќи на клупа.", ["Dumbbells", "Bench"], "elbow-extension", "strength", ["triceps"], false),
  make("cable-rope-overhead-extension", "Cable rope overhead extension", "Кабелско изопнување над глава со јаже", "Extend a cable rope overhead to load the triceps through a long range.", "Испружете кабелско јаже над глава за да го оптоварите трицепсот низ долг опсег.", ["Cable"], "elbow-extension", "strength", ["triceps"], false),
  make("reverse-curl", "Reverse curl", "Обратно свиткување", "Curl with an overhand grip to train the forearms and biceps.", "Виткајте со надворешен фат за да ги тренирате подлактиците и бицепсот.", ["Dumbbells"], "elbow-flexion", "strength", ["biceps", "forearms"]),
  make("barbell-overhead-press", "Barbell overhead press", "Потисок над глава со шипка", "Press a loaded barbell from the shoulders to lockout overhead.", "Потиснувајте оптоварена шипка од рамениците до целосно испружување над глава.", ["Barbell"], "vertical-push", "strength", ["shoulders", "triceps"], false, "intermediate"),
  make("upright-row", "Upright row", "Веслање исправено", "Pull a load vertically along the body to the collarbone height.", "Влечете товар вертикално долж телото до висина на клучната коска.", ["Dumbbells"], "vertical-pull", "strength", ["side-delts", "traps"]),
  make("arnold-press", "Arnold press", "Арнолд потисок", "Rotate the dumbbells while pressing overhead for full shoulder coverage.", "Ротирајте ги теговите додека потиснувате над глава за целосна работа на рамото.", ["Dumbbells"], "vertical-push", "strength", ["shoulders", "triceps"], true, "intermediate"),
  make("ab-wheel-rollout", "Ab wheel rollout", "Ролање со тркало за стомак", "Roll a wheel forward from the knees while keeping the trunk braced.", "Ролајте тркало напред од колена додека трупот е стабилен и затегнат.", ["Ab wheel"], "anti-extension", "core", ["abdominals"], true, "intermediate"),
);

export const equipmentOptions = [...new Set(exercises.flatMap((exercise) => exercise.equipment))].sort();
export const movementOptions = [...new Set(exercises.map((exercise) => exercise.movementPattern))].sort();
export const muscleOptions = [...new Set(exercises.flatMap((exercise) => exercise.primaryMuscles))].sort();
export const getExercise = (slug: string) => exercises.find((exercise) => exercise.slug === slug);
