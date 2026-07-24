create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title_en text not null, title_mk text not null,
  summary_en text not null, summary_mk text not null, equipment text[] not null default '{}', difficulty text not null check (difficulty in ('beginner','intermediate','advanced')),
  movement_pattern text not null, exercise_type text not null, instructions_en jsonb not null default '[]', instructions_mk jsonb not null default '[]',
  safety_en text not null default '', safety_mk text not null default '', is_public boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.exercise_muscles (
  exercise_id uuid not null references public.exercises(id) on delete cascade, muscle_key text not null, role text not null check (role in ('primary','secondary')), primary key (exercise_id, muscle_key, role)
);
create table if not exists public.workout_programs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, name text not null check (char_length(name) between 1 and 80), description text not null default '', is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.workout_templates (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, program_id uuid references public.workout_programs(id) on delete set null,
  name text not null check (char_length(name) between 1 and 80), description text not null default '', difficulty text not null default 'beginner', expected_duration_minutes integer not null default 30 check (expected_duration_minutes between 5 and 300), goal text not null default 'general', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.workout_template_exercises (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, template_id uuid not null references public.workout_templates(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id), position integer not null check (position >= 0), target_sets integer not null default 3 check (target_sets between 1 and 20), rep_min integer check (rep_min between 1 and 1000), rep_max integer check (rep_max between 1 and 1000), rest_seconds integer not null default 90 check (rest_seconds between 0 and 1800), target_rpe numeric(3,1) check (target_rpe between 1 and 10), note text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(template_id, position)
);
create table if not exists public.planned_workouts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, template_id uuid not null references public.workout_templates(id) on delete cascade,
  planned_on date not null, status text not null default 'planned' check (status in ('planned','complete','skipped')), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, template_id uuid references public.workout_templates(id) on delete set null, planned_workout_id uuid references public.planned_workouts(id) on delete set null,
  name_snapshot text not null, status text not null default 'active' check (status in ('active','complete','discarded')), started_at timestamptz not null default now(), finished_at timestamptz, duration_seconds integer, note text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index if not exists workout_sessions_one_active_user on public.workout_sessions(user_id) where status = 'active';
create table if not exists public.workout_session_exercises (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, session_id uuid not null references public.workout_sessions(id) on delete cascade, exercise_id uuid references public.exercises(id) on delete set null,
  position integer not null, name_en_snapshot text not null, name_mk_snapshot text not null, target_sets integer not null default 3, rep_min integer, rep_max integer, rest_seconds integer not null default 90, target_rpe numeric(3,1), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(session_id, position)
);
create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, session_id uuid not null references public.workout_sessions(id) on delete cascade, session_exercise_id uuid not null references public.workout_session_exercises(id) on delete cascade,
  position integer not null, reps integer check (reps between 0 and 1000), load_kg numeric(8,3) check (load_kg between 0 and 10000), duration_seconds integer check (duration_seconds between 0 and 86400), rpe numeric(3,1) check (rpe between 1 and 10), is_bodyweight boolean not null default false, is_complete boolean not null default false, note text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(session_exercise_id, position)
);

alter table public.exercises enable row level security; alter table public.exercise_muscles enable row level security;
alter table public.workout_programs enable row level security; alter table public.workout_templates enable row level security; alter table public.workout_template_exercises enable row level security;
alter table public.planned_workouts enable row level security; alter table public.workout_sessions enable row level security; alter table public.workout_session_exercises enable row level security; alter table public.workout_sets enable row level security;
create policy "public exercise catalogue" on public.exercises for select using (is_public);
create policy "public exercise muscles" on public.exercise_muscles for select using (exists(select 1 from public.exercises e where e.id=exercise_id and e.is_public));
create policy "owners manage programs" on public.workout_programs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners manage templates" on public.workout_templates for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners manage template exercises" on public.workout_template_exercises for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners manage plans" on public.planned_workouts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners manage sessions" on public.workout_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners manage session exercises" on public.workout_session_exercises for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners manage sets" on public.workout_sets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
revoke all on all tables in schema public from anon;
grant select on public.exercises, public.exercise_muscles to anon, authenticated;
grant select, insert, update, delete on public.workout_programs, public.workout_templates, public.workout_template_exercises, public.planned_workouts, public.workout_sessions, public.workout_session_exercises, public.workout_sets to authenticated;

insert into public.exercises(slug,title_en,title_mk,summary_en,summary_mk,equipment,difficulty,movement_pattern,exercise_type)
values ('bodyweight-squat','Bodyweight squat','Чучнување со сопствена тежина','Build lower-body control.','Развијте контрола на долниот дел.','{Bodyweight}','beginner','squat','strength')
on conflict (slug) do update set title_en=excluded.title_en, title_mk=excluded.title_mk;

insert into public.exercises(slug,title_en,title_mk,summary_en,summary_mk,equipment,difficulty,movement_pattern,exercise_type) values
('goblet-squat','Goblet squat','Пехар чучнување','Front-loaded squat control.','Контрола со предно оптоварување.','{Dumbbell}','beginner','squat','strength'),
('romanian-deadlift','Romanian deadlift','Романско мртво кревање','Train the hip hinge.','Тренирајте го движењето од колк.','{Dumbbells}','beginner','hinge','strength'),
('hip-bridge','Hip bridge','Мост со колкови','Floor-based glute strength.','Сила на глутеус на под.','{Bodyweight}','beginner','hinge','strength'),
('push-up','Push-up','Склек','Scalable pushing strength.','Прилагодлива сила на туркање.','{Bodyweight}','beginner','horizontal-push','strength'),
('dumbbell-bench-press','Dumbbell bench press','Потисок со тегови на клупа','Independent-arm pressing.','Независен потисок со рацете.','{Dumbbells,Bench}','beginner','horizontal-push','strength'),
('overhead-press','Overhead press','Потисок над глава','Controlled overhead strength.','Контролирана сила над глава.','{Dumbbells}','beginner','vertical-push','strength'),
('one-arm-row','One-arm row','Веслање со една рака','Single-arm upper-back work.','Еднострана работа за грбот.','{Dumbbell}','beginner','horizontal-pull','strength'),
('seated-cable-row','Seated cable row','Седечко веслање на кабел','Stable horizontal pulling.','Стабилно хоризонтално влечење.','{Cable}','beginner','horizontal-pull','strength'),
('lat-pulldown','Lat pulldown','Лат повлекување','Adjustable vertical pulling.','Прилагодливо вертикално влечење.','{Cable}','beginner','vertical-pull','strength'),
('farmer-carry','Farmer carry','Фармерско носење','Grip and posture under load.','Стисок и држење под товар.','{Dumbbells}','beginner','carry','strength'),
('dead-bug','Dead bug','Мртва бубачка','Trunk control while moving.','Контрола на трупот при движење.','{Bodyweight}','beginner','anti-extension','core'),
('side-plank','Side plank','Страничен планк','Lateral trunk endurance.','Странична издржливост на трупот.','{Bodyweight}','beginner','anti-lateral-flexion','core'),
('thoracic-rotation','Thoracic rotation','Торакална ротација','Comfortable upper-back rotation.','Удобна ротација на горниот грб.','{Bodyweight}','beginner','rotation','mobility'),
('hip-flexor-mobility','Hip-flexor mobility','Мобилност на флексорите на колкот','Comfortable hip extension.','Удобна екстензија на колкот.','{Bodyweight}','beginner','mobility','mobility')
on conflict (slug) do update set title_en=excluded.title_en,title_mk=excluded.title_mk;

insert into public.exercise_muscles(exercise_id,muscle_key,role)
select e.id,m.muscle_key,'primary' from public.exercises e join (values
('bodyweight-squat','quadriceps'),('bodyweight-squat','glutes'),('goblet-squat','quadriceps'),('romanian-deadlift','hamstrings'),('hip-bridge','glutes'),
('push-up','chest'),('dumbbell-bench-press','chest'),('overhead-press','shoulders'),('one-arm-row','lats'),('seated-cable-row','mid-back'),
('lat-pulldown','lats'),('farmer-carry','forearms'),('dead-bug','abdominals'),('side-plank','obliques'),('thoracic-rotation','thoracic-spine'),('hip-flexor-mobility','hip-flexors')
) as m(slug,muscle_key) on e.slug=m.slug on conflict do nothing;
