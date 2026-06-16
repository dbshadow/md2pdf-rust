## Context

目前在儲存自訂範本時，使用瀏覽器的 `window.prompt` 彈窗。此彈窗在 Tauri 桌面應用中會顯示 `localhost:5173 says:` 的網頁來源資訊，顯得不夠專業且與整體介面風格不搭。本設計引進 React 自訂 Promise 控制的彈出對話框，優化其視覺效果與操作體驗。

## Goals / Non-Goals

**Goals:**
- 以 HTML/CSS + React 狀態開發專屬的 Prompt 對話框。
- 支援 Promise 控制流，保持異步調用端的簡單性。
- 提供鍵盤操作支持（Enter 確定、Escape 取消）。
- 使用毛玻璃特效 (`backdrop-filter`) 與平滑動畫美化視覺。

**Non-Goals:**
- 不替換 `window.confirm` 或 Tauri 的 `ask` 彈窗（該彈窗由 Tauri 原生 Rust 核心控制，沒有網頁來源標頭，外觀足夠桌面化）。
- 不提供多重嵌套彈出（一次僅能顯示一個 Prompt Modal）。

## Decisions

### 1. Promise-Based Ref 解決方案
- **做法**:
  - 在 React 中使用一個 `useRef` 紀錄 `resolve` 函數。
  - 設計 `showPrompt` 回傳一個 `Promise<string | null>`。
  - 當用戶點擊「確定」或「取消」時，執行對應的 `resolve` 以將結果傳遞回原儲存邏輯。
- **原因**: 傳統的 Modal 寫法需要將「觸發彈出」與「點選確認」的邏輯拆解在不同的生命週期與函數中，這會破壞 `handleSaveAsCustomTemplate` 的整體控制流程。Promise 寫法可以讓我們在 `handleSaveAsCustomTemplate` 內部直接 `const name = await showPrompt(...)`，代碼邏輯維持線性，最為乾淨。

### 2. 優化鍵盤監聽與焦點
- **做法**:
  - Modal 中的 `<input>` 加上 `autoFocus` 屬性。
  - 綁定 `onKeyDown`，當偵測到 `Enter` 時觸發確認，`Escape` 時觸發取消。
- **原因**: 輸入對話框非常講求鍵盤操作流暢度，使用者習慣打字完直接按 Enter 儲存。

## Risks / Trade-offs

- **[Risk] State 更新非同步導至 Ref 未即時寫入**
  - *Mitigation*: 雖然 React state 更新是非同步的，但我們存取 `promptResolveRef.current` 是直接的 mutable 操作，這會在 `showPrompt` 執行時立即生效，因此不會有任何同步時序問題。
