"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { scheduleSchema, setSchema, templateSchema, uuidSchema } from "@/features/fitness/schemas";
import { discoveryWorkoutSchema } from "@/features/discovery/schemas";
import type { AuthActionState } from "@/features/auth/types";
import type { DiscoveryExercise } from "@/features/discovery/types";

async function authorized() { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/sign-in"); return { supabase, user }; }
const refresh = () => ["/today","/training","/training/planner","/workouts","/workout-history","/personal-records"].forEach((path) => revalidatePath(path));

export async function createTemplateAction(formData: FormData) {
  const parsed = templateSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) redirect("/workouts/new?error=invalid");
  const { supabase, user } = await authorized(); const template = await supabase.from("workout_templates").insert({ user_id: user.id, name: parsed.data.name, description: parsed.data.description, expected_duration_minutes: parsed.data.duration }).select("id").single();
  if (template.error || !template.data) redirect("/workouts/new?error=storage");
  const slugs = parsed.data.exerciseSlugs.split(",").filter(Boolean); const found = await supabase.from("exercises").select("id,slug").in("slug", slugs);
  const bySlug = new Map((found.data ?? []).map((row) => [row.slug, row.id]));
  const rows = slugs.flatMap((slug, position) => bySlug.has(slug) ? [{ user_id: user.id, template_id: template.data.id, exercise_id: bySlug.get(slug)!, position, target_sets: 3, rep_min: 8, rep_max: 12, rest_seconds: 90 }] : []);
  if (rows.length) await supabase.from("workout_template_exercises").insert(rows); refresh(); redirect(`/workouts/${template.data.id}`);
}

export async function importDiscoveryWorkoutAction(
  _: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = formData.get("item");
  if (typeof raw !== "string") {
    return { status: "error", message: "Choose a workout to import." };
  }
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { status: "error", message: "The selected workout is not valid." };
  }
  const parsed = discoveryWorkoutSchema.safeParse(value);
  if (!parsed.success || !parsed.data.exercises.length) {
    return { status: "error", message: "This workout has no usable exercises." };
  }

  const { supabase, user } = await authorized();
  const workout = parsed.data;
  try {
    const { saveDiscoverySnapshot } = await import(
      "@/features/discovery/repository"
    );
    await saveDiscoverySnapshot(user.id, workout);
    const template = await supabase
      .from("workout_templates")
      .insert({
        user_id: user.id,
        name: workout.title,
        description: `${workout.goal} workout imported from ${workout.attribution}. Review and adapt it before training.`,
        expected_duration_minutes: workout.durationMinutes ?? 40,
      })
      .select("id")
      .single();
    if (template.error || !template.data) {
      return { status: "error", message: "The editable workout could not be created." };
    }

    const rows = [];
    for (const [position, movement] of workout.exercises.entries()) {
      const exercise: DiscoveryExercise = {
        id: `${workout.provider}:${movement.exerciseId}`,
        kind: "exercise",
        provider: workout.provider,
        externalId: movement.exerciseId,
        title: movement.title,
        normalizedTitle: movement.title.toLocaleLowerCase().trim(),
        sourceUrl: workout.sourceUrl,
        attribution: workout.attribution,
        retrievedAt: workout.retrievedAt,
        quality: workout.quality,
        completeness: [],
        alternates: [],
        primaryMuscles: [],
        secondaryMuscles: [],
        equipment: workout.equipment,
        difficulty: workout.difficulty,
        movementPattern: null,
        instructions: [],
        safety: null,
        media: [],
      };
      const snapshotId = await saveDiscoverySnapshot(user.id, exercise);
      rows.push({
        user_id: user.id,
        template_id: template.data.id,
        exercise_id: null,
        external_snapshot_id: snapshotId,
        position,
        target_sets: movement.sets,
        rep_min: movement.repMin,
        rep_max: movement.repMax,
        rest_seconds: movement.restSeconds,
      });
    }
    const inserted = await supabase.from("workout_template_exercises").insert(rows);
    if (inserted.error) {
      await supabase
        .from("workout_templates")
        .delete()
        .eq("id", template.data.id)
        .eq("user_id", user.id);
      return { status: "error", message: "The workout exercises could not be imported." };
    }
    refresh();
    return {
      status: "success",
      message: `${workout.title} is ready in My workouts.`,
    };
  } catch {
    return { status: "error", message: "The workout could not be imported." };
  }
}
export async function updateTemplateAction(formData: FormData) { const id=uuidSchema.safeParse(formData.get("templateId"));const parsed=templateSchema.safeParse(Object.fromEntries(formData));if(!id.success||!parsed.success)return;const{supabase,user}=await authorized();await supabase.from("workout_templates").update({name:parsed.data.name,description:parsed.data.description,expected_duration_minutes:parsed.data.duration}).eq("id",id.data).eq("user_id",user.id);const slugs=parsed.data.exerciseSlugs.split(",").filter(Boolean);const found=await supabase.from("exercises").select("id,slug").in("slug",slugs);const bySlug=new Map((found.data??[]).map(row=>[row.slug,row.id]));await supabase.from("workout_template_exercises").delete().eq("template_id",id.data).eq("user_id",user.id);const rows=slugs.flatMap((slug,position)=>bySlug.has(slug)?[{user_id:user.id,template_id:id.data,exercise_id:bySlug.get(slug)!,position,target_sets:3,rep_min:8,rep_max:12,rest_seconds:90}]:[]);if(rows.length)await supabase.from("workout_template_exercises").insert(rows);refresh();redirect(`/workouts/${id.data}`);}
export async function deleteTemplateAction(formData: FormData) { const id = uuidSchema.safeParse(formData.get("id")); if (!id.success) return; const { supabase, user } = await authorized(); await supabase.from("workout_templates").delete().eq("id", id.data).eq("user_id", user.id); refresh(); redirect("/workouts"); }
export async function scheduleWorkoutAction(formData: FormData) { const parsed = scheduleSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const { supabase, user } = await authorized(); await supabase.from("planned_workouts").insert({ user_id: user.id, template_id: parsed.data.templateId, planned_on: parsed.data.plannedOn }); refresh(); }
export async function updatePlanStatusAction(formData: FormData) { const id = uuidSchema.safeParse(formData.get("id")); const status = formData.get("status"); if (!id.success || !["planned","skipped"].includes(String(status))) return; const { supabase, user } = await authorized(); await supabase.from("planned_workouts").update({ status: String(status) as "planned"|"skipped" }).eq("id", id.data).eq("user_id", user.id); refresh(); }
export async function startSessionAction(formData: FormData) {
  const templateId = uuidSchema.safeParse(formData.get("templateId")); if (!templateId.success) return; const { supabase, user } = await authorized();
  const existing = await supabase.from("workout_sessions").select("id").eq("user_id", user.id).eq("status", "active").maybeSingle(); if (existing.data) redirect(`/session/${existing.data.id}`);
  const [template, templateRows] = await Promise.all([supabase.from("workout_templates").select("*").eq("id", templateId.data).eq("user_id", user.id).single(), supabase.from("workout_template_exercises").select("*").eq("template_id", templateId.data).eq("user_id", user.id).order("position")]); if (!template.data) return;
  const session = await supabase.from("workout_sessions").insert({ user_id: user.id, template_id: template.data.id, name_snapshot: template.data.name }).select("id").single(); if (!session.data) return;
  for (const row of templateRows.data ?? []) { const exercise = row.exercise_id ? await supabase.from("exercises").select("title_en,title_mk").eq("id", row.exercise_id).single() : { data: null }; const external = row.external_snapshot_id ? await supabase.from("external_content_snapshots").select("title").eq("id", row.external_snapshot_id).eq("user_id", user.id).maybeSingle() : { data: null }; const title = exercise.data?.title_en ?? external.data?.title ?? "Exercise"; const snapshot = await supabase.from("workout_session_exercises").insert({ user_id: user.id, session_id: session.data.id, exercise_id: row.exercise_id, position: row.position, name_en_snapshot: title, name_mk_snapshot: exercise.data?.title_mk ?? title, target_sets: row.target_sets, rep_min: row.rep_min, rep_max: row.rep_max, rest_seconds: row.rest_seconds, target_rpe: row.target_rpe }).select("id").single(); if (snapshot.data) await supabase.from("workout_sets").insert(Array.from({length: row.target_sets}, (_, position) => ({ user_id: user.id, session_id: session.data.id, session_exercise_id: snapshot.data.id, position })) ); }
  refresh(); redirect(`/session/${session.data.id}`);
}
export async function updateSetAction(formData: FormData) { const parsed = setSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const { supabase, user } = await authorized(); await supabase.from("workout_sets").update({ reps: parsed.data.reps ?? null, load_kg: parsed.data.loadKg ?? null, rpe: parsed.data.rpe === "" ? null : parsed.data.rpe, is_bodyweight: parsed.data.bodyweight === "on", is_complete: parsed.data.complete === "on" }).eq("id", parsed.data.setId).eq("session_id", parsed.data.sessionId).eq("user_id", user.id); revalidatePath(`/session/${parsed.data.sessionId}`); }
export async function addSetAction(formData:FormData){const sessionId=uuidSchema.safeParse(formData.get("sessionId"));const exerciseId=uuidSchema.safeParse(formData.get("sessionExerciseId"));if(!sessionId.success||!exerciseId.success)return;const{supabase,user}=await authorized();const previous=await supabase.from("workout_sets").select("position").eq("session_id",sessionId.data).eq("session_exercise_id",exerciseId.data).eq("user_id",user.id).order("position",{ascending:false}).limit(1).maybeSingle();await supabase.from("workout_sets").insert({user_id:user.id,session_id:sessionId.data,session_exercise_id:exerciseId.data,position:(previous.data?.position??-1)+1});revalidatePath(`/session/${sessionId.data}`);}
export async function removeSetAction(formData:FormData){const setId=uuidSchema.safeParse(formData.get("setId"));const sessionId=uuidSchema.safeParse(formData.get("sessionId"));if(!setId.success||!sessionId.success)return;const{supabase,user}=await authorized();await supabase.from("workout_sets").delete().eq("id",setId.data).eq("session_id",sessionId.data).eq("user_id",user.id);revalidatePath(`/session/${sessionId.data}`);}
export async function finishSessionAction(formData: FormData) { const id = uuidSchema.safeParse(formData.get("id")); if (!id.success) return; const { supabase, user } = await authorized(); const completed = await supabase.from("workout_sets").select("id", { count: "exact", head: true }).eq("session_id", id.data).eq("user_id", user.id).eq("is_complete", true); if (!completed.count) redirect(`/session/${id.data}?error=no-sets`); const current = await supabase.from("workout_sessions").select("started_at").eq("id", id.data).eq("user_id", user.id).single(); const duration = current.data ? Math.max(0, Math.round((Date.now()-new Date(current.data.started_at).getTime())/1000)) : null; await supabase.from("workout_sessions").update({ status: "complete", finished_at: new Date().toISOString(), duration_seconds: duration }).eq("id", id.data).eq("user_id", user.id); refresh(); redirect(`/workout-history/${id.data}`); }
export async function discardSessionAction(formData: FormData) { const id = uuidSchema.safeParse(formData.get("id")); if (!id.success) return; const { supabase, user } = await authorized(); await supabase.from("workout_sessions").update({ status: "discarded", finished_at: new Date().toISOString() }).eq("id", id.data).eq("user_id", user.id); refresh(); redirect("/training"); }
