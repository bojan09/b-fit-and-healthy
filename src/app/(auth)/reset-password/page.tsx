import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ResetForm } from "@/features/auth/reset-form";
import { sanitizeNextPath } from "@/features/auth/redirects";
import { getLocale } from "@/lib/i18n/server";

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const store = await cookies();
  if (!store.get("appwrite_recovery_user") || !store.get("appwrite_recovery_secret")) redirect("/forgot-password");
  return <ResetForm locale={await getLocale()} next={sanitizeNextPath((await searchParams).next)} />;
}
