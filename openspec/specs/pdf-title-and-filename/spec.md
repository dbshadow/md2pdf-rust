# pdf-title-and-filename Specification

## Purpose
TBD - created by archiving change pdf-title-and-filename. Update Purpose after archive.
## Requirements
### Requirement: Dynamic PDF Title
當應用渲染 PDF 時，系統 SHALL 動態注入 HTML 標題（`<title>` 標籤），其名稱應基於當前的檔案開啟狀態。

#### Scenario: Rendering with opened file
- **WHEN** 使用者開啟了本地檔案 "resume.md" 並進行 PDF 渲染
- **THEN** 系統 SHALL 將 HTML 標題設定為 "resume.pdf"

#### Scenario: Rendering draft without file
- **WHEN** 使用者在沒有開啟檔案的情況下進行 PDF 渲染
- **THEN** 系統 SHALL 將 HTML 標題設定為與當前草稿隨機檔名相同的名稱（例如 "12345678.pdf"）

### Requirement: Filename Consistency
當使用者下載 PDF 時，系統提供的下載存檔對話框之預設檔名，SHALL 與當前渲染 PDF 的標題完全一致。

#### Scenario: Downloading opened file PDF
- **WHEN** 使用者開啟了 "resume.md" 並點擊「下載 PDF」
- **THEN** 系統 SHALL 在存檔對話框中將預設檔名設定為 "resume.pdf"

#### Scenario: Downloading draft PDF
- **WHEN** 使用者在未開啟檔案時點擊「下載 PDF」
- **THEN** 系統 SHALL 在存檔對話框中將預設檔名設定為與該草稿預設隨機檔名相同的名稱（例如 "12345678.pdf"）

