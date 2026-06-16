import { useState, useEffect, useRef } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
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
  FileDown,
  FolderOpen,
  Save,
  GitCompare,
  FilePlus,
  Trash2
} from 'lucide-react';
import { PRESET_TEMPLATES } from './templates';
import { invoke } from '@tauri-apps/api/core';
import { open, save, ask } from '@tauri-apps/plugin-dialog';

function App() {
  // 1. 初始化狀態 - 預設載入 Resume 模板
  const defaultTemplate = PRESET_TEMPLATES[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(defaultTemplate.id);
  const [markdown, setMarkdown] = useState<string>(defaultTemplate.defaultMarkdown);
  const [originalMarkdown, setOriginalMarkdown] = useState<string>(defaultTemplate.defaultMarkdown);
  const [css, setCss] = useState<string>(defaultTemplate.defaultCss);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  
  const [leftWidth, setLeftWidth] = useState<number>(50); // 左側寬度百分比
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [customTemplates, setCustomTemplates] = useState<any[]>(() => {
    const saved = localStorage.getItem('custom_templates');
    return saved ? JSON.parse(saved) : [];
  });

  // 儲存為自訂範本
  const handleSaveAsCustomTemplate = () => {
    const name = window.prompt('請輸入自訂範本的名稱：', '我的自訂範本');
    if (name === null) return; // 使用者按取消
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      alert('範本名稱不能為空！');
      return;
    }

    const newTemplate = {
      id: `custom_${Date.now()}`,
      name: `[自訂] ${trimmedName}`,
      defaultMarkdown: markdown,
      defaultCss: css
    };

    const updated = [...customTemplates, newTemplate];
    setCustomTemplates(updated);
    localStorage.setItem('custom_templates', JSON.stringify(updated));
    setSelectedTemplateId(newTemplate.id);
    setIsDirty(false);
  };

  // 刪除自訂範本
  const handleDeleteCustomTemplate = async () => {
    const activeTemplate = customTemplates.find(t => t.id === selectedTemplateId);
    if (!activeTemplate) return;

    try {
      const confirmed = await ask(
        `確定要刪除自訂範本「${activeTemplate.name}」嗎？`,
        { title: '刪除自訂範本？', kind: 'warning' }
      );
      if (!confirmed) return;
    } catch (e) {
      if (!window.confirm(`確定要刪除自訂範本「${activeTemplate.name}」嗎？`)) return;
    }

    const updated = customTemplates.filter(t => t.id !== selectedTemplateId);
    setCustomTemplates(updated);
    localStorage.setItem('custom_templates', JSON.stringify(updated));
    
    // 切換回預設 Resume 範本
    setSelectedTemplateId(defaultTemplate.id);
    setMarkdown(defaultTemplate.defaultMarkdown);
    setOriginalMarkdown(defaultTemplate.defaultMarkdown);
    setCss(defaultTemplate.defaultCss);
    setCurrentFilePath(null);
    setIsDirty(false);
  };

  // 處理水平拖曳調整視窗比例
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      if (containerWidth === 0) return;
      
      const newWidthPercent = (e.clientX / containerWidth) * 100;
      // 限制在 20% ~ 80% 之間
      const boundedWidth = Math.max(20, Math.min(80, newWidthPercent));
      setLeftWidth(boundedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const [activeTab, setActiveTab] = useState<'markdown' | 'css' | 'compare'>('markdown');
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
  const diffEditorRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isScrollingFromEditor = useRef<boolean>(false);
  const isScrollingFromIframe = useRef<boolean>(false);
  const editorScrollTimeout = useRef<any>(null);
  const iframeScrollTimeout = useRef<any>(null);

  // 共享的滾動同步邏輯綁定
  const setupScrollSync = (editorInstance: any) => {
    editorInstance.onDidScrollChange(() => {
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
          
          const scrollTop = editorInstance.getScrollTop();
          const scrollHeight = editorInstance.getScrollHeight();
          const clientHeight = editorInstance.getLayoutInfo().height;
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

  // 監聽 Monaco 編輯器掛載與滾動
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    setupScrollSync(editor);
  };

  // 監聽 Monaco DiffEditor 掛載與滾動、變更
  const handleDiffEditorDidMount = (editor: any) => {
    diffEditorRef.current = editor;
    const modifiedEditor = editor.getModifiedEditor();
    editorRef.current = modifiedEditor;

    setupScrollSync(modifiedEditor);

    modifiedEditor.onDidChangeModelContent(() => {
      const val = modifiedEditor.getValue();
      setMarkdown(val || '');
      setIsDirty(true);
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

  // 取得基準目錄
  const getBaseDir = (filePath: string | null): string | undefined => {
    if (!filePath) return undefined;
    const lastSlash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
    if (lastSlash === -1) return undefined;
    return filePath.substring(0, lastSlash);
  };

  // 放棄變更確認
  const confirmDiscard = async (): Promise<boolean> => {
    if (!isDirty) return true;
    try {
      const confirmed = await ask(
        '當前檔案有未儲存的變更，是否放棄這些變更？',
        { title: '放棄變更？', kind: 'warning' }
      );
      return confirmed;
    } catch (e) {
      return window.confirm('當前檔案有未儲存的變更，是否放棄這些變更？');
    }
  };

  // 開啟檔案
  const handleOpenFile = async () => {
    if (!(await confirmDiscard())) return;

    try {
      const selected = await open({
        filters: [{
          name: 'Markdown 檔案',
          extensions: ['md', 'markdown']
        }]
      });

      if (selected && typeof selected === 'string') {
        setIsLoading(true);
        const content = await invoke<string>('read_text_file', { filePath: selected });
        setMarkdown(content);
        setOriginalMarkdown(content);
        setCurrentFilePath(selected);
        setIsDirty(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || String(err) || '開啟檔案失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 儲存檔案
  const handleSaveFile = async () => {
    if (!currentFilePath) {
      await handleSaveFileAs();
      return;
    }

    try {
      setIsLoading(true);
      await invoke('write_text_file', {
        filePath: currentFilePath,
        content: markdown
      });
      setOriginalMarkdown(markdown);
      setIsDirty(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || String(err) || '儲存檔案失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 另存新檔
  const handleSaveFileAs = async () => {
    try {
      const defaultFilename = currentFilePath 
        ? currentFilePath.substring(Math.max(currentFilePath.lastIndexOf('/'), currentFilePath.lastIndexOf('\\')) + 1)
        : 'untitled.md';

      const filePath = await save({
        filters: [{
          name: 'Markdown 檔案',
          extensions: ['md', 'markdown']
        }],
        defaultPath: defaultFilename
      });

      if (filePath) {
        setIsLoading(true);
        await invoke('write_text_file', {
          filePath: filePath,
          content: markdown
        });
        setOriginalMarkdown(markdown);
        setCurrentFilePath(filePath);
        setIsDirty(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || String(err) || '另存新檔失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. 即時將 Markdown 編譯成 HTML (用於前端即時 HTML 預覽，調用 Rust 後端以處理相對路徑圖片)
  useEffect(() => {
    const parseMd = async () => {
      if (!markdown.trim()) {
        setHtmlContent('');
        return;
      }
      try {
        const parsed = await invoke<string>('parse_markdown', { 
          markdown,
          baseDir: getBaseDir(currentFilePath)
        });
        setHtmlContent(parsed);
      } catch (err) {
        console.error('Markdown 解析錯誤:', err);
      }
    };
    parseMd();
  }, [markdown, currentFilePath]);

  // 4. 當模板變更時，重設編輯器內容
  const handleTemplateChange = async (templateId: string) => {
    if (!(await confirmDiscard())) return;
    const allTemplates = [...PRESET_TEMPLATES, ...customTemplates];
    const template = allTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplateId(templateId);
      setMarkdown(template.defaultMarkdown);
      setOriginalMarkdown(template.defaultMarkdown);
      setCss(template.defaultCss);
      setCurrentFilePath(null);
      setIsDirty(false);
    }
  };

  // 5. 重置為目前模板的預設值
  const handleResetToTemplate = async () => {
    if (!(await confirmDiscard())) return;
    const allTemplates = [...PRESET_TEMPLATES, ...customTemplates];
    const template = allTemplates.find(t => t.id === selectedTemplateId);
    if (template) {
      setMarkdown(template.defaultMarkdown);
      setOriginalMarkdown(template.defaultMarkdown);
      setCss(template.defaultCss);
      setCurrentFilePath(null);
      setIsDirty(false);
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
        css: currentCss,
        baseDir: getBaseDir(currentFilePath)
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

  // 8.1 註冊鍵盤快捷鍵 (Ctrl+O, Ctrl+S, Ctrl+Shift+S)
  const keyActionsRef = useRef({ handleOpenFile, handleSaveFile, handleSaveFileAs });
  useEffect(() => {
    keyActionsRef.current = { handleOpenFile, handleSaveFile, handleSaveFileAs };
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      if (isCmdOrCtrl) {
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          if (e.shiftKey) {
            keyActionsRef.current.handleSaveFileAs();
          } else {
            keyActionsRef.current.handleSaveFile();
          }
        } else if (e.key.toLowerCase() === 'o') {
          e.preventDefault();
          keyActionsRef.current.handleOpenFile();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
      <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
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
        
        // 載入完成後還原滾動高度與執行 Mermaid 渲染
        window.addEventListener('DOMContentLoaded', () => {
          console.log("[DEBUG] Iframe DOMContentLoaded triggered.");
          const saved = localStorage.getItem('html_preview_scroll');
          if (saved) {
            console.log("[DEBUG] Iframe restoring scroll position to:", saved);
            window.scrollTo(0, parseInt(saved, 10));
          }

          // 執行 Mermaid 渲染
          window.mermaidRendered = false;
          const codeNodes = document.querySelectorAll("pre code.language-mermaid");
          console.log("[DEBUG] Found language-mermaid nodes count:", codeNodes.length);
          if (codeNodes.length > 0) {
            if (typeof mermaid === 'undefined') {
              console.error("[DEBUG] Mermaid object is undefined inside iframe.");
              // 在網頁上建立顯眼的提示，告訴使用者 CDN 載入失敗
              codeNodes.forEach((node) => {
                const preNode = node.parentNode;
                const errDiv = document.createElement("div");
                errDiv.style.color = "orange";
                errDiv.style.border = "1px solid orange";
                errDiv.style.padding = "10px";
                errDiv.style.margin = "10px 0";
                errDiv.textContent = "警告: 檢測到 Mermaid 代碼塊，但 Mermaid.js 庫未加載（請檢查網路連線或 CDN 存取）";
                preNode.parentNode.insertBefore(errDiv, preNode);
              });
              window.mermaidRendered = true;
              return;
            }
            codeNodes.forEach((codeNode) => {
              const preNode = codeNode.parentNode;
              const div = document.createElement("pre");
              div.className = "mermaid";
              div.style.whiteSpace = "pre";
              div.style.backgroundColor = "transparent";
              div.style.border = "none";
              div.style.padding = "0";
              div.style.margin = "20px 0";
              div.style.display = "flex";
              div.style.justifyContent = "center";
              div.style.alignItems = "center";
              div.style.width = "100%";
              div.textContent = codeNode.textContent;
              preNode.parentNode.replaceChild(div, preNode);
            });
            try {
              console.log("[DEBUG] Initializing and running mermaid...");
              
              // 1. 動態讀取當前套用範本的 CSS 樣式，實現完美配色自適應
              let primaryTextColor = "#333333";
              let primaryBorderColor = "#cbd5e1";
              let lineColor = "#64748b";
              let fontFamily = "system-ui, -apple-system, sans-serif";

              try {
                const bodyStyle = window.getComputedStyle(document.body);
                primaryTextColor = bodyStyle.color || primaryTextColor;
                fontFamily = bodyStyle.fontFamily || fontFamily;

                const h2 = document.querySelector("h2");
                if (h2) {
                  const h2Style = window.getComputedStyle(h2);
                  const h2Color = h2Style.color;
                  const borderBottom = h2Style.borderBottomColor;
                  
                  // 優先使用 h2 的 border-bottom 顏色（例如 Tiffany 的蒂芬妮綠），否則使用 h2 文字色
                  if (h2Style.borderBottomWidth !== "0px" && borderBottom && borderBottom !== "rgba(0, 0, 0, 0)" && borderBottom !== "transparent") {
                    primaryBorderColor = borderBottom;
                  } else {
                    primaryBorderColor = h2Color || primaryBorderColor;
                  }
                  lineColor = h2Color || lineColor;
                } else {
                  const h1 = document.querySelector("h1") || document.querySelector("h3");
                  if (h1) {
                    const h1Style = window.getComputedStyle(h1);
                    primaryBorderColor = h1Style.color || primaryBorderColor;
                    lineColor = h1Style.color || lineColor;
                  }
                }
              } catch (e) {
                console.warn("[DEBUG] Failed to compute theme styles, using default colors:", e);
              }

              mermaid.initialize({
                startOnLoad: false,
                theme: 'base',
                themeVariables: {
                  fontFamily: fontFamily,
                  fontSize: '13px',
                  primaryColor: '#ffffff',
                  primaryTextColor: primaryTextColor,
                  primaryBorderColor: primaryBorderColor,
                  lineColor: lineColor,
                  secondaryColor: '#f8fafc',
                  tertiaryColor: '#f8fafc',
                  mainBkg: '#ffffff',
                  nodeBorder: primaryBorderColor,
                  actorBkg: '#ffffff',
                  actorBorder: primaryBorderColor,
                  actorTextColor: primaryTextColor,
                  signalColor: lineColor,
                  signalTextColor: primaryTextColor,
                  labelBoxBkgColor: '#ffffff',
                  labelBoxBorderColor: primaryBorderColor,
                  labelTextColor: primaryTextColor,
                  loopLimitEvt: '#ffffff',
                  noteBkgColor: '#ffffff',
                  noteBorderColor: primaryBorderColor
                }
              });
              mermaid.run({ querySelector: '.mermaid' })
                .then(() => {
                  console.log("[DEBUG] Mermaid render succeeded.");
                  window.mermaidRendered = true;
                })
                .catch((err) => {
                  console.error("[DEBUG] Mermaid run promise failed:", err);
                  document.querySelectorAll(".mermaid").forEach((el) => {
                    el.style.color = "red";
                    el.style.border = "1px solid red";
                    el.style.padding = "10px";
                    el.style.margin = "10px 0";
                    el.textContent = "Mermaid 渲染失敗: " + err;
                  });
                  window.mermaidRendered = true;
                });
            } catch (e) {
              console.error("[DEBUG] Mermaid initialization sync exception:", e);
              window.mermaidRendered = true;
            }
          } else {
            window.mermaidRendered = true;
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ margin: 0, fontSize: '15px', lineHeight: '1.2' }}>Markdown to PDF</h1>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              {currentFilePath ? (
                <span>
                  {currentFilePath.substring(Math.max(currentFilePath.lastIndexOf('/'), currentFilePath.lastIndexOf('\\')) + 1)}
                  {isDirty && <span style={{ color: '#ef4444', marginLeft: '2px', fontWeight: 'bold' }}>*</span>}
                </span>
              ) : (
                <span>
                  未命名草稿
                  {isDirty && <span style={{ color: '#ef4444', marginLeft: '2px', fontWeight: 'bold' }}>*</span>}
                </span>
              )}
            </span>
          </div>
        </div>
        
        <div className="controls-section">
          {/* 開啟檔案 */}
          <button 
            className="action-btn" 
            onClick={handleOpenFile}
            title="開啟本地 Markdown 檔案 (Ctrl+O)"
          >
            <FolderOpen size={14} />
            開啟檔案
          </button>

          {/* 儲存檔案 */}
          <button 
            className="action-btn" 
            onClick={handleSaveFile}
            title="儲存檔案變更 (Ctrl+S)"
          >
            <Save size={14} />
            儲存檔案
          </button>

          {/* 另存新檔 */}
          <button 
            className="action-btn" 
            onClick={handleSaveFileAs}
            title="另存為新的 Markdown 檔案 (Ctrl+Shift+S)"
          >
            <Save size={14} />
            另存新檔
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-color)', margin: '0 8px' }}></div>

          {/* 模板選擇 */}
          <select 
            className="select-theme-btn" 
            value={selectedTemplateId} 
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            {[...PRESET_TEMPLATES, ...customTemplates].map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* 儲存為範本 */}
          <button 
            className="action-btn" 
            onClick={handleSaveAsCustomTemplate}
            title="將當前內容與樣式儲存為新的自訂範本"
          >
            <FilePlus size={14} />
            儲存範本
          </button>

          {/* 刪除自訂範本 */}
          {selectedTemplateId.startsWith('custom_') && (
            <button 
              className="action-btn" 
              onClick={handleDeleteCustomTemplate}
              title="刪除此自訂範本"
              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <Trash2 size={14} />
              刪除範本
            </button>
          )}

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
      <div className="app-container" ref={containerRef}>
        {/* 左側：編輯器面板 */}
        <section className="editor-panel" style={{ width: `${leftWidth}%` }}>
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
                className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
                onClick={() => setActiveTab('compare')}
              >
                <GitCompare size={16} />
                對比變更
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
            {activeTab === 'markdown' && (
              <Editor
                height="100%"
                defaultLanguage="markdown"
                language="markdown"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={markdown}
                onChange={(val) => {
                  setMarkdown(val || '');
                  setIsDirty(true);
                }}
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
            )}
            {activeTab === 'css' && (
              <Editor
                height="100%"
                defaultLanguage="css"
                language="css"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={css}
                onChange={(val) => {
                  setCss(val || '');
                  setIsDirty(true);
                }}
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
            {activeTab === 'compare' && (
              <DiffEditor
                height="100%"
                original={originalMarkdown}
                modified={markdown}
                language="markdown"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                onMount={handleDiffEditorDidMount}
                options={{
                  originalEditable: false,
                  renderMarginRevertIcon: true,
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

        {/* 拖動條 Resizer */}
        <div 
          className={`resizer-bar ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
        />

        {/* 右側：預覽面板 */}
        <section className="preview-panel" style={{ width: `${100 - leftWidth}%` }}>
          {/* 拖曳時的遮罩防止 iframe 劫持指針事件 */}
          {isDragging && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              cursor: 'col-resize',
              backgroundColor: 'transparent'
            }} />
          )}
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
