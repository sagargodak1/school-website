/* St. Augustine Staff PWA V6 — online-first + Web Push.
   Supabase/API data is never cached by this worker. */
self.addEventListener("install",()=>self.skipWaiting());

self.addEventListener("activate",event=>{
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message",event=>{
  if(event.data&&event.data.type==="SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET") return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;
  /* No respondWith: keep current online-first/browser-cache behavior. */
});

self.addEventListener("push",event=>{
  let payload={};
  try{
    payload=event.data?event.data.json():{};
  }catch(_){
    payload={body:event.data?event.data.text():""};
  }

  const title=payload.title||"St. Augustine";
  const body=payload.body||"You have a new school notification.";
  const data={
    notification_id:payload.notification_id||null,
    click_path:payload.click_path||"/",
    payload:payload.data||{}
  };

  event.waitUntil(
    self.registration.showNotification(title,{
      body,
      icon:"/apple-touch-icon-st-staff-180.png",
      badge:"/apple-touch-icon-st-staff-180.png",
      tag:payload.tag||("school-notification-"+(payload.notification_id||Date.now())),
      renotify:true,
      requireInteraction:payload.priority==="urgent",
      data
    })
  );
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const data=event.notification.data||{};
  const target=new URL(data.click_path||"/",self.location.origin);
  if(!target.searchParams.has("staffapp")){
    target.searchParams.set("staffapp","1");
  }
  if(data.notification_id){
    target.searchParams.set("notification",String(data.notification_id));
  }

  event.waitUntil((async()=>{
    const list=await self.clients.matchAll({type:"window",includeUncontrolled:true});
    for(const client of list){
      try{
        const u=new URL(client.url);
        if(u.origin===self.location.origin){
          client.postMessage({
            type:"SCHOOL_NOTIFICATION_CLICK",
            notification_id:data.notification_id||null,
            payload:data.payload||{}
          });
          await client.focus();
          return;
        }
      }catch(_){}
    }
    if(self.clients.openWindow) await self.clients.openWindow(target.href);
  })());
});
