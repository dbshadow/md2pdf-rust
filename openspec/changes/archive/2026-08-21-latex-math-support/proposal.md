## Why

目前 `md2pdf` 僅支援標準 Markdown 語法與 Mermaid 圖表，缺乏 LaTeX 數學公式解析與渲染支援。使用者在撰寫學術筆記、技術文件或數學/物理報告時，無法正常呈現數學符號、方程式與矩陣（如 `$E=mc^2$`、`$$\sum_{i=1}^n x_i$$`）。整合高效能的 KaTeX 渲染引擎將大幅提升軟體在學術與專業排版領域的實用性。

## What Changes

*   **KaTeX 樣式與腳本整合**：在 HTML 即時預覽（`App.tsx`）與後端無頭瀏覽器 PDF 產生（`lib.rs`）中，引入 KaTeX CSS/JS 函式庫及 `auto-render` 擴充功能。
*   **支援行內與區塊數學公式**：支援常見的 LaTeX 定界符號，包括行內公式（`$...$`、`\(...\)`）與區塊公式（`$$...$$`、`\[...\]`）。
*   **無頭瀏覽器等待機制**：後端在執行 `print_to_pdf` 前，增加對 KaTeX 渲染完成狀態的檢查與同步，確保 PDF 導出時包含高清晰度的向量數學公式。

## Capabilities

### New Capabilities
- `latex-math-preview`: 支援在 HTML 即時預覽與 PDF 導出中解析並渲染 LaTeX 數學公式。

### Modified Capabilities
- `pdf-generator`: 擴充無頭瀏覽器渲染邏輯，支援載入 KaTeX 資源並等待 LaTeX 公式渲染完成後再產生 PDF。

## Impact

*   **前端 UI**：修改 [src/App.tsx](file:///home/dbshadow/project/md2pdf-rust/src/App.tsx) 的 `iframeSrcDoc`，注入 KaTeX CSS、JS 與渲染腳本。
*   **後端 Rust**：修改 [src-tauri/src/lib.rs](file:///home/dbshadow/project/md2pdf-rust/src-tauri/src/lib.rs) 的 `markdown_to_html_with_css` 與 `try_pdf_render` 等頁面組裝及非同步等待邏輯。
