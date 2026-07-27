@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel%==0 (
  start "B1 Speaking Server" /min node server.js
) else (
  where py >nul 2>nul
  if %errorlevel%==0 (
    start "B1 Speaking Server" /min py -m http.server 8080
  ) else (
    start "B1 Speaking Server" /min python -m http.server 8080
  )
)
timeout /t 2 /nobreak >nul
start "" http://localhost:8080
