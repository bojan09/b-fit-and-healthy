import {
  normalizeDiscoveryTitle,
  type DiscoveryContext,
  type DiscoveryItem,
} from "@/features/discovery/types";

function materialKey(item: DiscoveryItem) {
  if (item.kind === "food") {
    if (item.barcode) return `food:barcode:${item.barcode}`;
    return `food:${item.normalizedTitle}:${normalizeDiscoveryTitle(item.brand ?? "")}`;
  }
  if (item.kind === "recipe") {
    return `recipe:${item.normalizedTitle}:${item.ingredients
      .slice(0, 3)
      .map((ingredient) => normalizeDiscoveryTitle(ingredient.name))
      .join("|")}`;
  }
  if (item.kind === "exercise") {
    return `exercise:${item.normalizedTitle}:${[...item.primaryMuscles]
      .sort()
      .join("|")}:${[...item.equipment].sort().join("|")}`;
  }
  return `workout:${item.normalizedTitle}:${item.goal}:${item.exercises.length}`;
}

function score(item: DiscoveryItem, context: DiscoveryContext) {
  const query = normalizeDiscoveryTitle(context.query);
  let value = 0;
  if (item.normalizedTitle === query) value += 1_000;
  else if (item.normalizedTitle.startsWith(query)) value += 600;
  else if (item.normalizedTitle.includes(query)) value += 300;
  if (item.provider === "local") value += 90;
  if (item.quality === "verified") value += 40;
  if (item.quality === "curated") value += 50;
  value += item.completeness.length * 3;
  if (context.recentIds?.includes(item.id)) value += 25;
  if (
    context.difficulty &&
    "difficulty" in item &&
    item.difficulty === context.difficulty
  ) {
    value += 20;
  }
  if (
    context.equipment?.length &&
    "equipment" in item &&
    item.equipment.some((entry) => context.equipment?.includes(entry))
  ) {
    value += 20;
  }
  if (
    context.activeGoals?.some((goal) =>
      `${item.title} ${"goal" in item ? item.goal : ""}`
        .toLocaleLowerCase()
        .includes(goal.toLocaleLowerCase()),
    )
  ) {
    value += 15;
  }
  return value;
}

function choosePrimary(current: DiscoveryItem, candidate: DiscoveryItem) {
  const priority = (item: DiscoveryItem) =>
    (item.provider === "local" ? 100 : 0) +
    (item.quality === "curated" ? 30 : item.quality === "verified" ? 20 : 0) +
    item.completeness.length;
  return priority(candidate) > priority(current) ? candidate : current;
}

export function mergeAndRank<T extends DiscoveryItem>(
  items: readonly T[],
  context: DiscoveryContext,
): T[] {
  const groups = new Map<string, T>();

  for (const item of items) {
    const normalized = {
      ...item,
      normalizedTitle:
        item.normalizedTitle || normalizeDiscoveryTitle(item.title),
      alternates: [...item.alternates],
    } as T;
    const key = materialKey(normalized);
    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, normalized);
      continue;
    }

    const primary = choosePrimary(existing, normalized) as T;
    const alternate = primary.id === existing.id ? normalized : existing;
    groups.set(key, {
      ...primary,
      alternates: [...new Set([...primary.alternates, alternate.id])],
    });
  }

  return [...groups.values()].sort((left, right) => {
    const scoreDifference = score(right, context) - score(left, context);
    return scoreDifference || left.id.localeCompare(right.id);
  });
}
