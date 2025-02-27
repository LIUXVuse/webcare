@echo off
echo 台灣長照居家服務量表計算器 - 啟動腳本
echo =====================================

REM 檢查Node.js是否安裝
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 錯誤: 找不到Node.js，請安裝Node.js後再試。
    echo 您可以從 https://nodejs.org/ 下載並安裝Node.js。
    pause
    exit /b 1
)

REM 檢查package.json是否存在
if not exist package.json (
    echo 錯誤: 找不到package.json文件。
    echo 請確保您在正確的目錄中執行此腳本。
    pause
    exit /b 1
)

REM 檢查是否需要安裝依賴
if not exist node_modules (
    echo 正在安裝依賴項...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo 錯誤: 安裝依賴項失敗。
        pause
        exit /b 1
    )
) else (
    echo 依賴項已安裝。
)

echo.
echo 選擇操作:
echo 1. 啟動本地服務器
echo 2. 運行文檔轉換工具
echo 3. 執行上述兩項操作
echo 4. 退出
echo.

set /p choice=請輸入選項 (1-4): 

if "%choice%"=="1" (
    echo 啟動本地服務器...
    start "本地服務器" cmd /c "npx serve"
    echo 服務器已啟動，請打開瀏覽器訪問 http://localhost:3000
    pause
    exit /b 0
)

if "%choice%"=="2" (
    echo.
    echo 運行文檔轉換工具...
    echo 請選擇要處理的文檔:
    echo 1. 使用原始文檔 (日常生活活動功能量表(ADL).doc)
    echo 2. 直接啟動網站
    echo.
    
    set /p documentOption=請輸入選項 (1-2): 
    
    if "%documentOption%"=="1" (
        echo.
        echo 正在轉換文檔...
        call node doc-converter.js --input ./日常生活活動功能量表(ADL).doc --format both
    ) else if "%documentOption%"=="2" (
        echo 請輸入要轉換的文件路徑:
        set /p docPath=路徑: 
        call node doc-converter.js --input "%docPath%" --format both
    ) else (
        echo 無效的選項!
    )
    
    pause
    exit /b 0
)

if "%choice%"=="3" (
    echo 運行文檔轉換工具...
    call node doc-converter.js --input ./日常生活活動功能量表(ADL).doc --format both
    
    echo.
    echo 啟動本地服務器...
    start "本地服務器" cmd /c "npx serve"
    echo 服務器已啟動，請打開瀏覽器訪問 http://localhost:3000
    
    pause
    exit /b 0
)

if "%choice%"=="4" (
    echo 謝謝使用!
    exit /b 0
) else (
    echo 無效的選項!
    pause
    exit /b 1
) 