from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
 app_name:str='TREAN AI API'; environment:str='development'; api_prefix:str='/api/v1'; supabase_url:str=''; supabase_anon_key:str=''; supabase_service_role_key:str=''; openrouter_api_key:str=''; openrouter_base_url:str='https://openrouter.ai/api/v1'; default_chat_model:str='openai/gpt-4o-mini'; worker_poll_seconds:int=5
 model_config=SettingsConfigDict(env_file='.env',extra='ignore')
settings=Settings()
