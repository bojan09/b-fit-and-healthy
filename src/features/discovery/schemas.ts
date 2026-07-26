import { z } from "zod";

const nullableNumber = z.number().finite().nonnegative().nullable();
const sourceUrl = z
  .union([z.url(), z.string().startsWith("/")])
  .nullable();
const base = z.object({
  id: z.string().min(1).max(240),
  provider: z.enum([
    "local",
    "usda",
    "open-food-facts",
    "themealdb",
    "wger",
    "musclewiki",
  ]),
  externalId: z.string().min(1).max(180),
  title: z.string().trim().min(1).max(180),
  normalizedTitle: z.string().max(180),
  sourceUrl,
  attribution: z.string().min(1).max(240),
  retrievedAt: z.iso.datetime(),
  quality: z.enum(["curated", "verified", "community"]),
  completeness: z.array(z.string().max(60)).max(30),
  alternates: z.array(z.string().max(240)).max(30),
});

export const discoveryFoodSchema = base.extend({
  kind: z.literal("food"),
  brand: z.string().max(120).nullable(),
  servingAmount: z.number().positive().max(5000),
  servingUnit: z.string().min(1).max(30),
  energyKcal: nullableNumber,
  proteinG: nullableNumber,
  carbohydrateG: nullableNumber,
  fatG: nullableNumber,
  fibreG: nullableNumber,
  barcode: z.string().max(64).nullable(),
  nutrientBasis: z.enum(["per-100-g", "per-serving"]),
});

export const discoveryRecipeSchema = base.extend({
  kind: z.literal("recipe"),
  category: z.string().max(100).nullable(),
  cuisine: z.string().max(100).nullable(),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1).max(160),
        measure: z.string().max(80),
      }),
    )
    .max(100),
  instructions: z.array(z.string().min(1).max(2000)).max(100),
  servings: z.number().positive().max(100).nullable(),
  totalMinutes: z.number().int().positive().max(1440).nullable(),
  imageUrl: z.url().nullable(),
  nutrition: z
    .object({
      energyKcal: nullableNumber,
      proteinG: nullableNumber,
      carbohydrateG: nullableNumber,
      fatG: nullableNumber,
      fibreG: nullableNumber,
    })
    .nullable(),
});

export const discoveryExerciseSchema = base.extend({
  kind: z.literal("exercise"),
  primaryMuscles: z.array(z.string().max(80)).max(30),
  secondaryMuscles: z.array(z.string().max(80)).max(30),
  equipment: z.array(z.string().max(80)).max(30),
  difficulty: z.string().max(80).nullable(),
  movementPattern: z.string().max(100).nullable(),
  instructions: z.array(z.string().min(1).max(2000)).max(100),
  safety: z.string().max(2000).nullable(),
  media: z
    .array(z.object({ type: z.enum(["image", "video"]), url: z.url() }))
    .max(20),
});

export const discoveryWorkoutSchema = base.extend({
  kind: z.literal("workout"),
  goal: z.string().min(1).max(100),
  durationMinutes: z.number().int().positive().max(600).nullable(),
  difficulty: z.string().max(80).nullable(),
  equipment: z.array(z.string().max(80)).max(30),
  exercises: z
    .array(
      z.object({
        exerciseId: z.string().min(1).max(240),
        title: z.string().min(1).max(180),
        sets: z.number().int().min(1).max(20),
        repMin: z.number().int().min(1).max(1000).nullable(),
        repMax: z.number().int().min(1).max(1000).nullable(),
        durationSeconds: z.number().int().min(1).max(86400).nullable(),
        restSeconds: z.number().int().min(0).max(1800),
      }),
    )
    .max(100),
});

export const discoveryItemSchema = z.discriminatedUnion("kind", [
  discoveryFoodSchema,
  discoveryRecipeSchema,
  discoveryExerciseSchema,
  discoveryWorkoutSchema,
]);

export const discoveryQuerySchema = z.object({
  q: z.string().trim().min(2).max(100).optional(),
  barcode: z.string().trim().regex(/^\d{6,18}$/).optional(),
  source: z.enum(["all", "branded"]).default("all"),
  equipment: z.string().trim().max(80).optional(),
  difficulty: z.string().trim().max(80).optional(),
}).refine((value) => value.q || value.barcode, {
  message: "Enter a query or barcode.",
});

export const discoveryFoodLogSchema = z.object({
  item: z
    .string()
    .transform((value, context) => {
      try {
        return JSON.parse(value) as unknown;
      } catch {
        context.addIssue({ code: "custom", message: "Invalid food data." });
        return z.NEVER;
      }
    })
    .pipe(discoveryFoodSchema),
  loggedOn: z.iso.date(),
  mealSlot: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  amountGrams: z.coerce.number().positive().max(5000),
});
