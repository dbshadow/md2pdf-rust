## Why

目前專案的專案名稱需要正式定名為 \`md2pdf\`。此外，專案目前缺乏完整、符合 GitHub 專案傳統介紹格式的 README.md，且未包含標準的開源授權聲明（MIT License），這不利於專案的開源推廣與後續團隊協作。
本提案旨在正式更新專案命名、提供符合 GitHub 規範的中英文 README.md，並導入 MIT License。

## What Changes

- **專案重新定名**：將根目錄、前端、後端的 `package.json` 中的專案名稱或相依性配置統一改為 \`md2pdf\` 相關命名。
- **導入 MIT 授權**：在根目錄新增標準的 \`LICENSE\` 檔案，聲明專案採用 MIT 授權合約。
- **重寫 README 規格**：在根目錄重新撰寫 \`README.md\`。格式將包含專案標題、中英文雙語版本介紹、專案特色（Markdown/CSS 雙編輯器、雙預覽模式、即時防抖、隨機檔名下載）、專案架構圖、WSL 依賴安裝指南、啟動步驟以及授權聲明。

## Capabilities

### New Capabilities

- \`project-renaming\`: 更改根目錄、前端與後端的專案配置檔案命名，將其正式更名為 \`md2pdf\`。
- \`multilingual-readme\`: 撰寫符合 GitHub 專案標準的中英文雙語對照 README.md 文件。
- \`license-setup\`: 建立標準的 MIT License 授權文件。

### Modified Capabilities

無。

## Impact

- 更改 \`/package.json\`、\`/frontend/package.json\` 與 \`/server/package.json\` 的 \`name\` 欄位。
- 在根目錄建立新的 \`/LICENSE\` 檔案。
- 覆蓋現有的 \`/README.md\`。
