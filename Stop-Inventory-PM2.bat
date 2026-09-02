@echo off
echo ==============================================
echo STOPPING INVENTORY API SERVICES (PM2)
echo ==============================================
pm2 stop container-inventory-api
echo.
echo ----------------------------------------------
echo PM2 backend API has been stopped!
echo You can close this window.
echo ----------------------------------------------
pause
