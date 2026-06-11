## Why

目前的桌面端應用程式在 HTML 預覽與 PDF 生成中無法顯示本地相對路徑圖片（如 `![圖片](./test.png)`）。這是因為 Webview 具有安全沙盒限制，預設禁止使用 `file://` 協定加載本地檔案；且 PDF 生成時的臨時 HTML 檔案位於系統 Temp 目錄下，無法以相對路徑正確定位圖片。我們需要一個安全、無痛且支援 A4 高精度列印的本地圖片解析方案。

## What Changes

- **圖片 Base64 內嵌化 (BREAKING)**：在 Rust 後端 Markdown 轉 HTML 的解析過程中，自動偵測本地相對路徑的圖片（排除 `http://`, `https://` 與 `data:` 協定），將其讀取並轉換為 Base64 Data URL 直接內嵌至 HTML 中。
- **相對路徑解析基準**：本機圖片相對路徑以「執行檔所在的目錄」為解析基準，確保與 exe 放在同資料夾下的圖片能正確載入。
- **無需額外權限設定**：由 Rust 後端直接在本地檔案系統讀取檔案，避開 Webview 的 Same-Origin 限制與 Tauri 的複查 Scopes 權限設定。

## Capabilities

### New Capabilities

*(無新增能力，僅修改現有 PDF 生成規格)*

### Modified Capabilities
- `pdf-generator`: 修改 Markdown 轉 HTML 處理機制，加入本地圖片解析與 Base64 自動嵌入。

## Impact

- **修改的程式碼**：將會修改 `src-tauri/src/lib.rs`，重構 `markdown_to_html_with_css` 函數，在將 Markdown 解析為 HTML Events 的過程中加入本地圖片轉換 Base64 邏輯。
- **依賴影響**：無（已在 `Cargo.toml` 中引入了 `base64`，無需新增其他依賴庫）。
