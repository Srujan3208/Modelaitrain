create or replace function public.retry_video_processing_for_user(p_video_id uuid)
returns boolean language plpgsql security definer set search_path='' as $$
declare v_user_id uuid := auth.uid();v_job_id uuid;
begin
 if v_user_id is null then return false; end if;
 update public.video_processing_jobs set status='queued',attempts=0,max_attempts=5,available_at=now(),failed_at=null,last_error=null,error_code=null,locked_at=null,locked_until=null,lock_token=null,locked_by=null,heartbeat_at=null,updated_at=now()
 where video_id=p_video_id and user_id=v_user_id and status in('failed','retrying') returning id into v_job_id;
 if v_job_id is null then return false; end if;
 update public.videos set status='pending',processing_stage='pending',processing_progress=0,retry_count=0,last_error=null,processed_at=null,updated_at=now() where id=p_video_id and user_id=v_user_id;
 return true;
end;
$$;
revoke all on function public.retry_video_processing_for_user(uuid) from public,anon;
grant execute on function public.retry_video_processing_for_user(uuid) to authenticated;
