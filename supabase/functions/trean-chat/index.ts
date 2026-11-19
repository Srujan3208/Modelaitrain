import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
const KEY=Deno.env.get("GEMINI_API_KEY")??"";
// Gemini model IDs are configurable so a model retirement never requires editing application code.
const MODEL=Deno.env.get("TREAN_CHAT_MODEL")??"gemini-3.8-flash";
const EMBED=Deno.env.get("TREAN_EMBEDDING_MODEL")??"gemini-embedding-001";
const GEMINI_TIMEOUT_MS=Number(Deno.env.get("TREAN_GEMINI_TIMEOUT_MS")??"25000");
const RETRYABLE_STATUS=new Set([408,429,500,502,503,504]);
const sleep=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
async function gemini(path:string,body:unknown){
 const isGeneration=path.endsWith(":generateContent");
 // Do not retry retired models: the replacement model is used as the default and as the fallback.
 const models=isGeneration?[MODEL,"gemini-3.8-flash"].filter((m,i,a)=>a.indexOf(m)===i):[path.split(":")[0]];
 let lastError="Gemini provider request failed";
 for(const model of models){
  for(let attempt=0;attempt<3;attempt++){
   const endpoint=isGeneration?model+":"+path.split(":").pop():path;
   const controller=new AbortController();
   const timeout=setTimeout(()=>controller.abort(),GEMINI_TIMEOUT_MS);
   try{
    const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+endpoint,{
     method:"POST",
     headers:{"Content-Type":"application/json","X-goog-api-key":KEY},
     body:JSON.stringify(body),
     signal:controller.signal
    });
    const d=await r.json().catch(()=>({}));
    if(r.ok)return d;
    const providerMessage=d?.error?.message??("Gemini API returned HTTP "+r.status);
    lastError=providerMessage;
    // A bad model or invalid request will not improve with retries/fallback to the same API shape.
    if(!RETRYABLE_STATUS.has(r.status))break;
    if(attempt<2)await sleep(500*(attempt+1));
   }catch(error){
    if(error instanceof DOMException&&error.name==="AbortError"){
     lastError="Gemini request timed out after "+GEMINI_TIMEOUT_MS+" ms";
    }else{
     lastError=error instanceof Error?error.message:"Gemini network request failed";
    }
    if(attempt<2)await sleep(500*(attempt+1));
   }finally{
    clearTimeout(timeout);
   }
  }
 }
 throw new Error("Gemini is temporarily unavailable: "+lastError);
}
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});if(req.method!=="POST")return json({error:"Method not allowed"},405);if(!KEY)return json({error:"AI provider not configured. Set GEMINI_API_KEY in Supabase Edge Function secrets."},503);
 const auth=req.headers.get("Authorization");if(!auth?.startsWith("Bearer "))return json({error:"Authentication required"},401);
 const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_ANON_KEY")??"",{global:{headers:{Authorization:auth}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data:authData,error:authError}=await supabase.auth.getUser(auth.slice(7));if(authError||!authData.user)return json({error:"Invalid or expired session"},401);const userId=authData.user.id;
 try{
  const body=await req.json();const message=String(body.message??"").trim();if(!message)return json({error:"Message is required"},400);if(message.length>8000)return json({error:"Message exceeds 8,000 characters"},413);
  let sessionId=body.session_id?String(body.session_id):null;const requestedVideo=body.video_id?String(body.video_id):null;const contextType=["general","video","knowledge_base","mixed"].includes(body.context_type)?body.context_type:"general";const requestedKnowledge=Array.isArray(body.knowledge_ids)?body.knowledge_ids.slice(0,20).map(String):[];
  if(sessionId){const {data,error}=await supabase.from("chat_sessions").select("id").eq("id",sessionId).eq("user_id",userId).single();if(error||!data)return json({error:"Chat session not found"},404);}
  else{const {data,error}=await supabase.from("chat_sessions").insert({user_id:userId,title:message.slice(0,80),context_type:contextType,video_id:requestedVideo}).select("id").single();if(error||!data)throw error??new Error("Session creation failed");sessionId=data.id;}
  const {data:session,error:se}=await supabase.from("chat_sessions").select("id,video_id,context_type,system_context").eq("id",sessionId).eq("user_id",userId).single();if(se||!session)return json({error:"Chat session not found"},404);
  const videoId=session.video_id??requestedVideo;if(videoId){const {data:v,error}=await supabase.from("videos").select("id,title,transcript,youtube_url").eq("id",videoId).eq("user_id",userId).single();if(error||!v)return json({error:"Video context unavailable"},403);if(!session.video_id)await supabase.from("chat_sessions").update({video_id:videoId,context_type:contextType,updated_at:new Date().toISOString()}).eq("id",sessionId);}
  if(requestedKnowledge.length){const {data:k,error}=await supabase.from("knowledge_items").select("id").eq("user_id",userId).in("id",requestedKnowledge);if(error)throw error;if((k??[]).length!==requestedKnowledge.length)return json({error:"Knowledge item access denied"},403);const rows=requestedKnowledge.map((knowledge_item_id:string)=>({session_id:sessionId,knowledge_item_id,user_id:userId}));const {error:e}=await supabase.from("chat_session_knowledge_items").upsert(rows,{onConflict:"session_id,knowledge_item_id"});if(e)throw e;}
  const {data:linked}=await supabase.from("chat_session_knowledge_items").select("knowledge_item_id").eq("session_id",sessionId).eq("user_id",userId);const knowledgeIds=(linked??[]).map((x:any)=>x.knowledge_item_id);
  const {data:userMsg,error:um}=await supabase.from("chat_messages").insert({session_id:sessionId,user_id:userId,role:"user",content:message,status:"completed"}).select("id").single();if(um||!userMsg)throw um??new Error("Message save failed");
  const {data:history}=await supabase.from("chat_messages").select("role,content").eq("session_id",sessionId).eq("user_id",userId).order("created_at",{ascending:true}).limit(20);
  const sources:any[]=[];
  // General chat must not depend on the embedding provider. Only embed when retrieval context is requested.
  let vector:number[]|null=null;
  if(videoId||knowledgeIds.length){const emb=await gemini(EMBED+":embedContent",{model:"models/"+EMBED,content:{parts:[{text:message}]},taskType:"RETRIEVAL_QUERY",outputDimensionality:1536});vector=emb?.embedding?.values;if(!Array.isArray(vector))throw new Error("Knowledge search is temporarily unavailable. Please try again.");}
  if(videoId){const {data:chunks,error}=await supabase.rpc("search_transcript_chunks",{query_embedding:JSON.stringify(vector),p_video_id:videoId,p_match_count:6});if(error)throw error;for(const c of chunks??[])sources.push({source_type:"transcript_chunk",transcript_chunk_id:c.id,video_id:c.video_id,source_title:"Video transcript",excerpt:c.content,start_seconds:c.start_seconds,end_seconds:c.end_seconds,relevance_score:c.similarity});if(!sources.length){const {data:v}=await supabase.from("videos").select("title,transcript,youtube_url").eq("id",videoId).eq("user_id",userId).single();if(v?.transcript)sources.push({source_type:"video_transcript",video_id:videoId,source_title:v.title??"Video transcript",source_url:v.youtube_url,excerpt:v.transcript.slice(0,12000),relevance_score:1});}}
  if(knowledgeIds.length){const {data:items,error}=await supabase.rpc("search_knowledge_items",{query_embedding:JSON.stringify(vector),p_knowledge_ids:knowledgeIds,p_match_count:6});if(error)throw error;for(const k of items??[])sources.push({source_type:"knowledge_item",knowledge_item_id:k.id,video_id:k.video_id,source_title:k.title,excerpt:k.content,relevance_score:k.similarity});if(!items?.length){const {data:k}=await supabase.from("knowledge_items").select("id,video_id,title,content").eq("user_id",userId).in("id",knowledgeIds).limit(10);for(const item of k??[])sources.push({source_type:"knowledge_item",knowledge_item_id:item.id,video_id:item.video_id,source_title:item.title,excerpt:item.content,relevance_score:1});}}
  const context=sources.map((s,i)=>"[Source "+(i+1)+"] "+(s.source_title??s.source_type)+(s.start_seconds!=null?" ("+s.start_seconds+"s-"+(s.end_seconds??s.start_seconds)+"s)":"")+"\n"+(s.excerpt??"")).join("\n\n");
  const system="You are TREAN AI, an educational learning assistant. Answer clearly and accurately. Use supplied context when relevant. If context does not support an answer, say so and distinguish general knowledge from source-derived claims. Cite supplied sources inline as [Source 1], [Source 2], etc. Never invent sources or timestamps.\n\nContext:\n"+(context||"No relevant video or knowledge context retrieved.");
  const completion=await gemini(MODEL+":generateContent",{systemInstruction:{parts:[{text:system}]},contents:[...(history??[]).filter((m:any)=>m.role==="user"||m.role==="assistant").map((m:any)=>({role:m.role==="assistant"?"model":"user",parts:[{text:m.content}]}))],generationConfig:{temperature:0.3}});
  const answer=completion?.candidates?.[0]?.content?.parts?.map((p:any)=>p.text??"").join("");if(typeof answer!=="string"||!answer.trim())throw new Error("AI returned empty answer");
  const {data:assistant,error:ae}=await supabase.from("chat_messages").insert({session_id:sessionId,user_id:userId,role:"assistant",content:answer,status:"completed",model:MODEL,prompt_tokens:null,completion_tokens:null}).select("id").single();if(ae||!assistant)throw ae??new Error("Assistant message save failed");
  const rows=sources.map((s,i)=>({message_id:assistant.id,user_id:userId,...s,citation_label:"Source "+(i+1)}));if(rows.length){const {error}=await supabase.from("chat_message_sources").insert(rows);if(error)throw error;}
  const now=new Date().toISOString();await supabase.from("chat_sessions").update({updated_at:now,last_message_at:now}).eq("id",sessionId).eq("user_id",userId);
  return json({session_id:sessionId,user_message_id:userMsg.id,assistant_message_id:assistant.id,answer,sources:sources.map((s,i)=>({citation_label:"Source "+(i+1),source_title:s.source_title,source_type:s.source_type,excerpt:s.excerpt,video_id:s.video_id,knowledge_item_id:s.knowledge_item_id,transcript_chunk_id:s.transcript_chunk_id,start_seconds:s.start_seconds,end_seconds:s.end_seconds,source_url:s.source_url,relevance_score:s.relevance_score})),usage:null,model:MODEL});
 }catch(e){
  const message=e instanceof Error?e.message:"Chat request failed";
  console.error("trean-chat",message);
  const retryable=/temporarily unavailable|timed out|high demand|rate limit/i.test(message);
  return json({error:message,code:retryable?"AI_PROVIDER_TEMPORARY":"CHAT_REQUEST_FAILED",retryable},retryable?503:500);
 }
});