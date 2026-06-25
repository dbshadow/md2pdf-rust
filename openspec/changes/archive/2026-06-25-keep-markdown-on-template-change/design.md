## Context

目前切換風格範本的 `handleTemplateChange` 函數，在不論使用者狀態下都會強制呼叫 `confirmDiscard()`，若是確認後，便會將 `markdown` 改寫成範本的預設範例，並將 `currentFilePath` 設定為 `null`。這在使用者已經開啟檔案或做過修改時，會覆蓋其編輯成果。

## Goals / Non-Goals

**Goals:**
- 提供平滑的範本風格切換。當使用者已經開啟檔案或修改了內容時，切換範本只套用 CSS，不覆蓋 Markdown。
- 只有在使用者未開啟檔案且內容未修改時，才同時套用 Markdown 範例。

**Non-Goals:**
- 不改變「重置樣式」(`handleResetToTemplate`) 的邏輯。重置樣式依然是明確的重設動作，應維持 `confirmDiscard()` 警告並重設為預設。

## Decisions

### 1. 條件式套用範本 Markdown 內容
- **做法**:
  在 `handleTemplateChange` 中，一律更新 `selectedTemplateId` 與 `css`，不再呼叫 `confirmDiscard()`。
  只有在 `!currentFilePath && !isDirty` (未開啟檔案且未修改過內容) 時，才同時調用 `setMarkdown` 與 `setOriginalMarkdown` 來寫入預設範本 Markdown。
- **原因**: 這樣既可以在乾淨狀態下展示完整的範例內容與樣式，又可以在使用者編輯時安全地只切換 CSS。

## Risks / Trade-offs

- **[Risk]** 使用者可能希望在已修改內容的情況下，故意把編輯內容換成新範本的範例。
  *Mitigation*: 使用者可以點擊「重置樣式」按鈕，這會明確觸發重設為當前範本預設內容的邏輯。
