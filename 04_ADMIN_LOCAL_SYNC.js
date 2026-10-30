/* St. Augustine — official publication bridge (single-step Publish / Update / Unpublish).
 * Requires existing authenticated Admin connection and existing secure RPCs.
 * Does not write student, marks, attendance or design drafts. No automatic publication.
 */
(function(){'use strict';
  function db(){
    if(typeof studentAdminSession==='undefined'||!studentAdminSession?.access_token)throw Error('Admin login required.');
    if(typeof umeAdminDb!=='function')throw Error('Supabase Admin connection unavailable.');
    return umeAdminDb();
  }
  async function rpc(name,args){const {data,error}=await db().rpc(name,args);if(error)throw Error(error.message);return data}
  function params(p){if(!p?.academicYear||!p?.className)throw Error('Missing class or academic year.');return {p_academic_year:String(p.academicYear),p_term_key:String(p.term||'second').toLowerCase(),p_class_name:String(p.className)}}
  window.saResultPublicationApi=Object.freeze({
    upsert:async p=>rpc('sa_result_admin_upsert_v1',{...params(p),p_payload:p,p_is_published:true}),
    unpublish:async p=>rpc('sa_result_admin_unpublish_v1',params(p)),
    list:async()=>rpc('sa_result_admin_list_v1',{})
  });
})();
