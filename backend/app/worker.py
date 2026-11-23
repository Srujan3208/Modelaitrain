import time
from app.config import settings
from app.services.supabase import admin_client
from app.services.video import get_transcript,chunk_text

def process_job(job):
 db=admin_client(); jid=job['id']; sid=job['source_id']; uid=job['user_id']
 db.table('processing_jobs').update({'status':'processing','stage':'transcript','attempts':job.get('attempts',0)+1}).eq('id',jid).execute()
 db.table('learning_sources').update({'status':'processing'}).eq('id',sid).execute()
 source=db.table('learning_sources').select('url').eq('id',sid).single().execute().data
 try:
  url=source['url']; vid=url.split('v=')[-1].split('&')[0] if 'v=' in url else url.split('youtu.be/')[-1].split('?')[0]
  transcript,lang=get_transcript(vid)
  db.table('transcripts').upsert({'source_id':sid,'user_id':uid,'content':transcript,'language':lang},on_conflict='source_id').execute()
  db.table('processing_jobs').update({'stage':'chunking'}).eq('id',jid).execute()
  chunks=chunk_text(transcript); db.table('knowledge_chunks').delete().eq('source_id',sid).execute()
  if chunks: db.table('knowledge_chunks').insert([{'source_id':sid,'user_id':uid,'chunk_index':i,'content':c} for i,c in enumerate(chunks)]).execute()
  db.table('processing_jobs').update({'status':'completed','stage':'completed'}).eq('id',jid).execute(); db.table('learning_sources').update({'status':'completed'}).eq('id',sid).execute()
 except Exception as e:
  db.table('processing_jobs').update({'status':'failed','stage':'failed','error':str(e)}).eq('id',jid).execute(); db.table('learning_sources').update({'status':'failed'}).eq('id',sid).execute()
def run_worker():
 while True:
  jobs=admin_client().table('processing_jobs').select('*').eq('status','queued').order('created_at').limit(1).execute().data
  if jobs: process_job(jobs[0])
  else: time.sleep(settings.worker_poll_seconds)
if __name__=='__main__': run_worker()
