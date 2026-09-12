Write-Host "===================================================================" -ForegroundColor Green
Write-Host "    ?? AgriSeed Direct - Smart Agricultural Marketplace ??" -ForegroundColor Yellow
Write-Host "===================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "[1/2] Launching Flask Backend Server on port 5000 (MongoDB)..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/k", "cd /d `"$PSScriptRoot`" & python app.py"

Write-Host "[2/2] Launching Modern React Frontend on port 5173..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/k", "cd /d `"$PSScriptRoot\frontend`" & npm run dev"

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Green
Write-Host " ? Fullstack Services are starting!" -ForegroundColor Green
Write-Host " ?? Modern React Web App : http://localhost:5173" -ForegroundColor White
Write-Host " ?? Flask Backend & API   : http://localhost:5000" -ForegroundColor White
Write-Host " ?? Database              : MongoDB (agriseed_db)" -ForegroundColor White
Write-Host "===================================================================" -ForegroundColor Green
Write-Host ""
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"
