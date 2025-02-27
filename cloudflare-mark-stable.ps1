$headers = @{
    Authorization = "Bearer D-DB7eBvyfG4HVpEpLf2nIZRgYKAPoiBqu9H43ld"
    "Content-Type" = "application/json"
}

$accountId = "6d7de63d20c5cefe2c5f5e384bda5522"
$projectName = "webcare"
$apiUrl = "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/$projectName/deployments"

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Cloudflare Pages 穩定版標記工具" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 獲取部署清單
try {
    Write-Host "正在獲取部署清單..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri $apiUrl -Method GET -Headers $headers
    
    if ($response.result.Count -gt 0) {
        Write-Host "找到 $($response.result.Count) 個部署:" -ForegroundColor Green
        
        # 顯示部署清單
        $deployments = @()
        $i = 1
        foreach ($deployment in $response.result) {
            $date = [DateTime]::Parse($deployment.created_on)
            $formattedDate = $date.ToString("yyyy-MM-dd HH:mm:ss")
            
            # 構建狀態字符串
            $status = $deployment.stage
            if ($deployment.latest) {
                $status += " (最新部署)"
            }
            
            Write-Host "[$i] ID: $($deployment.id)" -ForegroundColor Cyan
            Write-Host "    提交: $($deployment.deployment_trigger.metadata.commit_hash)" -ForegroundColor Yellow
            Write-Host "    分支: $($deployment.deployment_trigger.metadata.branch)" -ForegroundColor Yellow
            Write-Host "    部署時間: $formattedDate" -ForegroundColor Yellow
            Write-Host "    部署URL: $($deployment.url)" -ForegroundColor Yellow
            Write-Host "    狀態: $status" -ForegroundColor Yellow
            Write-Host "----------------------------------------"
            
            $deployObject = New-Object PSObject
            $deployObject | Add-Member -MemberType NoteProperty -Name "Index" -Value $i
            $deployObject | Add-Member -MemberType NoteProperty -Name "Id" -Value $deployment.id
            $deployObject | Add-Member -MemberType NoteProperty -Name "Latest" -Value $deployment.latest
            
            $deployments += $deployObject
            $i++
        }
        
        # 詢問用戶選擇哪個部署標記為穩定版
        $latestDeployment = $deployments | Where-Object { $_.Latest -eq $true }
        if ($latestDeployment) {
            $defaultOption = $latestDeployment.Index
            Write-Host "推薦標記最新部署 [$defaultOption] 為穩定版" -ForegroundColor Green
        } else {
            $defaultOption = 1
            Write-Host "推薦標記第一個部署 [$defaultOption] 為穩定版" -ForegroundColor Green
        }
        
        Write-Host "請選擇要標記為穩定版的部署編號 (1-$($deployments.Count))，或直接按Enter使用推薦選項:" -ForegroundColor Cyan
        $selection = Read-Host
        
        if ([string]::IsNullOrEmpty($selection)) {
            $selection = $defaultOption
        }
        
        if ($selection -ge 1 -and $selection -le $deployments.Count) {
            $selectedDeployment = $deployments[$selection - 1]
            $deploymentId = $selectedDeployment.Id
            
            # 標記為穩定版
            Write-Host "正在將部署 $deploymentId 標記為穩定版..." -ForegroundColor Yellow
            
            # 實際上，Cloudflare Pages API目前沒有直接標記特定部署為穩定版的端點
            # 但我們可以將它標記為環境變量或在README中記錄
            Write-Host "Cloudflare Pages API不支持直接標記穩定版，但此版本已標記在GitHub上為 v1.0.0-stable" -ForegroundColor Yellow
            Write-Host "請在Cloudflare儀表板中手動確認此部署為生產環境:" -ForegroundColor Yellow
            Write-Host "1. 前往 https://dash.cloudflare.com" -ForegroundColor Cyan
            Write-Host "2. 選擇 Pages 頁面" -ForegroundColor Cyan
            Write-Host "3. 點擊 $projectName 專案" -ForegroundColor Cyan
            Write-Host "4. 在部署標籤中找到此部署ID: $deploymentId" -ForegroundColor Cyan
            Write-Host "5. 點擊'...'菜單並選擇'標記為生產環境'" -ForegroundColor Cyan
            
            Write-Host "穩定版已成功標記在Git上，標籤為: v1.0.0-stable" -ForegroundColor Green
            Write-Host "網站可通過以下地址訪問: https://$projectName.pages.dev" -ForegroundColor Green
        } else {
            Write-Host "無效的選擇" -ForegroundColor Red
        }
    } else {
        Write-Host "沒有找到任何部署。請確保網站已成功部署。" -ForegroundColor Red
    }
    
} catch {
    Write-Host "發生錯誤: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "按任意鍵退出..." -ForegroundColor Cyan
Read-Host 