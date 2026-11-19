select cron.schedule(
 'trean-video-worker',
 '30 seconds',
 $job$
 select net.http_post(
  url:='https://evxweqaldnvmsvophuny.supabase.co/functions/v1/process-video',
  headers:=jsonb_build_object(
   'Content-Type','application/json',
   'x-worker-secret',(select decrypted_secret from vault.decrypted_secrets where name='trean_video_worker_secret')
  ),
  body:=jsonb_build_object('scheduled',true,'requested_at',now()),
  timeout_milliseconds:=10000
 );
 $job$
);
