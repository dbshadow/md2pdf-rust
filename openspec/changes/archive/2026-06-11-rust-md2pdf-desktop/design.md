## Context

原本的 `md2pdf` 專案採用 Monorepo 架構，包含 Vite+React 前端與 Node.js+Express+Puppeteer 後端。為了將其改寫為 Rust 桌面應用程式並編譯成單一免安裝的 Windows exe 檔，我們需要整合前端與後端，並重新設計 PDF 生成的底層引擎。

## Goals / Non-Goals

**Goals:**
- 將 React 前端與 Rust 後端整合，使用 Tauri 框架構建桌面應用程式。
- 移除 Node.js + Express 後端與 Puppeteer 依賴，以 Rust 代替後端邏輯。
- 在 Rust 中實現高精度的 HTML/CSS 轉 PDF，確保 PDF 排版效果與原本的 Puppeteer 一致。
- 支援一鍵編譯成 Windows 的單一免安裝 `.exe` 執行檔。
- 前端與後端通訊全部改用 Tauri IPC (Inter-Process Communication)。
- 使用系統原生另存新檔對話框進行 PDF 導出。

**Non-Goals:**
- 不重新設計前端 UI 外觀與編輯器邏輯（保留現有的 Monaco Editor 與 5 套預設模板）。
- 不自己實作 HTML/CSS 排版引擎（繼續藉由 Chromium 核心進行高精度的 PDF 渲染）。

## Decisions

### 1. 桌面端框架：Tauri (Tauri v2)
- **決定**：使用 Tauri 框架，其前端使用現有的 React + TS + Monaco Editor 程式碼，後端使用 Rust 實作。
- **理由**：
  - 可以 100% 複用前端既有的高質感 UI，無須以 Rust 原生 UI 庫（如 iced 或 egui）重新刻劃複雜的 Monaco Editor 與 A4 網頁預覽。
  - 產物体積小（Tauri 的 exe 大小通常小於 15MB），因為它使用系統內建的 Webview (Windows 下為 WebView2)，不需要包裝 Chromium。
- **替代方案**：
  - *Electron*：打包體積過大（> 100MB），不符合免安裝輕量化的需求。
  - *Rust 原生 UI*：如 egui 或 iced，難以完美支援 Monaco Editor、繁瑣的 CSS 語法高亮及即時 HTML 渲染。

### 2. PDF 生成引擎：`headless_chrome` (Rust Crate)
- **決定**：在 Rust 後端使用 `headless_chrome` 庫，驅動作業系統內建的 Microsoft Edge (Windows) 或 Chrome (Mac/Linux) 的 Headless 實例來生成 PDF。
- **理由**：
  - 系統內建的 Edge 在 Windows 10/11 都是預設安裝的，我們無須隨 App 打包 Chromium，即可呼叫 Edge 的無頭模式。
  - `headless_chrome` 通過 Chrome DevTools Protocol (CDP) 與瀏覽器通訊，其列印 PDF 功能與 Puppeteer 的 `page.pdf()` 原理完全相同，能 100% 保留 CSS page size, margin, page-breaks 等高精度 A4 排版規格。
- **替代方案**：
  - *Tauri WebView Print*：Tauri 本身沒有穩定跨平台的 A4 PDF 導出 API，且在 Windows 上調用低階 WebView2 COM API 實現靜默列印為 PDF 較為繁瑣且不夠靈活。
  - *純 Rust PDF 庫 (如 printpdf)*：難以解析複雜的 Markdown 轉 HTML 加上自訂 CSS 樣式，無法達到原本 Puppeteer 的排版渲染水準。

### 3. API 與通訊架構：Tauri IPC
- **決定**：前端呼叫 `import { invoke } from '@tauri-apps/api/core'`，將 Markdown 及 CSS 傳送至 Rust 端。
- **Rust 端 API 介面**：
  - `generate_pdf(markdown: String, css: String) -> Result<String, String>`：接收內容，經 `pulldown-cmark` 將 Markdown 轉為 HTML，注入 CSS 後，透過 `headless_chrome` 渲染，最後返回 PDF 的 Base64 編碼字串給前端。
  - `export_pdf(base64_data: String, filename: String) -> Result<(), String>`：前端傳入 PDF 的 Base64 資料，Rust 調用 Tauri dialog 顯示儲存對話框，再將檔案寫入指定的本機路徑。

### 4. 前端預覽機制
- **決定**：前端取得 Rust 返回的 PDF Base64 資料後，將其轉換為 ArrayBuffer 並建立 Blob URL，最後更新 `<iframe>` 或 PDF 預覽元件的 `src`。這能保持跟原專案一樣的無黑屏 preview 機制。

## Risks / Trade-offs

- **[Risk] 系統內建瀏覽器依賴**：如果使用者的 Windows 系統沒有安裝 Microsoft Edge，`headless_chrome` 將無法運行。
  - *Mitigation*：在 Windows 10/11 上 Edge 是內建且無法輕易移除的，因此對絕大多數 Windows 使用者來說是安全的。我們也可以在 Rust 端加入偵測，若找不到瀏覽器則提示使用者下載 Chrome 或 Edge。
- **[Risk] 跨平台編譯限制**：Tauri 在 Linux/WSL 下直接交叉編譯 Windows `.exe` 會有 WebView2 鏈結與資源檔編譯的相容性問題，官方亦不支持此方式。
  - *Mitigation*：採用 Windows 本地編譯方案。開發者可直接在 Windows 宿主機的終端機進入 WSL 目錄路徑執行 `npm run tauri build`，或於 WSL 中調用 Windows 側安裝的 `cargo.exe` 與 MSVC 工具鏈進行編譯。
