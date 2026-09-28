-- Indexes for the fitness read paths. Every query filters by user_id (RLS) plus
-- the parent key, so user_id leads each composite index.

create index if not exists workout_templates_user_updated_idx
  on public.workout_templates (user_id, updated_at desc);

create index if not exists workout_template_exercises_user_template_idx
  on public.workout_template_exercises (user_id, template_id, position);

create index if not exists planned_workouts_user_date_idx
  on public.planned_workouts (user_id, planned_on);

create index if not exists workout_sessions_user_status_finished_idx
  on public.workout_sessions (user_id, status, finished_at desc);

create index if not exists workout_session_exercises_user_session_idx
  on public.workout_session_exercises (user_id, session_id, position);

create index if not exists workout_sets_user_session_exercise_idx
  on public.workout_sets (user_id, session_id, session_exercise_id, position);
