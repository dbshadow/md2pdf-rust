## Context

本專案現已實作完成核心功能，專案目錄命名為 \`md2pdf\`。為了使其具備標準的 GitHub 開源專案規格，需要統一 package.json 的命名配置，並完整建立中英文對照的 \`README.md\` 與標準的 \`LICENSE\` 檔案。

## Goals / Non-Goals

**Goals:**
- 將根目錄、前端與後端的專案配置名稱統一變更為 \`md2pdf\` 相關標識。
- 撰寫結構完整、格式美觀的 GitHub 風格中英文雙語 \`README.md\`。
- 新增標準的 MIT \`LICENSE\` 授權檔案。

**Non-Goals:**
- 修改現有的前後端應用邏輯或增加新的 UI 功能。
- 將專案上傳至 npm 官方 registry 進行釋出。

## Decisions

### 1. 專案命名結構
- **決策**：
  - 根目錄 \`package.json\` 改名為 \`md2pdf-workspace\`
  - 前端 \`frontend/package.json\` 改名為 \`md2pdf-frontend\`
  - 後端 \`server/package.json\` 改名為 \`md2pdf-server\`
- **理由**：
  - 維持 monorepo workspaces 的良好命名慣例，便於在根目錄快速以 \`npm run dev --workspace=md2pdf-frontend\` 等方式區分。

### 2. README 檔案設計
- **決策**：採用 Traditional Chinese（繁體中文）與 English（英文）上下並列的結構。
- **理由**：
  - 上下分段並列能保證在 GitHub 頁面上直接渲染時的可讀性，比分欄或折疊更利於搜尋引擎優化 (SEO) 與快速閱讀。
  - README 內容將包含：專案標題與徽章、中英文簡介、主要特色（即時預覽、防抖機制、隔離樣式、隨機下載）、專案架構說明、 WSL-Ubuntu 下運行 Puppeteer 的依賴安裝指令、本地啟動與使用指南、以及 MIT 授權說明。

### 3. 開源授權選擇
- **決策**：選用 MIT License。
- **理由**：
  - MIT License 是最寬鬆、最受社群歡迎的開源協議之一，允許使用者自由使用、修改、分發且無商業限制，非常適合此類本地端實用工具專案。

## Risks / Trade-offs

- **變更相依性名稱的潛在衝突**：
  - *風險*：若在 workspaces 中使用了 package 互連，更名可能導致 npm 無法正確連結 workspaces。
  - *緩解*：本專案之前的前後端互連僅透過根目錄的 workspaces 設定（\`"workspaces": ["frontend", "server"]\`），前端與後端之間並未直接互相 dependency 引用，因此更名 package.json 中的 \`name\` 屬性不會造成連結破壞。更新完 package.json 後，僅需重新在根目錄執行 \`npm install --legacy-peer-deps\` 即可重新連結。
