# md2pdf 🚀

[繁體中文](#繁體中文) | [English](#english)

---

# 繁體中文

這是一個美觀、高質感的**本地端 Markdown 轉 PDF 獨立桌面應用程式**。基於 Tauri (Rust) + React + TypeScript 構建，前端利用 Monaco Editor 提供高效率編輯體驗，後端採用 Rust 惰性加載的常駐無頭瀏覽器（Microsoft Edge/Chrome）進行高精度 PDF 生成。所有編譯與生成均在本地端運作，100% 確保敏感資料的隱私與安全。

## ✨ 專案特色

- **雙編輯器整合**：採用 VS Code 同款的 Monaco Editor，提供語法高亮、行號以及對 CSS 的屬性自動完成與語法檢查。
- **雙預覽模式系統**：
  - **HTML 即時預覽**：打字時微秒級響應，絕無黑屏閃爍，完美保留目前滾動條位置，提供流暢的寫作體驗。
  - **PDF 真實分頁預覽**：一鍵切換，調用後端常駐無頭瀏覽器，精確呈現邊距、分頁（Page Break）與 `@page` 列印樣式。
- **效能優化 (Tauri State)**：後端無頭瀏覽器採用單例 (Singleton) 模式常駐背景，避免每次渲染重啟瀏覽器。打字時在 HTML 模式下不消耗後端資源，PDF 渲染速度可達數十毫秒。
- **內建 5 套高質感簡約模板**：
  - 📄 **精美個人履歷 (Resume)**：緊湊細緻，專為求職設計。
  - 🎓 **學術報告 (Academic)**：符合學術規格與首字縮排。
  - 🚀 **簡約現代 (Modern)**：現代化漸層標題與圓角代碼塊。
  - 💎 **蒂芬妮簡約 (Tiffany Minimal)**：搭配莫蘭迪灰藍色調，極致優雅。
  - 📝 **乾淨文字 (Plain Markdown)**：最經典純粹的排版。
- **原生另存新檔對話框**：下載 PDF 時呼叫作業系統原生對話框，可自訂儲存路徑，安全且乾淨。

---

## 🛠️ 開發環境準備

### 系統需求
- Node.js >= 18
- Rust ＆ Cargo 工具鏈 (用於編譯後端)

---

## 🚀 開發與執行步驟

### 1. 安裝依賴
在專案根目錄下執行：
```bash
npm install --legacy-peer-deps
```

### 2. 啟動開發偵錯
```bash
npm run dev
```
啟動後會自動編譯 Rust 後端、啟動 Vite 開發伺服器並開啟 Tauri 桌面視窗。

---

## 📦 打包發布 (Build)

你可以將 App 打包成一個獨立、**免安裝的 `.exe` 執行檔**發送給其他人使用：

```bash
# 打包正式免安裝執行檔 (推薦)
npx @tauri-apps/cli build --no-bundle
```
打包完成後，獨立的 `app.exe` 將會生成在以下路徑：
`src-tauri/target/release/app.exe`

### 🍎 macOS 安裝與安全繞過說明

由於本專案的 macOS 安裝程式（`_universal.dmg`）為無簽名打包（Unsigned），因此首次打開時，macOS 安全機制（Gatekeeper）會跳出警告並阻止執行。請按照以下任一方法進行安全解鎖：

#### 方法一：Finder 右鍵打開（最直觀）
1. 打開 **Finder**，進入「應用程式 (Applications)」資料夾。
2. 找到 `md2pdf`，按住鍵盤的 **`Control` 鍵點擊** 該應用程式（或按滑鼠右鍵），在彈出選單中點選 **「打開」**。
3. 此時跳出的警告視窗會出現 **「打開」** 按鈕，點擊後即可順利開啟，且此後雙擊即可直接執行。

#### 方法二：終端機指令解鎖（一勞永逸）
打開 Mac 的「終端機 (Terminal)」軟體，執行以下指令清除系統的隔離標籤即可直接雙擊解鎖：
```bash
xattr -cr /Applications/md2pdf.app
```

---

## 📄 開源授權

本專案採用 **[MIT License](LICENSE)** 授權。

---
---

# English

A beautiful, high-quality **local Markdown to PDF converter standalone desktop application**. Built with Tauri (Rust) + React + TypeScript, it leverages Monaco Editor for efficient editing and uses a background-persistent headless browser singleton (Microsoft Edge/Chrome) in Rust for high-precision A4 PDF generation. All operations are processed locally, ensuring 100% data privacy and security.

## ✨ Features

- **Dual Editors Integration**: Powered by Monaco Editor (the editor behind VS Code) for both Markdown and CSS, supporting syntax highlighting, line numbers, autocomplete, and syntax linting.
- **Dual Preview System**:
  - **HTML Instant Preview**: Microsecond-level responsiveness without blackout flashes. It perfectly retains your current scrollbar position for a seamless writing experience.
  - **PDF Real-print Preview**: Toggle to render your A4 PDF via headless browser, showcasing exact margins, page breaks, and `@page` rules.
- **Performance Optimized (Tauri State)**: The backend headless browser runs as a persistent singleton instance, eliminating browser startup overhead. PDF compilation takes only tens of milliseconds, while typing in HTML mode stays completely lightweight.
- **5 Predefined Muted Themes**:
  - 📄 **Resume**: Muted, compact layout, tailored for job hunting.
  - 🎓 **Academic**: Formatted with standard margins and indentation.
  - 🚀 **Modern**: Beautiful title gradients and rounded-corner code blocks.
  - 💎 **Tiffany Minimal**: A premium look highlighted with Tiffany green and Morandi gray-blue.
  - 📝 **Plain Markdown**: A classic and minimal raw layout.
- **Native Save File Dialog**: Saving PDFs triggers a native file dialog, allowing you to choose the exact path and filename on your OS.

---

## 🛠️ Setup & Dev Requirements

### Prerequisites
- Node.js >= 18
- Rust & Cargo Toolchain (for compiling the Rust backend)

---

## 🚀 Getting Started

### 1. Install Dependencies
Run the following command in the root directory:
```bash
npm install --legacy-peer-deps
```

### 2. Start Development
```bash
npm run dev
```
This will compile the Rust backend, run the Vite dev server, and launch the Tauri app window.

---

## 📦 Building for Production

Compile the project into a single, **portable standalone `.exe` executable** for distribution:

```bash
# Build the portable release executable
npx @tauri-apps/cli build --no-bundle
```
Once completed, the standalone `app.exe` will be located at:
`src-tauri/target/release/app.exe`

### 🍎 macOS Installation & Security Workaround

Since the macOS bundle (`_universal.dmg`) is distributed unsigned, macOS Gatekeeper will block it upon first launch with a security warning. You can bypass this with one of the following methods:

#### Method 1: Right-Click in Finder (Recommended)
1. Open **Finder** and navigate to your **Applications** folder.
2. Locate `md2pdf`, hold the **`Control` key and click** the app (or right-click) and select **Open**.
3. In the popup dialog, click **Open** to authorize and launch the app. You won't need to do this again.

#### Method 2: Terminal Unlock (Easiest)
Open your **Terminal** app and run the following command to strip the quarantine flag:
```bash
xattr -cr /Applications/md2pdf.app
```

---

## 📄 License

Distributed under the **[MIT License](LICENSE)**.
