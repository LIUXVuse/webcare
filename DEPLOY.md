# 台灣長照居家服務量表計算器 - 部署指南

本文檔提供將此專案部署到Cloudflare Pages的詳細步驟。

## Cloudflare Pages部署步驟

### 1. 登入Cloudflare儀表板

1. 前往 [Cloudflare儀表板](https://dash.cloudflare.com/)
2. 使用您的帳號登入

### 2. 配置Cloudflare Pages

1. 在左側導航選單中，點擊「Pages」
2. 點擊「建立專案」按鈕
3. 選擇「連接到Git」選項
4. 授權Cloudflare訪問您的GitHub帳號
5. 從列表中選擇 `webcare` 存儲庫
6. 在配置頁面上:
   - 專案名稱: `webcare`
   - 生產分支: `master`
   - 框架預設: `None`
   - 建構命令: 留空（靜態網站不需要建構）
   - 建構輸出目錄: 留空（使用根目錄）
7. 點擊「儲存並部署」按鈕

### 3. 監控部署進度

部署開始後，您可以在Cloudflare Pages儀表板上監控進度。幾分鐘後，部署完成，您會看到「成功」狀態。

### 4. 訪問您的網站

部署成功後，您可以通過以下網址訪問您的網站:

```
https://webcare.pages.dev
```

您也會獲得一個獨特的預覽URL，用於測試每次提交的變更，格式如下:

```
https://<提交ID>.<專案名稱>.pages.dev
```

### 5. 自訂域名設置（可選）

如果您想使用自己的域名:

1. 在Pages專案詳情頁面，點擊「自訂域名」選項卡
2. 點擊「設置自訂域名」按鈕
3. 輸入您的域名（例如: care.example.com）
4. 按照頁面上的DNS配置指示操作

## 自動部署

已配置自動部署 - 每當您推送更改到GitHub存儲庫的master分支時，Cloudflare Pages會自動開始新的部署。

## 敏感信息處理

重要: 此專案的敏感配置信息存儲在本地的 `cloudflare-config.json` 檔案中，該檔案已在 `.gitignore` 中設置為不上傳到Git。請妥善保管此檔案，避免將敏感API令牌等信息公開。

## 排錯

如果部署過程中遇到問題:

1. 檢查Cloudflare Pages部署日誌
2. 確認您的GitHub存儲庫設置正確
3. 確保所有必要的文件都已提交到Git
4. 檢查是否有文件過大或其他限制問題

## 聯繫支持

如需更多幫助，請訪問Cloudflare支持中心或聯繫專案管理員。 