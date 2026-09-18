@echo off
setlocal
cd /d "%~dp0"

if not exist "index.html" (
  echo.
  echo ERROR: index.html was not found in this folder.
  echo Put ALL V1.4 patch files in the SAME folder as index.html and app.js.
  echo.
  pause
  exit /b 1
)
if not exist "question-submission.js" (
  echo.
  echo ERROR: question-submission.js is missing.
  echo Extract/copy ALL files from this ZIP into the website folder.
  echo.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$ErrorActionPreference='Stop';" ^
"$index=Join-Path (Get-Location) 'index.html';" ^
"$backup=Join-Path (Get-Location) 'index.before-question-submission-v1_4.html';" ^
"$text=Get-Content -LiteralPath $index -Raw -Encoding UTF8;" ^
"if(!(Test-Path $backup)){Copy-Item -LiteralPath $index -Destination $backup};" ^
"$text=[regex]::Replace($text,'(?s)\s*<button\s+id=\"staffDashboardQuestionSubmissionAction\"\b.*?</button>','');" ^
"$text=[regex]::Replace($text,'(?s)\s*<button\s+id=\"websiteAdminQuestionSubmissionButton\"\b.*?</button>','');" ^
"$staffBtn='<button id=\"staffDashboardQuestionSubmissionAction\" type=\"button\" class=\"staff-dashboard-action question-submission\" onclick=\"openQuestionSubmission(''staff'')\"><span class=\"staff-dashboard-action-icon\">📝</span><span class=\"staff-dashboard-action-copy\"><strong>Question Submission</strong><small>Submit Word questions • View submission status</small></span><span class=\"staff-dashboard-action-arrow\">→</span></button>';" ^
"$adminBtn='<button id=\"websiteAdminQuestionSubmissionButton\" type=\"button\" onclick=\"openQuestionSubmission(''admin'')\">📝 Question Submission</button>';" ^
"$p='(?s)(<button\s+id=\"staffDashboardMarksAction\"\b.*?</button>)';" ^
"if([regex]::IsMatch($text,$p)){$text=[regex]::Replace($text,$p,('$1'+[Environment]::NewLine+'                    '+$staffBtn),1)}else{throw 'Staff Marks button was not found. No change saved.'};" ^
"$p='(?s)(<button\s+id=\"websiteAdminExamButton\"\b.*?</button>)';" ^
"if([regex]::IsMatch($text,$p)){$text=[regex]::Replace($text,$p,('$1'+[Environment]::NewLine+'                '+$adminBtn),1)}else{throw 'Admin Exam Management button was not found. No change saved.'};" ^
"$text=$text.Replace('✅ Question Submission & Printing Tracker','✅ Question, Printing & Marks Tracker');" ^
"$text=$text.Replace('Admin, Principal and Exam Coordinator can Publish/Unpublish and tick Submitted/Printed; other Staff see only the currently Published version.','Question Submitted updates from approved Question files. Printed remains manual. Marks Submitted updates only after Website Admin accepts Marks; Principal remains read only for Marks.');" ^
"$tag='<script src=\"question-submission.js?v=20260918-qs-v1_4-final\"></script>';" ^
"if($text -match '<script\s+src=\"question-submission\.js[^\"]*\"\s*></script>'){$text=[regex]::Replace($text,'<script\s+src=\"question-submission\.js[^\"]*\"\s*></script>',$tag)}else{if($text -notmatch '</body>'){throw '</body> was not found. No change saved.'};$text=$text -replace '</body>',('  '+$tag+[Environment]::NewLine+'</body>')};" ^
"Set-Content -LiteralPath $index -Value $text -Encoding UTF8;" ^
"Write-Host '';" ^
"Write-Host 'QUESTION SUBMISSION FINAL V1.4 PATCH APPLIED.' -ForegroundColor Green;" ^
"Write-Host 'Staff Question Submission button now has a solid high-contrast design.' -ForegroundColor Green;" ^
"Write-Host 'IMPORTANT: Run QUESTION_SUBMISSION_UPDATE_V1_4.sql ONCE in Supabase.' -ForegroundColor Yellow;"

if errorlevel 1 (
  echo.
  echo PATCH FAILED. Your backup remains safe.
)

echo.
pause
