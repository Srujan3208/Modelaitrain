"use client";
import {useEffect} from "react";
export default function PWARegistration(){
 useEffect(()=>{
  if(!("serviceWorker" in navigator))return;
  navigator.serviceWorker.register("/sw.js",{scope:"/"}).catch(error=>console.error("TREAN AI service worker registration failed:",error));
 },[]);
 return null;
}