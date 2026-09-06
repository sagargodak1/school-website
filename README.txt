ST. AUGUSTINE STAFF PWA — PREMIUM MOBILE DESIGN

Files in this package:
- index.html            Full existing website code + app-only premium design patch
- manifest.json         Same Staff PWA settings; premium launch colors
- sw.js                 Existing online-first service worker (unchanged)
- pwa-icon-192.png      New Staff App icon
- pwa-icon-512.png      New Staff App icon
- staff-app-logo.png    Logo used only inside installed Staff App design

IMPORTANT
1. The public website / normal browser Staff Login is NOT redesigned by this patch.
2. Premium styles activate only when:
   - the PWA is opened in standalone mode, OR
   - URL contains ?staffapp=1 (preview/test).
3. Existing Supabase, login, marks, leave, exam, portfolio and other feature logic was not changed.
4. Replace/upload these files in the same GitHub website root where your current index.html,
   manifest.json and sw.js are located.
5. Keep your other current website files (school.jpeg, logo.jpeg, etc.) exactly as they are.

Preview before installing:
https://staugustine.edu.np/?staffapp=1

After GitHub Pages updates, installed PWA may need to be fully closed and reopened.
If an old icon remains, reinstalling the PWA can refresh the home-screen icon.
