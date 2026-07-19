import { z } from "zod";

export const addWaterSchema = z.object({ amount: z.coerce.number().min(50).max(5000), units: z.enum(["metric", "imperial"]), loggedAt: z.string().datetime().optional() });
export const deleteWaterSchema = z.object({ id: z.string().uuid() });
export const weightSchema = z.object({ weight: z.coerce.number().positive().max(1500), units: z.enum(["metric", "imperial"]), recordedOn: z.string().date(), note: z.string().trim().max(240).optional() });
export const habitSchema = z.object({ title: z.string().trim().min(2).max(80) });
export const habitCheckinSchema = z.object({ habitId: z.string().uuid(), date: z.string().date(), status: z.enum(["complete", "skipped", "clear"]) });
export const recordIdSchema = z.object({ id: z.string().uuid() });
export const goalSchema = z.object({ kind: z.string().trim().min(2).max(48), target: z.union([z.coerce.number().positive(), z.literal("")]).optional(), unit: z.string().trim().max(24).optional(), endsOn: z.union([z.string().date(), z.literal("")]).optional() });
export const goalStatusSchema = z.object({ id: z.string().uuid(), status: z.enum(["active", "paused", "complete"]) });
