## Context

目前專案的 GitHub Actions 工作流只在 Windows 環境 (`windows-latest`) 上編譯與打包，產出 Windows `.exe` 安裝檔並將其簽名與更新資訊寫入 `update-manifest.json` 推回 `main`。為了讓 macOS 用戶也能享受到自動打包與自動更新的便利，我們需要重構工作流與 Manifest 整合腳本，以支援 macOS 雙架構 Universal 打包與自動更新源的發布。

## Goals / Non-Goals

**Goals:**
* 在 GitHub Actions 中加入 macOS 平台的打包編譯支援。
* 打包產出 macOS 雙架構通用安裝包 `_universal.dmg` (供用戶手動安裝) 和 `.app.tar.gz` / `.app.tar.gz.sig` (供自動更新源下載與安全驗證)。
* 重構 `scripts/updater-helper.js` 支援自動搜尋雙平台的編譯產物，並將 Windows 與 macOS 簽名同時整合寫入 `update-manifest.json`。
* 重構 `.github/workflows/release.yml`，改為「三段式」並行 Job 結構（Windows 編譯 -> macOS 編譯 -> 單一 Manifest 整合更新），徹底防止 Git 併發推送 Manifest 時的衝突。

**Non-Goals:**
* 在不引入 Apple 付費開發者帳號的情況下完全繞過 macOS 系統的 Gatekeeper 安全警告。本專案將採用無簽名打包 (Unsigned)，並在 README 中引導 Mac 用戶手動繞過警告。

## Decisions

### 1. 三段式 CI/CD 流程避免 Git 推送衝突
* **抉擇**：不讓 Windows 和 macOS 的 Runner 在各自打包完後直接修改並推回 `update-manifest.json`，而是採用三段式 Job 設計。
* **做法**：
  1. **`build-windows` Job (runs-on: windows-latest)**：進行 Windows 打包，並將產出的 `.exe` 與 `.sig` 上傳為 GitHub Workflow Artifacts。
  2. **`build-macos` Job (runs-on: macos-latest)**：進行 macOS 打包，產出 `.dmg`、`.app.tar.gz` 與 `.sig`，並同樣上傳為 Artifacts。
  3. **`update-manifest` Job (runs-on: ubuntu-latest)**：設定為 `needs: [build-windows, build-macos]`。前兩個 Job 成功後，在此 Job 下載所有平台產出的簽名與安裝檔，執行 `updater-helper.js` 統一彙整更新 `update-manifest.json`，最後一次性推回 `main` 分支。
* **理由**：這能 100% 避免多個 Runner 並行 push 回 Git 倉庫時產生的 non-fast-forward 衝突。

### 2. 擴充 `updater-helper.js` 為多平台遍歷解析結構
* **抉擇**：不再在腳本中寫死 Windows 的檔案路徑與平台，改為動態掃描下載下來的雙平台 artifacts。
* **做法**：
  * 當前腳本遍歷所有已下載的 `.sig` 檔案：
    * 發現 `.exe.sig` 時，將簽名與 URL 寫入 `platforms['windows-x86_64']`。
    * 發現 `.app.tar.gz.sig` 時，將簽名與 URL 同時寫入 `platforms['darwin-x86_64']` 與 `platforms['darwin-aarch64']`。
  * 依然使用 `CHANGELOG.md` 本地讀取與解析機制，動態提取該版本的條列式英文更新日誌寫入 Manifest `notes` 欄位。

### 3. macOS 平台打包無簽名配置
* **抉擇**：在 GitHub Action 的 macOS 編譯步驟中，暫不配置 Apple 證書環境變數（如 `APPLE_CERTIFICATE` 等）。
* **做法**：保持 tauri.conf.json 默認的無簽名打包行為，使其生成 `_universal.dmg`。在 `README.md` 中補上 Mac 使用者手動繞過安全限制的教學指引。

## Risks / Trade-offs

* **[Risk]**：Mac 使用者雙擊打開 App 時，系統跳出「無法驗證開發者」或「已損壞」警告。
  * **Mitigation**：在 `README.md` 中加入 macOS 開啟與安裝的簡短指令與圖文指引（如：按住 Control 鍵點擊打開，或者執行 `xattr -cr /Applications/md2pdf.app` 即可解鎖）。
* **[Risk]**：Tauri 在 macOS 下編譯 Universal binary 需要雙架構 Rust 鏈的支援。
  * **Mitigation**：在 macOS 構建步驟中，需提前安裝 `x86_64-apple-darwin` 與 `aarch64-apple-darwin` 的 Rust targets，以防編譯失敗。
