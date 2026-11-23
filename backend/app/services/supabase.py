from supabase import create_client
from app.config import settings
def admin_client():
 if not settings.supabase_url or not settings.supabase_service_role_key: raise RuntimeError('Supabase server credentials not configured')
 return create_client(settings.supabase_url,settings.supabase_service_role_key)
