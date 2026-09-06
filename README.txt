ST. AUGUSTINE STAFF PWA — MOBILE V3 FIX

This package fixes two issues:
1) Installed Staff App now shows a visible premium launch screen before Login/Dashboard.
2) App-only work screens are constrained to the phone viewport. Wide Marks/Exam tables scroll inside their own area; the whole page should not require zooming out.

IMPORTANT:
- Public website / normal browser Staff Login design is unchanged.
- Supabase queries, IDs, Marks/Exam/Leave/Portfolio save-submit logic are unchanged.
- Replace/upload the files in your website root.
- Keep both old and V3 icon files; manifest now points to V3 names.
- Existing installed apps should receive the UI update after close/reopen once the new service worker takes control. Home-screen icon refresh can still require reinstall on some phones because Android/iOS launchers cache icons independently.
