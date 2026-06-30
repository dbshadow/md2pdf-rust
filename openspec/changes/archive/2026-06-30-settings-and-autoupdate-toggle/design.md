## Context

隨著應用程式進入 v1.1.0 以上的大改版，我們實作了線上自動更新功能。然而，目前頂部導覽列按鈕數量較多（主題切換、語言切換等），版面略顯擁擠。此外，自動更新檢查目前是強制性的，使用者無法手動開啟或關閉。我們需要建立一個抽屜式的「設定側邊欄 (Settings Drawer)」，用三條橫線按鈕收納這些選項，並提供使用者隨時開啟/關閉「軟體啟動時自動檢查更新」的自主權。

## Goals / Non-Goals

**Goals:**
- 在頂部列最右方新增一個三條橫線的 Hamburger 設定按鈕。
- 實作平滑滑出的設定側邊欄 (Settings Drawer) 以及半透明背景遮罩 (Overlay)。
- 重構並收納現有的深色模式切換（Toggle）與多國語言切換（Dropdown）。
- 新增「自動檢查更新開關」，並將其狀態（預設為 `true`）持久化儲存於 `localStorage` 的 `md2pdf_auto_check_update` 中。
- 修改啟動時的自動檢查更新邏輯，只有在該開關為啟用狀態時才執行檢查。
- 在側邊欄底部清晰顯示當前的版本號（動態獲取 `v1.1.1` 或最新版本）。

**Non-Goals:**
- 本次開發不更改 Rust 後端代碼或設定檔，純粹在前端利用 React 狀態、CSS 動畫與 `localStorage` 進行控制。

## Decisions

### 1. 採用從右側滑出的 Drawer (抽屜式) 設計
- **Decision**: 點選右上角的「三條橫線」按鈕時，會有一個背景遮罩覆蓋主畫面，且設定欄會從右側平滑滑出。
- **Rationale**: 相比下拉選單 (Dropdown) 或中央彈出的 Modal，側邊抽屜式 Drawer 能提供更充裕的排版空間，極具現代技術應用的科技感與高級感。
- **Alternatives**: 採用下拉選單。下拉選單對於多國語言、主題、開關和版本號等複合式選項來說，排版會過於侷促，且不易閱讀與操作。

### 2. 利用 `localStorage` 持久化自動更新偏好
- **Decision**: 透過鍵名 `md2pdf_auto_check_update` 儲存布林值設定。當 App 初始化時，透過 `localStorage.getItem` 讀取，並傳遞給自動更新的 `useEffect`。
- **Rationale**: `localStorage` 的讀寫極快，無任何額外的效能開銷，非常適合儲存輕量級的使用者本地設定。

### 3. 動態獲取與展示當前版本號
- **Decision**: 使用 Tauri 提供的 `@tauri-apps/api/app` 插件中的 `getVersion()` 方法在元件載入時動態讀取，若讀取失敗則降級為顯示 `package.json` 中的靜態版本號。
- **Rationale**: 動態讀取能確保顯示的版本號與目前封裝的 binary 檔案版本絕對一致。

## Risks / Trade-offs

- **[Risk]** 在滑出 Drawer 的過程中，如果動畫不流暢會造成卡頓感。
  - **Mitigation**: 使用高效的 CSS 3D 硬體加速（`transform: translateX()`）來實現滑出動畫，並為 Overlay 加上平滑的透明度漸變（`transition: opacity`）。
- **[Risk]** 使用者關閉自動更新後，可能錯過重大的效能修復或安全更新。
  - **Mitigation**: 將自動更新的預設值設定為 `true`。即使關閉，我們依然在設定欄中提供一個顯示目前版本的地方，未來也可以在此擴展「手動檢查更新」的按鈕。
