select vault.create_secret(encode(gen_random_bytes(48),'hex'),'trean_video_worker_secret','Secret used by the scheduled TREAN video processing worker',null)
where not exists(select 1 from vault.decrypted_secrets where name='trean_video_worker_secret');
create or replace function public.validate_video_worker_secret(p_token text)
returns boolean language sql security definer set search_path='' as $$
 select coalesce(length(p_token)>=80 and exists(select 1 from vault.decrypted_secrets where name='trean_video_worker_secret' and decrypted_secret=p_token),false);
$$;
revoke all on function public.validate_video_worker_secret(text) from public,authenticated;
grant execute on function public.validate_video_worker_secret(text) to anon,service_role;
