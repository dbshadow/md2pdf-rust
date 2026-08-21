## Context

目前 `md2pdf` 透過 Rust 後端的 `pulldown-cmark` 將 Markdown 轉為 HTML，並在前端（Iframe 即時預覽）與後端（Headless Chrome PDF 產生）分別載入 CSS 樣式與 Mermaid 腳本進行渲染。為了支援 LaTeX 數學公式，需要導入輕量且高速的數學公式渲染引擎。

## Goals / Non-Goals

**Goals:**
*   在前端 HTML 即時預覽與後端 PDF 導出時，支援行內公式（`$...$`、`\(...\)`）與區塊公式（`$$...$$`、`\[...\]`）。
*   採用 KaTeX 與 `auto-render` 擴充套件，實現零編譯負擔的高效能渲染。
*   在後端無頭瀏覽器中增加 KaTeX 渲染等待信號（`window.katexRendered`），確保 PDF 匯出不會漏掉公式。

**Non-Goals:**
*   不支援 MathJax（KaTeX 體積更小且渲染速度顯著高於 MathJax，更適合即時預覽與桌面端 PDF 產生）。
*   不提供所見即所得（WYSIWYG）的公式編輯器，維持 Monaco 編輯器內的原始 LaTeX 語法編輯體驗。

## Decisions

### 1. 採用 KaTeX + auto-render (CDN 載入)
*   **決策**：在 HTML 預覽與後端無頭瀏覽器產生的 HTML template 中，引入 KaTeX CSS、JS 以及 `contrib/auto-render.min.js`。
*   **理由**：KaTeX 不需要對 Markdown AST 進行侵入式二次解析，直接由 auto-render 遍歷 DOM 節點並對定界符號內的 LaTeX 語法進行渲染，與現有 `pulldown-cmark` 完美相容。

### 2. 定界符號 (Delimiters) 設定
*   **決策**：配置 delimiters：
    - `$$` ... `$$` (display: true)
    - `\[` ... `\]` (display: true)
    - `$` ... `$` (display: false)
    - `\(` ... `\)` (display: false)
*   **理由**：涵蓋最普遍的 Markdown 數學公式書寫習慣。

### 3. 同步渲染等待機制
*   **決策**：在 `DOMContentLoaded` 事件中執行 `renderMathInElement`，並在渲染完成後設置 `window.katexRendered = true`。後端無頭瀏覽器在渲染 PDF 時檢查 `window.mermaidRendered && window.katexRendered`。

## Risks / Trade-offs

*   **[Risk]** 在純文字中出現單個 `$` 符號（例如金額 `$100`）可能誤觸行內公式解析。
    *   **→ Mitigation**: KaTeX auto-render 預設支援 escape 機制（`\$`），且在一般未成對或帶空格的金額文字中不會誤渲染。
