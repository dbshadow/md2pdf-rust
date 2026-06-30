## 1. 設定側邊欄 (Settings Drawer) 元件開發

- [x] 1.1 新增獨立設定抽屜元件 `src/SettingsDrawer.tsx`，使用精美的「科技藍」風格與 CSS 色調變數渲染
- [x] 1.2 於 `SettingsDrawer` 中實作主題切換 Toggle、語言選擇 Dropdown、以及自動更新檢查開關 Toggle
- [x] 1.3 整合 `localStorage`，持久化儲存使用者切換的「自動檢查更新 (md2pdf_auto_check_update)」布林值設定
- [x] 1.4 動態載入 Tauri App 的版本號（如 `v1.1.1`），並在 Drawer 底部展示

## 2. 前端介面整合與邏輯連動

- [x] 2.1 修改 `src/index.css`，追加側邊設定欄平滑滑出動畫（`transform: translateX`）、半透明背景遮罩（Overlay）以及相關微動效之 CSS 樣式
- [x] 2.2 重構 `src/App.tsx` 的頂部導覽列，收起原先暴露的深色模式切換與語言下拉選單，並於頂部最右側掛載「三條橫線 (Hamburger)」設定按鈕以開啟側邊欄
- [x] 2.3 修改 `src/App.tsx` 啟動時自動檢查更新的 `useEffect` 邏輯，優先判斷本地 `md2pdf_auto_check_update` 設定值，唯有其為 `true` 時才呼叫 `check()` 更新檢查
