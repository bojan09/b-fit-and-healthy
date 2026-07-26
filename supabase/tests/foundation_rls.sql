begin;
select plan(23);

select has_table('public', 'profiles', 'profiles exists');
select has_table('public', 'user_settings', 'user settings exists');
select has_table('public', 'goals', 'goals exists');
select has_table('public', 'daily_targets', 'daily targets exists');
select policies_are('public', 'profiles', array['profiles_select_own', 'profiles_update_own', 'profiles_insert_own'], 'profiles policies are explicit');
select policies_are('public', 'user_settings', array['settings_select_own', 'settings_update_own', 'settings_insert_own'], 'settings policies are explicit');
select policies_are('public', 'goals', array['goals_select_own', 'goals_insert_own', 'goals_update_own', 'goals_delete_own'], 'goal ownership is complete');
select policies_are('public', 'daily_targets', array['targets_select_own', 'targets_insert_own', 'targets_update_own', 'targets_delete_own'], 'target ownership is complete');
select is((select relrowsecurity from pg_class where oid = 'public.goals'::regclass), true, 'goals RLS enabled');
select is((select relrowsecurity from pg_class where oid = 'public.daily_targets'::regclass), true, 'target RLS enabled');
select has_table('public', 'water_logs', 'water logs exists');
select has_table('public', 'body_measurements', 'body measurements exists');
select has_table('public', 'habits', 'habits exists');
select has_table('public', 'habit_checkins', 'habit checkins exists');
select has_table('public', 'notifications', 'notifications exists');
select policies_are('public', 'water_logs', array['water_own'], 'water ownership is complete');
select policies_are('public', 'body_measurements', array['measurements_own'], 'measurement ownership is complete');
select policies_are('public', 'habits', array['habits_own'], 'habit ownership is complete');
select policies_are('public', 'habit_checkins', array['checkins_own'], 'checkin ownership is complete');
select policies_are('public', 'notifications', array['notifications_select_own', 'notifications_update_own'], 'notification ownership is explicit');
select has_table('public', 'external_content_snapshots', 'external snapshots exist');
select policies_are('public', 'external_content_snapshots', array['owners manage external snapshots'], 'external snapshots are owner-only');
select is((select relrowsecurity from pg_class where oid = 'public.external_content_snapshots'::regclass), true, 'external snapshot RLS enabled');

select * from finish();
rollback;
