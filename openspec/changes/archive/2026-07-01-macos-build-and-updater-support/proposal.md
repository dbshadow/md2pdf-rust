## Why

目前專案僅支援 Windows 平台的自動打包與自動更新。為了擴展使用者基礎，我們需要為 macOS 使用者提供雙架構通用安裝檔（`_universal.dmg`），並建立支援 macOS 系統的自動更新機制（`.app.tar.gz` 格式的打包、簽名與下載更新）。

## What Changes

* **新增 macOS 平台打包支援**：引入 macOS 平台的自動化編譯與打包，產出雙架構通用安裝檔案 (`_universal.dmg`)。
* **支援 macOS 自動更新**：打包生成 `.app.tar.gz` 自動更新檔案，並進行 Ed25519 簽名。
* **多平台更新源 Manifest 整合**：在 `update-manifest.json` 中擴充 `darwin-x86_64` (Intel Mac) 與 `darwin-aarch64` (Apple Silicon Mac) 的下載路徑與簽名欄位。
* **CI/CD 工作流重構**：調整 `.github/workflows/release.yml`，改用矩陣並行打包與三段式 Job（Windows 編譯 -> macOS 編譯 -> 單獨 Manifest 整合推回），徹底防止 Git 併發推送衝突。
* **Manifest 生成腳本升級**：擴充 `scripts/updater-helper.js` 支援提取與整合多個平台的簽名資訊，並將本地 `CHANGELOG.md` 中英文條列內容自動寫入 Manifest notes。

## Capabilities

### New Capabilities
- `macos-package-distribution`: 支援為 macOS 使用者生成通用安裝包 (`_universal.dmg`)。
- `macos-auto-updater`: 支援 macOS 平台的自動更新功能，生成相容的 `.app.tar.gz` 更新檔與簽名，並擴充 Manifest 的雙架構欄位。

### Modified Capabilities
<!-- 無 -->

## Impact

* **工作流組態**：`.github/workflows/release.yml` 需要重構為三段式矩陣。
* **自動更新腳本**：`scripts/updater-helper.js` 需調整為遍歷與解析多平台 signature 的結構。
* **Manifest 檔案格式**：`update-manifest.json` 的 `platforms` 對象將由單一的 `windows-x86_64` 擴展為支援三種平台架構。
