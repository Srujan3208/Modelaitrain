from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.routes import router
app=FastAPI(title='TREAN AI API',version='0.2.0')
app.add_middleware(CORSMiddleware,allow_origins=['http://localhost:3000','https://trean-ai.vercel.app'],allow_credentials=True,allow_methods=['*'],allow_headers=['*'])
app.include_router(router,prefix=settings.api_prefix)
@app.get('/')
def root(): return {'name':settings.app_name,'status':'running','docs':'/docs'}
@app.get('/health')
def health(): return {'status':'healthy'}
