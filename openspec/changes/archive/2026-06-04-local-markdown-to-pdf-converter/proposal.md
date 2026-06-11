## Why

線上將 Markdown 轉換成 PDF 的工具（如 apitemplate.io）雖然方便，但在處理敏感、機密或個人資料時，會面臨隱私與資安風險。此外，線上工具受限於網路連線且通常有額度或付費限制。
本專案旨在建立一個「本地端網頁工具」，提供與 apitemplate.io 相同的高效編輯體驗：支援 Markdown 編輯、自訂 CSS 樣式、即時預覽轉出 PDF 的結果，並能直接於本地端生成與下載 PDF，確保資料隱私與離線可用性。

## What Changes

- **建立本地端 Web 應用程式**：採用 Vite + React (TypeScript) 前端與 Node.js + Express 後端。
- **Markdown & CSS 雙編輯器**：前端提供左右分欄或 Tab 切換的編輯器，一邊輸入 Markdown 內容，另一邊編輯自訂 CSS（支援語法高亮與自動完成）。
- **即時預覽 PDF**：當 Markdown 或 CSS 內容變更時，即時在網頁右側（或下方）渲染 PDF 預覽畫面。
- **本地 PDF 生成引擎**：後端使用 Puppeteer 接收 Markdown 轉成的 HTML 及 CSS，在無頭瀏覽器 (headless browser) 中進行完美的 PDF 渲染，支援分頁、自訂頁首/頁尾、邊距設定等，並回傳 PDF 二進制流 (binary stream)。
- **樣式模板 (Style Templates)**：內建多套精美的 CSS 模板（如：學術報告、履歷/CV、商業提案、簡約風等），使用者可一鍵套用並在此基礎上進行修改。
- **下載/匯出功能**：一鍵下載生成的 PDF 文件，並支援設定 PDF 檔名。
- **精美現代化 UI**：採用流暢且具科技感的深色/淺色主題，符合 Premium Web Design 的精緻質感。

## Capabilities

### New Capabilities

- `markdown-editor`: 提供 Markdown 編輯功能，具備語法高亮、行號及常用快捷鍵。
- `css-editor`: 提供 CSS 編輯功能，用於自訂 PDF 頁面的排版與樣式，具備 CSS 語法高亮與提示。
- `pdf-generator`: 後端 PDF 生成核心，基於 Puppeteer 將結合 CSS 的 HTML 轉換為 PDF，支援 @page CSS 規則、頁首頁尾、分頁控制等。
- `pdf-preview`: 前端 PDF 預覽元件，能即時顯示後端生成的 PDF（可使用 PDF.js 或 iframe 進行高效渲染與縮放）。
- `style-templates`: 樣式模板管理器，允許使用者選擇、套用、並預覽不同的 CSS 模板。

### Modified Capabilities

無。

## Impact

- **新增後端服務**：建立 `server/` 資料夾，使用 Express、Puppeteer、marked 等套件來處理 Markdown 轉 HTML 以及 HTML 轉 PDF 的邏輯。
- **建立前端應用**：建立 `frontend/` 資料夾，使用 React, Lucide React, Monaco Editor (或 CodeMirror) 等來構建高質感的編輯器與預覽介面。
- **專案結構優化**：在根目錄使用 npm workspaces 或簡單的 concurrently 套件，讓使用者可以透過單一命令（如 `npm run dev`）同時啟動前端與後端。
