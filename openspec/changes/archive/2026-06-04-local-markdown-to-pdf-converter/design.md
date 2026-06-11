## Context

本專案旨在提供一個與 apitemplate.io 雷同的本地端 Markdown 轉 PDF Web 應用程式。使用者將在瀏覽器中操作（前端），背後由本地的 Node.js 伺服器提供 Markdown 解析與 PDF 精準渲染服務（後端）。

## Goals / Non-Goals

**Goals:**
- 提供雙編輯器介面，左側編輯 Markdown 與自訂 CSS，右側即時顯示生成的 PDF 預覽。
- 採用 Monaco Editor，為 Markdown 與 CSS 編輯提供最高品質的語法高亮與提示。
- 後端使用 Puppeteer 進行高精度的 HTML+CSS 轉 PDF 渲染，支援 A4 格式、分頁控制與列印背景。
- 提供多個預設樣式模板（如：學術報告、個人簡歷、商業提案、簡約風格）。
- 提供一鍵下載生成的 PDF 檔案。
- 支援一鍵啟動（在根目錄運行 `npm run dev` 同時啟動前端與後端）。

**Non-Goals:**
- 提供帳號註冊、雲端儲存或線上協作功能。
- 支援 markdown 以外的格式（如 Word, LaTeX, RestructuredText）。
- 支援線上 PDF 編輯（如直接修改預覽 PDF 中的文字）。

## Decisions

### 1. 前後端架構與本地部署
- **決策**：採用 Monorepo 結構，包含前端 `frontend` (Vite + React + TypeScript) 和後端 `server` (Node.js + Express)。
- **理由**：
  - 前端與後端分離可以使職責清晰：前端專注於 UI 體驗與編輯器狀態；後端專注於安全、高效的 PDF 渲染。
  - 使用 `concurrently` 套件，在根目錄定義 `npm run dev` 同時運行 Vite 開發伺服器與 Express 後端。

### 2. 編輯器選擇
- **決策**：前端編輯器採用 Monaco Editor (`@monaco-editor/react`)。
- **理由**：
  - Monaco Editor 提供了與 VS Code 相同的開發體驗。
  - 對於 CSS 的自訂編輯，Monaco 提供內建的語法錯誤檢查與屬性自動完成，這對使用者修改樣式非常有幫助。
  - 對於 Markdown，也提供了良好的可讀性與折疊功能。

### 3. PDF 渲染引擎
- **決策**：後端採用 `marked` 進行 Markdown -> HTML 轉換，並使用 `puppeteer` 進行 HTML -> PDF 渲染。
- **理由**：
  - 由於 apitemplate.io 的核心賣點是「即時預覽完全精準的 PDF 結果」，直接在前端用 Canvas 或是 HTML2PDF 的做法對分頁 (Page Break) 和 CSS @page 的支援極其有限。
  - Puppeteer 透過 Chrome Headless 進行渲染，能完美支援所有 CSS 印表機樣式（包括 `page-break-before`, `page-break-after`, `orphans`, `widows`, 以及 CSS 變數與 Web Fonts）。
  - 後端將重複使用同一個 Puppeteer 瀏覽器實例，每次請求僅開啟新的 `page` 來進行渲染，渲染完成後關閉 `page`，以最大化效能並降低記憶體開銷。

### 4. PDF 即時預覽方案
- **決策**：前端使用 `<iframe>` 元件載入由 PDF 數據生成的 Blob URL。
- **理由**：
  - 瀏覽器內建的 PDF 閱讀器功能非常強大，支援縮放、搜尋、單頁/雙頁顯示。
  - 使用 iframe 載入 Blob URL 渲染開銷極低，且不需要在前端載入龐大的 PDF.js 渲染庫。

### 5. UI 與設計系統
- **決策**：前端使用 Vanilla CSS / CSS Modules，建立高質感的玻璃摩登風格 (Glassmorphism)，並配合深色/淺色切換。
- **理由**：
  - 滿足 Premium 網頁設計需求，具有平滑的微動畫 (Micro-animations) 與流暢的佈局轉換。
  - 避開單調的 AI 預設樣式，透過精心挑選的 CSS 變數（HSL 色系）控制主題。

## Risks / Trade-offs

### 1. WSL 環境下的 Puppeteer 缺少依賴庫
- **風險**：WSL-Ubuntu 預設沒有安裝運行 Chromium 所需的圖形與系統庫（例如 `libnss3`、`libatk` 等），導致 Puppeteer 啟動失敗。
- **折衷與緩解**：
  - 在 Puppeteer 啟動參數中加入 `--no-sandbox` 與 `--disable-setuid-sandbox`。
  - 在 README.md 中清楚記載在 WSL-Ubuntu 22.04 中，需要執行 `sudo apt-get install -y ...` 安裝 Chromium 依賴的指令，或提供一鍵腳本安裝。

### 2. 即時預覽的 CPU 消耗
- **風險**：當使用者打字時，頻繁發送編譯請求會導致後端 CPU 飆升。
- **折衷與緩解**：
  - 前端實施 防抖 (Debounce) 機制。只有當使用者停止輸入達 800 毫秒後，才會將當前的 Markdown 和 CSS 發送到後端進行編譯。
  - 提供手動/自動預覽切換開關，讓使用者可以選擇手動按下「預覽」或開啟「自動即時預覽」。
