## 1. 前端調整與編譯

- [ ] 1.1 修改 `frontend/src/App.tsx` 中的 API 請求 URL，在開發環境下指向 `http://localhost:3001`，生產環境下使用相對路徑。
- [ ] 1.2 執行前端編譯指令 `npm run build --workspace=md2pdf-frontend`，確保順利生成 `frontend/dist` 靜態檔案。

## 2. 後端伺服器調整

- [ ] 2.1 修改 `server/package.json`，將 `puppeteer` 依賴改為 `puppeteer-core`。
- [ ] 2.2 在 `server/src/pdfService.ts` 中，改為引入 `puppeteer-core`，並實作 `findChromeOrEdge` 函式，用於在 Windows、macOS 與 Linux/WSL 環境下動態探測 Chrome 或 Edge 瀏覽器的執行檔路徑。
- [ ] 2.3 修改 `server/src/pdfService.ts` 中的 `getBrowser` 邏輯，將尋找到的本機瀏覽器路徑作為 `executablePath` 傳入 `puppeteer.launch`。
- [ ] 2.4 在 `server/src/index.ts` 中實作 Express 託管前端靜態資源（`frontend/dist`）的路由邏輯，並確保非 API 的萬用路由會回傳 `index.html`。
- [ ] 2.5 在 `server/src/index.ts` 中，使用 Node.js 原生 `child_process.exec` 實作在伺服器啟動成功後，自動於預設瀏覽器打開 `http://localhost:3001` 的邏輯。

## 3. 整合與打包配置

- [ ] 3.1 在根目錄 `package.json` 的 `devDependencies` 中加入 `pkg`。
- [ ] 3.2 在 `server/package.json` 中配置 `pkg` 欄位，指定包含的前端 assets（`../frontend/dist/**/*`）、目標平台為 `node18-win-x64`。
- [ ] 3.3 在根目錄 `package.json` 的 `scripts` 中加入 `build:exe` 腳本，依序編譯前端、編譯後端、並執行 `pkg server/package.json --out-path dist/`。

## 4. 測試與驗證

- [ ] 4.1 於專案根目錄執行 `npm run build:exe`，確認能成功編譯出 `dist/md2pdf.exe`。
- [ ] 4.2 驗證 `dist/md2pdf.exe` 檔案大小（預期應在 30-50MB 之間，遠小於 100MB）。
- [ ] 4.3 更新專案根目錄的 `README.md`，新增免安裝執行檔的編譯與使用說明。
