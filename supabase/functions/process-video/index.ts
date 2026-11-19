import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info, x-worker-secret","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
const anonClient=()=>createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_ANON_KEY")!,{auth:{persistSession:false,autoRefreshToken:false}});
const admin=()=>createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false,autoRefreshToken:false}});
const xmlText=(xml:string)=>[...xml.matchAll(/<text[^>]*>(.*?)<\/text>/gs)].map(m=>m[1].replace(/<[^>]+>/g,"").replaceAll("&amp;","&").replaceAll("&quot;",'"').replaceAll("&#39;","'").replaceAll("&lt;","<").replaceAll("&gt;",">").trim()).filter(Boolean).join(" ");
async function embed(key:string,text:string){const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent",{method:"POST",headers:{"Content-Type":"application/json","X-goog-api-key":key},body:JSON.stringify({model:"models/gemini-embedding-001",content:{parts:[{text}]},taskType:"RETRIEVAL_DOCUMENT",outputDimensionality:1536})});const d=await r.json();if(!r.ok)throw new Error(d.error?.message??"Embedding generation failed");const values=d.embedding?.values;if(!Array.isArray(values)||values.length!==1536)throw new Error("Unexpected embedding dimensions");return values;}
async function parseTimedTextResponse(r:Response){
 if(!r.ok)return "";
 const body=await r.text();
 try{const data=JSON.parse(body);return (data.events??[]).flatMap((event:any)=>(event.segs??[]).map((seg:any)=>seg.utf8??"")).join(" ").replace(/\\s+/g," ").trim();}
 catch{return xmlText(body);}
}
async function captions(videoId:string){
 const headers={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"};
 try{
  const watch=await fetch("https://www.youtube.com/watch?v="+encodeURIComponent(videoId),{headers});
  if(watch.ok){
   const html=await watch.text(),marker=html.indexOf("ytInitialPlayerResponse");
   if(marker>=0){
    const start=html.indexOf("{",marker),end=html.indexOf("</script>",start);
    if(start>=0&&end>start){
     try{
      const player=JSON.parse(html.slice(start,end).replace(/;\\s*$/,""));
      const tracks=player?.captions?.playerCaptionsTracklistRenderer?.captionTracks??[];
      const track=tracks.find((t:any)=>String(t.languageCode??"").toLowerCase().startsWith("en"))??tracks.find((t:any)=>t.kind==="asr");
      if(track?.baseUrl){const url=new URL(track.baseUrl);url.searchParams.set("fmt","json3");const transcript=await parseTimedTextResponse(await fetch(url.toString(),{headers}));if(transcript.length>80)return transcript;}
     }catch(e){console.warn("caption track metadata parse failed",String(e));}
    }
   }
  }
 }catch(e){console.warn("watch page caption discovery failed",String(e));}
 for(const lang of ["en","en-US","en-GB"]){
  for(const options of [{},{kind:"asr"},{fmt:"json3"},{kind:"asr",fmt:"json3"}]){
   const url=new URL("https://www.youtube.com/api/timedtext");url.searchParams.set("lang",lang);url.searchParams.set("v",videoId);for(const [k,v] of Object.entries(options))url.searchParams.set(k,v);
   try{const transcript=await parseTimedTextResponse(await fetch(url.toString(),{headers}));if(transcript.length>80)return transcript;}catch{}
  }
 }
 return ""; // Captions unavailable: fall back to Gemini multimodal YouTube processing.
}
async function transcribeFromVideo(videoUrl:string,key:string){
 const models=["gemini-3.8-flash","gemini-3.6-flash","gemini-3.1-flash-lite"];let last="";
 const prompt="You are transcribing an educational video for a learning system. Carefully listen to the entire video audio. Produce a faithful, detailed transcript in the spoken language, preserving technical terms, code identifiers, formulas, examples and explanations. Include timestamps approximately every 30-60 seconds when possible. Do not invent speech. If audio is unclear, mark [unclear]. After the transcript, add a separate section called VIDEO CONTEXT with important visible slides, code, diagrams or demonstrations that complement the audio. If the video is too long to fully process, clearly state the covered time range and do not pretend it is complete.";
 for(const model of models){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),120000);try{const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+model+":generateContent",{method:"POST",headers:{"Content-Type":"application/json","X-goog-api-key":key},body:JSON.stringify({contents:[{parts:[{fileData:{fileUri:videoUrl,mimeType:"video/*"}},{text:prompt}]}],generationConfig:{temperature:0.1}}),signal:controller.signal});const d=await r.json();if(!r.ok){last=d.error?.message??"Multimodal video transcription failed";continue;}const text=d.candidates?.[0]?.content?.parts?.map((p:any)=>p.text??"").join("").trim();if(text&&text.length>100)return text;last="Gemini returned an incomplete transcript";}catch(e){last=e instanceof Error?e.message:"Video transcription failed";}finally{clearTimeout(timer);}}
 throw new Error("Captions unavailable and AI video/audio transcription failed: "+last);
}
async function processOne(db:any,job:any,key:string){
 const {data:video,error}=await db.from("videos").select("id,user_id,youtube_video_id,title,youtube_url").eq("id",job.video_id).eq("user_id",job.user_id).single();
 if(error||!video)throw new Error("Video not found or ownership mismatch");
 await db.from("videos").update({status:"processing",processing_stage:"extracting_transcript",processing_progress:10,updated_at:new Date().toISOString(),last_error:null}).eq("id",video.id).eq("user_id",video.user_id);
 let transcript=await captions(video.youtube_video_id);let transcriptSource="youtube_timedtext";if(!transcript){transcript=await transcribeFromVideo(video.youtube_url||("https://www.youtube.com/watch?v="+video.youtube_video_id),key);transcriptSource="gemini_multimodal_video";}const chunks:string[]=[];for(let i=0;i<transcript.length;i+=1800)chunks.push(transcript.slice(i,i+1800));
 const {error:transcriptError}=await db.from("videos").update({transcript,transcript_status:"available",transcript_source:transcriptSource,transcript_fetched_at:new Date().toISOString(),processing_stage:"chunking",processing_progress:30,updated_at:new Date().toISOString()}).eq("id",video.id).eq("user_id",video.user_id);if(transcriptError)throw transcriptError;
 const {error:deleteChunks}=await db.from("transcript_chunks").delete().eq("video_id",video.id);if(deleteChunks)throw deleteChunks;
 const rows=chunks.map((content,i)=>({video_id:video.id,chunk_index:i,content,language:"en",token_count:Math.ceil(content.length/4),metadata:{source:transcriptSource}}));
 const {error:insertChunks}=await db.from("transcript_chunks").insert(rows);if(insertChunks)throw insertChunks;
 await db.from("videos").update({processing_stage:"generating_embeddings",processing_progress:45,updated_at:new Date().toISOString()}).eq("id",video.id);
 for(let start=0;start<chunks.length;start+=4){await Promise.all(chunks.slice(start,start+4).map(async(chunk,offset)=>{const index=start+offset;const vector=await embed(key,chunk);const {error}=await db.from("transcript_chunks").update({embedding:vector,embedding_model:"gemini-embedding-001",embedding_version:"v1"}).eq("video_id",video.id).eq("chunk_index",index);if(error)throw error;}));}
 await db.from("videos").update({processing_stage:"extracting_knowledge",processing_progress:75,updated_at:new Date().toISOString()}).eq("id",video.id);
 const prompt="Return valid JSON only: {\"items\":[{\"title\":string,\"content\":string,\"knowledge_type\":string,\"subject\":string|null,\"topic\":string|null,\"difficulty_level\":string|null,\"tags\":string[]}]}. Create 8-15 accurate educational items covering summary, concepts, definitions, examples, formulas when present, and key points. knowledge_type must be one of concept, definition, summary, example, formula, question, answer, key_point, relationship, note. difficulty_level must be beginner, intermediate, advanced or null. Transcript:\n"+transcript.slice(0,28000);
 const models=["gemini-3.8-flash","gemini-3.6-flash","gemini-3.1-flash-lite"];let extracted:any=null,lastError="";
 for(const model of models){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+model+":generateContent",{method:"POST",headers:{"Content-Type":"application/json","X-goog-api-key":key},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.2,responseMimeType:"application/json"}}),signal:controller.signal});const d=await r.json();if(!r.ok){lastError=d.error?.message??"Gemini returned HTTP "+r.status;continue;}const raw=d.candidates?.[0]?.content?.parts?.map((p:any)=>p.text??"").join("");if(raw){extracted=JSON.parse(raw);break;}}catch(e){lastError=e instanceof Error?e.message:"Knowledge extraction failed";}finally{clearTimeout(timer);}
 }
 if(!extracted)throw new Error(lastError||"Knowledge extraction returned no response");
 const items=Array.isArray(extracted.items)?extracted.items:[];if(!items.length)throw new Error("No knowledge items were generated");
 const allowed=new Set(["concept","definition","summary","example","formula","question","answer","key_point","relationship","note"]),levels=new Set(["beginner","intermediate","advanced"]);let saved=0;
 for(const item of items){
  const title=String(item.title??"").trim(),content=String(item.content??"").trim();if(!title||!content)continue;
  const {data:savedItem,error:saveError}=await db.from("knowledge_items").insert({user_id:video.user_id,video_id:video.id,title:title.slice(0,300),content:content.slice(0,12000),knowledge_type:allowed.has(item.knowledge_type)?item.knowledge_type:"key_point",subject:item.subject?String(item.subject).slice(0,200):null,topic:item.topic?String(item.topic).slice(0,200):null,difficulty_level:levels.has(item.difficulty_level)?item.difficulty_level:null,tags:Array.isArray(item.tags)?item.tags.slice(0,20).map((x:any)=>String(x).slice(0,80)):[],confidence:0.85,metadata:{source:"video_processing"}}).select("id,title,content").single();
  if(saveError)throw saveError;const v=await embed(key,savedItem.title+"\n\n"+savedItem.content);const {error:embedError}=await db.from("knowledge_items").update({embedding:v,embedding_model:"gemini-embedding-001",embedding_version:"v1"}).eq("id",savedItem.id).eq("user_id",video.user_id);if(embedError)throw embedError;saved++;
 }
 const {error:doneError}=await db.from("videos").update({status:"completed",processing_stage:"completed",processing_progress:100,transcript_status:"available",processed_at:new Date().toISOString(),updated_at:new Date().toISOString(),last_error:null}).eq("id",video.id).eq("user_id",video.user_id);if(doneError)throw doneError;
 const {error:completeError}=await db.rpc("complete_video_processing_job",{p_job_id:job.job_id,p_lock_token:job.lock_token,p_result:{transcript_chunks:chunks.length,knowledge_items:saved}});if(completeError)throw completeError;
 return {video_id:video.id,transcript_chunks:chunks.length,knowledge_items:saved};
}
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});if(req.method!=="POST")return json({error:"POST required"},405);
 const workerToken=req.headers.get("x-worker-secret");let scheduled=false,userId:string|null=null,videoId:string|null=null;
 if(workerToken){const {data:valid,error}=await admin().rpc("validate_video_worker_secret",{p_token:workerToken});if(error||valid!==true)return json({error:"Invalid worker credential"},401);scheduled=true;}
 else{
  const auth=req.headers.get("Authorization")??"";if(!auth.startsWith("Bearer "))return json({error:"Authentication required"},401);
  const {data:{user},error}=await anonClient().auth.getUser(auth.slice(7));if(error||!user)return json({error:"Unauthorized"},401);userId=user.id;
  try{const body=await req.json();videoId=body.video_id?String(body.video_id):null;}catch{return json({error:"Invalid JSON"},400);}
 }
 const key=Deno.env.get("GEMINI_API_KEY");if(!key)return json({error:"GEMINI_API_KEY is not configured"},503);const db=admin();
 const recovery=await db.rpc("requeue_expired_video_processing_jobs");if(recovery.error)console.error("expired lease recovery:",recovery.error.message);
 const {data:jobs,error:claimError}=await db.rpc("claim_video_processing_jobs",{p_worker_id:"trean-"+crypto.randomUUID(),p_limit:scheduled?3:1,p_lease_seconds:240,p_user_id:userId,p_video_id:videoId});
 if(claimError)return json({error:claimError.message},500);if(!jobs?.length)return json({success:true,processed:0,message:"No jobs available"});
 const outcomes:any[]=[];
 for(const job of jobs){try{outcomes.push({success:true,...await processOne(db,job,key)});}catch(e){const message=e instanceof Error?e.message:"Processing failed";await db.from("videos").update({status:"failed",processing_stage:"failed",last_error:message,updated_at:new Date().toISOString()}).eq("id",job.video_id).eq("user_id",job.user_id);const {error}=await db.rpc("fail_video_processing_job",{p_job_id:job.job_id,p_lock_token:job.lock_token,p_error:message,p_error_code:"VIDEO_PROCESSING_FAILED",p_retry_delay_seconds:Math.min(3600,30*Math.pow(2,Math.max(0,job.attempts-1)))});if(error)console.error("failed to release job:",error.message);outcomes.push({success:false,video_id:job.video_id,error:message});}}
 return json({success:outcomes.every(x=>x.success),processed:outcomes.length,outcomes});
});