create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  locale text not null default 'en' check (locale in ('en','mk')),
  title text not null default 'New conversation' check (char_length(title) between 1 and 80),
  expires_at timestamptz not null default (now() + interval '30 days'),
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null check (char_length(content) between 1 and 12000),
  draft jsonb,
  applied_at timestamptz,
  status text not null default 'complete' check (status in ('complete','aborted','failed')),
  created_at timestamptz not null default now()
);

create index if not exists ai_conversations_owner_activity_idx
  on public.ai_conversations(user_id, last_message_at desc);
create index if not exists ai_conversations_expiry_idx
  on public.ai_conversations(expires_at);
create index if not exists ai_messages_conversation_created_idx
  on public.ai_messages(conversation_id, created_at);

alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

create policy "owners read active ai conversations" on public.ai_conversations
  for select using (auth.uid() = user_id and expires_at > now());
create policy "owners create ai conversations" on public.ai_conversations
  for insert with check (auth.uid() = user_id);
create policy "owners update active ai conversations" on public.ai_conversations
  for update using (auth.uid() = user_id and expires_at > now())
  with check (auth.uid() = user_id);
create policy "owners delete ai conversations" on public.ai_conversations
  for delete using (auth.uid() = user_id);

create policy "owners read active ai messages" on public.ai_messages
  for select using (
    auth.uid() = user_id and exists (
      select 1 from public.ai_conversations c
      where c.id = conversation_id and c.user_id = auth.uid() and c.expires_at > now()
    )
  );
create policy "owners create ai messages" on public.ai_messages
  for insert with check (
    auth.uid() = user_id and exists (
      select 1 from public.ai_conversations c
      where c.id = conversation_id and c.user_id = auth.uid() and c.expires_at > now()
    )
  );
create policy "owners delete ai messages" on public.ai_messages
  for delete using (auth.uid() = user_id);
create policy "owners update ai draft status" on public.ai_messages
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.cleanup_expired_ai_conversations()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare deleted_count bigint;
begin
  delete from public.ai_conversations where expires_at <= now();
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on public.ai_conversations, public.ai_messages from anon;
grant select, insert, update, delete on public.ai_conversations to authenticated;
grant select, insert, update, delete on public.ai_messages to authenticated;
revoke all on function public.cleanup_expired_ai_conversations() from public, anon, authenticated;
