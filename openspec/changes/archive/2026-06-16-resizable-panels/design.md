## Context

目前編輯器左側面板與預覽右側面板之比例固定為 50%/50%。當使用對比分頁時，側邊對比因為寬度限制顯得過於擁擠。本設計將引進一個可拖曳的 Splitter Bar，讓使用者可自行調整寬度比例。

## Goals / Non-Goals

**Goals:**
- 提供在左側與右側面板之間的垂直拖曳 resizer。
- 支援透過滑鼠拖曳調整左側寬度百分比（範圍限制在 20% ~ 80% 之間，以維持基本可讀性）。
- 在拖曳期間防止 iframe 預覽區攔截滑鼠事件，維持流暢拖曳體驗。
- 使 Monaco Editor / DiffEditor 能夠配合寬度變更進行自動縮放 layout 重繪。

**Non-Goals:**
- 不支援垂直（上下）拖曳。
- 不提供多面板（如三個面板以上）的複雜拖曳架構。
- 面板寬度比例不要求跨瀏覽會話（session）做 LocalStorage 持久化，重整時可恢復預設 50/50 比例。

## Decisions

### 1. 基於 React 狀態與 Window 事件監聽
- **做法**:
  - 在 `App.tsx` 中新增 `leftWidth` 狀態，預設為 `50` (代表 50%)。
  - 在 `App.tsx` 中新增 `isDragging` 狀態，預設為 `false`。
  - 在 resizer 元素上監聽 `onMouseDown`。點擊時將 `isDragging` 設為 `true`，並向 `window` 註冊 `mousemove` 與 `mouseup` 監聽器。
  - 在 `window` 的 `mousemove` 觸發時，計算 `e.clientX / window.innerWidth * 100`，並將值限制在 `[20, 80]` 之間，進而調用 `setLeftWidth()`。
  - 在 `window` 的 `mouseup` 觸發時，將 `isDragging` 設為 `false`，並登出 window 上的監聽器。
- **替代方案**: 使用第三方 React 庫（如 `react-resizable` 或 `react-split`）。由於本專案是一個輕量的 Tauri 專案，引進新的 node 依賴會增加打包體積，且我們只需實現最基礎的雙欄水平拖曳，手寫約 30 行 React 程式碼即可達到極高自訂性且零依賴，是最優選擇。

### 2. 避免 Iframe 滑鼠劫持
- **機制**: 當 `isDragging === true` 時，在右側預覽面板內渲染一個絕對定位、覆蓋全螢幕的透明 Overlay 元素。
- **原因**: 右側 HTML/PDF 預覽是嵌在 `iframe` 中。如果滑鼠在拖曳過程中移入 `iframe`，滑鼠事件會被 `iframe` 內部的 document 劫持，導致父視窗的 `window.onmousemove` 無法觸發，使得拖曳動作卡死或中斷。透明 Overlay 可以完美攔截指針事件，確保拖曳過程無比流暢。

### 3. Resizer 互動熱區優化 (Hover / Dragging Effect)
- **做法**:
  - Resizer Bar 寬度設為 4px。
  - 使用 `:after` 虛擬元素將滑鼠感應熱區（hitbox）向兩側拓寬至 12px（保持背景透明），解決 4px 太細不易被滑鼠精準點擊的問題。
  - 當 hover 或 dragging 時，讓 resizer bar 的背景顏色轉為 Accent 亮色，提供清晰的視覺反饋。

## Risks / Trade-offs

- **[Risk] Monaco Editor resize 延遲或卡頓**
  - *Mitigation*: 我們的 Monaco `<Editor>` 與 `<DiffEditor>` 都已經設定了 `automaticLayout: true`。Monaco 的 automatic layout 具有內建防震特性，這在一般的拖動頻率下可以很好地適應。我們應限制 `leftWidth` 的更新頻率（React state 更新已足夠快），並確保 layout 合理。
- **[Risk] Window 事件監聽器殘留**
  - *Mitigation*: 在 `window` 上註冊監聽器時，必須在 `mouseup` 觸發時呼叫 `window.removeEventListener`，同時在 React 元件的 `useEffect` cleanup 函數中也進行安全清除，以防止 memory leak。
