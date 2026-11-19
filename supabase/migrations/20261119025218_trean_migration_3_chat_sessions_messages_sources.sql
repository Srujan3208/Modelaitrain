-- TREAN AI Migration 3: Chat Sessions, Messages and Citation Sources
-- Applied to Supabase project evxweqaldnvmsvophuny

create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New chat',
  context_type text not null default 'general' check (context_type in ('general','video','knowledge_base','mixed')),
  video_id uuid references public.videos(id) on delete set null,
  system_context jsonb not null default '{}'::jsonb check (jsonb_typeof(system_context) = 'object'),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz,
  archived_at timestamptz,
  constraint chat_sessions_video_context_check check (context_type <> 'video' or video_id is not null)
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  status text not null default 'completed' check (status in ('pending','streaming','completed','failed','cancelled')),
  model text,
  prompt_tokens integer check (prompt_tokens is null or prompt_tokens >= 0),
  completion_tokens integer check (completion_tokens is null or completion_tokens >= 0),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create table public.chat_session_knowledge_items (
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  knowledge_item_id uuid not null references public.knowledge_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (session_id, knowledge_item_id)
);

create table public.chat_message_sources (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.chat_messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null check (source_type in ('video_transcript','knowledge_item','transcript_chunk','external')),
  video_id uuid references public.videos(id) on delete set null,
  knowledge_item_id uuid references public.knowledge_items(id) on delete set null,
  transcript_chunk_id uuid references public.transcript_chunks(id) on delete set null,
  citation_label text,
  source_title text,
  source_url text,
  excerpt text,
  start_seconds integer check (start_seconds is null or start_seconds >= 0),
  end_seconds integer check (end_seconds is null or end_seconds >= 0),
  relevance_score numeric(5,4) check (relevance_score is null or relevance_score between 0 and 1),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  constraint chat_message_sources_time_check check (start_seconds is null or end_seconds is null or end_seconds >= start_seconds),
  constraint chat_message_sources_reference_check check (
    (source_type = 'video_transcript' and video_id is not null) or
    (source_type = 'knowledge_item' and knowledge_item_id is not null) or
    (source_type = 'transcript_chunk' and transcript_chunk_id is not null) or
    (source_type = 'external')
  )
);

create index chat_sessions_user_updated_idx on public.chat_sessions(user_id, updated_at desc);
create index chat_sessions_user_last_message_idx on public.chat_sessions(user_id, last_message_at desc);
create index chat_sessions_video_idx on public.chat_sessions(video_id) where video_id is not null;
create index chat_messages_session_created_idx on public.chat_messages(session_id, created_at);
create index chat_messages_user_created_idx on public.chat_messages(user_id, created_at desc);
create index chat_messages_status_idx on public.chat_messages(status) where status in ('pending','streaming');
create index chat_session_knowledge_user_idx on public.chat_session_knowledge_items(user_id, session_id);
create index chat_message_sources_message_idx on public.chat_message_sources(message_id);
create index chat_message_sources_user_idx on public.chat_message_sources(user_id, created_at desc);
create index chat_message_sources_video_idx on public.chat_message_sources(video_id) where video_id is not null;
create index chat_message_sources_knowledge_idx on public.chat_message_sources(knowledge_item_id) where knowledge_item_id is not null;
create index chat_message_sources_chunk_idx on public.chat_message_sources(transcript_chunk_id) where transcript_chunk_id is not null;

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_session_knowledge_items enable row level security;
alter table public.chat_message_sources enable row level security;

revoke all on public.chat_sessions, public.chat_messages, public.chat_session_knowledge_items, public.chat_message_sources from anon, authenticated;
grant select, insert, update, delete on public.chat_sessions, public.chat_messages, public.chat_session_knowledge_items, public.chat_message_sources to authenticated;
grant all on public.chat_sessions, public.chat_messages, public.chat_session_knowledge_items, public.chat_message_sources to service_role;

create policy chat_sessions_select_own on public.chat_sessions for select to authenticated using ((select auth.uid()) = user_id);
create policy chat_sessions_insert_own on public.chat_sessions for insert to authenticated with check ((select auth.uid()) = user_id);
create policy chat_sessions_update_own on public.chat_sessions for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy chat_sessions_delete_own on public.chat_sessions for delete to authenticated using ((select auth.uid()) = user_id);

create policy chat_messages_select_own on public.chat_messages for select to authenticated using ((select auth.uid()) = user_id);
create policy chat_messages_insert_own on public.chat_messages for insert to authenticated with check (
  (select auth.uid()) = user_id and exists (
    select 1 from public.chat_sessions s where s.id = session_id and s.user_id = (select auth.uid())
  )
);
create policy chat_messages_update_own on public.chat_messages for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy chat_messages_delete_own on public.chat_messages for delete to authenticated using ((select auth.uid()) = user_id);

create policy chat_session_knowledge_select_own on public.chat_session_knowledge_items for select to authenticated using ((select auth.uid()) = user_id);
create policy chat_session_knowledge_insert_own on public.chat_session_knowledge_items for insert to authenticated with check (
  (select auth.uid()) = user_id and
  exists (select 1 from public.chat_sessions s where s.id = session_id and s.user_id = (select auth.uid())) and
  exists (select 1 from public.knowledge_items k where k.id = knowledge_item_id and k.user_id = (select auth.uid()))
);
create policy chat_session_knowledge_delete_own on public.chat_session_knowledge_items for delete to authenticated using ((select auth.uid()) = user_id);

create policy chat_message_sources_select_own on public.chat_message_sources for select to authenticated using ((select auth.uid()) = user_id);
create policy chat_message_sources_insert_own on public.chat_message_sources for insert to authenticated with check (
  (select auth.uid()) = user_id and exists (
    select 1 from public.chat_messages m
    join public.chat_sessions s on s.id = m.session_id
    where m.id = message_id and m.user_id = (select auth.uid()) and s.user_id = (select auth.uid())
  )
);
create policy chat_message_sources_delete_own on public.chat_message_sources for delete to authenticated using ((select auth.uid()) = user_id);
