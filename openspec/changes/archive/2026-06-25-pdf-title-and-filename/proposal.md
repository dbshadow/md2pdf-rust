## Why

目前導出 PDF 的預設檔名是隨機的，且產生的 PDF 內部 Metadata 標題顯示的是無意義的暫存 HTML 檔名（例如 `.tmpYs459S.html`）。我們需要依據使用者當下是否開啟本地檔案，提供更有意義的預設檔名與 PDF 標題。

## What Changes

1. 開啟 Markdown 檔案：若使用者開啟 `xxx.md`，渲染時 PDF 標題設為 `xxx.pdf`，點選下載 PDF 時，預設存檔名稱也為 `xxx.pdf`。
2. 直接編輯草稿：若使用者直接編輯（無 md 檔案名），使用隨機檔名（例如 `12345678.pdf`），且 PDF 標題與該隨機檔名保持相同。

## Capabilities

### New Capabilities
- `pdf-title-and-filename`: 提供依據編輯狀態動態注入 PDF 標題與預設檔名的功能。

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- 前端 `src/App.tsx`: 新增 `draftPdfName` 狀態儲存草稿隨機名，在 `renderPDF` 時傳遞標題參數，並在 `handleDownload` 中使用 `getPdfTitleAndFilename()`。
- 後端 `src-tauri/src/lib.rs`: `generate_pdf` 新增 `title` 參數，將其嵌入 HTML 模板的 `<title>` 標籤中。
