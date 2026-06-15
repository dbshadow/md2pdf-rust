## 1. 後端 Rust headless_chrome 渲染同步機制

- [x] 1.1 在 `src-tauri/src/lib.rs` 的 `try_pdf_render` 函數中，加入輪詢等待 `window.mermaidRendered` 標記為 `true` 的等待邏輯（最多等待 2 秒，每 50ms 輪詢一次）
- [x] 1.2 重構 `markdown_to_html_with_css` 輸出的 HTML 模板，在 HTML 的 `<head>` 區段引入 Mermaid.js (CDN)，並在尾部添加轉換 `.language-mermaid` 節點為 `.mermaid` 且觸發 `mermaid.run()` 與設置 `window.mermaidRendered = true` 的等待標記腳本

## 2. 前端 Live Preview 整合

- [x] 2.1 修改 `src/App.tsx` 中 `iframeSrcDoc` 模板，引入 Mermaid.js CDN 腳本
- [x] 2.2 在 `iframeSrcDoc` 的底部腳本中，新增程式碼以將 `<code class="language-mermaid">` 替換為 `<div class="mermaid">`，並在 HTML 更新後調用 `mermaid.run()` 重新渲染，並將 `window.mermaidRendered` 設定為 `true`
- [x] 2.3 進行編譯測試，使用實際的 Mermaid 語法範本測試「HTML 即時預覽」與「PDF 真實分頁預覽（含導出）」的圖表是否皆能 100% 正確繪製，且不與雙向滾動同步衝突
