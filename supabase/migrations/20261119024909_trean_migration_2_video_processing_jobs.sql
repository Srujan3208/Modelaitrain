-- TREAN AI Migration 2: reliable video-processing queue.
-- Non-destructive; workers should call claim_video_processing_jobs using service_role.

CREATE TABLE IF NOT EXISTS public.video_processing_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  job_type text NOT NULL DEFAULT 'process_video',
  status text NOT NULL DEFAULT 'queued',
  priority smallint NOT NULL DEFAULT 0,
  attempts integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 5,
  available_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz,
  locked_until timestamptz,
  lock_token uuid,
  locked_by text,
  heartbeat_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  last_error text,
  error_code text,
  result jsonb NOT NULL DEFAULT '{}'::jsonb,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT video_processing_jobs_type_valid CHECK(job_type IN ('process_video','extract_transcript','chunk_transcript','generate_embeddings','extract_knowledge')),
  CONSTRAINT video_processing_jobs_status_valid CHECK(status IN ('queued','processing','retrying','completed','failed','cancelled')),
  CONSTRAINT video_processing_jobs_priority_range CHECK(priority BETWEEN -100 AND 100),
  CONSTRAINT video_processing_jobs_attempts_valid CHECK(attempts>=0 AND max_attempts BETWEEN 1 AND 20 AND attempts<=max_attempts),
  CONSTRAINT video_processing_jobs_json_objects CHECK(jsonb_typeof(result)='object' AND jsonb_typeof(payload)='object'),
  CONSTRAINT video_processing_jobs_lock_consistency CHECK((status='processing' AND lock_token IS NOT NULL AND locked_until IS NOT NULL) OR (status<>'processing' AND lock_token IS NULL AND locked_until IS NULL))
);
CREATE UNIQUE INDEX IF NOT EXISTS video_processing_jobs_active_unique ON public.video_processing_jobs(video_id,job_type) WHERE status IN ('queued','processing','retrying');
CREATE INDEX IF NOT EXISTS video_processing_jobs_claim_idx ON public.video_processing_jobs(status,available_at,priority DESC,created_at) WHERE status IN ('queued','retrying');
CREATE INDEX IF NOT EXISTS video_processing_jobs_user_created_idx ON public.video_processing_jobs(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS video_processing_jobs_video_idx ON public.video_processing_jobs(video_id,created_at DESC);
CREATE INDEX IF NOT EXISTS video_processing_jobs_expired_locks_idx ON public.video_processing_jobs(locked_until) WHERE status='processing';
ALTER TABLE public.video_processing_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own processing jobs" ON public.video_processing_jobs FOR SELECT TO authenticated USING ((select auth.uid())=user_id);
CREATE POLICY "Users can cancel their own queued jobs" ON public.video_processing_jobs FOR UPDATE TO authenticated USING ((select auth.uid())=user_id AND status IN ('queued','retrying')) WITH CHECK ((select auth.uid())=user_id AND status='cancelled');
REVOKE ALL ON public.video_processing_jobs FROM anon,authenticated;
GRANT SELECT ON public.video_processing_jobs TO authenticated;
GRANT UPDATE(status) ON public.video_processing_jobs TO authenticated;
GRANT ALL ON public.video_processing_jobs TO service_role;
CREATE OR REPLACE FUNCTION public.claim_video_processing_jobs(p_worker_id text,p_limit integer DEFAULT 1,p_lease_seconds integer DEFAULT 300)
RETURNS TABLE(job_id uuid,video_id uuid,user_id uuid,job_type text,attempts integer,max_attempts integer,payload jsonb,lock_token uuid)
LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$
 WITH candidates AS (SELECT j.id FROM public.video_processing_jobs j WHERE j.status IN ('queued','retrying') AND j.available_at<=now() AND j.attempts<j.max_attempts ORDER BY j.priority DESC,j.available_at ASC,j.created_at ASC FOR UPDATE SKIP LOCKED LIMIT greatest(1,least(coalesce(p_limit,1),20))),
 claimed AS (UPDATE public.video_processing_jobs j SET status='processing',attempts=j.attempts+1,locked_at=now(),locked_until=now()+make_interval(secs=>greatest(30,least(coalesce(p_lease_seconds,300),3600))),lock_token=gen_random_uuid(),locked_by=left(coalesce(p_worker_id,'worker'),128),heartbeat_at=now(),started_at=coalesce(j.started_at,now()),updated_at=now() FROM candidates c WHERE j.id=c.id RETURNING j.id,j.video_id,j.user_id,j.job_type,j.attempts,j.max_attempts,j.payload,j.lock_token)
 SELECT id,video_id,user_id,job_type,attempts,max_attempts,payload,lock_token FROM claimed; $$;
CREATE OR REPLACE FUNCTION public.heartbeat_video_processing_job(p_job_id uuid,p_lock_token uuid,p_lease_seconds integer DEFAULT 300)
RETURNS boolean LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$
 UPDATE public.video_processing_jobs SET heartbeat_at=now(),locked_until=now()+make_interval(secs=>greatest(30,least(coalesce(p_lease_seconds,300),3600))),updated_at=now() WHERE id=p_job_id AND status='processing' AND lock_token=p_lock_token RETURNING true; $$;
CREATE OR REPLACE FUNCTION public.complete_video_processing_job(p_job_id uuid,p_lock_token uuid,p_result jsonb DEFAULT '{}'::jsonb)
RETURNS boolean LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$
 UPDATE public.video_processing_jobs SET status='completed',result=coalesce(p_result,'{}'::jsonb),completed_at=now(),locked_at=NULL,locked_until=NULL,lock_token=NULL,locked_by=NULL,heartbeat_at=NULL,last_error=NULL,updated_at=now() WHERE id=p_job_id AND status='processing' AND lock_token=p_lock_token RETURNING true; $$;
CREATE OR REPLACE FUNCTION public.fail_video_processing_job(p_job_id uuid,p_lock_token uuid,p_error text,p_error_code text DEFAULT NULL,p_retry_delay_seconds integer DEFAULT 30)
RETURNS TABLE(new_status text,next_available_at timestamptz) LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$
 UPDATE public.video_processing_jobs SET status=CASE WHEN attempts>=max_attempts THEN 'failed' ELSE 'retrying' END,available_at=CASE WHEN attempts>=max_attempts THEN available_at ELSE now()+make_interval(secs=>greatest(5,least(coalesce(p_retry_delay_seconds,30),86400))) END,failed_at=CASE WHEN attempts>=max_attempts THEN now() ELSE NULL END,last_error=left(coalesce(p_error,'Unknown processing error'),4000),error_code=left(p_error_code,128),locked_at=NULL,locked_until=NULL,lock_token=NULL,locked_by=NULL,heartbeat_at=NULL,updated_at=now() WHERE id=p_job_id AND status='processing' AND lock_token=p_lock_token RETURNING status,available_at; $$;
CREATE OR REPLACE FUNCTION public.requeue_expired_video_processing_jobs()
RETURNS integer LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$
 WITH expired AS (UPDATE public.video_processing_jobs SET status=CASE WHEN attempts>=max_attempts THEN 'failed' ELSE 'retrying' END,available_at=CASE WHEN attempts>=max_attempts THEN available_at ELSE now()+make_interval(secs=>least(86400,30*power(2,greatest(0,attempts-1))::integer)) END,failed_at=CASE WHEN attempts>=max_attempts THEN now() ELSE NULL END,last_error='Worker lease expired',error_code='LEASE_EXPIRED',locked_at=NULL,locked_until=NULL,lock_token=NULL,locked_by=NULL,heartbeat_at=NULL,updated_at=now() WHERE status='processing' AND locked_until<now() RETURNING id) SELECT count(*)::integer FROM expired; $$;
REVOKE ALL ON FUNCTION public.claim_video_processing_jobs(text,integer,integer) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.heartbeat_video_processing_job(uuid,uuid,integer) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.complete_video_processing_job(uuid,uuid,jsonb) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.fail_video_processing_job(uuid,uuid,text,text,integer) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.requeue_expired_video_processing_jobs() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.claim_video_processing_jobs(text,integer,integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.heartbeat_video_processing_job(uuid,uuid,integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.complete_video_processing_job(uuid,uuid,jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.fail_video_processing_job(uuid,uuid,text,text,integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.requeue_expired_video_processing_jobs() TO service_role;
