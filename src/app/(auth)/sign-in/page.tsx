import { AuthForm } from "@/features/auth/auth-form";
import { sanitizeNextPath } from "@/features/auth/redirects";
import { getLocale } from "@/lib/i18n/server";
export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) { const locale = await getLocale(); const next = sanitizeNextPath((await searchParams).next); return <AuthForm mode="sign-in" locale={locale} next={next} />; }
