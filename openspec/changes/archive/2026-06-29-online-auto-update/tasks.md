## 1. 後端與配置檔設定

- [x] 1.1 使用 `npx tauri signer generate` 產生更新簽名密鑰對，並將公鑰配置於 `src-tauri/tauri.conf.json` 內
- [x] 1.2 在 `src-tauri/Cargo.toml` 中加入 `tauri-plugin-updater` 與 `tauri-plugin-process` 依賴
- [x] 1.3 在 `src-tauri/src/lib.rs` 中初始化並註冊自動更新器插件
- [x] 1.4 在 `src-tauri/tauri.conf.json` 中配置 plugins.updater.endpoints 更新來源端點
- [x] 1.5 在 `src-tauri/capabilities/default.json` 之中加入 `updater:default` 與 `process:allow-restart` 權限

## 2. 前端更新控制與 React UI 實作

- [x] 2.1 透過 npm 安裝 `@tauri-apps/plugin-updater` 和 `@tauri-apps/plugin-process` 套件
- [x] 2.2 建立精美的自訂「科技藍」風格更新對話框元件 `UpdateModal`
- [x] 2.3 在 `src/App.tsx` 中引入 `UpdateModal`，並於 App 啟動時自動背景呼叫檢查更新
- [x] 2.4 實作下載進度監聽與下載完成後自動重啟的處理邏輯
