## ADDED Requirements

### Requirement: Context-aware Template Switching
當使用者在風格範本下拉選單選擇新範本時，系統 SHALL 依據當前編輯狀態決定是否套用範例 Markdown 內容。

#### Scenario: Switching template with opened file
- **WHEN** 使用者已開啟本地 md 檔案且切換了風格範本
- **THEN** 系統 SHALL 只更新 CSS 樣式，保留目前的 Markdown 編輯內容與檔案路徑，且不彈出任何確認警告。

#### Scenario: Switching template with modified draft
- **WHEN** 使用者在草稿中已修改內容（`isDirty` 為 `true`）且切換了風格範本
- **THEN** 系統 SHALL 只更新 CSS 樣式，保留當前的 Markdown 編輯內容，且不彈出任何確認警告。

#### Scenario: Switching template with unmodified default draft
- **WHEN** 使用者在沒有任何修改的預設草稿中（`isDirty` 為 `false`）切換風格範本
- **THEN** 系統 SHALL 同時更新 CSS 樣式與該範本的預設 Markdown 範例內容。
