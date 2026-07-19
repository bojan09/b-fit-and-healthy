begin;
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = user_id);
create policy "settings_insert_own" on public.user_settings for insert to authenticated with check (auth.uid() = user_id);
grant insert on public.profiles, public.user_settings to authenticated;
commit;
