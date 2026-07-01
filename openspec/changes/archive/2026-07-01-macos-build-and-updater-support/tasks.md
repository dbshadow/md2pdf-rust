## 1. 重構構建與 Manifest 更新腳本

- [x] 1.1 修改 `scripts/updater-helper.js`，支援接收多個平台的 Artifacts 目錄並遍歷掃描所有以 `.sig` 結尾的簽名檔案。
- [x] 1.2 實現 macOS 簽名整合邏輯：將 `.tar.gz.sig` 的 signature 與 GitHub 下載 URL 同時寫入 `platforms['darwin-x86_64']` 與 `platforms['darwin-aarch64']` 欄位。
- [x] 1.3 確保 Windows 的 `.exe.sig` 簽名與下載路徑正確寫入 `platforms['windows-x86_64']`。

## 2. 重構 GitHub Actions 工作流為三段式架構

- [x] 2.1 重構 `.github/workflows/release.yml`，設計並行 Job `build-windows` (runs-on: windows-latest) 與 `build-macos` (runs-on: macos-latest)。
- [x] 2.2 在 macOS 編譯步驟前，新增雙架構 Rust target 安裝：`rustup target add x86_64-apple-darwin aarch64-apple-darwin`。
- [x] 2.3 配置雙平台的編譯產物上傳：將 Windows 產出的 `.exe`/`.sig` 和 macOS 產出的 `.dmg`/`.tar.gz`/`.tar.gz.sig` 上傳為 GitHub Workflow Artifacts。
- [x] 2.4 新增獨立的第三個 Job `update-manifest` (runs-on: ubuntu-latest)，設定為 `needs: [build-windows, build-macos]`，下載所有 artifacts 後統一執行 `updater-helper.js` 生成最終 Manifest，並以防禦性 rebase 方式推回 `main` 分支。
## 3. 新增 macOS 使用者引導文件

- [x] 3.1 修改 `README.md`，新增 macOS 下載與開啟的引導說明，包含 Control-Click（按住 Control 鍵點擊打開）的步驟，以及終端機執行 `xattr -cr` 清除 Gatekeeper 隔離屬性的教學。
