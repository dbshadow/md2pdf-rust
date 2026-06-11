use headless_chrome::{Browser, LaunchOptions, Tab, types::PrintToPdfOptions};
use std::fs::File;
use std::io::Write;
use std::sync::{Arc, Mutex};
use tempfile::Builder;
use base64::{Engine as _, engine::general_purpose};

// 宣告 Tauri 狀態結構，常駐瀏覽器與分頁單例
pub struct ChromeBrowser {
    pub browser: Mutex<Option<Browser>>,
    pub tab: Mutex<Option<Arc<Tab>>>,
}

fn markdown_to_html_with_css(markdown: &str, css: &str) -> String {
    use pulldown_cmark::{Parser, Options, html, Event, Tag};
    use std::path::{Path, PathBuf};

    let mut options = Options::empty();
    options.insert(Options::ENABLE_TABLES);
    options.insert(Options::ENABLE_FOOTNOTES);
    options.insert(Options::ENABLE_STRIKETHROUGH);
    options.insert(Options::ENABLE_TASKLISTS);
    options.insert(Options::ENABLE_HEADING_ATTRIBUTES);

    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|d| d.to_path_buf()))
        .unwrap_or_else(|| std::env::current_dir().unwrap_or_default());

    let parser = Parser::new_ext(markdown, options);
    let mut events = Vec::new();

    for event in parser {
        match event {
            Event::Start(Tag::Image { link_type, dest_url, title, id }) => {
                let dest_str = dest_url.to_string();
                if !dest_str.starts_with("http://")
                    && !dest_str.starts_with("https://")
                    && !dest_str.starts_with("data:")
                {
                    let img_path = if Path::new(&dest_str).is_absolute() {
                        PathBuf::from(&dest_str)
                    } else {
                        exe_dir.join(&dest_str)
                    };

                    if let Ok(img_data) = std::fs::read(&img_path) {
                        let mime_type = match img_path.extension().and_then(|s| s.to_str()) {
                            Some("png") | Some("PNG") => "image/png",
                            Some("jpg") | Some("JPG") | Some("jpeg") | Some("JPEG") => "image/jpeg",
                            Some("gif") | Some("GIF") => "image/gif",
                            Some("svg") | Some("SVG") => "image/svg+xml",
                            Some("webp") | Some("WEBP") => "image/webp",
                            _ => "image/png",
                        };
                        let encoded = general_purpose::STANDARD.encode(img_data);
                        let data_url = format!("data:{};base64,{}", mime_type, encoded);
                        events.push(Event::Start(Tag::Image {
                            link_type,
                            dest_url: data_url.into(),
                            title,
                            id,
                        }));
                        continue;
                    }
                }
                events.push(Event::Start(Tag::Image { link_type, dest_url, title, id }));
            }
            _ => events.push(event),
        }
    }

    let mut html_output = String::new();
    html::push_html(&mut html_output, events.into_iter());

    format!(
        r#"<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* {{
  box-sizing: border-box;
}}
html, body {{
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
}}
::-webkit-scrollbar {{
  display: none !important;
}}
img {{
  max-width: 100% !important;
  height: auto !important;
  display: block;
}}
pre, table {{
  max-width: 100%;
  overflow-x: auto;
}}
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

// 嘗試使用常駐 Tab 進行 PDF 渲染的輔助函數
fn try_pdf_render(file_url: &str, state: &tauri::State<'_, ChromeBrowser>) -> Result<String, String> {
    let mut browser_guard = state.browser.lock().map_err(|_| "無法獲取瀏覽器鎖")?;
    let mut tab_guard = state.tab.lock().map_err(|_| "無法獲取瀏覽器鎖")?;
    
    // 如果尚未初始化，進行初始化
    if browser_guard.is_none() {
        let launch_options = LaunchOptions::default_builder()
            .headless(true)
            .build()
            .map_err(|e| format!("無法配置瀏覽器啟動參數: {}", e))?;

        let browser = Browser::new(launch_options)
            .map_err(|e| format!("啟動瀏覽器失敗（請確認本機已安裝 Microsoft Edge 或 Google Chrome）: {}", e))?;
        
        let tab = browser.new_tab()
            .map_err(|e| format!("無法開啟初始分頁: {}", e))?;

        *browser_guard = Some(browser);
        *tab_guard = Some(tab);
    }
    
    let tab = tab_guard.as_ref().unwrap();

    // 在分頁中載入網頁
    tab.navigate_to(file_url)
        .map_err(|e| format!("載入頁面失敗: {}", e))?;
    
    tab.wait_until_navigated()
        .map_err(|e| format!("載入頁面超時: {}", e))?;

    // 配置 PDF 列印參數，啟用 prefer_css_page_size
    let pdf_options = PrintToPdfOptions {
        prefer_css_page_size: Some(true),
        ..Default::default()
    };

    // 列印成 PDF
    let pdf_bytes = tab
        .print_to_pdf(Some(pdf_options))
        .map_err(|e| format!("列印 PDF 失敗: {}", e))?;

    let b64 = general_purpose::STANDARD.encode(pdf_bytes);
    Ok(b64)
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
    let file_url = format!("file://{}", temp_path);

    // 3. 嘗試使用常駐瀏覽器進行渲染
    let result = try_pdf_render(&file_url, &state);

    // 4. 如果出錯（例如 CDP websocket 中斷），重置背景 Edge 並重新連線再試一次
    match result {
        Ok(b64) => Ok(b64),
        Err(err) => {
            println!("[WARN] 常駐瀏覽器連線異常（將自動重新連線）: {}", err);
            
            // 釋放原有的瀏覽器實例，將其設為 None 進行重置
            if let Ok(mut browser_guard) = state.browser.lock() {
                if let Ok(mut tab_guard) = state.tab.lock() {
                    *browser_guard = None;
                    *tab_guard = None;
                }
            }
            
            // 重新發起第二次渲染嘗試 (此時會重新建立 Browser 與 Tab 實例)
            try_pdf_render(&file_url, &state)
                .map_err(|e| format!("重啟無頭瀏覽器後依然渲染失敗: {}", e))
        }
    }
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

#[tauri::command]
fn parse_markdown(markdown: String) -> Result<String, String> {
    use pulldown_cmark::{Parser, Options, html, Event, Tag};
    use std::path::{Path, PathBuf};

    let mut options = Options::empty();
    options.insert(Options::ENABLE_TABLES);
    options.insert(Options::ENABLE_FOOTNOTES);
    options.insert(Options::ENABLE_STRIKETHROUGH);
    options.insert(Options::ENABLE_TASKLISTS);
    options.insert(Options::ENABLE_HEADING_ATTRIBUTES);

    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|d| d.to_path_buf()))
        .unwrap_or_else(|| std::env::current_dir().unwrap_or_default());

    let parser = Parser::new_ext(&markdown, options);
    let mut events = Vec::new();

    for event in parser {
        match event {
            Event::Start(Tag::Image { link_type, dest_url, title, id }) => {
                let dest_str = dest_url.to_string();
                if !dest_str.starts_with("http://")
                    && !dest_str.starts_with("https://")
                    && !dest_str.starts_with("data:")
                {
                    let img_path = if Path::new(&dest_str).is_absolute() {
                        PathBuf::from(&dest_str)
                    } else {
                        exe_dir.join(&dest_str)
                    };

                    if let Ok(img_data) = std::fs::read(&img_path) {
                        let mime_type = match img_path.extension().and_then(|s| s.to_str()) {
                            Some("png") | Some("PNG") => "image/png",
                            Some("jpg") | Some("JPG") | Some("jpeg") | Some("JPEG") => "image/jpeg",
                            Some("gif") | Some("GIF") => "image/gif",
                            Some("svg") | Some("SVG") => "image/svg+xml",
                            Some("webp") | Some("WEBP") => "image/webp",
                            _ => "image/png",
                        };
                        let encoded = general_purpose::STANDARD.encode(img_data);
                        let data_url = format!("data:{};base64,{}", mime_type, encoded);
                        events.push(Event::Start(Tag::Image {
                            link_type,
                            dest_url: data_url.into(),
                            title,
                            id,
                        }));
                        continue;
                    }
                }
                events.push(Event::Start(Tag::Image { link_type, dest_url, title, id }));
            }
            _ => events.push(event),
        }
    }

    let mut html_output = String::new();
    html::push_html(&mut html_output, events.into_iter());
    Ok(html_output)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(ChromeBrowser {
            browser: Mutex::new(None),
            tab: Mutex::new(None),
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
        .invoke_handler(tauri::generate_handler![generate_pdf, save_pdf_to_path, parse_markdown])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
