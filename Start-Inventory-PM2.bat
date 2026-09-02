@echo off
echo ==============================================
echo STARTING INVENTORY API SERVICES (PM2)
echo ==============================================
cd "C:\Users\Administrator\.gemini\antigravity\scratch\Container Inventory\api"
pm2 start ecosystem.config.js
pm2 save
echo.
echo ----------------------------------------------
echo PM2 backend API has been started in the background!
echo You can close this window.
echo ----------------------------------------------
pause
