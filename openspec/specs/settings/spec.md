## ADDED Requirements

### Requirement: Settings Drawer Toggle
系統應於頂部工具列最右側提供三條橫線按鈕，點擊時能平滑開啟設定側邊欄。

#### Scenario: Open Settings Drawer
- **WHEN** 使用者點擊最右側的三條橫線按鈕
- **THEN** 系統將在背景顯示半透明遮罩，並將設定側邊欄自右側平滑滑出顯示。

#### Scenario: Close Settings Drawer
- **WHEN** 使用者點擊背景半透明遮罩、或是設定欄內部的關閉按鈕
- **THEN** 設定欄平滑向右收回，背景遮罩消失。

---

### Requirement: Settings Features Integration
設定側邊欄應整合原本分散或缺少的設定項，包含主題切換、語言切換、當前版本號顯示與自動檢查更新開關。

#### Scenario: Theme Switching in Settings
- **WHEN** 使用者在設定欄中切換「深色模式」開關
- **THEN** 系統將會將應用程式切換為深色或淺色模式，並確保與整體 UI 變數同步。

#### Scenario: Language Switching in Settings
- **WHEN** 使用者在設定欄中更改語言下拉選單的選項
- **THEN** 系統即時切換介面的翻譯文字（繁體中文/英文）。

#### Scenario: Version Display in Settings
- **WHEN** 設定欄被開啟時
- **THEN** 系統將動態讀取目前的應用程式版本號（如 `v1.1.1`），並在設定欄底部清晰展示。

#### Scenario: Auto-Update Configuration Toggle
- **WHEN** 使用者切換設定欄中的「啟動時自動檢查更新」開關
- **THEN** 系統將即時更新狀態值，並將此布林值持久化儲存於 `localStorage` 的 `md2pdf_auto_check_update` 鍵中。

---

### Requirement: Conditional Update Check on Startup
系統在啟動時，應讀取使用者的本地偏好設定，決定是否向遠端發送更新檢查。

#### Scenario: Auto Check Update Enabled (Default)
- **WHEN** 軟體啟動，且本地儲存的 `md2pdf_auto_check_update` 為 `true` 或不存在（預設）
- **THEN** 系統在背景自動發送更新 Manifest 的請求以檢查最新版本。

#### Scenario: Auto Check Update Disabled
- **WHEN** 軟體啟動，且本地儲存的 `md2pdf_auto_check_update` 設定為 `false`
- **THEN** 系統靜默跳過更新檢查，直接進入系統主介面。
