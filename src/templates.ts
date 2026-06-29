export interface PresetTemplate {
  id: string;
  name: string;
  defaultMarkdown: string;
  defaultCss: string;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'resume',
    name: '精美個人履歷 (Resume)',
    defaultMarkdown: `# 王大明 (David Wang)
**資深全端工程師**

<p class="contact-info">📍 台北市信義區 | 📞 0912-345-678 | ✉️ david.wang@example.com | 🌐 github.com/davidwang</p>

## 關於我
擁有超過 5 年的 Web 開發經驗，專精於 React, Node.js 以及雲端架構設計。熱愛以優雅的程式碼解決複雜的業務問題，並具有多次帶領團隊從零建構大規模應用的經驗。

---

## 專業技能
* **前端開發**: React, TypeScript, Next.js, CSS Modules, Tailwind CSS
* **後端開發**: Node.js, Express, Go, NestJS, RESTful API, GraphQL
* **資料庫 & 雲端**: PostgreSQL, MongoDB, Redis, AWS (S3, EC2, Lambda), Docker
* **工作方法**: Agile/Scrum, CI/CD Pipelines, Git Flow, Clean Code

---

## 工作經歷

### **資深全端工程師** | 創新型科技股份有限公司 *(2022 - 至今)*
* **專案重構**: 帶領 4 人小組使用 React + TS 重構核心電商系統，提升頁面載入速度 **40%**。
* **高併發優化**: 設計 Redis 快取機制，將 API 平均回應時間從 250ms 降至 **80ms**。
* **CI/CD 建立**: 導入 GitHub Actions 與 Docker，將代碼部署時間由 30 分鐘縮短至 **5 分鐘**。

### **全端工程師** | 未來軟體工作室 *(2020 - 2022)*
* 負責開發 SaaS 系統的前後端功能，使用 Express & MongoDB。
* 獨立開發即時聊天模組，基於 WebSocket，支援萬人同時在線。

---

## 教育背景
### **資訊工程學系 學士** | 國立台灣大學 *(2016 - 2020)*
`,
    defaultCss: `@page {
  size: A4;
  margin: 15mm 10mm 15mm 10mm;
}

body {
  font-family: 'Helvetica Neue', Arial, 'Noto Sans TC', sans-serif;
  color: #333333;
  font-size: 14px;
  line-height: 1.5;
}

h1 {
  font-size: 28px;
  color: #1a365d;
  margin-top: 0;
  margin-bottom: 5px;
  text-align: center;
}

p {
  margin-top: 5px;
  margin-bottom: 10px;
}

/* 聯絡資訊樣式 - 使用 Class 避免誤傷正文 */
.contact-info {
  text-align: center;
  color: #4a5568;
  font-size: 13px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

h2 {
  font-size: 16px;
  color: #2b6cb0;
  border-left: 4px solid #2b6cb0;
  padding-left: 8px;
  margin-top: 20px;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

hr {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 15px 0;
}

ul {
  margin-top: 5px;
  margin-bottom: 10px;
  padding-left: 20px;
}

li {
  margin-bottom: 5px;
}

strong {
  color: #2d3748;
}

/* 經歷中的職稱和時間佈局 */
h3 {
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  color: #2d3748;
}

em {
  color: #718096;
  font-style: normal;
}
`
  },
  {
    id: 'academic',
    name: '學術報告 (Academic)',
    defaultMarkdown: `# 基於 Headless Browser 的本地端 PDF 渲染系統之設計與實現

<div class="author-info">
  <strong>作者：王小明</strong><br>
  <em>國立科技大學資訊工程研究所</em>
</div>

---

### 摘要
<p class="abstract">本文提出了一種基於無頭瀏覽器（Headless Browser）技術的本地端 Markdown 轉 PDF 系統。本系統採用前後端分離架構，前端基於 React 提供自訂 Markdown 與 CSS 的編輯介面，後端基於 Node.js 與 Puppeteer 提供高精度的 PDF 實體渲染。實驗結果表明，該系統相較於傳統基於 Canvas 轉換的工具，在分頁精度、頁首頁尾自訂以及 CSS 印表機樣式支援度上具有顯著的技術優勢。</p>

---

## 1. 導言
隨著標記語言的普及，Markdown 已成為撰寫技術文件、學術草稿的重要工具。然而，如何將 Markdown 檔案輸出為符合學術規範（如 A4 規格、精準頁邊距、自訂分頁）的 PDF 文件，仍然是個痛點。

傳統的解決方案主要分為兩類：
1. **純前端 Canvas 轉換**：使用 \`html2canvas\` 搭配 \`jsPDF\`。此方法會將網頁渲染為圖片再裁切分頁，容易造成文字在分頁處被截斷，且無法複製文字。
2. **後端編譯器轉換**：如使用 Pandoc 搭配 LaTeX。此方法排版極佳，但安裝體積龐大，且 CSS 樣式無法直接套用。

## 2. 系統架構
本系統設計基於兩大核心理念：即時預覽與排版自訂。

### 2.1 後端 Puppeteer 渲染機制
後端接收前端傳送的 HTML 片段與自訂 CSS，並在 Puppeteer 建立的 Chrome 實例中以 \\\`preferCSSPageSize\\\` 模式進行印表機渲染：

$$\\text{渲染效率} = f(\\text{記憶體管理}, \\text{分頁大小})$$

<div class="page-break"></div>

## 3. 實驗與評估
我們在 WSL-Ubuntu 22.04 環境下對不同文件長度進行了編譯效能測試。

| 文件頁數 | 轉換耗時 (ms) | 記憶體開銷 (MB) |
| :---: | :---: | :---: |
| 1 頁 | 180 | 45 |
| 5 頁 | 320 | 58 |
| 10 頁 | 640 | 82 |

## 4. 結論
本研究成功實現了一個輕量化的 Markdown 轉 PDF 工具，完美解決了分頁文字被裁切的業界難題。
`,
    defaultCss: `@page {
  size: A4;
  margin: 20mm 20mm 20mm 20mm;
}

body {
  font-family: 'Times New Roman', Times, 'Noto Serif TC', serif;
  color: #000000;
  font-size: 15px;
  line-height: 1.8;
  text-align: justify;
}

h1 {
  font-size: 22px;
  text-align: center;
  margin-top: 0;
  margin-bottom: 10px;
  font-weight: bold;
}

p {
  text-indent: 2em;
  margin-top: 0;
  margin-bottom: 12px;
}

/* 作者資訊樣式 - 使用 Class 避免誤置中正文 */
.author-info {
  text-align: center;
  margin-bottom: 25px;
  line-height: 1.5;
}

.author-info strong {
  font-size: 14px;
  font-weight: bold;
  display: block;
  margin-bottom: 2px;
}

.author-info em {
  font-size: 13px;
  color: #333333;
  font-style: italic;
}

/* 摘要樣式 */
.abstract {
  text-indent: 0 !important;
  font-size: 13.5px;
  line-height: 1.6;
  margin-bottom: 25px;
}

/* 摘要區塊標題 */
hr + h3 {
  text-align: center;
  margin-top: 15px;
  margin-bottom: 8px;
  font-size: 16px;
}

h2 {
  font-size: 18px;
  margin-top: 25px;
  margin-bottom: 10px;
  font-weight: bold;
  border-bottom: 1px solid #000000;
  padding-bottom: 3px;
}

h3 {
  font-size: 15px;
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: bold;
}

table {
  width: 80%;
  margin: 20px auto;
  border-collapse: collapse;
  font-size: 14px;
}

th, td {
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  padding: 8px;
  text-align: center;
}

th {
  font-weight: bold;
}
`
  },
  {
    id: 'modern',
    name: '簡約現代 (Modern)',
    defaultMarkdown: `# 雲端服務技術白皮書
**次世代微服務架構實踐**

---

<p class="lead">本白皮書介紹如何利用容器化技術與 Service Mesh 建構高可用性的微服務架構。</p>

---

## 核心優勢

### 🚀 彈性擴展 (Scalability)
利用 Kubernetes 實現基於 CPU/Memory 使用率的自動水平擴展 (HPA)，保證業務在高峰期的平穩運行。

### 🛡️ 高安全性 (Security)
預設開啟 mTLS，在服務間建立加密傳輸通道，防範中間人攻擊。

\`\`\`typescript
// 快速建立安全連線
const connection = await createSecureMesh({
  serviceId: "auth-service",
  encryption: "mTLS",
  timeout: 5000
});
\`\`\`

---

## 架構對比

1. **單體架構 (Monolith)**: 開發迅速，但後期維護困難，部署緩慢。
2. **微服務架構 (Microservices)**: 模組化開發，各自獨立部署，容錯性佳。
`,
    defaultCss: `@page {
  size: A4;
  margin: 15mm;
}

body {
  font-family: 'Outfit', 'Inter', system-ui, sans-serif;
  color: #2d3748;
  font-size: 15px;
  line-height: 1.6;
  background-color: #ffffff;
}

h1 {
  font-size: 32px;
  font-weight: 800;
  color: #1a202c;
  background: linear-gradient(135deg, #3182ce 0%, #319795 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 0;
  margin-bottom: 5px;
}

p {
  margin-top: 0;
  margin-bottom: 15px;
}

/* 引言樣式 - 使用 Class 避免誤傷正文 */
.lead {
  font-size: 16px;
  color: #718096;
  font-weight: 500;
}

hr {
  border: none;
  border-top: 2px solid #edf2f7;
  margin: 20px 0;
}

h2 {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin-top: 25px;
  margin-bottom: 15px;
}

h3 {
  font-size: 16px;
  font-weight: 600;
  color: #3182ce;
  margin-top: 15px;
  margin-bottom: 5px;
}

code {
  font-family: 'Fira Code', 'Courier New', monospace;
  background-color: #f7fafc;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13.5px;
  color: #e53e3e;
}

pre {
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 15px;
  overflow-x: auto;
}

pre code {
  color: #4a5568;
  background-color: transparent;
  padding: 0;
  font-size: 13px;
}
`
  },
  {
    id: 'plain',
    name: '乾淨文字 (Plain Markdown)',
    defaultMarkdown: `# 簡單文件標題

這是一個非常乾淨的 Plain Markdown 樣式。它僅提供基本的 HTML 排版樣式。

## 次標題

你可以在這裡寫任何內容：
- 項目一
- 項目二
- 項目三

以下是一張表格：

| 欄位 A | 欄位 B |
| :--- | :--- |
| 內容 1 | 內容 2 |
| 內容 3 | 內容 4 |

### 小標題
這只是一般的文件段落。
`,
    defaultCss: `@page {
  size: A4;
  margin: 15mm;
}

body {
  font-family: system-ui, sans-serif;
  color: #333;
  line-height: 1.6;
}

h1, h2, h3 {
  color: #111;
  font-weight: 600;
}

h1 {
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f5f5f5;
}
`
  }
];

export const TIFFANY_MINIMAL_TEMPLATE = {
  id: 'tiffany-minimal',
  name: '蒂芬妮簡約 (Tiffany Minimal)',
  defaultMarkdown: `# 簡約生活美學提案
**日常的留白與細緻平衡**

<p class="subtitle">企劃撰寫：美學生活研究室</p>

---

## 關於極簡主義
極簡主義並非單純的「減少」，而是在繁雜的世界中，**精準地保留最核心的價值**。透過空間留白與色調的調和，重新尋回生活的秩序感。

> 「美，是減去多餘的東西，只留下純粹的核心。」  
> — *美學大師*

---

## 莫蘭迪色彩學
莫蘭迪色系（Morandi Colors）源自義大利畫家喬治·莫蘭迪，其特點是飽和度低、帶有淡淡的灰色調。在簡約設計中，我們使用淺蒂芬妮綠作為點綴，並融合莫蘭迪色系，營造溫柔且沉靜的氛圍：

* **淺蒂芬妮綠**: 象徵清新與精緻，作為視覺引導的焦點色。
* **莫蘭迪灰藍**: 用於次要標題與線條，穩定整體視覺架構。
* **莫蘭迪沙褐**: 作為溫暖的底色或輔助點綴。

---

## 美學實踐步驟

### 1. 空間整理
清空不必要的雜物，讓光線在白牆與木質家具之間自由流動。

### 2. 色彩計畫
室內基調以白色與米色為主，透過少量的莫蘭迪灰色調家飾進行點綴。

---

## 提案時程規劃

| 階段 | 計畫內容 | 預計耗時 |
| :--- | :--- | :---: |
| 階段一 | 空間視覺靈感搜集 | 2 週 |
| 階段二 | 色彩搭配與材質挑選 | 1 週 |
| 階段三 | 軟裝進場與陳列優化 | 2 週 |
`,
  defaultCss: `@page {
  size: A4;
  margin: 20mm 15mm;
}

body {
  font-family: 'Outfit', 'Inter', 'Noto Sans TC', sans-serif;
  color: #3e4c4f; /* 莫蘭迪深灰綠 */
  font-size: 14.5px;
  line-height: 1.7;
  background-color: #ffffff;
}

/* 標題樣式 */
h1 {
  font-size: 26px;
  font-weight: 600;
  color: #2c383a;
  text-align: center;
  margin-top: 0;
  margin-bottom: 5px;
  letter-spacing: 1px;
}

.subtitle {
  text-align: center;
  color: #8fa3a6; /* 莫蘭迪淺灰 */
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 25px;
}

h2 {
  font-size: 17px;
  color: #4b6569; /* 莫蘭迪灰藍 */
  border-bottom: 2px solid #a3dedb; /* 淺蒂芬妮綠 */
  padding-bottom: 6px;
  margin-top: 30px;
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

h3 {
  font-size: 14.5px;
  color: #86dcd8; /* 淺蒂芬妮綠 */
  margin-top: 20px;
  margin-bottom: 6px;
  font-weight: 600;
}

/* 強調文字 */
strong {
  color: #4b6569;
  border-bottom: 1.5px solid #a3dedb;
}

/* 引用 blockquote */
blockquote {
  margin: 20px 0;
  padding: 12px 20px;
  background-color: #f4f7f7; /* 莫蘭迪淺綠灰 */
  border-left: 4px solid #86dcd8; /* 淺蒂芬妮綠 */
  border-radius: 0 8px 8px 0;
  color: #5b7376;
  font-style: normal;
}

blockquote p {
  margin: 0;
  font-size: 13.5px;
  text-align: left;
}

/* 表格樣式 */
table {
  width: 100%;
  margin: 20px 0;
  border-collapse: collapse;
  font-size: 13.5px;
}

th {
  background-color: #eaf6f5; /* 極淡的蒂芬妮綠 */
  color: #4b6569;
  font-weight: 600;
  border-bottom: 2px solid #86dcd8;
  padding: 10px;
}

td {
  padding: 10px;
  border-bottom: 1px solid #e5eded;
  color: #5b7376;
}

tr:hover {
  background-color: #f9fbfb;
}

/* 項目列表 */
ul {
  padding-left: 20px;
  margin-bottom: 15px;
}

li {
  margin-bottom: 6px;
}

hr {
  border: none;
  border-top: 1px solid #e5eded;
  margin: 25px 0;
}
`
};

PRESET_TEMPLATES.push(TIFFANY_MINIMAL_TEMPLATE);

export const TECH_BLUE_TEMPLATE: PresetTemplate = {
  id: 'tech-blue',
  name: '科技藍 (Tech Blue)',
  defaultMarkdown: `# 工業級 Managed 交換器建置指南
**網路解決方案與架構設計白皮書**

<div class="md-logo-mock">
  <!-- 科技藍 Logo SVG 模擬 -->
  <svg class="tech-blue-logo-svg" viewBox="0 0 120 30" width="120" height="30">
    <text x="0" y="22" font-family="'Outfit', 'Inter', 'Noto Sans TC', sans-serif" font-weight="900" font-size="22" fill="#0087A9">Tech Blue</text>
  </svg>
</div>

---

<div class="admonition info">
  <p class="admonition-title">系統簡介 (Overview)</p>
  <p>本系列交換器是最新一代工業級 Managed 乙太網路交換器。專為嚴苛環境設計，具備強大的環境適應能力、高層級防護防雷擊設計以及靈活的網路拓撲配置能力。</p>
</div>

---

## 1. 系統拓撲架構

在典型的智慧監控或工廠自動化場景中，交換器作為邊緣設備扮演著關鍵角色。

以下為 DHCP Relay 與 IP 分配流程的 Mermaid 序列圖：

\`\`\`mermaid
sequenceDiagram
  Client->>Switch: 1. DHCP Discover (VLAN 10)
  Switch->>Core_Switch: 2. DHCP Relay (Option 82)
  Core_Switch->>DHCP_Server: 3. Forward Request
  DHCP_Server-->>Core_Switch: 4. IP Lease Offer
  Core_Switch-->>Switch: 5. Relay Offer
  Switch-->>Client: 6. DHCP ACK
\`\`\`

我們也可以看其在實體網路拓撲中的連接關係：

\`\`\`mermaid
graph TD
  Internet((網際網路)) --> Firewall[核心防火牆]
  Firewall --> CoreSwitch[核心交換器]
  CoreSwitch --> EdgeSwitch[工業級邊緣交換器]
  EdgeSwitch --> IP_Cam[IP 監控攝影機]
  EdgeSwitch --> AP[Wi-Fi 6 AP]
\`\`\`

<div class="my-page-break-before"></div>

## 2. 產品規格與效能指標

以下為 10-Port Gigabit 工業級交換器的核心規格參數：

| 埠口配置 (Port Configuration) | 備份電源輸入 (Redundant Power) | 外殼防護等級 (Enclosure) | 傳輸效能 (Switching Capacity) |
| :--- | :--- | :--- | :--- |
| 8-Port 10/100/1000Base-T PoE + 2-Port SFP | 12-58V DC Dual Input (Redundant) | IP30 金屬外殼 (支援導軌/壁掛) | 20 Gbps 無阻塞線速轉發 |

---

## 3. CLI 常規 VLAN 設定範例

管理人員可以透過以下 CLI 指令，快速將 \`surveillance\` 攝影機網路劃分至獨立 VLAN 中，以確保安全性：

\`\`\`bash
# 進入全域配置模式
Switch# configure terminal
Switch(config)# vlan 10
Switch(config-vlan)# name Surveillance
Switch(config-vlan)# exit

# 配置埠口為 Access 模式並加入 VLAN 10
Switch(config)# interface gigabitethernet 1/0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# end
\`\`\`

---

## 4. PDF 導出與列印配置

本模板已整合列印最佳化樣式。在進行 PDF 渲染時：
1. 所有程式碼區塊與表格已設定為 \`page-break-inside: avoid\`，防止內容跨頁斷裂。
2. 可以在需要強行換頁的地方加入 \`<div class="my-page-break-before"></div>\`，即可在該處進行精準分頁。
3. 頁面邊距設定為預設的 \`4rem\`。
`,
  defaultCss: `@page {
  size: A4;
  margin: 4rem;
}

body {
  font-family: 'Inter', 'Noto Sans TC', system-ui, sans-serif;
  color: #333333;
  line-height: 1.6;
  background-color: #ffffff;
}

/* 專屬 Logo 容器樣式 */
.md-logo-mock {
  margin: 1.5rem 0;
  display: flex;
  justify-content: flex-start;
}

.tech-blue-logo-svg text {
  font-family: 'Outfit', 'Inter', 'Noto Sans TC', sans-serif;
  font-weight: 900;
}

/* 標題與下邊距微調 (依據使用者 extra.css) */
.md-typeset h1, .md-typeset h2, .md-typeset h3, .md-typeset h4 {
  margin-bottom: -0.5rem;
}

h1 {
  font-size: 26px;
  color: #0087A9; /* 科技藍主色 */
  border-bottom: 2px solid #0087A9;
  padding-bottom: 10px;
  margin-top: 0;
}

h2 {
  font-size: 18px;
  color: #006D8A;
  border-left: 4px solid #0087A9;
  padding-left: 10px;
  margin-top: 2rem;
}

h3 {
  font-size: 15px;
  color: #00536B;
  margin-top: 1.5rem;
}

/* 表格樣式 (整合使用者 extra.css) */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 13.5px;
}

th {
  background-color: #0087A9;
  color: #ffffff;
  font-weight: 600;
}

.md-typeset table:not([class]) th, .md-typeset table:not([class]) td {
  padding: 5px 10px;
  min-width: 3rem;
  border: 1px solid #e2e8f0;
}

tr:nth-child(even) {
  background-color: #f8fafc;
}

tr:hover {
  background-color: #f1f5f9;
}

/* Admonition (Material 提示框樣式) */
.admonition {
  margin: 1.5rem 0;
  padding: 0.8rem 1.2rem;
  border-left: 0.25rem solid #0087A9;
  border-radius: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  background-color: #f8fafc;
}

.admonition-title {
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  color: #0087A9;
  font-size: 14px;
}

.admonition.info {
  border-left-color: #0087A9;
  background-color: #f0f9ff;
}

.admonition.info .admonition-title {
  color: #0087A9;
}

/* 程式碼與 CLI 區塊樣式 */
code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
  background-color: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  color: #0087A9;
}

pre {
  background-color: #1e293b;
  color: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

pre code {
  background-color: transparent;
  color: inherit;
  padding: 0;
  font-size: 12.5px;
}

/* 列表樣式 */
ul, ol {
  padding-left: 20px;
  margin-bottom: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
}

hr {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 2rem 0;
}

/* 列印與分頁微調 (依據使用者 extra.css) */
@media print {
  table, code, pre {
    page-break-inside: avoid;
  }
  .my-page-break-before {
    page-break-before: always;
  }
  .my-page-break-after {
    page-break-after: always;
  }
}

/* Tweaks for Logo (依據使用者 extra.css) */
.md-header__button.md-logo img {
  filter: invert(1);
  width: 5rem;
  height: auto;
}

/* Tweaks for mermaid sequence diagrams (依據使用者 extra.css) */
.messageText {
  stroke: none !important;
  font-weight: bold !important;
}
`
};

PRESET_TEMPLATES.push(TECH_BLUE_TEMPLATE);
