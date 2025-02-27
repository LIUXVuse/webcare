# 台灣長照居家服務量表計算器

![版本](https://img.shields.io/badge/版本-1.1.0-blue)
![狀態](https://img.shields.io/badge/狀態-已部署-success)
![最後更新](https://img.shields.io/badge/最後更新-2025年2月27日-green)
![穩定版本](https://img.shields.io/badge/穩定版本-v1.0.0--stable-orange)

## 專案概述

台灣長照居家服務量表計算器是一個網頁應用工具，專為台灣長期照護服務提供者設計。本工具提供多種評估量表的數位計算功能，幫助照護人員快速、準確地評估被照護者的狀態和需求。

### 目前功能

- **日常生活功能量表 (ADL)**：評估個案的基本自理能力，包括進食、移位、個人衛生等項目
- 優化的使用者界面，適合各種設備使用
- 結果自動計算與分級
- 列印功能

### 即將推出功能

- 工具性日常生活活動能力量表 (IADL)
- 迷你營養評估 (MNA)
- 跌倒風險評估量表
- 表單數據暫存功能
- 批量處理與資料匯出

## 線上訪問

您可以通過以下鏈接直接訪問已部署的應用：

[https://webcare.pages.dev](https://webcare.pages.dev)

無需安裝或部署，直接在瀏覽器中使用。

### 穩定版本信息

目前最新穩定版本為 **v1.0.0-stable**，已成功部署至Cloudflare Pages。此版本已經過測試，可穩定用於生產環境。

## 本地使用

### 系統需求

- 現代網頁瀏覽器（Chrome, Firefox, Edge, Safari等）
- Internet連接（僅用於首次載入）
- Node.js（如需本地運行）

### 快速啟動

1. 下載或克隆此存儲庫
   ```bash
   git clone https://github.com/LIUXVuse/webcare.git
   cd webcare
   ```
2. 根據 [設置指南](SETUP.md) 啟動本地伺服器
3. 在瀏覽器中開啟應用程式（默認為 http://localhost:3000）

### 部署到自己的環境

如果您想將此專案部署到自己的環境，請參考 [部署指南](DEPLOY.md) 文件，其中包含了如何部署到Cloudflare Pages的詳細步驟。

## 版本管理與部署流程

### 版本標記

本專案使用Git標籤來標記重要版本：
- **v1.0.0-stable**: 第一個穩定發布版本 (2025-02-27)

### 開發與部署流程

若要貢獻或更新此專案，請遵循以下流程：

1. **本地開發**：在您的環境中進行代碼修改
2. **本地測試**：確保所有功能在本地正常運行
3. **提交更改**：
   ```bash
   git add .
   git commit -m "描述您的更改"
   git push origin master
   ```
4. **自動部署**：推送至GitHub後，Cloudflare Pages會自動部署更新版本
5. **版本標記**：對於重要更新，創建新的版本標籤
   ```bash
   git tag -a v版本號 -m "版本描述"
   git push origin v版本號
   ```

## 最近更新

**1.1.0版本 (2025-02-27)**
- 優化了ADL量表的計算標準
- 改進了界面視覺效果和用戶體驗
- 更新了聯繫方式和頁尾信息
- 優化了表單選項的顯示效果和間距
- 調整了界面布局，移除了尚未實現的功能入口
- 完成Cloudflare Pages部署並標記第一個穩定版本v1.0.0-stable

**1.0.0版本 (2025-02-27)**
- 添加日常生活功能量表 (ADL) 計算功能
- 實現結果自動計算與分級
- 添加響應式設計，支持多種設備
- 添加結果列印功能

## 專案狀態

- **目前版本**: 1.0.0 (MVP)
- **最後更新**: 2025年2月27日
- **開發階段**: 基礎功能已完成，可進行ADL量表評估

## 功能特色

- **簡潔易用的界面**：採用簡約大方的設計風格，操作直觀
- **模組化設計**：便於添加和維護不同的量表計算器
- **自動計算**：根據輸入自動計算評估分數和依賴程度
- **結果保存**：支持列印評估結果以便存檔
- **響應式設計**：適配桌面和移動設備，隨時隨地都能使用
- **動態數據載入**：支持從HTML或Word文檔中提取量表數據

## 目前支持的評估量表

1. **日常生活功能量表 (ADL)**：評估個案在日常生活活動中的自理能力

## 快速開始

### 使用批處理文件快速啟動（Windows系統）

我們提供了便捷的批處理文件來啟動服務器：

```bash
# Windows命令提示符(CMD)中啟動本地服務器
cd D:\projects\webcare
start-server.bat
```

```bash
# 或者直接雙擊
D:\projects\webcare\start-server.bat
```

伺服器啟動後，請在瀏覽器中訪問：http://localhost:3000

### 手動安裝和啟動

#### 安裝依賴

```bash
npm install
```

#### 從文檔提取量表數據

```bash
node doc-converter.js --input ./doc-sources/adl-sample.html --format both
```

#### 啟動本地服務器

```bash
# 在專案根目錄下執行
npx serve
```

#### PowerShell使用者

```powershell
# 使用PowerShell腳本啟動
.\start.ps1
```

詳細步驟請參考 [SETUP.md](SETUP.md) 文件。

## 技術架構

本專案是一個純前端應用，使用以下技術：

- **HTML5**：搭建頁面結構
- **CSS3**：實現頁面樣式，使用Bootstrap框架
- **JavaScript (ES6+)**：實現交互和計算邏輯，不依賴任何大型框架
- **Node.js**：提供文檔轉換工具，將文檔轉換為JSON數據
- **模組化設計**：每個量表計算器作為獨立模組開發
- **響應式設計**：適應不同屏幕尺寸的設備

## 專案結構

```
webcare/
├── index.html              # 主頁面
├── css/                    # 樣式文件
│   └── styles.css          # 主樣式文件
├── js/                     # JavaScript 文件
│   └── index.js            # 主程序
├── data/                   # 量表數據文件
│   └── adl-sample.json     # ADL量表JSON數據
├── docs/                   # 文檔目錄
│   └── scales/             # 量表說明文檔
│       └── adl-sample.md   # ADL量表Markdown格式說明
├── doc-sources/            # 原始文檔目錄
│   └── adl-sample.html     # ADL量表HTML原始文檔
├── doc-converter.js        # 文檔轉換工具
├── start-server.bat        # 啟動服務器的批處理文件（Windows）
├── start.ps1               # PowerShell啟動腳本（可選）
├── package.json            # 項目依賴和配置
├── README.md               # 項目說明
└── SETUP.md                # 安裝與使用指南
```

## 使用方法

1. 打開網頁（訪問 http://localhost:3000）
2. 選擇需要的評估量表（目前僅有 ADL 量表）
3. 填寫評估表格
4. 點擊"計算總分"按鈕獲取結果
5. 可選擇"列印結果"保存評估結果

## 文檔轉換工具

我們提供了一個強大的文檔轉換工具，可以將HTML或Word文檔轉換為JSON和Markdown格式：

```bash
# 基本用法
node doc-converter.js --input <輸入文件路徑> --format <輸出格式>

# 示例：將HTML文檔轉換為JSON和Markdown
node doc-converter.js --input ./doc-sources/adl-sample.html --format both

# 輸出格式選項:
# - json: 僅輸出JSON格式
# - markdown: 僅輸出Markdown格式
# - both: 同時輸出JSON和Markdown格式
```

## 如何添加自訂量表

1. **使用文檔提取數據**：
   - 準備包含評估項目和評分標準的HTML或Word文檔
   - 使用`doc-converter.js`工具提取數據
   - 檢查並修正生成的JSON文件

2. **使用現有界面添加新量表**：
   - 在 `index.html` 中添加新量表的選項
   - 修改 `js/index.js` 來支持新的量表數據載入和處理

## 開發指南

### 添加新的量表計算器

1. 在 `data/` 目錄下添加新量表的JSON數據文件
2. 在 `index.html` 的選擇器區域添加新量表按鈕或選項
3. 在 `js/index.js` 中添加處理新量表數據的邏輯
4. 測試新量表的計算和顯示功能

## 瀏覽器兼容性

已在以下瀏覽器中測試通過：
- Google Chrome (最新版)
- Mozilla Firefox (最新版)
- Microsoft Edge (最新版)
- Safari (最新版)

## 已知問題

- 在某些移動設備上，界面顯示可能需要進一步優化
- 文檔轉換工具目前對複雜格式支持有限
- 處理大量數據時可能存在性能問題

## 未來規劃

1. 添加更多評估量表，如：
   - 工具性日常生活活動能力量表 (IADL)
   - 迷你營養評估表 (MNA)
   - 疼痛評估量表
   - 跌倒風險評估量表

2. 改進功能：
   - 添加資料暫存功能
   - 批量處理多位個案的評估
   - 增加結果統計和比較功能
   - 改進文檔轉換工具的解析能力

## 貢獻指南

歡迎對此專案提出建議或貢獻代碼。請遵循以下步驟：

1. Fork 此存儲庫
2. 創建您的功能分支 (`git checkout -b feature/your-feature`)
3. 提交您的更改 (`git commit -m 'Add some feature'`)
4. 推送到分支 (`git push origin feature/your-feature`)
5. 創建一個 Pull Request

## 隱私聲明

本應用為純前端應用，所有數據僅在本地處理，不會上傳至任何服務器或存儲在雲端。

## 授權協議

MIT License 