## Why

當網路連線不穩定或處於離線狀態時，無頭瀏覽器渲染 PDF 常會卡死並報出「載入頁面超時: The event waited for never came」。這是因為 HTML 模板每次都強行載入外部 CDN 的 `mermaid.min.js`，導致在 `navigate_to` 時被網路請求卡住，超過了嚴苛的 3 秒超時限制。隨後引發連線中斷、進程樹被強制終止與暫存目錄鎖定（os error 32）等一系列異常。

## What Changes

1. **條件式載入 Mermaid**：無論在前端（iframe 預覽）或後端（PDF 渲染），檢查 Markdown 是否包含 ````mermaid` 或 `~~~mermaid`。若無包含，完全不載入外部的 `mermaid.min.js` 網路資源，且直接標記 Mermaid 渲染完成（`window.mermaidRendered = true`），實現普通文件 100% 離線渲染與瞬間載入。
2. **放寬超時限制**：將後端常駐分頁的預設超時時間從 3 秒調大至 10 秒，為含有 Mermaid 複雜圖表的文件在網路延遲時提供足夠的緩衝。

## Capabilities

### New Capabilities
- `fix-rendering-timeout-root-cause`: 解決無頭瀏覽器在渲染 PDF 時，因外部網絡 CDN 資源加載阻塞與超時過短造成的崩潰與超時問題。

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- 前端 `src/App.tsx`: 條件式引入 `iframeSrcDoc` 中的 Mermaid 腳本。
- 後端 `src-tauri/src/lib.rs`: 條件式嵌入 `mermaid.min.js` 的 CDN，並將預設超時時間調整為 10 秒。
