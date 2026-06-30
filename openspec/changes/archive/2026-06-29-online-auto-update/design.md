## Context

目前應用程式基於 Tauri v2 + React 構建，尚未建立任何版本更新偵測與自動升級機制。為了保證使用者體驗與安全性，並減少版本落後引發的支援成本，我們需要引進線上升級系統，使應用程式能在每次啟動時自動檢查更新，下載安裝包並引導使用者重啟。

## Goals / Non-Goals

**Goals:**
- 在應用程式啟動時，自動、背景執行版本檢查。
- 引入 Tauri 官方的 updater 與 process 插件，控制下載、安裝與重啟。
- 實作符合「科技藍」美學的自訂 React UI 彈出對話框，顯示更新日誌與精準進度條。
- 透過公私鑰簽名機制 (Tauri Signer) 確保更新檔案的安全校驗，防止偽造。

**Non-Goals:**
- 不提供手動檢查更新的 UI 入口或設定頁面。
- 本次實作不包括 GitHub 遠端 Actions 的實際觸發與發布環境配置，僅提供本地代碼與設定的完整實作。

## Decisions

### 1. 採用 Tauri v2 官方 Updater 插件
- **Decision**: 使用 `@tauri-apps/plugin-updater` (前端) 與 `tauri-plugin-updater` (Rust 後端)。
- **Rationale**: 官方插件對 Windows (NSIS/MSI) 及 macOS/Linux 的二進制取代與升級流程提供了成熟的跨平台底層封裝，避免自行撰寫下載與執行腳本的複雜性與安全隱患。
- **Alternatives**: 自訂 HTTP 下載並用 Rust 執行執行檔。此做法需要自行處理權限提升、程序取代與多作業系統的差異，開發成本過高且容易失敗。

### 2. 在 React 前端渲染進度狀態
- **Decision**: 透過 `downloadAndInstall` 的回呼函數接收下載進度，並在自訂的「科技藍」React Modal 內以進度條展示。
- **Rationale**: 讓更新流程視覺化、透明化，比靜默下載或使用瀏覽器原生 Dialog 更具 premium 質感與安全感。
- **Alternatives**: 採用原生對話框或完全在背景靜默更新。靜默更新容易在重新啟動時讓使用者困惑，原生的 Dialog 則無法達成 UI 風格的一致性。

### 3. 使用 Tauri Signer 產生密鑰對
- **Decision**: 透過 Tauri 內建工具生成私鑰與公鑰。
- **Rationale**: Tauri updater 機制要求必須對所有發布的安裝包使用私鑰進行 `.sig` 簽名，並在客戶端的 `tauri.conf.json` 中配置公鑰進行校驗，這是防止中間人篡改的核心防禦。

## Risks / Trade-offs

- **[Risk]** 網路連線超時或 endpoint 被牆（例如 GitHub 被特定網路阻擋）導致檢查失敗。
  - **Mitigation**: 系統在檢查更新時若拋出錯誤，必須使用 `try-catch` 捕獲，並直接靜默進入系統主介面，不得影響使用者原有的正常操作。
- **[Risk]** 下載大檔案時應用程式無回應或中途關閉。
  - **Mitigation**: 提供清楚的進度提示，並在下載中停用 Modal 的關閉按鈕，以引導使用者等待。
