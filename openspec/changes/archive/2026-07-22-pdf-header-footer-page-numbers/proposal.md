## Why

導出 PDF 檔案時缺少頁首（文件標題/日期）與頁尾（動態頁碼，如「第 1 頁 / 共 3 頁」），無法滿足使用者排版正式履歷、論文、商業簡報與企劃書等專業文件的需求。增加視覺化、客製化的頁首頁尾設定能大幅提升導出 PDF 的質感與實用性。

## What Changes

*   **新增頁首頁尾控制介面**：在側邊設定欄 (SettingsDrawer) 或預覽工具列提供頁首頁尾功能開關、頁碼顯示選擇與文字自訂輸入框。
*   **支援動態範本標籤**：支援預設動態變數，包括 `{{page}}`（當前頁碼）、`{{totalPages}}`（總頁數）、`{{title}}`（文件標題）與 `{{date}}`（目前日期）。
*   **後端無頭瀏覽器頁首頁尾渲染**：擴充 Rust 後端 `generate_pdf` 命令，引入 `headerTemplate` 與 `footerTemplate` 參數或 `@page` CSS 注入，確保高精度 A4 列印輸出。
*   **多國語言與狀態持久化**：新增對應的繁中、英文、西班牙文多國語言辭典，並將使用者的頁首頁尾偏好設定持久化保存於 `localStorage` 中。

## Capabilities

### New Capabilities
- `pdf-header-footer`: 支援控制與客製化 PDF 的頁首 (Header)、頁尾 (Footer) 以及動態頁碼渲染。

### Modified Capabilities
- `pdf-generator`: 擴充現有 Rust 後端的 `generate_pdf` 命令介面，傳遞頁首頁尾 HTML 範本與列印參數。

## Impact

*   **前端 UI / State**：修改 [src/SettingsDrawer.tsx](file:///home/dbshadow/project/md2pdf-rust/src/SettingsDrawer.tsx), [src/App.tsx](file:///home/dbshadow/project/md2pdf-rust/src/App.tsx), 以及 [src/i18n.ts](file:///home/dbshadow/project/md2pdf-rust/src/i18n.ts)。
*   **後端 Rust IPC**：修改 [src-tauri/src/main.rs](file:///home/dbshadow/project/md2pdf-rust/src-tauri/src/main.rs) 的 `generate_pdf` 命令簽署與頁面渲染邏輯。
