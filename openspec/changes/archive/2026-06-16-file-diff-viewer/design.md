## Context

目前 md2pdf 本地 Markdown 編輯器在使用者編輯檔案時，無法與硬碟上已儲存的原始狀態進行對比。這使得使用者在做了大量修改後，難以確認自己改了哪些地方，也無法輕易將某些修改區塊還原回舊版內容。
本設計旨在引進 side-by-side 的 Diff 編輯器，並提供類似 Meld 的「一鍵還原區塊」功能。

## Goals / Non-Goals

**Goals:**
- 在左側編輯器面板加入「對比變更」分頁。
- 使用 `@monaco-editor/react` 的 `<DiffEditor>` 進行雙欄對比，左側為「硬碟中已儲存的原始內容 (Original)」，右側為「當前編輯的最新內容 (Modified)」。
- 啟用 Monaco 內建的 `renderMarginRevertIcon` 選項，在變更區塊的邊緣提供「向右箭頭」按鈕，使用者點擊即可一鍵將舊區塊還原/覆蓋至右側編輯區。
- 支援在對比編輯器的右側 (Modified) 面板中直接打字編輯，且即時與原有的 `markdown` 狀態同步，從而讓右側預覽面板依然能即時渲染。
- 當使用者在任何分頁按下「儲存檔案」或「另存新檔」時，將基準 `originalMarkdown` 更新為最新的編輯內容，使對比編輯器的差異自動清除。
- 在「開啟檔案」、「切換模板」、「重置樣式」時，同步將基準 `originalMarkdown` 更新為新載入的內容。

**Non-Goals:**
- 不對「自訂 CSS」分頁進行歷史對比，此功能僅限於 Markdown 內容。
- 不進行 HTML 樹狀結構或預覽區段落的 Diff 渲染，僅聚焦於 Markdown 原始碼的 Monaco Diff 顯示。

## Decisions

### 1. 使用 `@monaco-editor/react` 的 `<DiffEditor>`
- **選擇原因**: 專案目前已使用 `@monaco-editor/react`，直接導入其 `DiffEditor` 最為輕量且無相容性問題，且能享有編輯器的語法高亮、自動排版等功能。
- **替代方案**: 自行使用 `diff-match-patch` 搭配 custom DOM 渲染。此方案需要處理大量的編輯器位置計算與極高難度的 Meld 還原功能，維護成本過高。

### 2. 透過 `originalMarkdown` State 管理對比基準
- **機制**: 
  - 新增 React 狀態 `originalMarkdown`，作為 DiffEditor 的 `original` 屬性。
  - 當滿足以下觸發點時，將 `markdown` 的當前值複製給 `originalMarkdown`：
    - 應用程式啟動初始化（Resume 模板載入）。
    - 成功「開啟檔案」讀取內容。
    - 成功「儲存檔案」或「另存新檔」。
    - 成功「切換模板」或「重置樣式」。
- **替代方案**: 每次切換到對比分頁時都用 Tauri IPC 去讀取磁碟上的實體檔案。但對於「未命名草稿（尚未儲存至硬碟）」的狀態，此方案會失效，且效能較慢。記憶體內的 `originalMarkdown` state 可以無縫支援草稿與實體檔案。

### 3. DiffEditor 右側雙向同步與一鍵還原 (Revert)
- **實作**:
  - 在 `DiffEditor` 的 `onMount` 取得 `modifiedEditor = editor.getModifiedEditor()`。
  - 監聽 `modifiedEditor.onDidChangeModelContent()`，當右側內容有任何變動（無論是使用者打字、還是點選 Revert 箭頭覆蓋時），呼叫 `setMarkdown(newValue)` 與 `setIsDirty(true)`。
  - 啟用 `options={{ renderMarginRevertIcon: true }}`。Monaco 會在偵測到變更時在邊緣放置箭頭，點擊後會直接修改 modified model 的內容，進而觸發上述的 change listener，完美達成一鍵還原並同步至預覽區。

## Risks / Trade-offs

- **[Risk] Monaco DiffEditor 的雙向滾動同步衝突**
  - *Mitigation*: 目前 `App.tsx` 已經有一套 Monaco 編輯器與右側 iframe 預覽區的雙向滾動同步邏輯（利用 `editorRef.current`）。當切換到 `compare` 分頁時，我們需要將 `editorRef.current` 暫時重導向為 `diffEditor.getModifiedEditor()`，這樣滾動同步就能無縫套用到對比編輯器的右側，且在回到普通 Markdown 編輯器時再切回原來的 editor 實例。
- **[Risk] 大檔案對比的效能**
  - *Mitigation*: Monaco Editor 在大檔案對比上效能優異，因此此風險極低。
