## 1. 前端 UI 與多國語言字典擴充

- [x] 1.1 在 `src/i18n.ts` 中新增頁首頁尾控制相關的中、英、西多國語言字典項目 (header/footer enable, header text, footer text, page number format)。
- [x] 1.2 在 `src/SettingsDrawer.tsx` 中新增「頁首頁尾設定」獨立區塊，包括 Toggle 開關、頁首文字輸入框、頁尾文字輸入框與動態變數說明。
- [x] 1.3 實作頁首頁尾設定在 `localStorage` (`md2pdf_header_footer_config`) 的讀取與持久化保存。

## 2. 頁首頁尾樣式動態注入與 PDF 渲染整合

- [x] 2.1 在 `src/App.tsx` 中建立頁首頁尾動態變數解析器（支援 `{{page}}`, `{{totalPages}}`, `{{title}}`, `{{date}}` 的汏換與 CSS `@page` 規則生成）。
- [x] 2.2 將頁首頁尾的 `@page` 列印樣式規則動態注入至 HTML 預覽與 `renderPDF` 方法中，確保 A4 印表機輸出的每一頁頁首頁尾均呈現頁碼與標題。
- [x] 2.3 修復與驗證在變更頁首頁尾設定時，觸發 PDF 重新渲染並與歷史快取連動的最新狀態。

## 3. 型別檢查與編譯驗證

- [x] 3.1 執行 `npx tsc --noEmit` 確保 TypeScript 前端程式碼零型別錯誤。
