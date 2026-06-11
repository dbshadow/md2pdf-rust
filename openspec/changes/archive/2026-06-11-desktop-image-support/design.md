## Context

目前的 Tauri 桌面端應用程式中，Markdown 內含的本地圖片（如相對路徑 `![alt](./image.png)`）在 Webview 即時 HTML 預覽與 `headless_chrome` 的 PDF 渲染中會因為 Same-Origin 沙盒限制與臨時 HTML 目錄不一致而破圖。為此，我們需要在 Rust 後端進行 Markdown 轉 HTML 時，自動將本地圖片轉為 Base64 內嵌。

## Goals / Non-Goals

**Goals:**
- 在 Rust 後端 Markdown 解析為 HTML 的過程中，自動將本地相對路徑的圖片（排除 `http://`, `https://`, `data:`）讀取並轉為 Base64 內嵌。
- 將本機圖片的相對路徑基準目錄設定為「目前執行檔所在的資料夾」（`std::env::current_exe()`）。
- 支援 PNG, JPG, JPEG, GIF, SVG, WEBP 圖片格式，並給予對應的 MIME-type。
- 前端不需要做任何修改，自動享有圖片預覽與 A4 PDF 高精度列印能力。

**Non-Goals:**
- 不開啟 Tauri 全域 `asset://` 本地檔案讀取協定，維持沙盒的高安全性。
- 不提供前端圖形上傳與圖片剪裁介面。

## Decisions

### 1. 於 `pulldown-cmark` Event 階段重寫路徑 (Event Rewriting)
- **決定**：直接在 Rust 端遍歷與重寫 `pulldown-cmark` 的 `Event` 序列。
- **理由**：
  - 相較於在 HTML 生成後使用正則表達式粗暴替換 `<img>` 標籤，在 Markdown AST 語意樹 Event 階段進行路徑攔截更安全、優雅，且 100% 避免了誤傷代碼區塊（Code Blocks）內文字的問題。
  
### 2. 基準路徑設為執行檔所在資料夾 (Executable-Relative)
- **決定**：使用 `std::env::current_exe()` 的 `parent()` 作為本地相對路徑的基準。
- **理由**：對於分發出去的單一免安裝 `.exe`，使用者最直覺的習慣就是把圖片跟 `.exe` 放同一個資料夾。以 `current_exe()` 為基準可以確保即便從不同終端機路徑啟動，相對路徑解析依然正確；如果使用 `std::env::current_dir()`，則會受到啟動時的 Working Directory 影響，容易找不到檔案。

### 3. MIME-Type 映射
- **決定**：在 Rust 內部直接根據圖片副檔名（不區分大小寫）映射為對應的 MIME-Type，未知格式則預設為 `image/png`。
- **理由**：不需要引入額外的 MIME-Type crate，保持依賴清爽與編譯速度。

## Risks / Trade-offs

- **[Risk] 大圖 Base64 導致記憶體與 IPC 卡頓**：Base64 編碼會使檔案體積增加約 33%，大圖會影響渲染速度。
  - *Mitigation*：建議使用者將嵌入圖片控制在合理大小（如 1MB 以內），這對於履歷、報告等排版已極為足夠。我們也可以在 README 加入說明。
