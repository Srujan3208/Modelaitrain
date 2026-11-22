"use client";
import { useEffect, useState } from "react";
import { Download, Check } from "lucide-react";
type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
export default function PWAInstallButton({variant="header"}:{variant?:"header"|"hero"}) {
 const [promptEvent,setPromptEvent]=useState<InstallPromptEvent|null>(null);
 const [installed,setInstalled]=useState(false);
 const [unsupported,setUnsupported]=useState(false);
 useEffect(()=>{
  setInstalled(window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone===true);
  const onPrompt=(e:Event)=>{e.preventDefault();setPromptEvent(e as InstallPromptEvent)};
  const onInstalled=()=>{setInstalled(true);setPromptEvent(null);setUnsupported(false)};
  window.addEventListener("beforeinstallprompt",onPrompt);window.addEventListener("appinstalled",onInstalled);
  return()=>{window.removeEventListener("beforeinstallprompt",onPrompt);window.removeEventListener("appinstalled",onInstalled)};
 },[]);
 async function install(){
  if(promptEvent){await promptEvent.prompt();const choice=await promptEvent.userChoice;if(choice.outcome==="accepted")setInstalled(true);setPromptEvent(null);return;}
  setUnsupported(true);window.setTimeout(()=>setUnsupported(false),6000);
 }
 if(installed)return null;
 return <button className={variant==="hero"?"btn pwa-install hero-install":"pwa-install"} onClick={install} aria-label="Install TREAN AI app"><Download size={variant==="hero"?17:16}/>{variant==="hero"?"Install now":"Install App"}{unsupported&&<span className="pwa-hint">{promptEvent?"Install prompt unavailable":"Chrome menu → Install app / Add to Home Screen"}</span>}</button>;
}