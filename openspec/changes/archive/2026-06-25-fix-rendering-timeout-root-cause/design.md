## Context

當前的 HTML 模板無條件載入外部的 Mermaid CDN。在 `lib.rs` 中，後端 Chrome Tab 設有嚴格的 3 秒超時限制。在網路較慢或離線時，頁面載入會卡在外部 CDN 載入上，導致超時崩潰。

## Goals / Non-Goals

**Goals:**
- 普通 Markdown 文件的 100% 離線渲染，完全免除外部網路影響。
- 將無頭瀏覽器的超時時間調大至 10 秒，提供合理緩衝。
- 優化前端 HTML 即時預覽的加載效能。

**Non-Goals:**
- 不在此 Change 中將 `mermaid.min.js` 本地打包（為保持零依賴與極簡 YAGNI 原則，仍使用外部 CDN，但採取條件式加載）。

## Decisions

### 1. 後端 (Rust) 條件式加載
- **做法**:
  在 `markdown_to_html_with_css` 中，檢測 `markdown.contains("```mermaid") || markdown.contains("~~~mermaid")`。
  若為 `true`，在 HTML 的 `<body>` 尾端插入帶有外部 CDN 與加載腳本的程式碼。
  若為 `false`，插入 `<script>window.mermaidRendered = true;</script>`，省略所有外部網路資源。

### 2. 後端超時時間調整
- **做法**:
  在 `src-tauri/src/lib.rs` 的 `try_pdf_render` 中，將 `tab.set_default_timeout` 從 3 秒調整為 10 秒。

### 3. 前端 (React) 條件式加載
- **做法**:
  在 `App.tsx` 中，計算 `const hasMermaid = markdown.includes('```mermaid') || markdown.includes('~~~mermaid');`。
  在 `iframeSrcDoc` 模板中，根據 `hasMermaid` 決定是否載入外部 CDN 腳本。

## Risks / Trade-offs

- **[Risk]** 在離線狀態下，若文件包含 Mermaid，渲染仍會超時失敗。
  *Mitigation*: 這屬於正常行為，因為使用了外部網路資源。已能確保 95% 不含 Mermaid 的普通文件在離線下 100% 成功且極速渲染。
