-- Shared request budget for expensive endpoints (AI coach, provider-backed search).
-- The function keys on auth.uid(), so a caller can only spend their own budget.

create table if not exists public.rate_limits (
  user_id uuid not null references auth.users (id) on delete cascade,
  scope text not null,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0,
  primary key (user_id, scope)
);

alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;

create or replace function public.consume_rate_limit(p_scope text, p_limit integer, p_window_seconds integer)
returns table (allowed boolean, retry_after integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_now timestamptz := now();
  v_row public.rate_limits%rowtype;
begin
  if v_user is null then
    return query select false, p_window_seconds;
    return;
  end if;

  insert into public.rate_limits as r (user_id, scope, window_started_at, request_count)
  values (v_user, p_scope, v_now, 1)
  on conflict (user_id, scope) do update
    set window_started_at = case
          when r.window_started_at + make_interval(secs => p_window_seconds) <= v_now then v_now
          else r.window_started_at end,
        request_count = case
          when r.window_started_at + make_interval(secs => p_window_seconds) <= v_now then 1
          else r.request_count + 1 end
  returning * into v_row;

  if v_row.request_count > p_limit then
    return query select false,
      greatest(1, ceil(extract(epoch from (v_row.window_started_at + make_interval(secs => p_window_seconds) - v_now)))::integer);
  else
    return query select true, 0;
  end if;
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon;
grant execute on function public.consume_rate_limit(text, integer, integer) to authenticated;
