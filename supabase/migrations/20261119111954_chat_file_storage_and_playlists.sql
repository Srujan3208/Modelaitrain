insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('trean-chat-files','trean-chat-files',false,10485760,array['image/jpeg','image/png','image/webp','image/gif','application/pdf','text/plain','text/markdown'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
do $$
begin
 if not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='trean_chat_files_select_own') then
  create policy trean_chat_files_select_own on storage.objects for select to authenticated using(bucket_id='trean-chat-files' and (storage.foldername(name))[1]=(select auth.uid())::text);
 end if;
 if not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='trean_chat_files_insert_own') then
  create policy trean_chat_files_insert_own on storage.objects for insert to authenticated with check(bucket_id='trean-chat-files' and (storage.foldername(name))[1]=(select auth.uid())::text);
 end if;
 if not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='trean_chat_files_update_own') then
  create policy trean_chat_files_update_own on storage.objects for update to authenticated using(bucket_id='trean-chat-files' and (storage.foldername(name))[1]=(select auth.uid())::text) with check(bucket_id='trean-chat-files' and (storage.foldername(name))[1]=(select auth.uid())::text);
 end if;
 if not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='trean_chat_files_delete_own') then
  create policy trean_chat_files_delete_own on storage.objects for delete to authenticated using(bucket_id='trean-chat-files' and (storage.foldername(name))[1]=(select auth.uid())::text);
 end if;
end $$;
create table if not exists public.video_playlists(
 id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,
 youtube_playlist_id text not null,title text not null,channel_name text,thumbnail_url text,
 total_videos integer not null default 0 check(total_videos>=0),status text not null default 'active' check(status in ('active','processing','completed','failed')),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(user_id,youtube_playlist_id)
);
create table if not exists public.video_playlist_items(
 id uuid primary key default gen_random_uuid(),playlist_id uuid not null references public.video_playlists(id) on delete cascade,
 video_id uuid not null references public.videos(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,
 position integer not null default 0 check(position>=0),created_at timestamptz not null default now(),unique(playlist_id,video_id)
);
create index if not exists video_playlists_user_created_idx on public.video_playlists(user_id,created_at desc);
create index if not exists video_playlist_items_user_playlist_idx on public.video_playlist_items(user_id,playlist_id,position);
alter table public.video_playlists enable row level security;alter table public.video_playlist_items enable row level security;
revoke all on public.video_playlists,public.video_playlist_items from anon,authenticated;
grant select,insert,update,delete on public.video_playlists,public.video_playlist_items to authenticated;
grant all on public.video_playlists,public.video_playlist_items to service_role;
do $$
begin
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='video_playlists' and policyname='video_playlists_select_own') then create policy video_playlists_select_own on public.video_playlists for select to authenticated using((select auth.uid())=user_id); end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='video_playlists' and policyname='video_playlists_insert_own') then create policy video_playlists_insert_own on public.video_playlists for insert to authenticated with check((select auth.uid())=user_id); end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='video_playlists' and policyname='video_playlists_update_own') then create policy video_playlists_update_own on public.video_playlists for update to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id); end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='video_playlists' and policyname='video_playlists_delete_own') then create policy video_playlists_delete_own on public.video_playlists for delete to authenticated using((select auth.uid())=user_id); end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='video_playlist_items' and policyname='video_playlist_items_select_own') then create policy video_playlist_items_select_own on public.video_playlist_items for select to authenticated using((select auth.uid())=user_id); end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='video_playlist_items' and policyname='video_playlist_items_insert_own') then create policy video_playlist_items_insert_own on public.video_playlist_items for insert to authenticated with check((select auth.uid())=user_id and exists(select 1 from public.video_playlists p where p.id=playlist_id and p.user_id=(select auth.uid())) and exists(select 1 from public.videos v where v.id=video_id and v.user_id=(select auth.uid()))); end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='video_playlist_items' and policyname='video_playlist_items_delete_own') then create policy video_playlist_items_delete_own on public.video_playlist_items for delete to authenticated using((select auth.uid())=user_id); end if;
end $$;
