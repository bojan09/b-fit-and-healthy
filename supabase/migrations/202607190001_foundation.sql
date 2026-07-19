begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_path text,
  locale text not null default 'en' check (locale in ('en', 'mk')),
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  units text not null default 'metric' check (units in ('metric', 'imperial')),
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  timezone text not null default 'UTC',
  reminders_enabled boolean not null default false,
  weekly_summary_enabled boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (char_length(kind) between 1 and 48),
  target numeric,
  unit text,
  starts_on date not null default current_date,
  ends_on date,
  status text not null default 'active' check (status in ('active', 'paused', 'complete')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (ends_on is null or ends_on >= starts_on)
);

create index goals_user_status_idx on public.goals(user_id, status);

create table public.daily_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  effective_from date not null default current_date,
  energy_kcal integer check (energy_kcal between 0 and 20000),
  protein_g numeric check (protein_g between 0 and 2000),
  carbohydrate_g numeric check (carbohydrate_g between 0 and 3000),
  fat_g numeric check (fat_g between 0 and 1000),
  water_ml integer check (water_ml between 0 and 20000),
  movement_minutes integer check (movement_minutes between 0 and 1440),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(user_id, effective_from)
);

create index daily_targets_user_date_idx on public.daily_targets(user_id, effective_from desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (user_id) do nothing;
  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create trigger profiles_set_updated_at before update on public.profiles
for each row execute procedure public.set_updated_at();
create trigger user_settings_set_updated_at before update on public.user_settings
for each row execute procedure public.set_updated_at();
create trigger goals_set_updated_at before update on public.goals
for each row execute procedure public.set_updated_at();
create trigger daily_targets_set_updated_at before update on public.daily_targets
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.goals enable row level security;
alter table public.daily_targets enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "settings_select_own" on public.user_settings for select to authenticated using (auth.uid() = user_id);
create policy "settings_update_own" on public.user_settings for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals_select_own" on public.goals for select to authenticated using (auth.uid() = user_id);
create policy "goals_insert_own" on public.goals for insert to authenticated with check (auth.uid() = user_id);
create policy "goals_update_own" on public.goals for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals_delete_own" on public.goals for delete to authenticated using (auth.uid() = user_id);
create policy "targets_select_own" on public.daily_targets for select to authenticated using (auth.uid() = user_id);
create policy "targets_insert_own" on public.daily_targets for insert to authenticated with check (auth.uid() = user_id);
create policy "targets_update_own" on public.daily_targets for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "targets_delete_own" on public.daily_targets for delete to authenticated using (auth.uid() = user_id);

revoke all on public.profiles, public.user_settings, public.goals, public.daily_targets from anon;
grant select, update on public.profiles, public.user_settings to authenticated;
grant select, insert, update, delete on public.goals, public.daily_targets to authenticated;

commit;
