use headless_chrome::{Browser, LaunchOptions};
use std::fs::File;
use std::io::Write;
use std::sync::Mutex;
use tempfile::Builder;
use base64::{Engine as _, engine::general_purpose};
use pulldown_cmark::{Parser, Options, html};

// 宣告 Tauri 狀態結構，用於常駐瀏覽器單例
pub struct ChromeBrowser {
    pub browser: Mutex<Option<Browser>>,
}

fn markdown_to_html_with_css(markdown: &str, css: &str) -> String {
    let mut options = Options::empty();
    options.insert(Options::ENABLE_TABLES);
    options.insert(Options::ENABLE_FOOTNOTES);
    options.insert(Options::ENABLE_STRIKETHROUGH);
    options.insert(Options::ENABLE_TASKLISTS);
    options.insert(Options::ENABLE_HEADING_ATTRIBUTES);

    let parser = Parser::new_ext(markdown, options);
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);

    format!(
        r#"<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
{}
</style>
</head>
<body>
{}
</body>
</html>"#,
        css, html_output
    )
}

#[tauri::command]
fn generate_pdf(
    markdown: String,
    css: String,
    state: tauri::State<'_, ChromeBrowser>,
) -> Result<String, String> {
    // 1. 將 Markdown 轉為 HTML ＋ CSS
    let html_content = markdown_to_html_with_css(&markdown, &css);

    // 2. 建立臨時 HTML 檔案
    let mut temp_file = Builder::new()
        .suffix(".html")
        .tempfile()
        .map_err(|e| format!("無法建立暫存檔: {}", e))?;
    
    temp_file
        .write_all(html_content.as_bytes())
        .map_err(|e| format!("無法寫入暫存檔: {}", e))?;

    let temp_path = temp_file.path().to_str().ok_or("暫存檔路徑無效")?;

    // 3. 取得或惰性初始化常駐的無頭瀏覽器實例（使用 try_lock 避免多個渲染任務重疊時排隊卡死）
    let mut browser_guard = state.browser.try_lock().map_err(|_| "另一項 PDF 渲染任務正在進行中...")?;
    if browser_guard.is_none() {
        let launch_options = LaunchOptions::default_builder()
            .headless(true)
            .build()
            .map_err(|e| format!("無法配置瀏覽器啟動參數: {}", e))?;

        let browser = Browser::new(launch_options)
            .map_err(|e| format!("啟動瀏覽器失敗（請確認本機已安裝 Microsoft Edge 或 Google Chrome）: {}", e))?;
        *browser_guard = Some(browser);
    }
    
    let browser = browser_guard.as_ref().unwrap();

    // 4. 開啟新分頁
    let tab = browser
        .new_tab()
        .map_err(|e| format!("無法開啟分頁: {}", e))?;

    let file_url = format!("file://{}", temp_path);

    // 5. 載入暫存網頁並列印
    tab.navigate_to(&file_url)
        .map_err(|e| format!("載入頁面失敗: {}", e))?;
    
    tab.wait_until_navigated()
        .map_err(|e| format!("載入頁面超時: {}", e))?;

    let pdf_bytes = tab
        .print_to_pdf(None)
        .map_err(|e| format!("列印 PDF 失敗: {}", e))?;

    // 6. 轉為 Base64 字串傳回 (離開 Scope 後 tab 會自動被 Drop 釋放關閉)
    let b64 = general_purpose::STANDARD.encode(pdf_bytes);
    Ok(b64)
}

#[tauri::command]
fn save_pdf_to_path(base64_data: String, file_path: String) -> Result<(), String> {
    let pdf_bytes = general_purpose::STANDARD
        .decode(base64_data)
        .map_err(|e| format!("Base64 解碼失敗: {}", e))?;

    let mut file = File::create(&file_path)
        .map_err(|e| format!("無法建立目標檔案: {}", e))?;

    file.write_all(&pdf_bytes)
        .map_err(|e| format!("寫入檔案失敗: {}", e))?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(ChromeBrowser {
            browser: Mutex::new(None),
        })
        .plugin(tauri_plugin_dialog::init())
        // 設定日誌過濾，全域 Info 級別，過濾掉 headless_chrome 與 tungstenite 吵雜的底層日誌
        .plugin(
            tauri_plugin_log::Builder::default()
                .level(log::LevelFilter::Info)
                .level_for("headless_chrome", log::LevelFilter::Warn)
                .level_for("tungstenite", log::LevelFilter::Warn)
                .build()
        )
        .invoke_handler(tauri::generate_handler![generate_pdf, save_pdf_to_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
