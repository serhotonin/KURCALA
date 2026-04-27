@echo off
title KURCALA LABS - Full Stack
echo Gelecegin Laboratuvari Baslatiliyor...

:: Start Backend
echo [1/2] Backend sunucusu baslatiliyor...
start "KURCALA Backend" cmd /k "cd server && node index.js"

:: Start Frontend
echo [2/2] Frontend gelistirme sunucusu baslatiliyor...
npm run dev

pause
