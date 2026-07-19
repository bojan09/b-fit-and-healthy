export type NutrientInput = {
  energyKcal: number;
  proteinG: number;
  carbohydrateG: number;
  fatG: number;
  fibreG: number;
};

const round = (value: number) => Math.round((value + Number.EPSILON) * 10) / 10;

export function buildNutritionTotals(entries: NutrientInput[]): NutrientInput {
  return entries.reduce<NutrientInput>((total, entry) => ({
    energyKcal: round(total.energyKcal + Number(entry.energyKcal || 0)),
    proteinG: round(total.proteinG + Number(entry.proteinG || 0)),
    carbohydrateG: round(total.carbohydrateG + Number(entry.carbohydrateG || 0)),
    fatG: round(total.fatG + Number(entry.fatG || 0)),
    fibreG: round(total.fibreG + Number(entry.fibreG || 0)),
  }), { energyKcal: 0, proteinG: 0, carbohydrateG: 0, fatG: 0, fibreG: 0 });
}

function isoDate(date: Date) { return date.toISOString().slice(0, 10); }

export function weekDates(dateValue: string) {
  const date = new Date(`${dateValue}T12:00:00.000Z`);
  const offset = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - offset);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(date); day.setUTCDate(date.getUTCDate() + index); return isoDate(day);
  });
}

export type GroceryInput = { name: string; quantity: number; unit: string };

export function aggregateGroceryItems(items: GroceryInput[]) {
  const grouped = new Map<string, GroceryInput>();
  for (const item of items) {
    const name = item.name.trim(); const unit = item.unit.trim();
    if (!name || !Number.isFinite(item.quantity) || item.quantity <= 0) continue;
    const key = `${name.toLocaleLowerCase()}::${unit.toLocaleLowerCase()}`;
    const current = grouped.get(key);
    grouped.set(key, { name: current?.name ?? name, quantity: round((current?.quantity ?? 0) + item.quantity), unit: current?.unit ?? unit });
  }
  return [...grouped.values()];
}

export function scalePerHundred(value: number, grams: number) {
  return round(Math.max(0, value) * Math.max(0, grams) / 100);
}
