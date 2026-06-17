## Context

當使用對比變更（Diff View）分頁時，加上右側預覽會將主工作區分割為三個窄欄，這會限制編輯視野並造成閱讀疲勞。本設計引入可一鍵開關的預覽視窗功能，讓編輯器在需要時可擴展至滿版 (100% 寬度) 進行專注編輯。

## Goals / Non-Goals

**Goals:**
- 提供全域的「顯示/隱藏預覽」按鈕。
- 隱藏預覽時，將編輯器/對比面板寬度擴展為 100%。
- 隱藏預覽時，收合拖曳 Resizer Bar。
- 重新顯示預覽時，恢復至隱藏前的拖曳寬度百分比（`leftWidth`）。

**Non-Goals:**
- 不鎖定拖曳比例，開啟預覽後仍可進行 Resizing。
- 不提供編輯區單獨全螢幕（OS 全螢幕），只處理 App 工作區內的預覽開關。

## Decisions

### 1. 以 React `showPreview` State 控制渲染條件
- **做法**:
  - 新增狀態 `showPreview` 預設為 `true`。
  - 當 `showPreview` 為 `false` 時，編輯面板的寬度 inline style 設定為 `100%`，且在 JSX 中條件式不渲染 `resizer-bar` 與 `preview-panel`。
  - 當其為 `true` 時，編輯面板與預覽面板重新載入以 `leftWidth` 計算出的百分比樣式，並恢復渲染 `resizer-bar`。
- **原因**: 條件式渲染（`{showPreview && ...}`）或以樣式隱藏是最符合 React 模式的作法。此做法能徹底確保預覽 iframe 被 unmount / 隱藏時不會有任何 pointer-event 衝突，且編輯器能得到完美的 full-width 工作區。

### 2. 按鈕定位於頂部 toolbar 右側
- **做法**: 放置在「主題切換」按鈕的左側，使用 Lucide 的 `Eye` (開啟) 與 `EyeOff` (隱藏) 作為 icon 狀態切換。
- **原因**: 該位置是應用程式常設控制項的集中處，使用者可以非常直觀地找到，且操作不會與分頁 Tab 產生干擾。

## Risks / Trade-offs

- **[Risk] Iframe 重新 mount 導至預覽重置或載入卡頓**
  - *Mitigation*: 由於 `showPreview` 為 `true` 時會重新 mount 預覽面板與 iframe，可能會觸發一次預覽載入。但因為 HTML 預覽是由記憶體中的 `srcDoc` 即時渲染，渲染速度在毫秒級，因此使用者感受不到任何延遲，體驗非常即時流暢。
- **[Risk] Monaco Editor layout resize 防震延遲**
  - *Mitigation*: Monaco Editor 的 `automaticLayout: true` 會以防震 (debounce) 的方式自動監聽容器寬度變化。經測試，百分比寬度從 `leftWidth%` 跳到 `100%` 的大幅度變更會被立即捕獲並重繪，不需額外調用 `editor.layout()`。
