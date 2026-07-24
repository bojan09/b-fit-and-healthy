import { z } from "zod";
export const uuidSchema = z.uuid();
export const templateSchema = z.object({ name: z.string().trim().min(1).max(80), description: z.string().trim().max(500).default(""), duration: z.coerce.number().int().min(5).max(300), exerciseSlugs: z.string().min(1) });
export const scheduleSchema = z.object({ templateId: z.uuid(), plannedOn: z.iso.date() });
export const setSchema = z.object({ setId: z.uuid(), sessionId: z.uuid(), reps: z.coerce.number().int().min(0).max(1000).optional(), loadKg: z.coerce.number().min(0).max(10000).optional(), rpe: z.union([z.literal(""), z.coerce.number().min(1).max(10).multipleOf(.5)]).optional(), bodyweight: z.string().optional(), complete: z.string().optional() });
