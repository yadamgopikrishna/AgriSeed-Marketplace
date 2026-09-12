@echo off
title AgriSeed Direct - Fullstack System Launcher
cd /d "%~dp0"

echo ===================================================================
echo     🌾 AgriSeed Direct - Smart Agricultural Marketplace 🌾
echo ===================================================================
echo.
echo [1/2] Starting Flask Backend & MongoDB REST Server on port 5000...
start "AgriSeed Backend (Flask/MongoDB)" cmd /k "cd /d ""%~dp0"" && python app.py"

echo [2/2] Starting Modern React Frontend on port 5173...
start "AgriSeed Frontend (React/Vite)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo ===================================================================
echo  ✅ AgriSeed Services are starting!
echo  🌐 Modern React Web App : http://localhost:5173
echo  ⚙️ Flask Backend & API   : http://localhost:5000
echo  📦 Database              : MongoDB (agriseed_db)
echo ===================================================================
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://localhost:5173
