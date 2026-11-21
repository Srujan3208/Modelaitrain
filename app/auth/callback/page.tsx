"use client";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@supabase/supabase-js";

export default function AuthCallback(){
 const router=useRouter();const [message,setMessage]=useState("Completing Google sign-in…");
 useEffect(()=>{let active=true;(async()=>{
  try{
   const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
   if(!url||!key)throw new Error("Supabase configuration is missing.");
   const supabase=createClient(url,key);
   const code=new URLSearchParams(window.location.search).get("code");
   if(code){const {error}=await supabase.auth.exchangeCodeForSession(code);if(error)throw error;}
   const {data,error}=await supabase.auth.getSession();if(error)throw error;
   if(!data.session)throw new Error("Google sign-in completed, but the session was not saved. Please try again.");
   if(active){setMessage("Signed in successfully. Redirecting…");router.replace("/");}
  }catch(e:any){if(active){setMessage(e?.message||"Unable to complete sign-in.");}}
 })();return()=>{active=false}},[router]);
 return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#0b0b10",color:"#f5f5f7",padding:24,fontFamily:"system-ui"}}><div style={{maxWidth:420,textAlign:"center",padding:32,border:"1px solid #292936",borderRadius:20,background:"#14141b"}}><h1 style={{fontSize:22,marginBottom:12}}>TREAN AI</h1><p>{message}</p><a href="/login" style={{color:"#a78bfa",display:"inline-block",marginTop:16}}>Return to sign in</a></div></main>
}
