import "server-only";

import { createClient } from "@/lib/appwrite/server";
import { localDateInTimezone } from "@/features/tracking/domain";
type Settings = { timezone: string };

function ensure(errors: Array<{ message: string } | null>) {
  if (errors.some(Boolean)) throw new Error("TRACKING_DATA_UNAVAILABLE");
}

export async function loadTrackingContext(userId: string) {
  const appwrite = await createClient();
  const [profile, settings, target] = await Promise.all([
    appwrite.table("profiles").select("display_name,locale,onboarding_complete").eq("user_id", userId).single(),
    appwrite.table("user_settings").select("*").eq("user_id", userId).single(),
    appwrite.table("daily_targets").select("*").eq("user_id", userId).order("effective_from", { ascending: false }).limit(1).maybeSingle(),
  ]);
  ensure([profile.error, settings.error, target.error]);
  if (!profile.data || !settings.data) throw new Error("TRACKING_DATA_UNAVAILABLE");
  return { profile: profile.data, settings: settings.data, target: target.data };
}

export async function loadTodayData(userId: string, settings: Settings) {
  const appwrite = await createClient();
  const date = localDateInTimezone(settings.timezone);
  const since = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
  const [water, habits, checkins, goals, weight] = await Promise.all([
    appwrite.table("water_logs").select("id,amount_ml,logged_at").eq("user_id", userId).gte("logged_at", since).order("logged_at"),
    appwrite.table("habits").select("id,title,position").eq("user_id", userId).eq("is_archived", false).order("position").order("created_at"),
    appwrite.table("habit_checkins").select("habit_id,status,checkin_on").eq("user_id", userId).eq("checkin_on", date),
    appwrite.table("goals").select("id,kind,target,unit,status,ends_on").eq("user_id", userId).eq("status", "active").order("created_at"),
    appwrite.table("body_measurements").select("id,recorded_on,weight_kg,note").eq("user_id", userId).order("recorded_on", { ascending: false }).limit(1).maybeSingle(),
  ]);
  ensure([water.error, habits.error, checkins.error, goals.error, weight.error]);
  return { date, water: (water.data ?? []).filter((entry) => localDateInTimezone(settings.timezone, new Date(entry.logged_at)) === date), habits: habits.data ?? [], checkins: checkins.data ?? [], goals: goals.data ?? [], latestWeight: weight.data };
}

export async function loadProgressData(userId: string) {
  const appwrite = await createClient();
  const since = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const [measurements, habits, checkins, goals] = await Promise.all([
    appwrite.table("body_measurements").select("id,recorded_on,weight_kg,note").eq("user_id", userId).order("recorded_on", { ascending: false }).limit(30),
    appwrite.table("habits").select("id,title").eq("user_id", userId).eq("is_archived", false).order("position"),
    appwrite.table("habit_checkins").select("habit_id,status,checkin_on").eq("user_id", userId).gte("checkin_on", since),
    appwrite.table("goals").select("id,kind,target,unit,status,starts_on,ends_on").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
  ]);
  ensure([measurements.error, habits.error, checkins.error, goals.error]);
  return { measurements: measurements.data ?? [], habits: habits.data ?? [], checkins: checkins.data ?? [], goals: goals.data ?? [] };
}

export async function loadNotifications(userId: string) {
  const appwrite = await createClient();
  const result = await appwrite.table("notifications").select("id,kind,title,body,href,read_at,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(50);
  ensure([result.error]);
  return result.data ?? [];
}

export async function loadUnreadNotificationCount(userId: string) {
  const appwrite = await createClient();
  const result = await appwrite.table("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId).is("read_at", null);
  if (result.error) return 0;
  return result.count ?? 0;
}
