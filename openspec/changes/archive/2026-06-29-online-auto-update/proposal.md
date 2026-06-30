## Why

現有應用程式缺乏線上自動更新機制，使用者在開發者發布新版本時，無法即時得知與更新。為修復版本落後可能造成的效能或崩潰問題，需要在軟體開啟時自動檢查更新，並以自訂科技藍風格 Modal 提示使用者進行安全更新，提升易用性。

## What Changes

- **線上更新功能**：軟體啟動時向指定端點 (GitHub) 請求最新的 Manifest 資訊。
- **使用者提示介面**：發現新版本時，顯示專屬的「科技藍」風格 UI Modal，展示版本號、更新日誌與下載進度條。
- **更新下載與重啟安裝**：下載過程中即時回報進度，完成後自動重啟套用更新。
- **安裝包安全驗證**：在 tauri.conf.json 配置公鑰，利用私鑰簽名安裝包，確保下載檔案的完整性。

## Capabilities

### New Capabilities
- `online-updater`: 提供在軟體開啟時自動向 GitHub 檢查 Manifest 更新、下載新版本二進制檔案、顯示科技藍更新 Modal 以及下載進度，並在完成後自動重啟應用程式以套用新版本的完整功能。

### Modified Capabilities
無。

## Impact

- **後端變更**：`src-tauri/Cargo.toml` 將增加 `tauri-plugin-updater` 與 `tauri-plugin-process` 依賴；`src-tauri/src/lib.rs` 註冊 updater 插件。
- **配置變更**：`src-tauri/tauri.conf.json` 配置 plugins.updater 的公鑰與 endpoints；`src-tauri/capabilities/default.json` 開放 `updater:default` 及 `process:allow-relaunch` 權限。
- **前端變更**：`src/App.tsx` 在初始化邏輯中監聽更新狀態，引入自訂 React Modal 對應更新進度與狀態的控制。
- **CI/CD 發布鏈**：需在 GitHub Actions 整合密鑰對簽名流程。
