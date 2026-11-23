from fastapi import APIRouter,Depends,HTTPException
from pydantic import BaseModel,HttpUrl
from app.services.auth import get_user_id
from app.services.supabase import admin_client
from app.services.video import youtube_id
from app.services.ai import generate
router=APIRouter()
class VideoBody(BaseModel): url:HttpUrl
class ChatBody(BaseModel): message:str; conversation_id:str|None=None; model:str|None=None
@router.post('/videos')
def create_video(body:VideoBody,user_id:str=Depends(get_user_id)):
 url=str(body.url); vid=youtube_id(url)
 if not vid: raise HTTPException(400,'Only YouTube URLs supported currently')
 db=admin_client(); source=db.table('learning_sources').upsert({'user_id':user_id,'url':url,'title':vid,'source_type':'youtube','status':'queued'},on_conflict='user_id,url').execute().data[0]
 job=db.table('processing_jobs').insert({'user_id':user_id,'source_id':source['id'],'status':'queued','stage':'queued'}).execute().data[0]
 return {'source':source,'job':job}
@router.get('/sources')
def sources(user_id:str=Depends(get_user_id)):
 return admin_client().table('learning_sources').select('*').eq('user_id',user_id).order('created_at',desc=True).execute().data
@router.get('/jobs/{job_id}')
def job(job_id:str,user_id:str=Depends(get_user_id)):
 r=admin_client().table('processing_jobs').select('*').eq('id',job_id).eq('user_id',user_id).maybe_single().execute()
 if not r.data: raise HTTPException(404,'Job not found')
 return r.data
@router.post('/chat')
async def chat(body:ChatBody,user_id:str=Depends(get_user_id)):
 if not body.message.strip(): raise HTTPException(400,'Message required')
 db=admin_client(); conv=body.conversation_id
 if not conv: conv=db.table('conversations').insert({'user_id':user_id,'title':body.message[:80]}).execute().data[0]['id']
 db.table('messages').insert({'conversation_id':conv,'user_id':user_id,'role':'user','content':body.message}).execute()
 try: answer=await generate(body.message,model=body.model)
 except Exception as e: raise HTTPException(502,str(e))
 db.table('messages').insert({'conversation_id':conv,'user_id':user_id,'role':'assistant','content':answer}).execute()
 return {'conversation_id':conv,'answer':answer}
