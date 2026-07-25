import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const readCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

const readProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
});

export async function requireUser() {
  const user = await readCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}

export async function getCurrentProfile(userId?: string) {
  const id = userId ?? (await readCurrentUser())?.id;
  if (!id) return null;
  return readProfile(id);
}
