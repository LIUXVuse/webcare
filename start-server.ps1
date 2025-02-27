# 台灣長照居家服務量表計算器 - 服務器啟動腳本

Write-Host "台灣長照居家服務量表計算器 - 啟動本地服務器" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "正在啟動服務器，請稍候..." -ForegroundColor Yellow
# 直接執行npx serve命令
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
# 允許cmdlet直接執行npm和npx命令
& npm config set script-shell powershell
& npx serve

Write-Host "服務器已啟動，請打開瀏覽器訪問 http://localhost:3000" -ForegroundColor Green
Write-Host "按Ctrl+C停止服務器" -ForegroundColor Yellow 