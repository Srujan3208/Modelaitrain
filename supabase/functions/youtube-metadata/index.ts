import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
function parseDuration(iso:string){const m=iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);return (Number(m?.[1]||0)*3600)+(Number(m?.[2]||0)*60)+Number(m?.[3]||0)}
function extractId(url:string){const v=url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);return v?.[1]??null}
Deno.serve(async(req:Request)=>{if(req.method==="OPTIONS")return new Response("ok",{headers:cors});if(req.method!=="POST")return json({error:"POST required"},405);
const supabaseUrl=Deno.env.get("SUPABASE_URL")!,anon=Deno.env.get("SUPABASE_ANON_KEY")!,key=Deno.env.get("YOUTUBE_API_KEY")??"";
if(!key)return json({error:"YouTube API not configured. Add YOUTUBE_API_KEY to Supabase Edge Function secrets."},500);
const auth=req.headers.get("Authorization");if(!auth)return json({error:"Unauthorized"},401);
const sb=createClient(supabaseUrl,anon,{global:{headers:{Authorization:auth}}});const {data:{user},error}=await sb.auth.getUser();if(error||!user)return json({error:"Unauthorized"},401);
try{const body=await req.json();const url=String(body.url??"");const videoId=String(body.videoId??extractId(url)??"");const playlistId=String(body.playlistId??"");
if(videoId){const r=await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id="+encodeURIComponent(videoId)+"&key="+encodeURIComponent(key));const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"YouTube API error");const v=d.items?.[0];if(!v)return json({error:"Video not found or unavailable"},404);return json({video:{youtube_video_id:v.id,title:v.snippet.title,channel_name:v.snippet.channelTitle,thumbnail_url:v.snippet.thumbnails?.high?.url??v.snippet.thumbnails?.medium?.url??v.snippet.thumbnails?.default?.url,youtube_url:"https://www.youtube.com/watch?v="+v.id,duration_seconds:parseDuration(v.contentDetails.duration),description:v.snippet.description,view_count:Number(v.statistics?.viewCount||0),published_at:v.snippet.publishedAt}})}
if(playlistId){
 const r=await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id="+encodeURIComponent(playlistId)+"&key="+encodeURIComponent(key));
 const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"YouTube API error");const p=d.items?.[0];if(!p)return json({error:"Playlist not found or unavailable"},404);
 const playlistItems:any[]=[];let pageToken="";
 for(let page=0;page<2;page++){
  const u=new URL("https://www.googleapis.com/youtube/v3/playlistItems");u.searchParams.set("part","contentDetails,snippet");u.searchParams.set("playlistId",playlistId);u.searchParams.set("maxResults","50");u.searchParams.set("key",key);if(pageToken)u.searchParams.set("pageToken",pageToken);
  const ir=await fetch(u.toString());const idata=await ir.json();if(!ir.ok)throw new Error(idata.error?.message||"Could not read playlist items");
  playlistItems.push(...(idata.items??[]));pageToken=idata.nextPageToken??"";if(!pageToken)break;
 }
 const ids=[...new Set(playlistItems.map(x=>x.contentDetails?.videoId).filter(Boolean))];
 const videos:any[]=[];
 for(let offset=0;offset<ids.length;offset+=50){
  const batch=ids.slice(offset,offset+50);if(!batch.length)continue;
  const vr=await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id="+encodeURIComponent(batch.join(","))+"&key="+encodeURIComponent(key));
  const vd=await vr.json();if(!vr.ok)throw new Error(vd.error?.message||"Could not read playlist video details");
  for(const v of vd.items??[])videos.push({youtube_video_id:v.id,title:v.snippet.title,channel_name:v.snippet.channelTitle,thumbnail_url:v.snippet.thumbnails?.high?.url??v.snippet.thumbnails?.medium?.url??v.snippet.thumbnails?.default?.url,youtube_url:"https://www.youtube.com/watch?v="+v.id,duration_seconds:parseDuration(v.contentDetails.duration),description:v.snippet.description,published_at:v.snippet.publishedAt});
 }
 const order=new Map(playlistItems.map((x,i)=>[x.contentDetails?.videoId,i]));
 videos.sort((a,b)=>(order.get(a.youtube_video_id)??0)-(order.get(b.youtube_video_id)??0));
 return json({playlist:{id:p.id,title:p.snippet.title,channel_name:p.snippet.channelTitle,thumbnail_url:p.snippet.thumbnails?.high?.url??p.snippet.thumbnails?.medium?.url,total_videos:p.contentDetails.itemCount,imported_videos:videos.length,limited_to_first_100:true},videos});
}
return json({error:"Provide a valid YouTube video URL, videoId, or playlistId"},400)}catch(e){return json({error:e instanceof Error?e.message:"YouTube request failed"},400)}});