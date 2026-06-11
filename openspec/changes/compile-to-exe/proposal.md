## Why

目前本專案為 Monorepo 架構，包含前端 (Vite + React) 與後端 (Express + Puppeteer)。使用者若要在本地執行，必須在終端機安裝 Node.js、執行 `npm install`、並啟動開發伺服器，對一般非開發者或尋求便利的使用者來說門檻較高。將專案改編譯成 Windows 免安裝的單一 `.exe` 執行檔，可以讓使用者點擊後直接執行，自動在瀏覽器打開 PDF 轉換網頁，實現開箱即用的極簡體驗。

## What Changes

- **前端靜態編譯與託管**：前端 Vite React 專案編譯後的 `dist` 資源，將由後端 Express 伺服器託管（`express.static`），使前後端在同一個連接埠（如 `3001`）運作。
- **後端伺服器啟動後自動開啟瀏覽器**：伺服器成功啟動後，將透過 Node.js 自動開啟系統預設瀏覽器並導向 `http://localhost:3001`。
- **動態尋找本機瀏覽器（免安裝 Puppeteer）**：為了避免打包 Chromium 導致 `.exe` 檔案過於巨大且啟動緩慢，後端改用 `puppeteer-core`，並在啟動時自動掃描本機常見的 Chrome / Edge 安裝路徑。
- **新增編譯打包腳本**：使用 `pkg` 將後端程式（含託管的前端靜態檔與相依套件）打包編譯成適用於 Windows 的單一免安裝執行檔（`.exe`）。
- **更新 README 與說明文件**：新增如何編譯與使用免安裝執行檔的說明。

## Capabilities

### New Capabilities
- `portable-executable`: 提供將專案編譯為單一 Windows 免安裝執行檔（`.exe`）的指令，運行該執行檔將啟動背景伺服器並自動開啟預設瀏覽器，並透過偵測本機 Chrome/Edge 進行 PDF 渲染。

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing -->

## Impact

- **前端 build 設定**：需確認 `frontend` 編譯後的靜態檔案輸出路徑可被後端正確讀取，或是將前端的 `dist` 複製到後端特定目錄。
- **後端 API 伺服器**：
  - 需要託管前端靜態資源。
  - 需要在啟動時呼叫 `open` 打開瀏覽器。
  - 渲染 PDF 的程式需從使用專案內的 Puppeteer Chromium，改為使用 `puppeteer-core` 尋找本機 Chrome / Edge 瀏覽器。
  - 修改 `package.json` 中的 `pkg` 配置以打包靜態資源。
- **依賴套件變更**：
  - 新增後端依賴：`open`（用於自動開啟網頁）、`puppeteer-core`（或直接使用 `puppeteer-core` 替代 `puppeteer`，避免 `pkg` 打包不必要的 Chromium 資源）。
  - 新增開發依賴：`pkg`（用於將 Node.js 專案打包成 exe）。
