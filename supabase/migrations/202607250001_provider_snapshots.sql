begin;

create table public.external_content_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_type text not null check (content_type in ('food','recipe','exercise','workout')),
  provider text not null check (char_length(provider) between 2 and 40),
  external_id text not null check (char_length(external_id) between 1 and 180),
  title text not null check (char_length(title) between 1 and 180),
  source_url text,
  attribution text not null check (char_length(attribution) between 1 and 240),
  schema_version integer not null default 1 check (schema_version > 0),
  payload jsonb not null,
  retrieved_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(user_id, content_type, provider, external_id)
);

create index external_content_snapshots_user_kind_idx
  on public.external_content_snapshots(user_id, content_type, updated_at desc);

create trigger external_content_snapshots_set_updated_at
  before update on public.external_content_snapshots
  for each row execute procedure public.set_updated_at();

alter table public.external_content_snapshots enable row level security;

create policy "owners manage external snapshots"
  on public.external_content_snapshots
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

revoke all on public.external_content_snapshots from anon;
grant select, insert, update, delete on public.external_content_snapshots to authenticated;

alter table public.meal_entries
  add column external_snapshot_id uuid references public.external_content_snapshots(id) on delete set null;

alter table public.meal_plan_items
  add column external_snapshot_id uuid references public.external_content_snapshots(id) on delete set null;

alter table public.workout_template_exercises
  alter column exercise_id drop not null,
  add column external_snapshot_id uuid references public.external_content_snapshots(id) on delete restrict;

alter table public.workout_template_exercises
  add constraint workout_template_exercise_source_check
  check (
    (exercise_id is not null and external_snapshot_id is null)
    or
    (exercise_id is null and external_snapshot_id is not null)
  );

commit;
