/* St. Augustine Staff PWA V5 — online-first, fresh UI.
   Supabase/API data is never cached by this worker.
   Static same-origin files use the browser/Cloudflare HTTP cache normally. */
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));
self.addEventListener("message",event=>{if(event.data&&event.data.type==="SKIP_WAITING")self.skipWaiting();});
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET") return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;
  /* No respondWith here: normal browser HTTP caching remains available. */
});
