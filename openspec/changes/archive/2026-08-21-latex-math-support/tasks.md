## 1. 前端 HTML 即時預覽支援 KaTeX

- [x] 1.1 在 `src/App.tsx` 的 `iframeSrcDoc` 中引入 KaTeX CSS、JS 與 `contrib/auto-render.min.js`。
- [x] 1.2 在 `iframeSrcDoc` 的 `DOMContentLoaded` 腳本中配置並調用 `renderMathInElement`，支援 `$` 與 `$$` 等定界符號。

## 2. 後端 Rust PDF 渲染器支援 KaTeX

- [x] 2.1 在 `src-tauri/src/lib.rs` 的 `markdown_to_html_with_css` 中注入 KaTeX CDN 樣式與 auto-render 腳本，並設置 `window.katexRendered = true`。
- [x] 2.2 在 `src-tauri/src/lib.rs` 的 `try_pdf_render` 中更新輪詢等待條件，確保 `mermaidRendered` 與 `katexRendered` 均為 true 後再導出 PDF。

## 3. 型別檢查與測試驗證

- [x] 3.1 執行 `npx tsc --noEmit` 確保前端 TypeScript 零型別錯誤。
- [x] 3.2 執行 `cargo check` 確保 Rust 後端編譯通過。
