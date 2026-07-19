# Supabase authentication configuration

Phase 3 uses Supabase Auth with PKCE callbacks. Keep all service-role secrets server-only; the application requires only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` at runtime.

## URL configuration

Set the Supabase **Site URL** to the canonical production URL. Add these **Redirect URLs**:

- `http://localhost:3000/auth/callback`
- `https://<your-vercel-project>.vercel.app/auth/callback`
- The custom production domain callback, when available

Preview deployments need an approved Vercel wildcard or explicit preview callback according to the team security policy.

## Email and Google

Enable email/password and Magic Link in Supabase Auth. Update confirmation, Magic Link, and recovery email templates so their confirmation URL uses the supplied redirect target. Enable the Google provider with OAuth credentials whose authorized callback URI matches the Supabase provider callback shown in the dashboard.

Provider-dependent flows cannot be accepted locally until these remote settings and credentials are configured. Never commit provider secrets or local `.env` files.

## Database

Apply migrations in order. `202607190002_auth_onboarding.sql` grants authenticated users narrowly scoped self-insert access for idempotent profile/settings bootstrap repair; row-level ownership checks remain enforced.
