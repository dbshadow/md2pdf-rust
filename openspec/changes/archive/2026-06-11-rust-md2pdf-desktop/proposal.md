## Why

目前的專案是 Web Monorepo 架構，使用者需要安裝 Node.js 並在本地同時啟動 React 前端與 Node.js/Puppeteer 後端伺服器，且在 WSL 環境下需要手動安裝大量 Linux 圖形庫依賴，這對一般使用者而言有較高門檻。透過將專案改寫為以 Rust 語言為基礎的 Tauri 獨立桌面應用程式，並編譯為 Windows 的免安裝 exe 檔案，使用者無須安裝任何 Node.js 環境即可開箱即用，大幅提升軟體的可攜性與易用性。

## What Changes

- **專案架構轉換**：將 React 前端與 Rust 後端整合至 Tauri 框架中，移除了原本的 Node.js + Express 後端。
- **PDF 生成機制重構 (BREAKING)**：移除 Puppeteer 的 Node.js 依賴，改在 Rust 端透過 `headless_chrome` 驅動本地瀏覽器（如系統內建的 Edge/Chrome）或使用 Tauri 的 WebView 進行高精度 HTML+CSS 轉 PDF。
- **前端 API 請求重構 (BREAKING)**：前端原本向後端 Express API (`http://localhost:3001/api/generate`) 發送的 HTTP 請求，將改為透過 Tauri 的 `invoke` 機制直接調用 Rust 後端的指令。
- **單一獨立應用程式與打包**：將專案編譯為單一 exe 的免安裝檔案（Portable Executable），不需要安裝額外的執行環境。
- **保留原有功能**：維持雙編輯器（Monaco Editor）、HTML 即時預覽、PDF 分頁預覽與 5 套高質感簡約模板等功能。

## Capabilities

### New Capabilities
- `desktop-app-integration`: 將 React 前端與 Rust 後端整合為 Tauri 桌面應用程式，實現單一 exe 免安裝檔案發布。

### Modified Capabilities
- `pdf-generator`: 移除 Node.js + Express 後端 API，改由 Rust 端提供高精度的 PDF 生成邏輯。
- `pdf-preview`: 重構 PDF 預覽數據流，前端不再透過 API 請求 PDF Buffer，而是透過 Tauri IPC 獲取 PDF 數據並進行渲染預覽。

## Impact

- **被移除的程式碼**：將會移除 `/server` 目錄下的所有 Node.js + Express 後端程式碼。
- **修改的程式碼**：`/frontend` 需要與 `src-tauri` 進行整合，並重構 API 通訊部分（將 `fetch` 改為 Tauri IPC 的 `invoke`）。
- **新增的程式碼**：新增 `src-tauri` 目錄，包含 Tauri 的設定檔 (`tauri.conf.json`)、Rust 進入點 (`main.rs`) 及 PDF 生成/列印的 Rust 實作。
- **依賴變更**：移除所有 Node.js 後端依賴（如 `puppeteer`, `express`, `cors`），新增 Rust 依賴（如 `tauri`, `tauri-build`, `headless_chrome` 或相關 PDF 渲染依賴）。
