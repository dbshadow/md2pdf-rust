## Why

當使用者已經開啟本地 md 檔案或修改了編輯器內容，如果他們在下拉選單切換風格範本，應用會強制將編輯區套用為該範本的預設範例 Markdown 內容。這導致使用者的編輯內容被覆蓋，必須重新開啟檔案或面臨資料遺失的風險。

## What Changes

1. 當使用者已開啟本地檔案，或已修改了當前草稿內容（`isDirty === true`）時，切換風格範本應只更新 CSS 樣式，保留當前的 Markdown 內容與檔案路徑，且不彈出放棄修改的確認對話框。
2. 當使用者未開啟檔案且當前內容完全未修改（`isDirty === false`，即剛啟動或剛載入的乾淨狀態）時，切換風格範本將同時更新 CSS 風格與 Markdown 範例內容。

## Capabilities

### New Capabilities
- `keep-markdown-on-template-change`: 風格範本切換時，依據編輯狀態決定是否保留使用者的 Markdown 內容。

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- 前端 `src/App.tsx`: 修改 `handleTemplateChange` 中的邏輯判斷，移除不必要的確認警告，並依狀態更新 CSS 或同時更新 Markdown。
