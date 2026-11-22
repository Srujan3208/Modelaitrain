const CACHE_NAME="trean-ai-shell-v2";
const OFFLINE_URL="/offline.html";
self.addEventListener("install",event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);await cache.add(OFFLINE_URL);await self.skipWaiting();})()));
self.addEventListener("activate",event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)));await self.clients.claim();})()));
self.addEventListener("fetch",event=>{const request=event.request;if(request.method!=="GET"||new URL(request.url).origin!==self.location.origin)return;if(request.mode==="navigate")event.respondWith(fetch(request).catch(async()=>await caches.match(OFFLINE_URL)||new Response("TREAN AI is offline. Connect to the internet to continue.",{headers:{"Content-Type":"text/plain"}}));});
