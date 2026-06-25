## 1. Frontend Implementation

- [x] 1.1 修改 `src/App.tsx` 中的 `handleTemplateChange` 函數：一律更新 `selectedTemplateId` 和 `css`；只有在 `!currentFilePath && !isDirty` 時，才套用預設範例 Markdown 並更新 `originalMarkdown`。移除不必要的 `confirmDiscard` 呼叫與 `regenerateDraftPdfName` 的重置。
