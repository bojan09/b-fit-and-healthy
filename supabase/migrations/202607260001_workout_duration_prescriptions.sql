begin;

alter table public.workout_template_exercises
  add column target_duration_seconds integer
  check (
    target_duration_seconds is null
    or target_duration_seconds between 1 and 3600
  );

commit;
