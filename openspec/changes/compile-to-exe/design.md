## Context

目前的專案採用 Monorepo 設計：
- `/frontend`：Vite + React + TS，編譯後產生靜態檔案。
- `/server`：Express + TS + Puppeteer，負責接收 Markdown/CSS 並啟動無頭瀏覽器產出 PDF。
為了方便 Windows 使用者無需安裝 Node.js 環境即可使用，我們計畫將前後端打包成一個免安裝的單一可執行檔（`md2pdf.exe`）。

## Goals / Non-Goals

**Goals:**
- 提供單一的 Windows 執行檔 (`md2pdf.exe`)，使用者執行後即開即用。
- 自動託管前端靜態資源，並自動在系統預設瀏覽器中開啟前端頁面。
- 大幅縮減執行檔體積，避免打包 100MB+ 的 Chromium，改用本機安裝的 Chrome 或 Edge 瀏覽器。
- 提供在 Linux/WSL 環境下交叉編譯 Windows 執行檔的機制。

**Non-Goals:**
- 不打算改寫前端的核心邏輯，只對 API 請求路徑做動態判定（開發環境打 http://localhost:3001，生產環境打相對路徑）。
- 不提供 macOS 或 Linux 的免安裝二進制檔編譯（以 Windows 的 `.exe` 為首要目標，但保留跨平台程式碼的相容性）。

## Decisions

### 1. 使用 `pkg` 交叉編譯與打包
- **選擇**：使用 Vercel 的 `pkg` 套件。
- **理由**：`pkg` 可以將 Node.js 專案（包含 JS 程式碼、資產檔案以及 Node 執行期環境）打包成單一二進制檔。它支援在 Linux/WSL 環境下，透過設定 `--targets node18-win-x64` 交叉編譯出 Windows 可執行的 `.exe` 檔。
- **替代方案**：使用 `nexe` 或 `Electron`。
  - `nexe` 對 ES 模組和 monorepo 靜態檔案打包的支援不如 `pkg` 友善。
  - `Electron` 雖然能提供獨立視窗，但會使包裝體積暴增至 150MB+，且開發與維護成本較高，暫不採用。

### 2. 靜態資源整合與單一 Port 託管
- **做法**：Express 後端在生產環境下（被打包時）會託管前端編譯出來的 `frontend/dist` 靜態檔案。
- **代碼變更**：
  - 前端發送 API 時，開發模式下使用 `http://localhost:3001`，生產模式下使用相對路徑。
  - 後端 `index.ts` 引入 `express.static` 來伺服 `frontend/dist`，並將所有非 API 的萬用路由（`*`）導向 `frontend/dist/index.html`。
- **優點**：使用者執行一個 `.exe`，只會佔用一個 Port，沒有跨域 (CORS) 問題。

### 3. 動態尋找本機瀏覽器（使用 `puppeteer-core`）
- **選擇**：將後端的 `puppeteer` 替換為 `puppeteer-core`，並在啟動時自動掃描 Windows 常見的 Chrome/Edge 安裝路徑。
- **理由**：
  - 標準的 `puppeteer` 會強行下載並包入 Chromium，導致打包體積增加 >100MB，且打包在 exe 內部執行時，Chromium 解壓或啟動常因權限問題失敗。
  - 改用 `puppeteer-core` 可以直接連結本機已有的 Chrome/Edge 瀏覽器。由於大多數 Windows 使用者皆裝有 Chrome 或 Edge，這是一個安全且高效的優化，可使 `.exe` 體積控制在約 30-40MB。

### 4. 使用內建 `child_process` 自動開啟瀏覽器
- **做法**：在 Express 伺服器啟動成功後，利用 Node.js 原生的 `child_process.exec`，根據作業系統平台執行對應命令（Windows 用 `start`，macOS 用 `open`，Linux/WSL 用 `xdg-open` / `wslview`）打開 `http://localhost:3001`。
- **優點**：不需引入第三方套件（如 `open`），減少打包時的外部相依性與錯誤風險。

## Risks / Trade-offs

- **[Risk] 使用者本機未安裝 Chrome 或 Edge**
  - *Mitigation*：在 PDF 服務初始化時，若找不到相容瀏覽器，後端會拋出明確錯誤，前端收到後會呈現友善的「請安裝 Chrome 或 Edge 瀏覽器」提示畫面，而非直接崩潰。
- **[Risk] `pkg` 對 ES Modules (ESM) 的打包支援問題**
  - *Mitigation*：確保後端 `package.json` 中正確配置 `bin`、`main` 以及 `pkg.assets`，並在必要時將依賴檔案明確寫入打包清單。
