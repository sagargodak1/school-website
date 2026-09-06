ST. AUGUSTINE STAFF PWA — V2

Files to keep in the same GitHub website folder:
- index.html
- manifest.json
- sw.js
- pwa-icon-192.png
- pwa-icon-512.png

V2 behavior:
- Normal browser opening of staugustine.edu.np remains the public school website.
- Installed "SA Staff" app opens a staff-only experience.
- Public Home/Gallery/Portfolio pages are covered and not used inside the installed app.
- If a valid staff Supabase session exists, the app opens the Staff Dashboard directly.
- If there is no valid session, Staff Login opens.
- The staff password is never stored by this code.
- Supabase persistSession keeps the secure session/refresh token on that device.
- Staff stays signed in until Log Out, session revocation, password/security change, or browser/device storage is cleared.
- In app mode, work panels (Marks, Leave, Plans, Exam, Portfolio, Videos, etc.) open above the Staff Dashboard; closing them returns to the Dashboard.
- Principal uses the same installed app and receives Principal permissions from the existing website logic.

Push:
git add index.html manifest.json sw.js pwa-icon-192.png pwa-icon-512.png
git commit -m "Make installed staff app staff-only with persistent login"
git push

After pushing on iPhone/iPad:
1. Open the already installed SA Staff app.
2. If the old behavior remains, fully close the app and reopen it once or twice.
3. If Safari keeps an old installed web app configuration, remove SA Staff from Home Screen and add it again from Safari.
