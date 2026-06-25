## 1. Backend Implementation

- [x] 1.1 修改 `src-tauri/src/lib.rs` 的 `markdown_to_html_with_css` 函數，接受 `title: &str`，並將其嵌入 HTML 模板的 `<title>` 標籤中。
- [x] 1.2 修改 `src-tauri/src/lib.rs` 的 `generate_pdf` 函數，加入 `title: String` 參數，並將其傳給 `markdown_to_html_with_css`。

## 2. Frontend Implementation

- [x] 2.1 在 `src/App.tsx` 中新增 `draftPdfName` 狀態。
- [x] 2.2 在 `src/App.tsx` 中新增 `getPdfTitleAndFilename` 輔助函數，用以取得當前檔案對應的 pdf 檔名或草稿隨機名。
- [x] 2.3 修改 `src/App.tsx` 中的 `renderPDF` 調用，傳入計算出的 `title` 參數給後端。
- [x] 2.4 修改 `src/App.tsx` 中的 `handleDownload` 下載對話框，預設存檔名稱使用 `getPdfTitleAndFilename()`。
- [x] 2.5 修改 `src/App.tsx` 中會改變檔案上下文的操作（如 `handleTemplateChange`、`handleResetToTemplate`、`handleOpenFile`），在切換或新建草稿時重新產生隨機 `draftPdfName`。
