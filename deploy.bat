@echo off
echo ===================================================
echo 台灣長照居家服務量表計算器 - Cloudflare Pages部署腳本
echo ===================================================
echo.

echo 檢查Git存在...
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 錯誤: 找不到Git。請安裝Git並確保它在PATH中。
    goto :error
)

echo 檢查是否有未提交的更改...
git status --porcelain | findstr . >nul
if %ERRORLEVEL% equ 0 (
    echo 警告: 有未提交的更改。請先提交所有更改。
    echo 未提交的文件:
    git status --porcelain
    
    set /p CONTINUE=是否仍要繼續部署? (y/n): 
    if /i "%CONTINUE%" neq "y" goto :end
)

echo.
echo 開始部署到Cloudflare Pages...
echo.

echo 1. 檢查遠程倉庫設置...
git remote -v | findstr origin >nul
if %ERRORLEVEL% neq 0 (
    echo 設置遠程倉庫...
    git remote add origin https://github.com/LIUXVuse/webcare.git
) else (
    echo 遠程倉庫已設置。
)

echo.
echo 2. 檢查當前分支...
for /f "tokens=2" %%i in ('git branch --show-current') do set BRANCH=%%i
if "%BRANCH%"=="" set BRANCH=master

echo 當前分支: %BRANCH%
echo.

echo 3. 推送到Github...
git push -u origin %BRANCH%
if %ERRORLEVEL% neq 0 (
    echo 推送失敗！請檢查您的Git設置和網絡連接。
    goto :error
)

echo.
echo 4. Cloudflare Pages將自動開始部署...
echo.
echo 部署完成後，您可以在以下網址訪問您的應用：
echo https://webcare.pages.dev
echo.
echo 要查看部署狀態，請訪問Cloudflare儀表板：
echo https://dash.cloudflare.com
echo.
echo 部署過程可能需要幾分鐘時間。請耐心等待。
echo.

goto :success

:error
echo.
echo 部署過程中發生錯誤。請參考上面的錯誤信息。
echo.
exit /b 1

:success
echo.
echo 部署流程已成功完成！
echo.
echo 提示：如果您是首次部署，您需要在Cloudflare儀表板上完成設置。
echo 請參考 DEPLOY.md 文件了解詳細步驟。
echo.

:end
pause 