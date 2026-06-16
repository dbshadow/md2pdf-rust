## Context

目前系統提供 5 個寫死的內建範本。當用戶客製化 Markdown 或自訂 CSS 後，無法進行儲存，導致樣式難以重複使用。本設計引入基於 `localStorage` 的自訂範本管理功能。

## Goals / Non-Goals

**Goals:**
- 提供「儲存為範本」按鈕，將目前的編輯內容與自訂 CSS 儲存為自訂範本。
- 將自訂範本持久化儲存於 `localStorage` 中。
- 在下拉選單中無縫載入並合併預設範本與自訂範本。
- 當選擇自訂範本時，提供「刪除範本」按鈕以清理不必要的樣式。

**Non-Goals:**
- 不對自訂範本進行雲端同步，僅保存在本地瀏覽器緩存（localStorage）中。
- 不提供預設範本的刪除或修改功能，僅限對自訂範本進行操作。

## Decisions

### 1. 採用 localStorage 持久化自訂範本
- **做法**:
  - React 初始化時載入 `localStorage.getItem('custom_templates')`，無則設為 `[]`。
  - 當儲存或刪除自訂範本時，即時更新 state 並寫回 `localStorage`。
- **原因**: 專案本身就是一個 Tauri 桌面應用，其 Webview 本身即有穩定持久的 LocalStorage 機制。此做法無需設計額外的 Rust 檔案讀寫 API，能以最簡單、零開銷的方式實現需求。

### 2. UI 刪除按鈕動態呈現
- **做法**:
  - 在頂部控制列檢測 `selectedTemplateId.startsWith('custom_')`。
  - 當該條件為 `true` 時，在範本下拉選單旁渲染「刪除範本」按鈕，並以紅色調標示表示危險操作。
- **原因**: 自訂範本需要有刪除的出口。動態呈現的按鈕既不佔用原本緊湊的預設 UI 空間，又能在使用者切換到自訂範本時提供直覺的刪除管道。

### 3. 範本資料型別與結構一致性
- **做法**:
  - 自訂範本的型別依舊是 `PresetTemplate`，即擁有 `id`、`name`、`defaultMarkdown` 和 `defaultCss`。
  - 其 `id` 格式採用 `custom_${Date.now()}` 確保全域唯一性，並作為判定是否為自訂範本（`startsWith('custom_')`）的標記。
  - 其 `name` 自動加上 `[自訂]` 前綴以與內建範本做清晰的視覺區隔。

## Risks / Trade-offs

- **[Risk] 儲存內容太大導致 localStorage 超出配額**
  - *Mitigation*: LocalStorage 限制通常為 5MB~10MB。一般 Markdown 文件與 CSS 樣式大小都在數十 KB 內，這意味著可以儲存數百個範本，配額相當充足。
- **[Risk] 刪除範本導致內容無預警遺失**
  - *Mitigation*: 點選刪除時會調用 Tauri plugin-dialog 的 `ask` 進行確認提示，預防使用者誤觸。
