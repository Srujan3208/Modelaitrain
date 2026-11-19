revoke all on function public.validate_video_worker_secret(text) from public,anon,authenticated;
grant execute on function public.validate_video_worker_secret(text) to service_role;
create index if not exists video_playlist_items_video_idx on public.video_playlist_items(video_id);
