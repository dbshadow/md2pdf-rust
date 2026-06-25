## 1. Backend Implementation

- [x] 1.1 修改 `src-tauri/src/lib.rs` 的 `markdown_to_html_with_css` 函數，依據 Markdown 是否包含 Mermaid 語法，條件式載入外部 CDN。
- [x] 1.2 修改 `src-tauri/src/lib.rs` 的 `try_pdf_render` 函數，將 `tab.set_default_timeout` 調整為 10 秒。

## 2. Frontend Implementation

- [x] 2.1 修改 `src/App.tsx` 中的 `iframeSrcDoc` 與 Mermaid 載入邏輯，依據內容是否包含 Mermaid 圖表條件式載入外鏈 CDN。
