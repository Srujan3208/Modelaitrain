"use client";
import { useEffect, useState } from "react";
import { Download, Info } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
};

export default function PWAInstallButton({variant="header"}:{variant?:"header"|"hero"}) {
  const [promptEvent,setPromptEvent]=useState<InstallPromptEvent|null>(null);
  const [installed,setInstalled]=useState(false);
  const [message,setMessage]=useState("");
  useEffect(()=>{
    const standalone=()=>window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone===true;
    setInstalled(standalone());
    const onPrompt=(e:Event)=>{e.preventDefault();setPromptEvent(e as InstallPromptEvent);setMessage("");};
    const onInstalled=()=>{setInstalled(true);setPromptEvent(null);setMessage("");};
    window.addEventListener("beforeinstallprompt",onPrompt);
    window.addEventListener("appinstalled",onInstalled);
    return()=>{window.removeEventListener("beforeinstallprompt",onPrompt);window.removeEventListener("appinstalled",onInstalled);};
  },[]);
  async function install(){
    setMessage("");
    if(installed)return;
    if(promptEvent){
      try{
        await promptEvent.prompt();
        const choice=await promptEvent.userChoice;
        if(choice.outcome==="accepted")setInstalled(true);
        else setMessage("Installation was cancelled. Tap Install now again when ready.");
      }catch{
        setMessage("Chrome couldn't open the install prompt. Open the browser menu and choose Install app.");
      }
      setPromptEvent(null);
      return;
    }
    // Some browsers do not expose beforeinstallprompt. Keep the button actionable and explain the native route.
    setMessage("If Chrome supports installation, use ⋮ → Install app or Add to Home screen.");
  }
  if(installed)return null;
  return <div className={variant==="hero"?"pwa-install-wrap hero-install-wrap":"pwa-install-wrap"}>
    <button className={variant==="hero"?"btn pwa-install hero-install":"pwa-install"} onClick={install} aria-label="Install TREAN AI app">
      <Download size={variant==="hero"?17:16}/><span>{variant==="hero"?"Install now":"Install App"}</span>
    </button>
    {message&&<div className="pwa-hint" role="status"><Info size={14}/>{message}</div>}
  </div>;
}