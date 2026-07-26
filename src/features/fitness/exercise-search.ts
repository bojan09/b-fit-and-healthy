import {
  normalizeDiscoveryTitle,
  type DiscoveryExercise,
} from "@/features/discovery/types";

export type ExerciseSearchCriteria = {
  query: string;
  muscle: string;
  equipment: string;
  type: "" | "strength" | "core" | "mobility";
};

const MIN_TYPED_QUERY_LENGTH = 2;
const muscleAliasGroups = [
  ["biceps", "biceps brachii"],
  ["triceps", "triceps brachii"],
  ["quadriceps", "quadriceps femoris", "quads"],
  ["hamstrings", "biceps femoris"],
  ["glutes", "gluteus maximus", "gluteus medius"],
  ["abdominals", "abdominal", "abs", "rectus abdominis"],
] as const;
const equipmentAliasGroups = [
  [
    "bodyweight",
    "body weight",
    "body only",
    "none bodyweight",
    "none bodyweight exercise",
    "none",
  ],
  ["dumbbell", "dumbbells"],
  ["resistance band", "resistance bands", "band", "bands"],
  ["bench", "flat bench", "incline bench", "decline bench"],
  ["cable", "cables", "cable stack", "cable machine"],
] as const;
const resistanceEquipment = new Set([
  "barbell",
  "dumbbell",
  "kettlebell",
  "cable",
  "resistance band",
  "bench",
  "weight plate",
]);

function aliasesFor(
  value: string,
  groups: readonly (readonly string[])[],
) {
  const normalized = normalizeDiscoveryTitle(value);
  return groups.find((aliases) => aliases.includes(normalized)) ?? [normalized];
}

function normalizeEquipment(value: string) {
  const normalized = normalizeDiscoveryTitle(value);
  return aliasesFor(normalized, equipmentAliasGroups)[0] ?? normalized;
}

function exerciseText(item: DiscoveryExercise) {
  return normalizeDiscoveryTitle([
    item.title,
    ...item.primaryMuscles,
    ...item.secondaryMuscles,
    ...item.equipment,
    item.movementPattern ?? "",
  ].join(" "));
}

function matchesMuscle(item: DiscoveryExercise, muscle: string) {
  const selected = normalizeDiscoveryTitle(muscle);
  if (!selected) return true;

  const candidates = aliasesFor(selected, muscleAliasGroups);
  const providerMuscles = [...item.primaryMuscles, ...item.secondaryMuscles]
    .map(normalizeDiscoveryTitle);

  return providerMuscles.some((providerMuscle) =>
    candidates.some((candidate) => providerMuscle === candidate)
  );
}

function isMobilityExercise(item: DiscoveryExercise) {
  return /\b(mobility|stretch|flexibility|warm up|warmup|yoga)\b/u.test(exerciseText(item));
}

function matchesType(item: DiscoveryExercise, type: ExerciseSearchCriteria["type"]) {
  if (!type) return true;

  const text = exerciseText(item);
  if (type === "core") {
    return /\b(core|abdominals?|abdominis|abs)\b/u.test(text);
  }
  if (type === "mobility") return isMobilityExercise(item);

  const equipment = item.equipment.map(normalizeEquipment);
  return !isMobilityExercise(item) && (
    equipment.includes("bodyweight")
    || equipment.some((value) => resistanceEquipment.has(value))
    || /\b(strength|resistance|bodyweight|weight|push|pull|squat|curl|press|extension|row|lunge|plank)\b/u.test(text)
  );
}

function facetFallback(criteria: ExerciseSearchCriteria) {
  return [
    criteria.muscle,
    criteria.equipment,
    criteria.type,
  ].map((value) => value.trim()).find(Boolean) ?? "";
}

export function exerciseTextQuery(criteria: ExerciseSearchCriteria) {
  const query = criteria.query.trim();
  if (query.length < MIN_TYPED_QUERY_LENGTH) return "";

  const normalizedQuery = normalizeDiscoveryTitle(query);
  const duplicatesSelectedFacet = [
    criteria.muscle,
    criteria.equipment,
    criteria.type,
  ].some((value) =>
    value.trim()
    && normalizeDiscoveryTitle(value) === normalizedQuery
  );

  return duplicatesSelectedFacet ? "" : query;
}

export function exerciseProviderSearchTerms(criteria: ExerciseSearchCriteria) {
  const typedQuery = exerciseTextQuery(criteria);
  if (typedQuery) return [normalizeDiscoveryTitle(typedQuery)];

  const terms = [
    ...aliasesFor(criteria.muscle, muscleAliasGroups),
    ...aliasesFor(criteria.equipment, equipmentAliasGroups),
    ...(criteria.type === "core"
      ? ["core", "abdominal", "abs", "plank"]
      : criteria.type === "mobility"
        ? ["mobility", "stretch", "flexibility", "yoga"]
        : []),
  ].map(normalizeDiscoveryTitle).filter(Boolean);

  return [...new Set(terms)];
}

export function effectiveExerciseQuery(criteria: ExerciseSearchCriteria) {
  const typedQuery = criteria.query.trim();
  return typedQuery.length >= MIN_TYPED_QUERY_LENGTH
    ? typedQuery
    : facetFallback(criteria);
}

export function buildExerciseDiscoveryEndpoint(
  criteria: ExerciseSearchCriteria,
) {
  const params = new URLSearchParams();

  if (criteria.query.trim()) params.set("q", criteria.query.trim());
  if (criteria.muscle.trim()) params.set("muscle", criteria.muscle.trim());
  if (criteria.equipment.trim()) params.set("equipment", criteria.equipment.trim());
  if (criteria.type) params.set("type", criteria.type);

  return `/api/discovery/exercises?${params.toString()}`;
}

export function filterConnectedExercises(
  items: readonly DiscoveryExercise[],
  criteria: ExerciseSearchCriteria,
) {
  const query = normalizeDiscoveryTitle(exerciseTextQuery(criteria));
  const equipment = normalizeEquipment(criteria.equipment);

  return items.filter((item) => {
    if (query && !exerciseText(item).includes(query)) return false;
    if (!matchesMuscle(item, criteria.muscle)) return false;
    if (equipment && !item.equipment
      .map(normalizeEquipment)
      .includes(equipment)) return false;

    return matchesType(item, criteria.type);
  });
}
