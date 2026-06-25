## Context

目前我們使用 headless Chrome 將 Markdown 轉成的 HTML 檔案列印成 PDF。
由於生成 HTML 時沒有設定 `<title>` 標籤，且使用了 tempfile 生成隨機的暫存 HTML 檔，導致 Chromium 渲染 PDF 後，其內建的 PDF 標題預設顯示為該隨機暫存檔名（如 `.tmpYs459S.html`）。

## Goals / Non-Goals

**Goals:**
- 提供在背景渲染 PDF 時動態注入正確的 Title。
- 提供在下載 PDF 對話框中預設正確的 pdf 檔名。
- 依據「已開啟本地 md 檔案」與「直接編輯草稿」兩種狀態，正確決定檔名與標題。

**Non-Goals:**
- 不改變原本本地 md 檔案讀寫的邏輯。
- 不在 UI 上提供讓使用者手動輸入 PDF 標題的欄位。

## Decisions

### 1. 後端 Tauri 命令 `generate_pdf` 接口修改
- **做法**: 修改 `generate_pdf` 以額外接收 `title: String` 參數，並將其傳遞給 `markdown_to_html_with_css` 函數，最終渲染進 HTML 的 `<title>` 標籤中。
- **原因**: Headless chrome 在使用 `print_to_pdf` 時，會讀取頁面的 `<title>` 當作生成的 PDF 的內部標題。在 HTML 中加入此標籤是最直接且標準的做法。

### 2. 前端狀態儲存草稿預設檔名
- **做法**: 在 `App.tsx` 中宣告一個 `draftPdfName` 狀態：
  ```typescript
  const [draftPdfName, setDraftPdfName] = useState<string>(() => {
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    return `${randomNum}.pdf`;
  });
  ```
  當 `currentFilePath` 存在時，我們取出檔名並將後綴改為 `.pdf`。當 `currentFilePath` 為空（草稿模式）時，使用此 `draftPdfName`。這確保了背景防抖渲染 PDF 時傳遞的 `title` 與使用者按下下載按鈕時彈出的檔名一致。

## Risks / Trade-offs

- **[Risk]** 在未命名草稿狀態下，隨機產生的草稿檔名在重新整理後會變更。
  *Mitigation*: 這符合草稿定義。一旦使用者使用另存新檔儲存了檔案，就會切換到具名檔案模式，檔名與標題將完美綁定為 `xxx.pdf`。
