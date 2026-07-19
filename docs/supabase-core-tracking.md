# Supabase core tracking

Phase 4 adds real, private tracking storage through `supabase/migrations/202607190003_core_tracking.sql`.

## Migration order

Apply migrations in filename order after reviewing them:

1. `202607190001_foundation.sql`
2. `202607190002_auth_onboarding.sql`
3. `202607190003_core_tracking.sql`

The third migration is additive. It creates `water_logs`, `body_measurements`, `habits`, `habit_checkins`, and `notifications`; it does not reset or delete existing data. Apply it through the project's normal Supabase migration workflow. The implementation agent does not remotely mutate or reset the project.

## Storage rules

- Water is stored in millilitres. Imperial fluid ounces are converted at the action/presentation boundary.
- Weight is stored in kilograms. Pounds are converted at the action/presentation boundary.
- The timezone in `user_settings` defines the user's calendar date for the daily dashboard.
- Water entries are immutable ledger rows and may be individually deleted to correct mistakes.
- Weight is upserted once per user and calendar date.
- Habit check-ins are unique per habit and date and use `complete` or `skipped` state.
- Notifications are inbox records only. Phase 4 does not schedule reminders, send push messages, or fabricate welcome notifications.

## Ownership and RLS

Every table enables Row Level Security. Authenticated users can read and mutate only rows whose `user_id` equals `auth.uid()`. Check-ins additionally verify that the referenced habit belongs to the same authenticated user. Anonymous access is revoked. Notifications allow authenticated select/update but not user-created inserts.

Run `supabase/tests/foundation_rls.sql` with pgTAP in the configured local/test environment after applying all migrations.

## Manual acceptance

After migration, use two disposable test accounts to verify that each can create and read its own water, weight, habits, and goals while neither can select or mutate the other's records. Confirm notification read state only changes owned rows. Do not run destructive acceptance against production accounts.

Phase 5 will add nutrition and planning tables separately. The Phase 4 dashboard intentionally omits meal, calorie, and macro values until those records exist.
