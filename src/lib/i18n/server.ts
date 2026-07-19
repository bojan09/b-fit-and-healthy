import "server-only";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale } from "@/lib/i18n/config";

export async function getLocale() {
  const value = (await cookies()).get("bfit-locale")?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getMessages() {
  return getDictionary(await getLocale());
}
