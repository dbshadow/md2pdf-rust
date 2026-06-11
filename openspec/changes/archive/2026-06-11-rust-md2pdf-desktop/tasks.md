## 1. 初始化 Tauri 專案環境

- [x] 1.1 安裝 Tauri CLI 依賴（在前端專案或根目錄下安裝 `@tauri-apps/cli`）
- [x] 1.2 初始化 Tauri 專案設定，建立 `src-tauri` 目錄並配置 `tauri.conf.json`
- [x] 1.3 配置 `tauri.conf.json`，設定前端資產來源（如指向前端 build 後的 dist 目錄）以及開發伺服器埠口（Vite 預設的 5173）

## 2. Rust 後端 PDF 核心與 IPC 實作

- [x] 2.1 在 `src-tauri/Cargo.toml` 中加入依賴：`headless_chrome`, `base64`, `tempfile`, `pulldown-cmark`, `serde` 
- [x] 2.2 在 Rust 端實作 Markdown 轉 HTML 邏輯與 CSS 樣式注入
- [x] 2.3 實作 `generate_pdf` 的 Tauri Command：將 HTML 透過 `headless_chrome` 呼叫本機瀏覽器列印為 PDF，並將 PDF 二進位 Buffer 轉為 Base64 字串傳回
- [x] 2.4 實作 `export_pdf` 的 Tauri Command：調用 Tauri 的 dialog API 彈出原生另存新檔對話框，將 Base64 PDF 解碼並寫入使用者選擇的路徑
- [x] 2.5 在 `main.rs` 中註冊這兩個 Tauri Commands，並設定 Tauri 視窗啟動參數

## 3. 前端 React 重構

- [x] 3.1 在前端安裝 `@tauri-apps/api` 依賴
- [x] 3.2 修改前端 PDF 生成呼叫：將原本的 `fetch("http://localhost:3001/api/generate")` 替換成以 Tauri IPC 的 `invoke("generate_pdf")` 調用
- [x] 3.3 修改前端預覽邏輯：將傳回的 Base64 數據轉成 Blob 並生成 Blob URL，更新 PDF 預覽元件的 `src`
- [x] 3.4 修改前端下載按鈕邏輯：點擊時呼叫 Rust 端 `export_pdf` Command 觸發原生儲存對話框

## 4. 移除 Node.js 後端與環境清理

- [x] 4.1 刪除 `/server` 目錄及其中所有程式碼
- [x] 4.2 修改根目錄 `package.json`，移除後端與 Monorepo workspace 的依賴配置，更新 `dev` 指令為 `tauri dev`，`build` 指令為 `tauri build`

## 5. 聯調測試與發布打包

- [x] 5.1 執行本地開發伺服器進行測試，確認雙編輯器、HTML 即時預覽、PDF 生成與預覽功能皆正常運作
- [x] 5.2 測試導出 PDF 功能，驗證原生另存新檔對話框與 PDF 檔案的正確性
- [x] 5.3 在 Windows 宿主機（或在 WSL 呼叫 Windows 側的工具鏈）進行 Tauri 靜態打包，編譯並產出單一 Windows 免安裝 `.exe` 執行檔，確認其可於無 Node.js/Chromium 環境的 Windows 系統直接啟動與使用
