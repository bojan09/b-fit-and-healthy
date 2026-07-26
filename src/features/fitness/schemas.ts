import { z } from "zod";

export const uuidSchema = z.uuid();

export const workoutPrescriptionSchema = z.object({
  exerciseSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sets: z.number().int().min(1).max(20),
  repMin: z.number().int().min(1).max(1000).nullable(),
  repMax: z.number().int().min(1).max(1000).nullable(),
  durationSeconds: z.number().int().min(1).max(3600).nullable(),
  restSeconds: z.number().int().min(0).max(1800),
}).refine(
  (row) =>
    row.durationSeconds !== null
    || (
      row.repMin !== null
      && row.repMax !== null
      && row.repMin <= row.repMax
    ),
  { message: "Use either a duration or a valid repetition range." },
);

const prescriptionListSchema = z
  .string()
  .transform((value, context): unknown => {
    try {
      return JSON.parse(value);
    } catch {
      context.addIssue({
        code: "custom",
        message: "Workout prescriptions must be valid JSON.",
      });
      return z.NEVER;
    }
  })
  .pipe(z.array(workoutPrescriptionSchema).min(1).max(30));

export const templateSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500).default(""),
  duration: z.coerce.number().int().min(5).max(300),
  prescriptions: prescriptionListSchema,
});

export const scheduleSchema = z.object({
  templateId: z.uuid(),
  plannedOn: z.iso.date(),
});

export const setSchema = z.object({
  setId: z.uuid(),
  sessionId: z.uuid(),
  reps: z.coerce.number().int().min(0).max(1000).optional(),
  loadKg: z.coerce.number().min(0).max(10000).optional(),
  rpe: z.union([
    z.literal(""),
    z.coerce.number().min(1).max(10).multipleOf(0.5),
  ]).optional(),
  bodyweight: z.string().optional(),
  complete: z.string().optional(),
});
