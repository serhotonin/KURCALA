@echo off
title A.E.T.H.E.R. LABS - Full Stack
echo Gelecegin Laboratuvari Baslatiliyor...

:: Start Backend
echo [1/2] Backend sunucusu baslatiliyor...
start "AETHER Backend" cmd /k "cd server && node index.js"

:: Start Frontend
echo [2/2] Frontend gelistirme sunucusu baslatiliyor...
npm run dev

pause
