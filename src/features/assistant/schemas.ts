import { z } from "zod";

const shortText = z.string().trim().min(1).max(120);
const date = z.string().date();
const slug = z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const assistantRequestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  conversationId: z.uuid().optional(),
});

export const mealDraftSchema = z.object({
  kind: z.literal("meal"),
  title: shortText,
  plannedOn: date,
  mealSlot: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  label: z.string().trim().min(2).max(120),
  servings: z.coerce.number().min(0.25).max(20),
});

export const workoutDraftSchema = z.object({
  kind: z.literal("workout"),
  title: shortText,
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500),
  durationMinutes: z.coerce.number().int().min(5).max(180),
  exerciseSlugs: z.array(slug).min(1).max(16),
});

export const habitDraftSchema = z.object({
  kind: z.literal("habit"),
  title: shortText,
  habitTitle: z.string().trim().min(2).max(80),
});

export const recipeDraftSchema = z.object({
  kind: z.literal("recipe"),
  title: shortText,
  slug,
  summary: z.string().trim().min(2).max(500),
  servings: z.coerce.number().int().min(1).max(20),
  prepMinutes: z.coerce.number().int().min(0).max(1440),
  cookMinutes: z.coerce.number().int().min(0).max(1440),
  ingredients: z.array(z.object({
    name: z.string().trim().min(1).max(100),
    quantity: z.coerce.number().positive().max(100000),
    unit: z.string().trim().min(1).max(24),
  })).min(1).max(40),
  steps: z.array(z.string().trim().min(2).max(500)).min(1).max(30),
});

export const summaryDraftSchema = z.object({
  kind: z.literal("summary"),
  title: shortText,
  body: z.string().trim().min(2).max(4000),
});

export const assistantDraftSchema = z.discriminatedUnion("kind", [
  mealDraftSchema,
  workoutDraftSchema,
  habitDraftSchema,
  recipeDraftSchema,
  summaryDraftSchema,
]);

export const assistantMessageIdSchema = z.object({ messageId: z.uuid() });
export const assistantConversationIdSchema = z.object({ conversationId: z.uuid() });

