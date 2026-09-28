/* =========================================================
   ST. AUGUSTINE ACADEMIC FOUNDATION
   SCHOOL NOTIFICATION EVENTS V5

   Purpose of this small browser add-on:
   The public Parent Suggestion / Feedback form currently sends email
   through FormSubmit. V5 records the same submission in Supabase first
   so Admin + Principal receive the existing School App push notification.

   IMPORTANT:
   - The original FormSubmit email is preserved.
   - No Staff login/password logic is changed.
   - If Supabase is temporarily unavailable, the email form still submits.
   ========================================================= */
(function(){
  "use strict";

  const FORM_ID="suggestionFeedbackForm";
  const RPC_NAME="school_submit_public_feedback";
  const MAX_WAIT_MS=2600;

  function value(id){return String(document.getElementById(id)?.value||"").trim();}

  function getClient(){
    try{
      if(typeof initStudentSupabase==="function"){
        const c=initStudentSupabase();
        if(c)return c;
      }
    }catch(_){ }
    try{
      if(typeof initStaffSupabase==="function"){
        const c=initStaffSupabase();
        if(c)return c;
      }
    }catch(_){ }
    return null;
  }

  function timeout(ms){return new Promise(resolve=>setTimeout(()=>resolve({timeout:true}),ms));}

  async function saveForSchoolNotification(){
    const client=getClient();
    if(!client)throw new Error("Supabase client unavailable");
    const {error}=await client.rpc(RPC_NAME,{
      p_parent_name:value("sfParentName"),
      p_phone:value("sfPhone"),
      p_class_name:value("sfClass"),
      p_topic:value("sfTopic"),
      p_message:value("sfMessage")
    });
    if(error)throw error;
    return {ok:true};
  }

  function install(){
    const form=document.getElementById(FORM_ID);
    if(!form||form.dataset.schoolV5Bound==="1")return;
    form.dataset.schoolV5Bound="1";

    // Capture phase lets V5 save the notification copy before the older
    // FormSubmit bubble listener continues with navigation.
    form.addEventListener("submit",async function(event){
      if(form.dataset.schoolV5Submitting==="1")return;
      if(!form.checkValidity())return;

      event.preventDefault();
      event.stopImmediatePropagation();
      form.dataset.schoolV5Submitting="1";

      const button=document.getElementById("suggestionFeedbackSubmit");
      const status=document.getElementById("suggestionFeedbackStatus");
      if(button){button.disabled=true;button.textContent="Submitting...";}
      if(status){
        status.className="form-submit-status";
        status.style.display="block";
        status.textContent="Submitting securely...";
      }

      try{
        await Promise.race([saveForSchoolNotification(),timeout(MAX_WAIT_MS)]);
      }catch(error){
        // Do not block the parent's original email if app notification storage
        // has a temporary network problem.
        console.warn("Parent feedback notification copy could not be saved:",error);
      }

      // Native submit bypasses JS submit listeners and preserves the existing
      // FormSubmit email action / _next redirect exactly as before.
      HTMLFormElement.prototype.submit.call(form);
    },true);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();
