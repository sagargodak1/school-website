ST. AUGUSTINE ACADEMIC FOUNDATION
FOUNDER + PARENT PORTAL — FINAL LOCAL TEST PACKAGE
Date: 2026-09-10

WHAT IS ADDED
1. Founder Portal
   - One shared Founder Login ID/password.
   - Read-only dashboard.
   - Principal announcements and upcoming plans.
   - Class-wise Marks summary only (NO individual student marks).
   - Exam status and Result publication status.

2. Parent Portal
   - One Parent Login ID/password per student, created/reset by Admin.
   - Login is linked to exactly one Student ID.
   - Parent sees only that child: Profile, Monthly Progress, Published Result,
     Attendance, Class Exam Routine and Notices.
   - Result supports Print / Save PDF.

3. Admin Control
   - New Admin menu: Founder & Parent Portal.
   - Create/reset shared Founder account.
   - Create/reset/enable/disable Parent accounts.
   - One global result publication button for Nursery through Class 10.
   - Publication is blocked until ALL 13 classes have submitted final Marks
     AND submitted Attendance for the selected Academic Year + Term.

IMPORTANT RESULT RULE
Teacher -> Class Teacher -> Admin workflow is unchanged.
Parents see NO result until Admin presses:
PUBLISH RESULT — NURSERY TO CLASS 10
After publishing, each Parent receives only the result linked to their own Student ID.

FIRST-TIME SUPABASE SETUP
1. Open Supabase -> SQL Editor.
2. Run the complete file: founder_parent_portal_setup.sql
3. It only creates the new Portal account/session/result-publication layer and read functions.
   It does not delete or migrate existing Marks, Attendance, Student, Portfolio,
   Notice, Exam, Staff or Principal data.

LOCAL TEST
Use these exact root filenames:
- index.html
- style.css
- app.js
- manifest.json
- sw.js
- CNAME

For the most reliable local browser test, serve the folder through a local web server
(e.g. VS Code Live Server). Normal public website and existing Staff PWA remain unchanged.

TEST ORDER
1. Run founder_parent_portal_setup.sql in Supabase.
2. Open the local website and login as Website Admin.
3. Open Admin -> Founder & Parent Portal.
4. Create/reset the shared Founder login.
5. Create a Parent login for one test student.
6. Select an Academic Year + Term. If all 13 class packages are ready, publish Results.
7. Log out and test Founder Login.
8. Test Parent Login and confirm only that student's information/result is visible.

FILES CHANGED FROM THE WEBSITE FRONTEND
- index.html
- style.css
- app.js

manifest.json, sw.js and CNAME are included unchanged for a complete folder.
