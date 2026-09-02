@echo off
title Live Container Inventory Console Logs
color 0A
echo ========================================================
echo   LIVE CONTAINER INVENTORY REAL-TIME CONSOLE LOGS
echo ========================================================
echo Watching for new container entries, logins, and API activity...
echo (Press Ctrl + C to exit anytime)
echo.
pm2 logs container-inventory-api --lines 50
pause
