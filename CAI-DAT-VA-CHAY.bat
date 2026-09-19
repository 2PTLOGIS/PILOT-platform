@echo off
title PILOT Demo Starter
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Chua tim thay Node.js.
  echo Hay cai Node.js ban LTS tai https://nodejs.org/en/download
  pause
  exit /b 1
)

if not exist node_modules (
  echo Dang cai dat thu vien. Vui long doi...
  call npm install
  if errorlevel 1 (
    echo Cai thu vien khong thanh cong.
    pause
    exit /b 1
  )
)

echo PILOT se chay tai http://localhost:5173
echo Khong dong cua so nay khi dang xem demo.
call npm run dev
pause
