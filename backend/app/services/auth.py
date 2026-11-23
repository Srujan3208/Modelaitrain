from fastapi import Header,HTTPException
from app.services.supabase import admin_client
def get_user_id(authorization:str|None=Header(default=None)):
 if not authorization or not authorization.lower().startswith('bearer '): raise HTTPException(401,'Bearer token required')
 try:
  user=admin_client().auth.get_user(authorization.split(' ',1)[1]).user
  if not user: raise ValueError()
  return user.id
 except Exception: raise HTTPException(401,'Invalid or expired session')
