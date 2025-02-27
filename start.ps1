# 台灣長照居家服務量表計算器 - PowerShell啟動腳本

Write-Host "台灣長照居家服務量表計算器 - 啟動腳本" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 檢查Node.js是否安裝
try {
    $nodeVersion = node -v
    Write-Host "Node.js版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "錯誤: 找不到Node.js，請安裝Node.js後再試。" -ForegroundColor Red
    Write-Host "您可以從 https://nodejs.org/ 下載並安裝Node.js。" -ForegroundColor Yellow
    Read-Host "按Enter鍵退出"
    exit 1
}

# 檢查package.json是否存在
if (-not (Test-Path "package.json")) {
    Write-Host "錯誤: 找不到package.json文件。" -ForegroundColor Red
    Write-Host "請確保您在正確的目錄中執行此腳本。" -ForegroundColor Yellow
    Read-Host "按Enter鍵退出"
    exit 1
}

# 檢查是否需要安裝依賴
if (-not (Test-Path "node_modules")) {
    Write-Host "正在安裝依賴項..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "錯誤: 安裝依賴項失敗。" -ForegroundColor Red
        Read-Host "按Enter鍵退出"
        exit 1
    }
} else {
    Write-Host "依賴項已安裝。" -ForegroundColor Green
}

Write-Host ""
Write-Host "選擇操作:" -ForegroundColor Cyan
Write-Host "1. 啟動本地服務器" -ForegroundColor White
Write-Host "2. 運行文檔轉換工具" -ForegroundColor White
Write-Host "3. 執行上述兩項操作" -ForegroundColor White
Write-Host "4. 退出" -ForegroundColor White
Write-Host ""

$choice = Read-Host "請輸入選項 (1-4)"

switch ($choice) {
    "1" {
        Write-Host "啟動本地服務器..." -ForegroundColor Yellow
        Start-Process -FilePath "powershell" -ArgumentList "-Command `"npx serve; Read-Host 'Press Enter to exit'`"" -NoNewWindow
        Write-Host "服務器已啟動，請打開瀏覽器訪問 http://localhost:3000" -ForegroundColor Green
    }
    "2" {
        Write-Host ""
        Write-Host "運行文檔轉換工具..." -ForegroundColor Yellow
        Write-Host "請選擇要處理的文檔:" -ForegroundColor Yellow
        Write-Host "1. 使用原始文檔 (日常生活活動功能量表(ADL).doc)" -ForegroundColor White
        Write-Host "2. 直接啟動網站" -ForegroundColor White
        Write-Host ""
        
        $documentOption = Read-Host "請輸入選項 (1-2)"
        
        if ($documentOption -eq "1") {
            Write-Host "`n正在轉換文檔..." -ForegroundColor Yellow
            node doc-converter.js --input ./日常生活活動功能量表(ADL).doc --format both
        } elseif ($documentOption -eq "2") {
            Write-Host "正在啟動網站..." -ForegroundColor Yellow
            Start-Process -FilePath "powershell" -ArgumentList "-Command `"npx serve; Read-Host 'Press Enter to exit'`"" -NoNewWindow
            Write-Host "網站已啟動，請打開瀏覽器訪問 http://localhost:3000" -ForegroundColor Green
        } else {
            Write-Host "無效的選項!" -ForegroundColor Red
        }
    }
    "3" {
        Write-Host "運行文檔轉換工具..." -ForegroundColor Yellow
        node doc-converter.js --input ./日常生活活動功能量表(ADL).doc --format both
        
        Write-Host ""
        Write-Host "啟動本地服務器..." -ForegroundColor Yellow
        Start-Process -FilePath "powershell" -ArgumentList "-Command `"npx serve; Read-Host 'Press Enter to exit'`"" -NoNewWindow
        Write-Host "服務器已啟動，請打開瀏覽器訪問 http://localhost:3000" -ForegroundColor Green
    }
    "4" {
        Write-Host "謝謝使用!" -ForegroundColor Green
        exit 0
    }
    default {
        Write-Host "無效的選項!" -ForegroundColor Red
        exit 1
    }
}

Read-Host "按Enter鍵退出" 