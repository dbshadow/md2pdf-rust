## Context

目前 md2pdf 主要介面完全為繁體中文硬編碼。為了擴展國際化用戶，我們需要在介面中引進多語系 (i18n) 機制，支援繁體中文（預設）、英文、簡體中文、德語、西班牙語與法語。

## Goals / Non-Goals

**Goals:**
- 建立一個包含 6 種語系翻譯密鑰的輕量級字典 `src/i18n.ts`。
- 支援基於 `localStorage` 的語系偏好持久化。
- 在右上角提供一個顯示當前國旗圖示的按鈕，點擊彈出可切換這 6 種語系的 Popover 下拉選單。
- 將 `App.tsx` 中的硬編碼文字，完全以自訂翻譯函數 `t(key)` 替換。

**Non-Goals:**
- 不引進 `react-i18next` 或類似的第三方大型 i18n 庫，以保持極簡（Ponytail YAGNI 原則，零額外 node 依賴）。
- 本地 Markdown 檔案內容與範本預設內容本身不做即時多語系翻譯（那是使用者寫作的內容），此功能僅聚焦於編輯器 UI 與應用程式提示文字。

## Decisions

### 1. 手寫輕量零依賴翻譯系統
- **做法**:
  - 新增 `src/i18n.ts` 導出 `TRANSLATIONS` 與 `LANGUAGES` 陣列（包含語系 id、名稱與國旗字串，例如 `{ id: 'zh-TW', name: '繁體中文', flag: '🇹🇼' }`）。
  - 在 `App.tsx` 定義 `lang` 狀態與翻譯輔助方法：
    ```typescript
    const t = (key: keyof typeof TRANSLATIONS['zh-TW']) => {
      return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['zh-TW'][key] || key;
    };
    ```
- **原因**: 桌面軟體的 UI 靜態文字不超過 50 句，引進額外的 i18n 解析庫與 loader 是過度設計（Over-engineering）。一個手寫的 Key-Value 對照物件即可在數毫秒內完成解析，不佔用任何執行期開銷，且寫法極為直覺。

### 2. 國旗按鈕與語系 Popover 選單
- **做法**:
  - 按鈕樣式為帶有當前語系國旗的 icon 按鈕（例如 `🇹🇼` 或 `🇺🇸`）。
  - 點擊後顯示絕對定位在按鈕正下方的選單 `.lang-dropdown-menu`。
  - 下拉選單中顯示 6 個語系的名稱與代表國旗，滑鼠 hover 時有高亮背景反饋。
  - 點擊選單中的語系後，呼叫 `setLang(id)`、將選擇儲存至 `localStorage`、並關閉選單。

### 3. 多語系清單字典規劃
翻譯字典將包含六種語系，並具備完整密鑰：
- `zh-TW`: 🇹🇼 繁體中文
- `en`: 🇺🇸 English
- `zh-CN`: 🇨🇳 简体中文
- `de`: 🇩🇪 Deutsch
- `es`: 🇪🇸 Español
- `fr`: 🇫🇷 Français

## Risks / Trade-offs

- **[Risk] 部分翻譯字串長度不同導致 UI 排版跑版**
  - *Mitigation*: 德文和法文通常比中文與英文長 30%~50%。在 `src/index.css` 中，對於按鈕、Tabs 的寬度應避免使用固定像素寬度（`width: 120px`），應改為使用 padding（`padding: 8px 16px`）與 flex 彈性佈局，以利自適應各種字元長度。
