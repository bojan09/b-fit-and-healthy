-- AI messages are written by the server on the user's behalf. Direct PostgREST updates
-- could rewrite assistant output or forge drafts, so limit updates to what the app needs:
-- marking a draft applied/unapplied and clearing a draft.

revoke update on public.ai_messages from authenticated;
grant update (applied_at, draft) on public.ai_messages to authenticated;

create or replace function public.ai_messages_guard_draft()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.draft is not null and new.draft is distinct from old.draft then
    raise exception 'ai draft content cannot be edited' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists ai_messages_guard_draft on public.ai_messages;
create trigger ai_messages_guard_draft
  before update on public.ai_messages
  for each row execute function public.ai_messages_guard_draft();

-- Foreign keys and owner lookups used by nutrition reads, mirrored from the fitness index pass.
create index if not exists recipes_owner_idx on public.recipes (owner_id);
create index if not exists recipe_ingredients_recipe_idx on public.recipe_ingredients (recipe_id);
create index if not exists recipe_steps_recipe_idx on public.recipe_steps (recipe_id);
create index if not exists food_favourites_user_idx on public.food_favourites (user_id);
create index if not exists saved_recipes_user_idx on public.saved_recipes (user_id);
