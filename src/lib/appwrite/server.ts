import "server-only";

import { cookies } from "next/headers";
import { getPublicEnv } from "@/lib/env/public";
import { getServerEnv } from "@/lib/env/server";
import { appwriteRequest, type AppwriteConfig, type AppwriteRequestOptions } from "@/lib/appwrite/rest";
import { createAppwriteTablesClient } from "@/lib/appwrite/tables";

export type AppwriteUser = {
  $id: string;
  id: string;
  email: string;
  name: string;
  prefs?: Record<string, unknown>;
  emailVerification?: boolean;
};

type AppwriteSession = { secret: string; expire: string; userId?: string };

export function getAppwriteConfig(): AppwriteConfig {
  const env = getPublicEnv();
  return { endpoint: env.NEXT_PUBLIC_APPWRITE_ENDPOINT, projectId: env.NEXT_PUBLIC_APPWRITE_PROJECT_ID };
}

export async function createClient() {
  return createAppwriteTablesClient();
}

export function getAppwriteSessionCookieName() {
  return `a_session_${getAppwriteConfig().projectId}`;
}

export async function getAppwriteSessionSecret() {
  return (await cookies()).get(getAppwriteSessionCookieName())?.value;
}

export async function appwriteSessionRequest<T>(path: string, options: Omit<AppwriteRequestOptions, "session">) {
  const session = await getAppwriteSessionSecret();
  if (!session) throw new Error("APPWRITE_SESSION_REQUIRED");
  return appwriteRequest<T>(getAppwriteConfig(), path, { ...options, session });
}

export async function appwriteAdminRequest<T>(path: string, options: Omit<AppwriteRequestOptions, "apiKey">) {
  const apiKey = getServerEnv().APPWRITE_API_KEY;
  if (!apiKey) throw new Error("APPWRITE_API_KEY_REQUIRED");
  return appwriteRequest<T>(getAppwriteConfig(), path, { ...options, apiKey });
}

export async function setAppwriteSession(session: AppwriteSession) {
  const expires = new Date(session.expire);
  const maxAge = Math.max(0, Math.floor((expires.getTime() - Date.now()) / 1000));
  (await cookies()).set(getAppwriteSessionCookieName(), session.secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
    maxAge,
  });
}

export async function clearAppwriteSession() {
  (await cookies()).delete(getAppwriteSessionCookieName());
}

export async function getCurrentAppwriteUser(): Promise<AppwriteUser | null> {
  const session = await getAppwriteSessionSecret();
  if (!session) return null;
  try {
    const account = await appwriteRequest<Omit<AppwriteUser, "id">>(getAppwriteConfig(), "/account", { method: "GET", session });
    return { ...account, id: account.$id };
  } catch {
    return null;
  }
}
