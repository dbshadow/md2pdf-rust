# fix-rendering-timeout-root-cause Specification

## Purpose
TBD - created by archiving change fix-rendering-timeout-root-cause. Update Purpose after archive.
## Requirements
### Requirement: Conditional Resource Loading
當系統將 Markdown 渲染為 HTML 時，系統 SHALL 依據 Markdown 內文是否包含 Mermaid 圖表來決定是否載入外部 Mermaid CDN。

#### Scenario: Rendering markdown without mermaid
- **WHEN** 渲染不包含 "```mermaid" 的普通 Markdown
- **THEN** 系統 SHALL 排除外部 Mermaid CDN 網路載入，並立刻將 "window.mermaidRendered" 設為 true

#### Scenario: Rendering markdown with mermaid
- **WHEN** 渲染包含 "```mermaid" 的 Markdown
- **THEN** 系統 SHALL 在 HTML 中包含外部 Mermaid CDN 載入與初始化渲染腳本

### Requirement: Relaxed Timeout Value
當後端無頭瀏覽器執行頁面載入與渲染時，系統 SHALL 設定至少 10 秒的超時時間，防範網路載入緩慢或高負載下發生無謂的重連與進程重啟。

#### Scenario: Load page under unstable network
- **WHEN** 無頭瀏覽器加載含有外部資源的頁面且遇到網路延遲
- **THEN** 系統 SHALL 容許最長 10 秒的載入時間而不發出超時異常

