$headers = @{
    Authorization = "Bearer D-DB7eBvyfG4HVpEpLf2nIZRgYKAPoiBqu9H43ld"
    "Content-Type" = "application/json"
}

$accountId = "6d7de63d20c5cefe2c5f5e384bda5522"
$apiUrl = "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects"

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method GET -Headers $headers
    
    # 檢查是否有項目
    if ($response.result.Count -gt 0) {
        Write-Host "找到 $($response.result.Count) 個Cloudflare Pages專案:" -ForegroundColor Green
        foreach ($project in $response.result) {
            Write-Host "專案名稱: $($project.name)" -ForegroundColor Cyan
            Write-Host "  狀態: $($project.deployment_configs.production.env_vars.DEPLOYMENT_STATUS.value)" -ForegroundColor Yellow
            Write-Host "  網址: $($project.domains[0])" -ForegroundColor Yellow
            Write-Host "  創建日期: $($project.created_on)" -ForegroundColor Yellow
            Write-Host "----------------------------------------"
        }
    } else {
        Write-Host "沒有找到任何Cloudflare Pages專案。" -ForegroundColor Red
        Write-Host "需要創建一個新的專案。" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "發生錯誤: $($_.Exception.Message)" -ForegroundColor Red
}

# 嘗試創建新專案
Write-Host "`n是否要嘗試創建一個新的webcare專案？(y/n)" -ForegroundColor Cyan
$answer = Read-Host
if ($answer -eq "y") {
    Write-Host "開始創建Cloudflare Pages專案..." -ForegroundColor Yellow
    
    $body = @{
        name = "webcare"
        source = @{
            type = "github"
            config = @{
                owner = "LIUXVuse"
                repo_name = "webcare"
                production_branch = "master"
                build_config = @{
                    build_command = $null
                    destination_dir = $null
                    root_dir = $null
                }
            }
        }
    } | ConvertTo-Json -Depth 5
    
    try {
        $createResponse = Invoke-RestMethod -Uri $apiUrl -Method POST -Headers $headers -Body $body
        Write-Host "專案創建成功！專案名: $($createResponse.result.name)" -ForegroundColor Green
    } catch {
        Write-Host "創建失敗: $($_.Exception.Message)" -ForegroundColor Red
    }
} 