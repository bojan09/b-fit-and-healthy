import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  return user;
}

export async function getCurrentProfile(userId?: string) {
  const supabase = await createClient();
  const id = userId ?? (await supabase.auth.getUser()).data.user?.id;
  if (!id) return null;
  const { data } = await supabase.from("profiles").select("*").eq("user_id", id).maybeSingle();
  return data;
}
