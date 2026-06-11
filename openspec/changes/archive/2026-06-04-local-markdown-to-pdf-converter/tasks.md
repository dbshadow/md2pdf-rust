## 1. 專案初始化與環境設定

- [x] 1.1 初始化根目錄，配置 npm workspaces 或 package.json 腳本，加入 `concurrently` 用於一鍵啟動前後端。
- [x] 1.2 初始化後端專案目錄 `server`，安裝 Express, marked, puppeteer, cors 等必要套件，並設定 TypeScript 環境。
- [x] 1.3 初始化前端專案目錄 `frontend`，使用 Vite + React + TypeScript 樣板，安裝 lucide-react, @monaco-editor/react 等套件。
- [x] 1.4 在根目錄新增 `README.md`，詳述本地端啟動方式及 WSL 底下安裝 Chrome/Chromium 依賴的指令。

## 2. 後端 PDF 生成引擎實作

- [x] 2.1 實作一個基礎的 Express 伺服器，並配置 CORS 以允許前端存取。
- [x] 2.2 實作 Puppeteer 瀏覽器管理服務，維持單一瀏覽器實例（Singleton pattern），並提供 `generatePDF(html, css)` 函數。
- [x] 2.3 實作 POST `/api/render` 端點，接收 `{ markdown, css }` 參數，利用 `marked` 轉為 HTML，拼接 CSS，呼叫 Puppeteer 輸出 PDF buffer 並返回二進制流。
- [x] 2.4 在後端加入針對 page-break 樣式（如 CSS `@page` 規則、分頁標記）的支援。

## 3. 前端 Markdown & CSS 雙編輯器實作

- [x] 3.1 設計前端整體 Layout，左側為編輯區（包含 Markdown 與 CSS 兩個 Tab 或是分欄），右側為 PDF 預覽區。
- [x] 3.2 整合 `@monaco-editor/react` 編輯器，實作 Markdown 與 CSS 編輯區的語法高亮、行號及提示。
- [x] 3.3 實作編輯器內容狀態管理，並加入 800ms 防抖 (Debounce) 機制，在使用者停止打字後觸發渲染請求。
- [x] 3.4 實作「手動/自動預覽」切換功能，讓使用者能自主控制渲染頻率。

## 4. PDF 預覽與導出功能實作

- [x] 4.1 實作 API 呼叫服務，發送編輯器內容至後端 `/api/render` 並將回傳的 PDF buffer 轉換為前端的 Blob URL。
- [x] 4.2 實作 PDF 預覽元件，使用 `<iframe>` 或 `<embed>` 載入 Blob URL。
- [x] 4.3 實作下載 PDF 功能，允許使用者在 UI 中輸入自訂的 PDF 檔名，並下載檔案.
- [x] 4.4 實作載入中 (Loading) 狀態的 UI 動效，在 PDF 渲染期間顯示骨架屏或 Loading 微動畫。

## 5. 樣式模板與 UI 拋光

- [x] 5.1 設計並建立 4 個預設的 CSS 樣式模板：學術報告 (Academic)、精美履歷 (Resume)、簡約現代 (Modern) 以及乾淨文字 (Plain Markdown)。
- [x] 5.2 在前端 UI 新增模板選擇下拉選單，選取時自動將對應 CSS 填入編輯器並觸發 PDF 更新。
- [x] 5.3 實作「重置回模板預設值」按鈕，方便使用者隨時還原自訂修改。
- [x] 5.4 套用 HSL 色系之 Vanilla CSS 進行全站美化，實作深色模式與淺色模式切換，並增加按鈕、切換卡片的微動效，實現 WOW 的視覺感受。
