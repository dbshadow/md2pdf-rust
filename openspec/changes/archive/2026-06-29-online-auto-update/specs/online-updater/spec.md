## ADDED Requirements

### Requirement: Auto Update Detection on Startup
系統在啟動時，應自動向遠端 GitHub Release Manifest 端點發送請求以檢查最新版本。

#### Scenario: Update Found
- **WHEN** 應用程式啟動，且向遠端獲取的最新版本號大於目前應用的本地版本號
- **THEN** 系統將觸發並開啟更新對話框 (Update Modal)，顯示更新日誌

#### Scenario: App Is Up To Date
- **WHEN** 應用程式啟動，且遠端版本小於或等於本地版本
- **THEN** 系統靜默忽略更新，不會彈出任何對話框，正常載入主介面

### Requirement: User Decides Update Action
更新對話框應包含「立即更新」與「暫不更新」選項。

#### Scenario: User Declines Update
- **WHEN** 使用者在對話框中點選「暫不更新」
- **THEN** 系統將關閉對話框，使用者保留目前版本繼續使用

#### Scenario: User Accepts Update
- **WHEN** 使用者在對話框中點選「立即更新」
- **THEN** 系統會開始下載更新包，禁用確認按鈕並切換為下載進度狀態

### Requirement: Update Download and Install Progress
在下載更新檔案時，系統必須即時向使用者展示下載進度，並在完成後自動重啟。

#### Scenario: Progress Indicator
- **WHEN** 下載進行中，後端回報資料傳輸量
- **THEN** 前端 Modal 顯示進度條並以百分比即時更新進度

#### Scenario: Download Finished and Relaunch
- **WHEN** 更新檔下載完成且成功套用安裝
- **THEN** 系統自動呼叫重啟指令，將目前軟體關閉並以新版本重新開啟
