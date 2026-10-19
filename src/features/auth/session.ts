import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getCurrentAppwriteUser } from "@/lib/appwrite/server";

const readCurrentUser = cache(getCurrentAppwriteUser);

export async function requireUser() {
  const user = await readCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}

export async function getCurrentProfile(userId?: string) {
  const user = await readCurrentUser();
  if (!user || (userId && userId !== user.$id)) return null;
  const prefs = user.prefs ?? {};
  return {
    user_id: user.$id,
    display_name: user.name,
    locale: typeof prefs.locale === "string" ? prefs.locale : "en",
    onboarding_complete: prefs.onboarding_complete === true,
  };
}
