"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function LoginPage(){
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [message,setMessage]=useState("");
 const [busy,setBusy]=useState(false);
 async function signIn(e:React.FormEvent){
  e.preventDefault();setBusy(true);setMessage("");
  try{
   const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
   const {error}=await client.auth.signInWithPassword({email,password});
   if(error)throw error;
   window.location.replace("/");
  }catch(err:any){setMessage(err?.message||"Unable to sign in.");}
  finally{setBusy(false);}
 }
 return <main style={{minHeight:"100svh",display:"grid",placeItems:"center",padding:24,background:"#090714",color:"#fff",fontFamily:"Arial,sans-serif"}}>
  <form onSubmit={signIn} style={{width:"min(100%,420px)",padding:28,border:"1px solid #393052",borderRadius:20,background:"#141020",display:"grid",gap:14}}>
   <a href="/" style={{color:"#b7a2ff",textDecoration:"none"}}>← TREAN AI</a>
   <h1 style={{margin:"8px 0 0"}}>Welcome back</h1><p style={{margin:0,color:"#aaa2b8"}}>Sign in to continue to your learning workspace.</p>
   <label>Email<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} style={{display:"block",boxSizing:"border-box",width:"100%",marginTop:6,padding:13,borderRadius:10,border:"1px solid #51436c",background:"#0d0a17",color:"white"}}/></label>
   <label>Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} style={{display:"block",boxSizing:"border-box",width:"100%",marginTop:6,padding:13,borderRadius:10,border:"1px solid #51436c",background:"#0d0a17",color:"white"}}/></label>
   {message&&<p role="alert" style={{color:"#ff9d9d",margin:0}}>{message}</p>}
   <button disabled={busy} style={{padding:14,border:0,borderRadius:10,background:"#8b5cf6",color:"white",fontWeight:700}}>{busy?"Signing in…":"Sign in"}</button>
   <a href="/" style={{color:"#b7a2ff",textAlign:"center"}}>Back to TREAN AI</a>
  </form>
 </main>;
}