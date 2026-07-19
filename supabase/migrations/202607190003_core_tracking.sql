begin;

create table public.water_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  amount_ml integer not null check (amount_ml between 50 and 5000), logged_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);
create index water_logs_user_logged_idx on public.water_logs(user_id, logged_at desc);

create table public.body_measurements (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  recorded_on date not null default current_date, weight_kg numeric(6,2) not null check (weight_kg between 20 and 500),
  note text check (note is null or char_length(note) <= 240), created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()), unique(user_id, recorded_on)
);
create index body_measurements_user_date_idx on public.body_measurements(user_id, recorded_on desc);

create table public.habits (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 80), position integer not null default 0,
  is_archived boolean not null default false, created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index habits_user_active_idx on public.habits(user_id, is_archived, position);

create table public.habit_checkins (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade, checkin_on date not null default current_date,
  status text not null check (status in ('complete', 'skipped')), created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()), unique(habit_id, checkin_on)
);
create index habit_checkins_user_date_idx on public.habit_checkins(user_id, checkin_on desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'general' check (char_length(kind) between 1 and 32), title text not null check (char_length(title) between 1 and 120),
  body text not null check (char_length(body) between 1 and 500), href text check (href is null or href ~ '^/[^/]'),
  read_at timestamptz, created_at timestamptz not null default timezone('utc', now())
);
create index notifications_user_unread_idx on public.notifications(user_id, read_at, created_at desc);

create trigger body_measurements_set_updated_at before update on public.body_measurements for each row execute procedure public.set_updated_at();
create trigger habits_set_updated_at before update on public.habits for each row execute procedure public.set_updated_at();
create trigger habit_checkins_set_updated_at before update on public.habit_checkins for each row execute procedure public.set_updated_at();

alter table public.water_logs enable row level security; alter table public.body_measurements enable row level security;
alter table public.habits enable row level security; alter table public.habit_checkins enable row level security; alter table public.notifications enable row level security;

create policy "water_own" on public.water_logs for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "measurements_own" on public.body_measurements for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habits_own" on public.habits for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "checkins_own" on public.habit_checkins for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id and exists (select 1 from public.habits where habits.id = habit_id and habits.user_id = auth.uid()));
create policy "notifications_select_own" on public.notifications for select to authenticated using (auth.uid() = user_id);
create policy "notifications_update_own" on public.notifications for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

revoke all on public.water_logs, public.body_measurements, public.habits, public.habit_checkins, public.notifications from anon;
grant select, insert, update, delete on public.water_logs, public.body_measurements, public.habits, public.habit_checkins to authenticated;
grant select, update on public.notifications to authenticated;

commit;
