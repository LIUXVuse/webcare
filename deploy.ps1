# 台灣長照居家服務量表計算器 - Cloudflare Pages部署腳本
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "台灣長照居家服務量表計算器 - Cloudflare Pages部署腳本" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# 檢查Git是否安裝
Write-Host "檢查Git存在..." -ForegroundColor Yellow
$gitExists = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitExists) {
    Write-Host "錯誤: 找不到Git。請安裝Git並確保它在PATH中。" -ForegroundColor Red
    exit 1
}

# 檢查未提交的更改
Write-Host "檢查是否有未提交的更改..." -ForegroundColor Yellow
$uncommittedChanges = git status --porcelain
if ($uncommittedChanges) {
    Write-Host "警告: 有未提交的更改。請先提交所有更改。" -ForegroundColor Yellow
    Write-Host "未提交的文件:" -ForegroundColor Yellow
    Write-Host $uncommittedChanges
    
    $continue = Read-Host "是否仍要繼續部署? (y/n)"
    if ($continue -ne "y") {
        Write-Host "部署已取消。" -ForegroundColor Red
        exit 0
    }
}

Write-Host ""
Write-Host "開始部署到Cloudflare Pages..." -ForegroundColor Green
Write-Host ""

# 檢查遠程倉庫設置
Write-Host "1. 檢查遠程倉庫設置..." -ForegroundColor Yellow
$remoteExists = git remote -v | Select-String "origin"
if (-not $remoteExists) {
    Write-Host "設置遠程倉庫..." -ForegroundColor Yellow
    git remote add origin https://github.com/LIUXVuse/webcare.git
} else {
    Write-Host "遠程倉庫已設置。" -ForegroundColor Green
}

Write-Host ""
Write-Host "2. 檢查當前分支..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
if (-not $currentBranch) {
    $currentBranch = "master"
}
Write-Host "當前分支: $currentBranch" -ForegroundColor Green
Write-Host ""

# 推送到GitHub
Write-Host "3. 推送到Github..." -ForegroundColor Yellow
try {
    git push -u origin $currentBranch
    if ($LASTEXITCODE -ne 0) {
        throw "Git push failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "推送失敗！請檢查您的Git設置和網絡連接。" -ForegroundColor Red
    Write-Host "錯誤信息: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "4. Cloudflare Pages將自動開始部署..." -ForegroundColor Yellow
Write-Host ""
Write-Host "部署完成後，您可以在以下網址訪問您的應用：" -ForegroundColor Green
Write-Host "https://webcare.pages.dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "要查看部署狀態，請訪問Cloudflare儀表板：" -ForegroundColor Green
Write-Host "https://dash.cloudflare.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "部署過程可能需要幾分鐘時間。請耐心等待。" -ForegroundColor Yellow
Write-Host ""

# 成功信息
Write-Host "部署流程已成功完成！" -ForegroundColor Green
Write-Host ""
Write-Host "提示：如果您是首次部署，您需要在Cloudflare儀表板上完成設置。" -ForegroundColor Yellow
Write-Host "請參考 DEPLOY.md 文件了解詳細步驟。" -ForegroundColor Yellow
Write-Host ""

Read-Host "按Enter鍵退出" 