# 台灣長照居家服務量表計算器 - 安裝與使用指南

此文檔將指導您如何設置和使用台灣長照居家服務量表計算器，包括從HTML或Word文檔中提取量表數據的步驟。

## 前置需求

- Node.js（版本14或更高）
- 網絡瀏覽器（Chrome、Firefox、Edge 等）
- 文字編輯器（推薦：VS Code）

## 啟動伺服器

有多種方式可以啟動本地伺服器：

### 方法1：使用批處理檔案（最簡單）

在Windows系統上，直接雙擊 `start-server.bat` 檔案即可啟動伺服器。

或者在命令提示符(CMD)中使用以下命令：

```bash
cd D:\projects\webcare
start-server.bat
```

### 方法2：使用PowerShell腳本

如果您偏好使用PowerShell，可以使用以下命令：

```powershell
cd D:\projects\webcare
.\start.ps1
```

然後在選單中選擇選項1即可啟動伺服器。

### 方法3：直接使用NPX命令

對於熟悉命令行的用戶，可以直接使用以下命令：

```bash
cd D:\projects\webcare
npx serve
```

無論使用哪種方式啟動伺服器，請在瀏覽器中訪問以下地址使用系統：
```
http://localhost:3000
```

## 停止伺服器

要停止伺服器，請按 `Ctrl+C` 鍵組合。如果使用批處理檔案或PowerShell腳本啟動的服務，關閉命令窗口也可以停止伺服器。

## 手動安裝與使用

### 獲取代碼

如果您是第一次使用，需要獲取代碼：

```bash
# 克隆存儲庫（如果適用）
git clone https://github.com/yourusername/webcare.git
cd webcare
```

### 安裝依賴

在項目根目錄下，打開命令提示符/PowerShell，運行以下命令安裝所需的依賴：

```bash
npm install
```

此命令將安裝所需的依賴，主要包括serve（用於在本地運行靜態網站）和mammoth（用於Word文檔轉換，如果啟用）。

### 啟動本地服務器

使用以下命令啟動本地服務器：

```bash
npx serve
```

啟動後，在瀏覽器中訪問 http://localhost:3000 即可使用量表計算器。

## PowerShell用戶指南

我們還提供了PowerShell腳本，提供更多功能選項：

```powershell
# 執行PowerShell腳本
./start.ps1
```

該腳本提供以下選項：
1. 啟動本地服務器
2. 運行文檔轉換工具
3. 同時執行上述兩項操作
4. 退出

> **注意**：如果遇到PowerShell執行策略限制，可能需要調整執行策略：
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```

## 使用文檔轉換工具

我們提供了強大的文檔轉換工具，可以從HTML或Word文檔中提取量表數據。

### 基本用法

```bash
node doc-converter.js --input ./日常生活活動功能量表(ADL).doc --format both
```

### 參數說明

- `--input`：指定輸入文件的路徑（必須）
- `--format`：指定輸出格式（可選，默認為json），可選值：
  - `json`：僅輸出JSON格式
  - `markdown`：僅輸出Markdown格式
  - `both`：同時輸出JSON和Markdown格式
- `--help`：顯示幫助信息

### 示例

```bash
# 將示例HTML文檔轉換為JSON和Markdown
node doc-converter.js --input ./doc-sources/adl-sample.html --format both

# 將自訂HTML文檔僅轉換為JSON
node doc-converter.js --input ./您的文檔.html --format json

# 顯示幫助信息
node doc-converter.js --help
```

### 輸出文件

轉換完成後，您將在以下位置找到生成的文件：

- JSON文件：`./data/<文件名>.json`
- Markdown文件：`./docs/scales/<文件名>.md`

## 文件結構說明

```
project-root/
│
├── data/                 # 資料檔案
│   ├── adl-sample.json   # ADL量表JSON資料
│   
├── docs/               
│   ├── scales/           # 量表說明文檔
│   
├── js/                   # JavaScript檔案
│   ├── adl-calculator.js # ADL計算模組
│   ├── index.js          # 主要JavaScript檔案
│   ├── ui-handlers.js    # UI處理模組
│   └── utils.js          # 工具函數
│
├── css/                  # 樣式表
│   ├── bootstrap.min.css # Bootstrap
│   ├── main.css          # 主要樣式
│   └── print.css         # 列印樣式
│
├── 日常生活活動功能量表(ADL).doc # ADL量表原始文檔
```

## 使用說明

1. 啟動服務器後，打開瀏覽器訪問 http://localhost:3000
2. 在主頁面選擇需要的評估量表（目前支持ADL量表）
3. 填寫評估表格，為每個評估項目選擇適當的選項
4. 點擊"計算總分"按鈕，系統將自動計算總分並顯示依賴程度
5. 如需保存結果，可點擊"列印結果"按鈕

## 自訂量表

若要添加自己的評估量表，請按照以下步驟操作：

1. 準備包含評估項目和評分標準的HTML或Word文檔
   - 文檔應包含量表標題、說明和評估項目
   - 每個評估項目應有清晰的標題和選項
   - 每個選項應標明分數

2. 使用文檔轉換工具生成JSON數據文件
   ```bash
   node doc-converter.js --input <您的文檔路徑> --format both
   ```

3. 編輯生成的JSON文件，確保格式正確
   - 檢查項目名稱、選項和分數
   - 確保JSON結構符合應用要求

4. 編輯 `index.html` 添加新量表的選項

5. 修改 `js/index.js` 支持加載和處理新量表數據

## 常見問題排解

### 文檔轉換問題

**問題**: 轉換工具無法正確解析我的文檔
**解決方案**:
- 確保文檔格式簡單明了
- 檢查文檔中是否有複雜的表格或格式
- 嘗試將文檔保存為簡單HTML格式後再轉換
- 檢查控制台輸出的錯誤信息

**問題**: 生成的JSON文件格式不正確
**解決方案**:
- 手動編輯JSON文件修正格式
- 確保每個項目都有正確的標題、說明和選項
- 檢查JSON語法是否有錯誤

### 服務器啟動問題

**問題**: 無法啟動本地服務器
**解決方案**:
- 確保Node.js正確安裝（運行 `node -v` 檢查）
- 檢查是否已安裝依賴（運行 `npm install`）
- 確保端口3000未被其他應用佔用
- 嘗試使用其他端口啟動 `npx serve -l 3001`

**問題**: PowerShell腳本無法執行
**解決方案**:
- 以管理員身份運行PowerShell
- 執行 `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
- 嘗試使用批處理文件 `start-server.bat` 替代

### 應用加載問題

**問題**: 網頁加載後顯示錯誤或白屏
**解決方案**:
- 使用瀏覽器開發者工具檢查控制台錯誤
- 檢查網絡請求，確保數據文件能正確加載
- 檢查文件路徑是否正確
- 清除瀏覽器緩存後重試

**問題**: 計算結果不正確
**解決方案**:
- 檢查JSON數據文件中的分數設置
- 查看控制台是否有計算錯誤的日誌
- 核對量表的計算邏輯是否正確實現

## 資源與支持

如需更多支持，請訪問我們的GitHub存儲庫或聯繫開發團隊。

## 專案維護與更新

為確保系統保持最新狀態並獲得最佳體驗，請定期執行以下維護步驟：

### 更新代碼庫

如果您是透過Git獲取本項目，可以通過以下命令更新到最新版本：

```bash
git pull origin main
```

### 更新依賴

定期更新Node.js依賴可以確保獲得安全修復和功能改進：

```bash
npm update
```

### 檢查新版本

建議定期訪問我們的GitHub存儲庫查看是否有新版本發布。主要版本更新通常會提供：
- 新的評估量表
- 用戶界面改進
- 性能優化
- 錯誤修復

### 備份數據

在進行更新前，建議備份您自定義的數據文件：
- 備份 `data/` 目錄中的自定義JSON文件
- 備份 `doc-sources/` 目錄中的原始文檔
- 如有修改過的JavaScript或HTML文件，也應進行備份

### 報告問題

如果您發現任何問題或有改進建議，請通過以下方式聯繫我們：
- 在GitHub存儲庫中創建Issue
- 發送電子郵件至支持團隊
- 在使用過程中記錄並描述問題的具體表現和重現步驟

## 更新記錄

### 版本 1.0.1 (2025-02-27)
- 文檔更新
- 優化移動端顯示效果
- 修復已知問題
- 改進表單驗證機制

### 版本 1.0.0 (2023-09-15)
- 初始版本發布
- 支持ADL量表評估
- 實現文檔轉換工具
- 添加批處理和PowerShell啟動腳本 