import httpx
from app.config import settings
async def generate(prompt,system='You are TREAN AI, a helpful learning assistant.',model=None):
 if not settings.openrouter_api_key: raise RuntimeError('OPENROUTER_API_KEY is not configured')
 payload={'model':model or settings.default_chat_model,'messages':[{'role':'system','content':system},{'role':'user','content':prompt}]}
 headers={'Authorization':f'Bearer {settings.openrouter_api_key}','Content-Type':'application/json'}
 async with httpx.AsyncClient(timeout=90) as client:
  response=await client.post(settings.openrouter_base_url+'/chat/completions',json=payload,headers=headers); response.raise_for_status(); data=response.json()
 return data['choices'][0]['message']['content']
