@echo off
title AgriSeed Direct - Fullstack System Launcher
echo ===================================================================
echo     🌾 AgriSeed Direct - Smart Agricultural Marketplace 🌾
echo ===================================================================
echo [1/2] Starting Flask REST Backend Server on http://127.0.0.1:5000 (MongoDB)...
start "AgriSeed Backend (Flask/MongoDB)" cmd /k "cd /d G:\agri(proto) && python app.py"

echo [2/2] Starting React Modern Frontend Server on http://localhost:5173...
start "AgriSeed Frontend (React/Vite)" cmd /k "cd /d G:\agri(proto)\frontend && npm run dev"

echo.
echo ===================================================================
echo  ✅ Fullstack System is Live!
echo  🌐 React Web App : http://localhost:5173
echo  ⚙️ Flask REST API : http://127.0.0.1:5000
echo  📦 Database      : MongoDB (agriseed_db)
echo ===================================================================
echo.
pause
