# md2pdf 🚀

[README_zh.md (繁體中文)](#) | [README.md (English)](README.md) | [README_es.md (Español)](README_es.md)

---

## 📖 專案介紹

`md2pdf` 是一款美觀、高質感的**本地端 Markdown 轉 PDF 獨立桌面應用程式**。基於 Tauri (Rust) + React + TypeScript 構建，前端利用 Monaco Editor 提供高效率編輯體驗，後端採用 Rust 惰性加載的常駐無頭瀏覽器（Microsoft Edge/Chrome）進行高精度 PDF 生成。

所有編譯與生成均在本地端運作，100% 確保敏感資料的隱私與安全。

---

## ✨ 核心特色

*   **雙編輯器整合**：採用 VS Code 同款的 Monaco Editor，提供語法高亮、行號以及對 CSS 的屬性自動完成與語法檢查。
*   **對比 (Diff) 編輯模式**：支援一鍵開啟 Monaco 對比編輯器，直觀比對當前文檔與原始範本的代碼差異，方便追蹤與管理變更。
*   **自訂模板持久化儲存**：可將自己調整好的 Markdown 內容與 CSS 樣式直接另存為自訂模板，持久化儲存於本地，隨時一鍵套用。
*   **雙預覽模式系統**：
    *   **HTML 即時預覽**：打字時微秒級響應，絕無黑屏閃爍，完美保留目前滾動條位置，提供流暢的寫作體驗。
    *   **PDF 真實分頁預覽**：一鍵切換，調用後端常駐無頭瀏覽器，精確呈現邊距、分頁（Page Break）與 `@page` 列印樣式。
*   **高質感預設風格模板**：
    *   📄 **精美個人履歷 (Resume)**：緊湊細緻，專為求職設計。
    *   🎓 **學術報告 (Academic)**：符合學術規格與首字縮排。
    *   🚀 **簡約現代 (Modern)**：現代化漸層標題與圓角代碼塊。
    *   💎 **蒂芬妮簡約 (Tiffany Minimal)**：搭配莫蘭迪灰藍與蒂芬妮綠色調，極致優雅。
    *   📝 **乾淨文字 (Plain Markdown)**：最經典純粹的排版。
    *   📘 **科技藍 (Tech Blue)**：專業科技藍色調，優化 Mermaid 適應與 PDF 列印分頁防腰斬。
*   **原生另存新檔對話框**：下載 PDF 時呼叫作業系統原生對話框，可自訂儲存路徑，安全且乾淨。
*   **側邊設定欄 (Settings Drawer)**：
    *   支援全域深色/淺色模式（Dark/Light Mode）切換。
    *   支援多國語言切換（繁體中文、英文等）。
    *   支援自主控制「啟動時自動檢查更新」的開關（狀態持久化至本地 `localStorage`）。
*   **線上自動更新系統**：軟體開啟時自動於背景偵測新版本，以科技藍對話框展示下載進度，並於下載完成後自動無縫重啟。

---

## 💻 支援平台

*   **Windows**：提供免安裝的可攜式執行檔 (`.exe`)。
*   **macOS**：提供雙架構通用安裝包 (`_universal.dmg`，支援 Intel 與 Apple M 晶片)。

---

## 🍎 macOS 安裝與安全繞過說明

由於本專案的 macOS 安裝程式（`_universal.dmg`）為無簽名打包（Unsigned），因此首次打開時，macOS 安全機制（Gatekeeper）會跳出警告並阻止執行。請按照以下任一方法進行安全解鎖：

### 方法一：Finder 右鍵打開（最直觀）
1.  打開 **Finder**，進入「應用程式 (Applications)」資料夾。
2.  找到 `md2pdf`，按住鍵盤的 **`Control` 鍵點擊** 該應用程式（或按滑鼠右鍵），在彈出選單中點選 **「打開」**。
3.  此時跳出的警告視窗會出現 **「打開」** 按鈕，點擊後即可順利開啟，且此後雙擊即可直接執行。

### 方法二：終端機指令解鎖（一勞永逸）
打開 Mac 的「終端機 (Terminal)」軟體，執行以下指令清除系統的隔離標籤即可直接雙擊解鎖：
```bash
xattr -cr /Applications/md2pdf.app
```

---

## 🛠️ 開發環境準備

### 系統需求
*   Node.js >= 18
*   Rust ＆ Cargo 工具鏈 (用於編譯後端)

---

## 🚀 開發與執行步驟

### 1. 安裝依賴
在專案根目錄下執行：
```bash
npm install
```

### 2. 啟動開發偵錯
```bash
npm run dev
```
啟動後會自動編譯 Rust 後端、啟動 Vite 開發伺服器並開啟 Tauri 桌面視窗。

---

## 📦 打包發布 (Build)

你可以將 App 打包成發行版的可執行檔案：

### Windows 平台
```bash
# 使用 NSIS 打包為免安裝的可攜式獨立 .exe 檔
npx @tauri-apps/cli build
```
打包完成後，獨立安裝包將會生成在以下路徑：
`src-tauri/target/release/bundle/nsis/md2pdf_{version}_x64-setup.exe`

### macOS 平台
```bash
# 打包為雙架構通用安裝檔
npx @tauri-apps/cli build --target universal-apple-darwin
```
打包完成後，通用安裝檔將會生成在以下路徑：
`src-tauri/target/universal-apple-darwin/release/bundle/dmg/md2pdf_{version}_universal.dmg`

---

## 📄 開源授權

本專案採用 **[MIT License](LICENSE)** 授權。
