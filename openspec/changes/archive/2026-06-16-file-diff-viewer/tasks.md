## 1. State Management Setup

- [x] 1.1 Declare originalMarkdown state in App.tsx initialized with PRESET_TEMPLATES[0].defaultMarkdown
- [x] 1.2 Update handleOpenFile to setOriginalMarkdown with the newly opened file content
- [x] 1.3 Update handleSaveFile and handleSaveFileAs to setOriginalMarkdown with current markdown value upon successful save
- [x] 1.4 Update handleTemplateChange and handleResetToTemplate to setOriginalMarkdown with the template's default markdown

## 2. Tabs and UI Integration

- [x] 2.1 Update activeTab state type definition in App.tsx to support 'markdown' | 'css' | 'compare'
- [x] 2.2 Add "Compare Changes" tab button in the editor panel header, using a suitable icon (e.g. GitCompare or Split)
- [x] 2.3 Import DiffEditor from @monaco-editor/react in App.tsx

## 3. Monaco DiffEditor Implementation

- [x] 3.1 Render <DiffEditor> component when activeTab is 'compare'
- [x] 3.2 Configure DiffEditor props: original={originalMarkdown}, modified={markdown}, language="markdown", options with originalEditable: false and renderMarginRevertIcon: true
- [x] 3.3 Implement handleDiffEditorDidMount to assign editorRef.current to the modified editor and listen to onDidChangeModelContent to sync changes back to markdown state
- [x] 3.4 Ensure scroll synchronization handles the shift between regular Editor and DiffEditor's modified editor instance properly
