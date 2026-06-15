import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  FileText, 
  Code, 
  Download, 
  Sun, 
  Moon, 
  RefreshCw, 
  Eye, 
  Check, 
  AlertCircle,
  FileCode2,
  FileDown
} from 'lucide-react';
import { PRESET_TEMPLATES } from './templates';
import { invoke } from '@tauri-apps/api/core';
import { save } from '@tauri-apps/plugin-dialog';

function App() {
  // 1. 初始化狀態 - 預設載入 Resume 模板
  const defaultTemplate = PRESET_TEMPLATES[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(defaultTemplate.id);
  const [markdown, setMarkdown] = useState<string>(defaultTemplate.defaultMarkdown);
  const [css, setCss] = useState<string>(defaultTemplate.defaultCss);
  
  const [activeTab, setActiveTab] = useState<'markdown' | 'css'>('markdown');
  const [previewMode, setPreviewMode] = useState<'html' | 'pdf'>('html'); // 'html' (即時) | 'pdf' (真實分頁)
  const [isAutoPreview, setIsAutoPreview] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const debounceTimerRef = useRef<any>(null);

  // 雙向滾動同步所需的 refs 與 flags
  const editorRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isScrollingFromEditor = useRef<boolean>(false);
  const isScrollingFromIframe = useRef<boolean>(false);
  const editorScrollTimeout = useRef<any>(null);
  const iframeScrollTimeout = useRef<any>(null);

  // 監聽 Monaco 編輯器掛載與滾動
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    editor.onDidScrollChange(() => {
      // 如果這次滾動是由 iframe 滾動引起的，忽略它以避免 Feedback Loop
      if (isScrollingFromIframe.current) return;

      isScrollingFromEditor.current = true;
      if (editorScrollTimeout.current) clearTimeout(editorScrollTimeout.current);
      editorScrollTimeout.current = setTimeout(() => {
        isScrollingFromEditor.current = false;
      }, 150);

      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          const html = doc.documentElement;
          
          const scrollTop = editor.getScrollTop();
          const scrollHeight = editor.getScrollHeight();
          const clientHeight = editor.getLayoutInfo().height;
          const maxEditorScroll = scrollHeight - clientHeight;
          const percentage = maxEditorScroll > 0 ? scrollTop / maxEditorScroll : 0;
          
          const maxIframeScroll = html.scrollHeight - html.clientHeight;
          iframe.contentWindow.scrollTo(0, maxIframeScroll * percentage);
        } catch (err) {
          console.warn("Monaco to Iframe scroll sync failed:", err);
        }
      }
    });
  };

  // 每次 Iframe 載入完成時，同步一次當前編輯器的滾動位置，防止位置錯亂
  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      try {
        const editor = editorRef.current;
        if (editor) {
          const scrollTop = editor.getScrollTop();
          const scrollHeight = editor.getScrollHeight();
          const clientHeight = editor.getLayoutInfo().height;
          const maxEditorScroll = scrollHeight - clientHeight;
          const percentage = maxEditorScroll > 0 ? scrollTop / maxEditorScroll : 0;
          
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          const html = doc.documentElement;
          const maxIframeScroll = html.scrollHeight - html.clientHeight;
          iframe.contentWindow.scrollTo(0, maxIframeScroll * percentage);
        }
      } catch (e) {
        console.warn("Failed to sync scroll on iframe load:", e);
      }
    }
  };

  // 雙向滾動同步：在 window 上掛載接收 iframe 滾動回報的函數
  useEffect(() => {
    (window as any).syncIframeScroll = (percentage: number) => {
      // 避免死循環
      if (isScrollingFromEditor.current) return;

      isScrollingFromIframe.current = true;
      if (iframeScrollTimeout.current) clearTimeout(iframeScrollTimeout.current);
      iframeScrollTimeout.current = setTimeout(() => {
        isScrollingFromIframe.current = false;
      }, 150);

      const editor = editorRef.current;
      if (editor) {
        try {
          const scrollHeight = editor.getScrollHeight();
          const clientHeight = editor.getLayoutInfo().height;
          const targetScrollTop = (scrollHeight - clientHeight) * percentage;
          editor.setScrollTop(targetScrollTop);
        } catch (e) {
          console.warn("Sync scroll to Monaco failed:", e);
        }
      }
    };

    return () => {
      delete (window as any).syncIframeScroll;
    };
  }, []);

  // 2. 監聽主題變更
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 3. 即時將 Markdown 編譯成 HTML (用於前端即時 HTML 預覽，調用 Rust 後端以處理相對路徑圖片)
  useEffect(() => {
    const parseMd = async () => {
      if (!markdown.trim()) {
        setHtmlContent('');
        return;
      }
      try {
        const parsed = await invoke<string>('parse_markdown', { markdown });
        setHtmlContent(parsed);
      } catch (err) {
        console.error('Markdown 解析錯誤:', err);
      }
    };
    parseMd();
  }, [markdown]);

  // 4. 當模板變更時，重設編輯器內容
  const handleTemplateChange = (templateId: string) => {
    const template = PRESET_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplateId(templateId);
      setCss(template.defaultCss);
    }
  };

  // 5. 重置為目前模板的預設值
  const handleResetToTemplate = () => {
    const template = PRESET_TEMPLATES.find(t => t.id === selectedTemplateId);
    if (template) {
      setMarkdown(template.defaultMarkdown);
      setCss(template.defaultCss);
    }
  };

  // 6. 核心 PDF 渲染 API 呼叫 (透過 Tauri IPC 呼叫 Rust 後端)
  const renderPDF = async (currentMd: string, currentCss: string, showLoadingState = true): Promise<string | null> => {
    if (!currentMd.trim()) {
      setStatus('idle');
      return null;
    }
    
    if (showLoadingState) {
      setIsLoading(true);
      setStatus('loading');
    }
    setErrorMsg(null);
    
    try {
      const base64Data = await invoke<string>('generate_pdf', {
        markdown: currentMd,
        css: currentCss
      });
      
      // 將 base64 轉為 Blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
      
      // 釋放舊的 Blob URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      
      const newPdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(newPdfUrl);
      setPdfBase64(base64Data);
      setStatus('success');
      return base64Data;
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || String(err) || '渲染 PDF 失敗');
      setStatus('error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 7. 防抖 (Debounce) 機制 - 只在自動預覽開啟，且有變更時觸發
  // 只有在 PDF 模式下打字時才自動觸發 PDF 渲染，避免在 HTML 模式下默默渲染導致編輯卡頓
  useEffect(() => {
    if (!isAutoPreview) return;
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      // 只有在 PDF 預覽模式下才進行背景 PDF 生成與預覽更新
      if (previewMode === 'pdf') {
        renderPDF(markdown, css, true);
      }
    }, 800);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [markdown, css, isAutoPreview, previewMode]);

  // 當使用者手動切換到 PDF 模式時，如果尚未生成 PDF，自動觸發一次渲染
  useEffect(() => {
    if (previewMode === 'pdf' && !pdfUrl && !isLoading) {
      renderPDF(markdown, css, true);
    }
  }, [previewMode, pdfUrl]);

  // 組件卸載時釋放 Blob URL
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // 8. 導出 PDF 檔案（透過 Tauri dialog 原生存檔對話框）
  const handleDownload = async () => {
    let currentBase64 = pdfBase64;
    
    // 下載前先確保拿的是最新的，如果防抖還沒跑完或尚未生成，就直接手動跑一次
    if (!currentBase64 || status === 'loading') {
      currentBase64 = await renderPDF(markdown, css, true);
    }
    
    if (currentBase64) {
      const randomNum = Math.floor(10000000 + Math.random() * 90000000); // 8位隨機數
      const defaultFilename = `${randomNum}.pdf`;
      
      try {
        const filePath = await save({
          filters: [{
            name: 'PDF 文件',
            extensions: ['pdf']
          }],
          defaultPath: defaultFilename
        });
        
        if (filePath) {
          setIsLoading(true);
          await invoke('save_pdf_to_path', {
            base64Data: currentBase64,
            filePath: filePath
          });
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err?.message || String(err) || '導出 PDF 失敗');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 9. 組裝 HTML 即時預覽的 Iframe srcdoc 內容
  // 這將 CSS 限制在 iframe 中，不影響整個應用的 UI，且更新時不丟失滾動位置
  const iframeSrcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        *, *::before, *::after {
          box-sizing: border-box;
        }

        html {
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
        }

        ::-webkit-scrollbar {
          display: none !important;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          line-height: 1.6;
          color: #333333;
          background-color: #ffffff;
        }

        @media screen {
          html {
            padding: 24px 0;
          }
          body {
            max-width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 20mm;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
            border-radius: 6px;
          }
        }

        @media print {
          body {
            padding: 0;
            margin: 0;
          }
        }
        
        img {
          max-width: 100% !important;
          height: auto !important;
          box-sizing: border-box;
          display: block;
        }
        
        .markdown-body {
          box-sizing: border-box;
          width: 100%;
        }
        
        pre, table {
          max-width: 100%;
          overflow-x: auto;
        }
        
        /* 預設的引用樣式，避免未設定時顯示異常 */
        blockquote {
          margin: 12px 0;
          padding: 8px 16px;
          border-left: 4px solid #cbd5e1;
          color: #64748b;
          background-color: #f8fafc;
        }
        
        blockquote p {
          margin: 0;
          text-align: left;
        }
        
        /* 預設 code 與 pre 程式碼樣式 */
        code {
          font-family: 'Fira Code', 'Courier New', monospace;
          background-color: #f1f5f9;
          color: #e11d48;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
        }
        pre {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 12px 0;
        }
        pre code {
          background-color: transparent;
          color: #334155;
          padding: 0;
          border-radius: 0;
          font-size: 13px;
        }
        
        /* 模擬分頁符號 */
        .page-break {
          border-top: 1px dashed #38bdf8;
          margin: 40px 0;
          position: relative;
          page-break-after: always;
          break-after: page;
        }
        
        .page-break::before {
          content: '✂️ PAGE BREAK (分頁處)';
          position: absolute;
          top: -10px;
          left: 20px;
          background: #ffffff;
          padding: 0 8px;
          font-size: 10px;
          color: #38bdf8;
          font-weight: 600;
          letter-spacing: 1px;
        }
        
        ${css}
      </style>
    </head>
    <body>
      <div class="markdown-body">
        ${htmlContent}
      </div>
      <script>
        // 監聽滾動事件，即時存入 localStorage 並同步到父視窗
        window.addEventListener('scroll', () => {
          console.log("[DEBUG] Iframe window scrolled. Y:", window.scrollY);
          localStorage.setItem('html_preview_scroll', window.scrollY);
          
          if (window.parent && window.parent.syncIframeScroll) {
            const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const percentage = maxScroll > 0 ? window.scrollY / maxScroll : 0;
            console.log("[DEBUG] Iframe reporting scroll to parent window. Percentage:", percentage);
            window.parent.syncIframeScroll(percentage);
          } else {
            console.warn("[DEBUG] Iframe sync failed: window.parent.syncIframeScroll is undefined", window.parent);
          }
        });
        
        // 載入完成後還原滾動高度
        window.addEventListener('DOMContentLoaded', () => {
          console.log("[DEBUG] Iframe DOMContentLoaded triggered.");
          const saved = localStorage.getItem('html_preview_scroll');
          if (saved) {
            console.log("[DEBUG] Iframe restoring scroll position to:", saved);
            window.scrollTo(0, parseInt(saved, 10));
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <>
      {/* 頂部導航欄 */}
      <header className="app-header">
        <div className="logo-section">
          <span className="logo-icon">
            <FileCode2 size={26} strokeWidth={2.5} />
          </span>
          <h1>Markdown to PDF</h1>
        </div>
        
        <div className="controls-section">
          {/* 模板選擇 */}
          <select 
            className="select-theme-btn" 
            value={selectedTemplateId} 
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            {PRESET_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* 重置按鈕 */}
          <button 
            className="action-btn" 
            onClick={handleResetToTemplate}
            title="還原為當前模板的預設內容與樣式"
          >
            <RefreshCw size={15} />
            重置樣式
          </button>

          {/* 主題切換 */}
          <button 
            className="icon-btn" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? '切換為淺色模式' : '切換為深色模式'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* 主工作區 */}
      <div className="app-container">
        {/* 左側：編輯器面板 */}
        <section className="editor-panel">
          <div className="panel-header">
            {/* 編輯器分頁標籤 */}
            <div className="tabs-container">
              <button 
                className={`tab-btn ${activeTab === 'markdown' ? 'active' : ''}`}
                onClick={() => setActiveTab('markdown')}
              >
                <FileText size={16} />
                Markdown 內容
              </button>
              <button 
                className={`tab-btn ${activeTab === 'css' ? 'active' : ''}`}
                onClick={() => setActiveTab('css')}
              >
                <Code size={16} />
                自訂 CSS
              </button>
            </div>
            
            {/* 狀態 Badge */}
            <div className={`status-badge ${status}`}>
              {status === 'loading' && <><RefreshCw size={12} className="spin" /> 渲染中...</>}
              {status === 'success' && <><Check size={12} /> 渲染成功</>}
              {status === 'error' && <><AlertCircle size={12} /> 渲染失敗</>}
              {status === 'idle' && '已就緒'}
            </div>
          </div>

          {/* 編輯器區塊 */}
          <div className="editor-wrapper">
            {activeTab === 'markdown' ? (
              <Editor
                height="100%"
                defaultLanguage="markdown"
                language="markdown"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={markdown}
                onChange={(val) => setMarkdown(val || '')}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                  padding: { top: 12, bottom: 12 }
                }}
              />
            ) : (
              <Editor
                height="100%"
                defaultLanguage="css"
                language="css"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={css}
                onChange={(val) => setCss(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                  padding: { top: 12, bottom: 12 }
                }}
              />
            )}
          </div>
        </section>

        {/* 右側：預覽面板 */}
        <section className="preview-panel">
          <div className="panel-header">
            {/* 預覽模式切換 Tab */}
            <div className="tabs-container">
              <button 
                className={`tab-btn ${previewMode === 'html' ? 'active' : ''}`}
                onClick={() => setPreviewMode('html')}
                title="純 HTML 渲染，極速更新且不重置滾動條"
              >
                <FileText size={15} />
                HTML 即時預覽
              </button>
              <button 
                className={`tab-btn ${previewMode === 'pdf' ? 'active' : ''}`}
                onClick={() => setPreviewMode('pdf')}
                title="真實 PDF 列印格式預覽，可見精確分頁"
              >
                <FileDown size={15} />
                PDF 真實分頁
              </button>
            </div>

            {/* 下載控制項 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* 下載按鈕 */}
              <button 
                className="action-btn primary" 
                onClick={handleDownload}
                title="下載當前渲染的 PDF 檔案"
              >
                <Download size={15} />
                下載 PDF
              </button>
            </div>
          </div>

          {/* 控制細項工具列 */}
          <div className="panel-header" style={{ height: '40px', backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* 自動預覽 Toggle */}
              <div 
                className={`toggle-container ${isAutoPreview ? 'active' : ''}`}
                onClick={() => setIsAutoPreview(!isAutoPreview)}
                title="打字時是否即時自動更新預覽"
              >
                <div className="toggle-switch"></div>
                <span>即時自動更新</span>
              </div>

              {/* 手動更新按鈕 */}
              {!isAutoPreview && (
                <button 
                  className="action-btn" 
                  onClick={() => renderPDF(markdown, css, true)}
                  disabled={isLoading}
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                >
                  <Eye size={12} />
                  手動更新預覽
                </button>
              )}
            </div>
            
            {previewMode === 'html' && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                ⚡ HTML 模式：打字零延遲，完美保留滾動位置
              </span>
            )}
            {previewMode === 'pdf' && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                📄 PDF 模式：呼叫後端 Puppeteer 精準渲染
              </span>
            )}
          </div>

          {/* 預覽主渲染區 */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {previewMode === 'html' ? (
              /* HTML 即時預覽模式 */
              <div className="pdf-container" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <iframe 
                  ref={iframeRef}
                  onLoad={handleIframeLoad}
                  srcDoc={iframeSrcDoc} 
                  className="pdf-iframe"
                  style={{ backgroundColor: '#ffffff', width: '100%', height: '100%' }}
                  title="HTML Live Preview"
                />
              </div>
            ) : (
              /* PDF 真實分頁預覽模式 */
              <>
                {/* PDF 載入時的毛玻璃 Overlay - 防止畫面全部轉黑 */}
                {isLoading && pdfUrl && (
                  <div className="loading-overlay">
                    <div className="loading-spinner-container">
                      <RefreshCw size={24} className="spin" style={{ color: 'var(--accent)' }} />
                      <span>正在以 Puppeteer 重新編譯 PDF...</span>
                    </div>
                  </div>
                )}

                {/* 錯誤提示 */}
                {errorMsg ? (
                  <div className="preview-empty-state" style={{ color: '#ef4444' }}>
                    <AlertCircle size={48} />
                    <h2>PDF 渲染失敗</h2>
                    <p style={{ maxWidth: '400px', fontSize: '14px', marginTop: '8px' }}>
                      {errorMsg}
                    </p>
                    <button 
                      className="action-btn" 
                      onClick={() => renderPDF(markdown, css, true)}
                      style={{ marginTop: '16px' }}
                    >
                      <RefreshCw size={14} /> 重新嘗試
                    </button>
                  </div>
                ) : isLoading && !pdfUrl ? (
                  /* 首次載入骨架屏 */
                  <div className="skeleton-loader">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                    <div className="skeleton-image" style={{ marginTop: '20px' }}></div>
                  </div>
                ) : pdfUrl ? (
                  /* PDF 內嵌 iframe */
                  <div className="pdf-container">
                    <iframe 
                      src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`} 
                      className="pdf-iframe"
                      title="PDF Live Preview"
                    />
                  </div>
                ) : (
                  /* 初始空白狀態 */
                  <div className="preview-empty-state">
                    <FileDown size={48} />
                    <h2>尚無 PDF 數據</h2>
                    <p>請點擊手動更新或確認後端服務已啟動</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
