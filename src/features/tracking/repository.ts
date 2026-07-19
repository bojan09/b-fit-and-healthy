import "server-only";

import { createClient } from "@/lib/supabase/server";
import { localDateInTimezone } from "@/features/tracking/domain";
import type { Database } from "@/types/database";

type Settings = Database["public"]["Tables"]["user_settings"]["Row"];

function ensure(errors: Array<{ message: string } | null>) {
  if (errors.some(Boolean)) throw new Error("TRACKING_DATA_UNAVAILABLE");
}

export async function loadTrackingContext(userId: string) {
  const supabase = await createClient();
  const [profile, settings, target] = await Promise.all([
    supabase.from("profiles").select("display_name,locale,onboarding_complete").eq("user_id", userId).single(),
    supabase.from("user_settings").select("*").eq("user_id", userId).single(),
    supabase.from("daily_targets").select("*").eq("user_id", userId).order("effective_from", { ascending: false }).limit(1).maybeSingle(),
  ]);
  ensure([profile.error, settings.error, target.error]);
  if (!profile.data || !settings.data) throw new Error("TRACKING_DATA_UNAVAILABLE");
  return { profile: profile.data, settings: settings.data, target: target.data };
}

export async function loadTodayData(userId: string, settings: Settings) {
  const supabase = await createClient();
  const date = localDateInTimezone(settings.timezone);
  const since = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
  const [water, habits, checkins, goals, weight] = await Promise.all([
    supabase.from("water_logs").select("id,amount_ml,logged_at").eq("user_id", userId).gte("logged_at", since).order("logged_at"),
    supabase.from("habits").select("id,title,position").eq("user_id", userId).eq("is_archived", false).order("position").order("created_at"),
    supabase.from("habit_checkins").select("habit_id,status,checkin_on").eq("user_id", userId).eq("checkin_on", date),
    supabase.from("goals").select("id,kind,target,unit,status,ends_on").eq("user_id", userId).eq("status", "active").order("created_at"),
    supabase.from("body_measurements").select("id,recorded_on,weight_kg,note").eq("user_id", userId).order("recorded_on", { ascending: false }).limit(1).maybeSingle(),
  ]);
  ensure([water.error, habits.error, checkins.error, goals.error, weight.error]);
  return { date, water: (water.data ?? []).filter((entry) => localDateInTimezone(settings.timezone, new Date(entry.logged_at)) === date), habits: habits.data ?? [], checkins: checkins.data ?? [], goals: goals.data ?? [], latestWeight: weight.data };
}

export async function loadProgressData(userId: string) {
  const supabase = await createClient();
  const since = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const [measurements, habits, checkins, goals] = await Promise.all([
    supabase.from("body_measurements").select("id,recorded_on,weight_kg,note").eq("user_id", userId).order("recorded_on", { ascending: false }).limit(30),
    supabase.from("habits").select("id,title").eq("user_id", userId).eq("is_archived", false).order("position"),
    supabase.from("habit_checkins").select("habit_id,status,checkin_on").eq("user_id", userId).gte("checkin_on", since),
    supabase.from("goals").select("id,kind,target,unit,status,starts_on,ends_on").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
  ]);
  ensure([measurements.error, habits.error, checkins.error, goals.error]);
  return { measurements: measurements.data ?? [], habits: habits.data ?? [], checkins: checkins.data ?? [], goals: goals.data ?? [] };
}

export async function loadNotifications(userId: string) {
  const supabase = await createClient();
  const result = await supabase.from("notifications").select("id,kind,title,body,href,read_at,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(50);
  ensure([result.error]);
  return result.data ?? [];
}

export async function loadUnreadNotificationCount(userId: string) {
  const supabase = await createClient();
  const result = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId).is("read_at", null);
  if (result.error) return 0;
  return result.count ?? 0;
}
