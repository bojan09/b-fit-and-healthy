begin;
select plan(10);

select has_table('public', 'profiles', 'profiles exists');
select has_table('public', 'user_settings', 'user settings exists');
select has_table('public', 'goals', 'goals exists');
select has_table('public', 'daily_targets', 'daily targets exists');
select policies_are('public', 'profiles', array['profiles_select_own', 'profiles_update_own'], 'profiles policies are explicit');
select policies_are('public', 'user_settings', array['settings_select_own', 'settings_update_own'], 'settings policies are explicit');
select policies_are('public', 'goals', array['goals_select_own', 'goals_insert_own', 'goals_update_own', 'goals_delete_own'], 'goal ownership is complete');
select policies_are('public', 'daily_targets', array['targets_select_own', 'targets_insert_own', 'targets_update_own', 'targets_delete_own'], 'target ownership is complete');
select is((select relrowsecurity from pg_class where oid = 'public.goals'::regclass), true, 'goals RLS enabled');
select is((select relrowsecurity from pg_class where oid = 'public.daily_targets'::regclass), true, 'target RLS enabled');

select * from finish();
rollback;
