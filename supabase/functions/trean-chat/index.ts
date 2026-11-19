import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
const OPENROUTER_KEY=Deno.env.get("OPENROUTER_API_KEY")??"";
const OPENROUTER_BASE=Deno.env.get("OPENROUTER_BASE_URL")??"https://openrouter.ai/api/v1";
type ModelConfig={id:string,model:string,role:string,enabled?:boolean};
const DEFAULT_MODELS:ModelConfig[]=[{id:"primary",model:"openai/gpt-4o",role:"primary"}];
function configuredModels():ModelConfig[]{try{const raw=Deno.env.get("TREAN_MODELS_JSON");if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed))return parsed.filter((m:any)=>m?.model&&m?.role).slice(0,5);}}catch{}return DEFAULT_MODELS;}
function complexity(message:string){if(/debug|architect|build|design|research|compare|analy[sz]e|implement|develop|project|write.*code|algorithm|explain.*deep/i.test(message))return 3;if(message.length>1500)return 2;return 1;}
async function openrouter(model:string,messages:any[],temperature=0.35){if(!OPENROUTER_KEY)throw new Error("OPENROUTER_API_KEY is not configured");const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),25000);try{const r=await fetch(OPENROUTER_BASE+"/chat/completions",{method:"POST",headers:{"Authorization":"Bearer "+OPENROUTER_KEY,"Content-Type":"application/json","HTTP-Referer":"https://trean-ai.vercel.app","X-Title":"TREAN AI"},body:JSON.stringify({model,messages,temperature}),signal:controller.signal});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data?.error?.message??("OpenRouter HTTP "+r.status));const text=data?.choices?.[0]?.message?.content;if(typeof text!=="string"||!text.trim())throw new Error("Model returned empty content");return {text,model:data.model??model,usage:data.usage};}finally{clearTimeout(timer);}}
async function collaborativeGenerate(message:string,history:any[],system:string){const available=configuredModels().filter(m=>m.enabled!==false).slice(0,5);const count=Math.min(available.length,Math.max(1,complexity(message)));const selected=available.slice(0,count);const common=[{role:"system",content:system},{role:"user",content:message},...history.map((h:any)=>({role:h.role==="model"?"assistant":h.role,content:h.parts?.map((p:any)=>p.text??"").join("")??""}))];if(selected.length===1){const r=await openrouter(selected[0].model,common);return {answer:r.text,models:[{role:selected[0].role,model:r.model}],mode:"single",usage:r.usage};}
const rolePrompts=["Analyze requirements, facts, and the strongest solution.","Develop a practical solution with steps and examples.","Critique accuracy, risks, omissions, and edge cases.","Offer an alternative approach and compare tradeoffs.","Review proposals for consistency and quality."];
const results=await Promise.allSettled(selected.map((m,i)=>openrouter(m.model,[...common,{role:"system",content:"Assigned role: "+(m.role||rolePrompts[i])+". Provide a useful contribution. Do not claim to see other model outputs."}])));
const contributions=results.map((r,i)=>r.status==="fulfilled"?{role:selected[i].role,model:r.value.model,text:r.value.text,usage:r.value.usage}:{role:selected[i].role,model:selected[i].model,error:r.reason instanceof Error?r.reason.message:"Provider failed"});
const successful=contributions.filter(x=>!x.error);if(!successful.length)throw new Error("All collaborative models failed: "+contributions.map(x=>x.error).join("; "));
if(successful.length===1)return {answer:successful[0].text,models:successful.map(x=>({role:x.role,model:x.model})),mode:"fallback-single",usage:successful[0].usage};
const synth=await openrouter(successful[0].model,[{role:"system",content:system+" You are TREAN's synthesis engine. Integrate contributions, resolve contradictions, correct errors and produce one polished answer. Do not reveal internal reasoning."},{role:"user",content:message+"\n\nContributions:\n"+successful.map((x,i)=>"## Contribution "+(i+1)+" ("+x.role+")\n"+x.text).join("\n\n")}],0.25);
return {answer:synth.text,models:successful.map(x=>({role:x.role,model:x.model})),mode:"collaborative",usage:synth.usage};}
\nconst KEY=Deno.env.get("GEMINI_API_KEY")??"";
const admin=()=>createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false,autoRefreshToken:false}});
function toBase64(bytes:Uint8Array){let binary="";for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(binary);}
const MODEL="gemini-3.8-flash";
const FALLBACKS=["gemini-3.6-flash","gemini-3.1-flash-lite"];
const EMBED=Deno.env.get("TREAN_EMBEDDING_MODEL")??"gemini-embedding-001";
const LIMIT=Number(Deno.env.get("TREAN_GEMINI_TIMEOUT_MS")??"12000");
const RETRY=new Set([408,429,500,502,503,504]);
async function gemini(model:string,kind:string,body:unknown){
 const all=[model,...(kind==="generateContent"?FALLBACKS:[])];let last="";
 for(const candidate of all){
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),LIMIT);
  try{
   const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+candidate+":"+kind,{method:"POST",headers:{"Content-Type":"application/json","X-goog-api-key":KEY},body:JSON.stringify(body),signal:controller.signal});
   const data=await r.json().catch(()=>({}));
   if(r.ok)return {data,model:candidate};
   last=data?.error?.message??("HTTP "+r.status);
   if(!RETRY.has(r.status))break;
  }catch(e){last=e instanceof Error?e.message:"Provider request failed";}
  finally{clearTimeout(timer);}
 }
 throw new Error("AI provider unavailable: "+last);
}
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return json({error:"POST required"},405);
 if(!KEY&&!OPENROUTER_KEY)return json({error:"Configure OPENROUTER_API_KEY to enable TREAN AI."},503);
 const auth=req.headers.get("Authorization");if(!auth?.startsWith("Bearer "))return json({error:"Authentication required"},401);
 const sb=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_ANON_KEY")??"",{global:{headers:{Authorization:auth}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error:authError}=await sb.auth.getUser(auth.slice(7));if(authError||!user)return json({error:"Invalid session"},401);
 try{
  const body=await req.json();const message=String(body.message??"").trim();if(!message||message.length>8000)return json({error:"Message must be between 1 and 8,000 characters"},400);
  const requestedVideo=body.video_id?String(body.video_id):null;
  const selectedKnowledge=Array.isArray(body.knowledge_ids)?[...new Set(body.knowledge_ids.slice(0,20).map(String))]:[];
  const requestedAttachments=Array.isArray(body.attachments)?body.attachments.slice(0,4):[];
  const safeAttachments=requestedAttachments.map((a:any)=>({path:String(a.path??""),name:String(a.name??"attachment").slice(0,180),mime_type:String(a.mime_type??"application/octet-stream")}));
  let sessionId=body.session_id?String(body.session_id):null;
  let session:any=null;
  if(sessionId){
   const found=await sb.from("chat_sessions").select("id,user_id,title,video_id,context_type,system_context").eq("id",sessionId).eq("user_id",user.id).single();
   if(found.error||!found.data)return json({error:"Chat session not found"},404);session=found.data;
  }else{
   const created=await sb.from("chat_sessions").insert({user_id:user.id,title:message.slice(0,80),context_type:body.context_type||"general",video_id:requestedVideo}).select("id,user_id,title,video_id,context_type,system_context").single();
   if(created.error||!created.data)throw created.error??new Error("Could not create chat");session=created.data;sessionId=session.id;
  }
  const videoId=session.video_id??requestedVideo;
  if(videoId){const {data:v,error}=await sb.from("videos").select("id,title,transcript,youtube_url").eq("id",videoId).eq("user_id",user.id).single();if(error||!v)return json({error:"Video context is not available for this account"},403);}
  if(selectedKnowledge.length){
   const {data:k,error}=await sb.from("knowledge_items").select("id").eq("user_id",user.id).in("id",selectedKnowledge);
   if(error)throw error;if((k??[]).length!==selectedKnowledge.length)return json({error:"One or more knowledge items are unavailable"},403);
   const rows=selectedKnowledge.map((knowledge_item_id:string)=>({session_id:sessionId,knowledge_item_id,user_id:user.id}));
   const {error:linkError}=await sb.from("chat_session_knowledge_items").upsert(rows,{onConflict:"session_id,knowledge_item_id"});if(linkError)throw linkError;
  }
  const {data:links,error:linkReadError}=await sb.from("chat_session_knowledge_items").select("knowledge_item_id").eq("session_id",sessionId).eq("user_id",user.id);
  if(linkReadError)throw linkReadError;
  const knowledgeIds=(links??[]).map(x=>x.knowledge_item_id);
  for(const attachment of safeAttachments){
   if(!attachment.path.startsWith(user.id+"/"))return json({error:"Attachment ownership check failed"},403);
   if(!["image/jpeg","image/png","image/webp","image/gif","application/pdf","text/plain","text/markdown","audio/mpeg","audio/mp4","audio/wav","audio/webm","audio/ogg","video/mp4","video/webm"].includes(attachment.mime_type))return json({error:"Unsupported attachment type: "+attachment.mime_type},415);
  }
  const {data:userMsg,error:userInsertError}=await sb.from("chat_messages").insert({session_id:sessionId,user_id:user.id,role:"user",content:message,status:"completed",metadata:{attachments:safeAttachments}}).select("id").single();
  if(userInsertError||!userMsg)throw userInsertError??new Error("Could not save user message");
  // Build model history without duplicating the current message.
  const {data:prior,error:priorError}=await sb.from("chat_messages").select("role,content").eq("session_id",sessionId).eq("user_id",user.id).order("created_at",{ascending:false}).limit(21);
  if(priorError)throw priorError;
  const history=(prior??[]).reverse().filter(m=>m.role==="user"||m.role==="assistant").slice(-20).map(m=>({role:m.role==="assistant"?"model":"user",parts:[{text:m.content}]}));
  const sources:any[]=[];let vector:number[]|null=null;
  {
   const embedded=await gemini(EMBED,"embedContent",{model:"models/"+EMBED,content:{parts:[{text:message}]},taskType:"RETRIEVAL_QUERY",outputDimensionality:1536});
   vector=embedded.data?.embedding?.values;if(!Array.isArray(vector))throw new Error("Knowledge embedding could not be created");
  }
  if(videoId){
   const {data:chunks,error}=await sb.rpc("search_transcript_chunks",{query_embedding:JSON.stringify(vector),p_video_id:videoId,p_match_count:6});if(error)throw error;
   for(const c of chunks??[])sources.push({source_type:"transcript_chunk",transcript_chunk_id:c.id,video_id:c.video_id,source_title:"Video transcript",excerpt:c.content,start_seconds:c.start_seconds,end_seconds:c.end_seconds,relevance_score:c.similarity});
   if(!sources.length){const {data:v}=await sb.from("videos").select("title,transcript,youtube_url").eq("id",videoId).eq("user_id",user.id).single();if(v?.transcript)sources.push({source_type:"video_transcript",video_id:videoId,source_title:v.title??"Video transcript",source_url:v.youtube_url,excerpt:v.transcript.slice(0,12000),relevance_score:1});}
  }
  {
   const {data:items,error}=await sb.rpc("search_knowledge_items",{query_embedding:JSON.stringify(vector),p_knowledge_ids:knowledgeIds.length?knowledgeIds:null,p_match_count:8});if(error)throw error;
   for(const k of items??[])sources.push({source_type:"knowledge_item",knowledge_item_id:k.id,video_id:k.video_id,source_title:k.title,excerpt:k.content,relevance_score:k.similarity});
   if(!items?.length){const {data:k}=await sb.from("knowledge_items").select("id,video_id,title,content").eq("user_id",user.id).in("id",knowledgeIds).limit(10);for(const x of k??[])sources.push({source_type:"knowledge_item",knowledge_item_id:x.id,video_id:x.video_id,source_title:x.title,excerpt:x.content,relevance_score:1});}
  }
  // Server-side uploaded files are stored in this chat's messages; include the latest attachment context.
  const {data:attachments}=await sb.from("chat_messages").select("metadata,content").eq("session_id",sessionId).eq("user_id",user.id).eq("role","user").order("created_at",{ascending:false}).limit(10);
  const fileContext=(attachments??[]).filter(m=>m.metadata?.attachments?.length).flatMap(m=>m.metadata.attachments).map((a:any)=>"Attached file: "+a.name+" ("+a.type+"). "+(a.extracted_text??"")).filter(Boolean).join("\n\n");
  const context=sources.map((s,i)=>"[Source "+(i+1)+"] "+(s.source_title??s.source_type)+"\n"+(s.excerpt??"")).join("\n\n");
  const attachmentParts:any[]=[];
  if(safeAttachments.length){
   const storage=admin();
   for(const attachment of safeAttachments){
    const {data:file,error:fileError}=await storage.storage.from("trean-chat-files").download(attachment.path);
    if(fileError||!file)throw new Error("Could not read uploaded file: "+attachment.name);
    const buffer=new Uint8Array(await file.arrayBuffer());
    if(buffer.length>10*1024*1024)throw new Error("Attachment exceeds 10 MB: "+attachment.name);
    if(attachment.mime_type==="text/plain"||attachment.mime_type==="text/markdown"){
     const extracted=new TextDecoder().decode(buffer).slice(0,30000);
     attachmentParts.push({text:"\n\nAttached text file ("+attachment.name+"):\n"+extracted});
    }else{
     attachmentParts.push({inlineData:{mimeType:attachment.mime_type,data:toBase64(buffer)}});
     attachmentParts.unshift({text:"Attached file: "+attachment.name+" ("+attachment.mime_type+"). Analyze it as part of the user's request."});
    }
   }
   if(history.length)history[history.length-1].parts.push(...attachmentParts);
  }
  const system="You are TREAN AI, a professional educational learning assistant. Answer directly and clearly with structured Markdown. Use retrieved knowledge when relevant, but do not limit your reasoning to it. If the question is an application/problem-solving question, combine learned concepts with general knowledge and derive a solution step by step. Clearly label what comes from the user\u2019s learned sources versus general knowledge. If learned context is absent or incomplete, say so briefly and still answer using your knowledge. Cite retrieved learning context as [Source 1], [Source 2] exactly; never fabricate citations.\n\nLearning context:\n"+(context||"No video or knowledge context retrieved.")+"\n\nUploaded file context:\n"+(fileContext||"No text extraction available for uploaded files.");
  const generated=OPENROUTER_KEY?await collaborativeGenerate(message,history,system):await (async()=>{const g=await gemini(MODEL,"generateContent",{systemInstruction:{parts:[{text:system}]},contents:history,generationConfig:{temperature:0.35}});return {answer:g.data?.candidates?.[0]?.content?.parts?.map((p:any)=>p.text??"").join("")??"",models:[{role:"primary",model:g.model}],mode:"gemini-fallback",usage:null};})();\n  const answer=generated.answer;if(!answer?.trim())throw new Error("AI returned an empty response");\n  const {data:assistant,error:assistantError}=await sb.from("chat_messages").insert({session_id:sessionId,user_id:user.id,role:"assistant",content:answer,status:"completed",model:generated.models.map((m:any)=>m.model).join(","),metadata:{ai_mode:generated.mode,models:generated.models,usage:generated.usage}}).select("id").single();
  if(assistantError||!assistant)throw assistantError??new Error("Could not save assistant response");
  const rows=sources.map((s,i)=>({message_id:assistant.id,user_id:user.id,...s,citation_label:"Source "+(i+1)}));
  if(rows.length){const {error}=await sb.from("chat_message_sources").insert(rows);if(error)throw error;}
  const now=new Date().toISOString();await sb.from("chat_sessions").update({updated_at:now,last_message_at:now}).eq("id",sessionId).eq("user_id",user.id);
  return json({session_id:sessionId,user_message_id:userMsg.id,assistant_message_id:assistant.id,answer,sources:sources.map((s,i)=>({citation_label:"Source "+(i+1),source_title:s.source_title,source_type:s.source_type,excerpt:s.excerpt,video_id:s.video_id,knowledge_item_id:s.knowledge_item_id,transcript_chunk_id:s.transcript_chunk_id,start_seconds:s.start_seconds,end_seconds:s.end_seconds,source_url:s.source_url,relevance_score:s.relevance_score})),model:generated.models.map((m:any)=>m.model).join(","),ai_mode:generated.mode,models:generated.models});
 }catch(error){
  const message=error instanceof Error?error.message:"Chat failed";
  console.error("trean-chat",message);
  const retryable=/temporarily unavailable|timed out|rate limit|overloaded|capacity|busy/i.test(message);
  return json({error:message,code:retryable?"AI_PROVIDER_TEMPORARY":"CHAT_REQUEST_FAILED",retryable},retryable?503:500);
 }
});