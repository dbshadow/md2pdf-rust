## 1. 後端 Rust I/O 實作與圖片路徑基準重構

- [x] 1.1 在 `src-tauri/src/lib.rs` 中實作 `read_text_file` 與 `write_text_file` 兩個 Tauri Command，提供安全文字檔讀寫
- [x] 1.2 重構 `markdown_to_html_with_css` 與 `parse_markdown` 函數，引入 `base_dir: Option<&str>` 參數
- [x] 1.3 重構圖片相對路徑解析邏輯：當 `base_dir` 存在時，優先以此為基準目錄讀取圖片二進位數據並轉換為 Base64 Data URL
- [x] 1.4 重構 `generate_pdf` Command 簽名，使其接受 `base_dir: Option<String>` 參數，並傳遞至 HTML 生成邏輯
- [x] 1.5 在 `lib.rs` 的 `run` 巨集中註冊新增的 `read_text_file` 和 `write_text_file` 命令

## 2. 前端 UI、系統對話框與快速鍵實作

- [x] 2.1 在 `src/App.tsx` 中新增 `currentFilePath` (文字檔路徑) 與 `isDirty` (未存檔變更) 狀態
- [x] 2.2 於頂部 header 區域新增「開啟檔案」、「儲存檔案」、「另存新檔」三個功能按鈕
- [x] 2.3 使用 `@tauri-apps/plugin-dialog` 實作開啟與儲存對話框調用，串接 Rust 讀寫命令，並正確擷取 parent directory 作為 `base_dir` 傳遞給後端
- [x] 2.4 在標題欄顯示目前開啟的檔案名稱（無開啟檔案則顯示「未命名草稿」），並在 `isDirty` 為 true 時於檔名旁顯示 `*` 標記
- [x] 2.5 實作未存檔防丟失警告：若當前編輯內容有未存檔變更，在使用者重置或開啟新檔前彈出確認提示
- [x] 2.6 在 React 的 `useEffect` 中註冊全域鍵盤監聽，綁定 `Ctrl+O` (開啟)、`Ctrl+S` (儲存)、`Ctrl+Shift+S` (另存) 快捷鍵
