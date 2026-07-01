## ADDED Requirements

### Requirement: macOS Auto-Updater Package Generation
系統 SHALL 生成用於 macOS 自動更新的壓縮包 `.app.tar.gz` 與其對應的 Ed25519 簽名檔 `.sig`。

#### Scenario: Build macOS update package
- **WHEN** 觸發 GitHub Actions 的 macOS 打包任務時
- **THEN** 系統將自動生成 `md2pdf.app.tar.gz` 與 `md2pdf.app.tar.gz.sig`，並將其上傳至 GitHub Release。

### Requirement: Multi-platform Updater Manifest Integration
系統 SHALL 支援整合多個平台（Windows, macOS Intel, macOS Apple Silicon）的自動更新簽名與下載路徑至同一個 `update-manifest.json`。

#### Scenario: Merge multi-platform signatures
- **WHEN** CI/CD 整合多平台打包成品並執行 Manifest 腳本時
- **THEN** `update-manifest.json` 必須更新 `"platforms"` 對象，使其同時包含 `windows-x86_64`、`darwin-x86_64` 以及 `darwin-aarch64` 的簽名與下載路徑，並推回 `main` 分支。
