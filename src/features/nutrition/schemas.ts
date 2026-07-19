import { z } from "zod";
const numberField = z.coerce.number().finite().min(0).max(100000);
const slot = z.enum(["breakfast", "lunch", "dinner", "snack"]);
export const mealEntrySchema = z.object({ loggedOn: z.iso.date(), mealSlot: slot, foodId: z.uuid().optional().or(z.literal("")), foodName: z.string().trim().min(2).max(160), amountGrams: z.coerce.number().positive().max(5000), energyKcal: numberField, proteinG: numberField, carbohydrateG: numberField, fatG: numberField, fibreG: numberField });
export const customFoodSchema = z.object({ name: z.string().trim().min(2).max(160), servingGrams: z.coerce.number().positive().max(5000), energyKcal: numberField, proteinG: numberField, carbohydrateG: numberField, fatG: numberField, fibreG: numberField });
export const planItemSchema = z.object({ plannedOn: z.iso.date(), mealSlot: slot, recipeId: z.uuid().optional().or(z.literal("")), label: z.string().trim().min(2).max(160), servings: z.coerce.number().positive().max(50) });
export const groceryItemSchema = z.object({ name: z.string().trim().min(1).max(160), quantity: z.union([z.coerce.number().positive().max(100000), z.literal("")]).optional(), unit: z.string().trim().max(30).optional(), category: z.string().trim().min(1).max(60) });
export const idSchema = z.object({ id: z.uuid() });
