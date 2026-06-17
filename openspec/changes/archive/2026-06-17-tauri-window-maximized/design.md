## Context

現有的 Tauri 桌面視窗配置將預設寬度設為 800、高度設為 600。此解析度對於同時包含「編輯區」、「對比區」與「HTML/PDF 預覽區」的雙欄 App 來說太小，強迫使用者每次啟動時都要手動調整視窗。

## Goals / Non-Goals

**Goals:**
- 修改 `tauri.conf.json` 檔案中的主要視窗設定。
- 使主視窗在開啟時預設處於最大化（Maximized）狀態。
- 調整預設的視窗維度至更寬敞的 1280x800。

**Non-Goals:**
- 不鎖定為固定解析度，視窗仍可自由 Resizable。
- 不預設以「全螢幕（Fullscreen）」啟動（全螢幕會隱藏作業系統的狀態欄，不便於一般使用，且 fullscreen 已設定為 false）。

## Decisions

### 1. 修改 `src-tauri/tauri.conf.json` 的 `"windows"` 配置
- **做法**:
  - 將 `"windows"` 陣列中的主要視窗屬性變更為：
    ```json
    "width": 1280,
    "height": 800,
    "maximized": true
    ```
- **原因**: 這是 Tauri 內建支援的視窗初始化配置屬性。藉由設定 `"maximized": true`，Tauri 的 Rust 核心在建立 Webview 視窗時，會呼叫作業系統層級的 `set_maximized(true)`，提供原生且滑順的最大化開啟效果。同時，`width: 1280` 與 `height: 800` 會被保留為還原（restore）時的大小，避免還原後視窗又縮小到 800x600。

## Risks / Trade-offs

- **[Risk] 部分低解析度螢幕（如舊型投影機）可能小於 1280x800**
  - *Mitigation*: 由於視窗以最大化開啟，在低解析度螢幕上它會自動限縮在該螢幕的最大可用範圍內；如果使用者還原視窗，Tauri 也會自適應。因此無相容性風險。
