"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, getCurrentAppwriteUser } from "@/lib/appwrite/server";
import { exercises as curatedExercises } from "@/features/fitness/catalogue";
import { assistantDraftSchema, assistantMessageIdSchema } from "@/features/assistant/schemas";
import { claimDraftApplication, deleteConversation, dismissDraft, getOwnedDraftMessage, releaseDraftApplication } from "@/features/assistant/repository";
import { recipeRows, workoutTemplateRow } from "@/features/assistant/draft-application";
import type { AuthActionState } from "@/features/auth/types";

const error = (message: string): AuthActionState => ({ status: "error", message });
const success = (message: string): AuthActionState => ({ status: "success", message });

async function authorized() {
  const appwrite = await createClient();
  const user = await getCurrentAppwriteUser();
  if (!user) redirect("/sign-in");
  return { appwrite, user };
}

export async function applyAssistantDraftAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const id = assistantMessageIdSchema.safeParse(Object.fromEntries(formData));
  if (!id.success) return error("This draft is invalid.");
  const { appwrite, user } = await authorized();
  const stored = await getOwnedDraftMessage(user.id, id.data.messageId);
  if (!stored?.draft || stored.applied_at) return error("This draft is unavailable or has already been applied.");
  const parsed = assistantDraftSchema.safeParse(stored.draft);
  if (!parsed.success) return error("This draft is no longer valid.");
  if (parsed.data.kind === "summary") return success("This summary is informational and does not change your records.");

  const claimed = await claimDraftApplication(user.id, id.data.messageId);
  if (!claimed) return error("This draft has already been applied.");
  try {
    if (parsed.data.kind === "meal") {
      const result = await appwrite.table("meal_plan_items").insert({
        user_id: user.id,
        planned_on: parsed.data.plannedOn,
        meal_slot: parsed.data.mealSlot,
        label: parsed.data.label,
        servings: parsed.data.servings,
      });
      if (result.error) throw new Error("meal");
      revalidatePath("/meal-planner");
      revalidatePath("/today");
      return success("Meal added to your planner.");
    }

    if (parsed.data.kind === "habit") {
      const result = await appwrite.table("habits").insert({ user_id: user.id, title: parsed.data.habitTitle });
      if (result.error) throw new Error("habit");
      revalidatePath("/habits");
      revalidatePath("/today");
      return success("Habit added.");
    }

    if (parsed.data.kind === "workout") {
      const exerciseSlugs = parsed.data.exerciseSlugs;
      const bySlug = new Map(curatedExercises.filter((exercise) => exerciseSlugs.includes(exercise.slug)).map((exercise) => [exercise.slug, exercise.id]));
      if (parsed.data.exerciseSlugs.some((slug) => !bySlug.has(slug))) throw new Error("workout");
      const template = await appwrite.table("workout_templates").insert(workoutTemplateRow(parsed.data, user.id)).select("id").single();
      if (template.error || !template.data) throw new Error("workout");
      const rows = parsed.data.exerciseSlugs.map((slug, position) => ({
        user_id: user.id,
        template_id: template.data.id,
        exercise_id: bySlug.get(slug)!,
        position,
        target_sets: 3,
        rep_min: 8,
        rep_max: 12,
        rest_seconds: 90,
      }));
      const exercises = await appwrite.table("workout_template_exercises").insert(rows);
      if (exercises.error) {
        await appwrite.table("workout_template_exercises").delete().eq("template_id", template.data.id).eq("user_id", user.id);
        await appwrite.table("workout_templates").delete().eq("id", template.data.id).eq("user_id", user.id);
        throw new Error("workout");
      }
      revalidatePath("/workouts");
      revalidatePath("/training");
      return success("Workout saved to your templates.");
    }

    const rows = recipeRows(parsed.data, user.id, id.data.messageId.slice(0, 8));
    const recipe = await appwrite.table("recipes").insert(rows.recipe).select("id").single();
    if (recipe.error || !recipe.data) throw new Error("recipe");
    const [ingredients, steps] = await Promise.all([
      appwrite.table("recipe_ingredients").insert(rows.ingredients.map((item) => ({ ...item, recipe_id: recipe.data.id }))),
      appwrite.table("recipe_steps").insert(rows.steps.map((item) => ({ ...item, recipe_id: recipe.data.id }))),
    ]);
    if (ingredients.error || steps.error) {
      await appwrite.table("recipe_ingredients").delete().eq("recipe_id", recipe.data.id);
      await appwrite.table("recipe_steps").delete().eq("recipe_id", recipe.data.id);
      await appwrite.table("recipes").delete().eq("id", recipe.data.id).eq("owner_id", user.id);
      throw new Error("recipe");
    }
    revalidatePath("/recipes");
    return success("Recipe saved privately.");
  } catch {
    await releaseDraftApplication(user.id, id.data.messageId);
    return error("The draft could not be applied. Your existing records were not changed.");
  }
}

export async function deleteAssistantConversationAction(formData: FormData) {
  const parsed = assistantMessageIdSchema.shape.messageId.safeParse(formData.get("conversationId"));
  if (!parsed.success) return;
  const { user } = await authorized();
  await deleteConversation(user.id, parsed.data);
  revalidatePath("/assistant");
  redirect("/assistant");
}

export async function dismissAssistantDraftAction(formData: FormData) {
  const parsed = assistantMessageIdSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const { user } = await authorized();
  await dismissDraft(user.id, parsed.data.messageId);
  revalidatePath("/assistant");
}
