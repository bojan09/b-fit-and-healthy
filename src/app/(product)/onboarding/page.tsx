import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/features/onboarding/onboarding-flow";
import { getCurrentProfile, requireUser } from "@/features/auth/session";
import { sanitizeNextPath } from "@/features/auth/redirects";
import { getLocale } from "@/lib/i18n/server";
export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) { const user = await requireUser(); const profile = await getCurrentProfile(user.id); const next = sanitizeNextPath((await searchParams).next); if (profile?.onboarding_complete) redirect(next); return <OnboardingFlow locale={await getLocale()} email={user.email ?? ""} initialName={profile?.display_name || String(user.user_metadata.display_name ?? "")} next={next} />; }
