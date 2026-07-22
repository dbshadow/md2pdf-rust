## Context

`md2pdf` 利用 Tauri (Rust) 常駐無頭瀏覽器（Microsoft Edge/Chrome）在背景渲染並輸出 A4 PDF。目前系統尚未提供頁首（Header）與頁尾（Footer）的 UI 控制面板與頁碼變數解析器。本設計旨在建立一套極輕量、零額外依賴且與既有 CSS `@page` 規格完全相容的頁首頁尾動態渲染機制。

## Goals / Non-Goals

**Goals:**
*   在前端 `SettingsDrawer` 中新增獨立的頁首頁尾設定區塊（包含啟用開關、頁碼樣式、頁首文字與頁尾文字）。
*   支援 4 個關鍵動態變數：`{{page}}` (當前頁)、`{{totalPages}}` (總頁數)、`{{title}}` (文件標題)、`{{date}}` (當前日期)。
*   在導出與預覽 PDF 時，將頁首頁尾的設定與樣式動態注入至 HTML/CSS 渲染層。
*   保持輕量無依賴，設定自動儲存至本地 `localStorage`。

**Non-Goals:**
*   不支援在頁首頁尾插入複雜的 JavaScript 動態圖表（僅限文字、頁碼與基本 CSS 樣式）。

## Decisions

### 1. 前端頁首頁尾 CSS 注入與範本取代
*   **決策**：在前端將使用者定義的頁首與頁尾文字範本進行動態變數汏換，並透過 CSS Paged Media 規範 (`@page { @top-center { ... } @bottom-center { ... } }`) 或 HTML 頁首頁尾層注入。
*   **理由**：無須修改後端複雜的底層印表機驅動，能在既有的無頭瀏覽器與 CSS 樣式系統中極速完成渲染，且發揮最極致的相容性與美觀度。

### 2. 本地設定持久化 (localStorage)
*   **決策**：將頁首頁尾的設定存於 `localStorage` (Key: `md2pdf_header_footer_config`)。
*   **理由**：讓使用者設定一次頁首頁尾樣式後，後續每次開機或換範本都能持續生效。

## Risks / Trade-offs

*   **[Risk]** 頁首頁尾文字過長導致與本文重疊。
    *   **→ Mitigation**: 設定適當的頁面預設 Margin（上/下各留 20mm），並限制頁首頁尾容器為單行截斷 (ellipsis)。
