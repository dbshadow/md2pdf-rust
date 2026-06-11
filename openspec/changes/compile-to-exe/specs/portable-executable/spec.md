## ADDED Requirements

### Requirement: Portable Executable Build
專案必須提供一個腳本，能將前端與後端整合並編譯為適用於 Windows 平台的單一免安裝執行檔（`md2pdf.exe`）。該執行檔必須包含 Node.js 執行環境、後端伺服器程式碼、以及編譯後的前端靜態檔案，且檔案大小必須控制在 100MB 以下。

#### Scenario: Build Portable Executable
- **WHEN** 執行編譯腳本
- **THEN** 在輸出目錄中產生 Windows 可執行的單一免安裝檔案（例如 `dist/md2pdf.exe`），且其檔案大小小於 100MB。

### Requirement: Server Startup and Auto Open Browser
運行免安裝執行檔時，系統必須在背景啟動 Express API 伺服器並託管前端靜態網頁。伺服器成功啟動後，系統必須自動開啟使用者電腦的預設瀏覽器，並導向 `http://localhost:3001`（或配置的 Port）。

#### Scenario: Launch Executable
- **WHEN** 使用者雙擊或從終端機執行 `md2pdf.exe`
- **THEN** 伺服器啟動成功，並自動調用預設瀏覽器打開 `http://localhost:3001`，且瀏覽器中能正常渲染編輯器與功能頁面。

### Requirement: PDF Generation via Local Chrome/Edge Browser
免安裝執行檔內的 PDF 生成服務不得內置 Chromium，以維持檔案輕量。服務在收到 PDF 轉換請求時，必須動態尋找 Windows 本機已安裝的 Chrome 或 Edge 瀏覽器的執行路徑，並透過 `puppeteer-core` 連結該瀏覽器進行 PDF 的印表機分頁渲染。若找不到任何相容的本機瀏覽器，必須提示錯誤訊息告知使用者。

#### Scenario: Generate PDF Successfully
- **WHEN** 使用者在瀏覽器中編輯 Markdown 並點擊 PDF 分頁預覽或下載
- **THEN** 後端服務成功尋找到本機的 Chrome/Edge，渲染並返回 PDF 二進制 Buffer，且無任何錯誤。

#### Scenario: Local Browser Not Found
- **WHEN** 使用者在未安裝 Chrome/Edge 的環境中執行 PDF 轉換
- **THEN** 後端服務拋出明確的錯誤訊息（例如「未能在本機找到 Chrome 或 Edge 瀏覽器，請先安裝以進行 PDF 轉換」），且前端畫面顯示該錯誤提示。
