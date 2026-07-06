# md2pdf 🚀

[README_zh.md (繁體中文)](README_zh.md) | [README.md (English)](#) | [README_es.md (Español)](README_es.md)

---

## 📖 Introduction

`md2pdf` is a beautiful, privacy-first **local Markdown-to-PDF standalone desktop application**. Built with Tauri (Rust) + React + TypeScript, it leverages Monaco Editor for an efficient editing experience and uses a background-persistent headless browser singleton (Microsoft Edge/Chrome) in Rust for high-precision A4 PDF generation.

All operations are processed locally, ensuring 100% data privacy and security.

---

## ✨ Features

*   **Dual Editors Integration**: Powered by Monaco Editor (the editor behind VS Code) for both Markdown and CSS, supporting syntax highlighting, line numbers, autocomplete, and syntax linting.
*   **Markdown Diff Editor**: Supports toggling Monaco's Diff Editor mode to visually compare code differences between your current draft and the template, making change tracking effortless.
*   **Custom Templates Persistence**: Save your edited Markdown content and custom CSS stylesheets as personalized templates locally. Reapply them with one click at any time.
*   **Dual Preview System**:
    *   **HTML Instant Preview**: Microsecond-level responsiveness without blackout flashes. It perfectly retains your current scrollbar position for a seamless writing experience.
    *   **PDF Real-print Preview**: Toggle to render your A4 PDF via headless browser, showcasing exact margins, page breaks, and `@page` rules.
*   **Predefined Premium Styles**:
    *   📄 **Resume**: Muted, compact layout, tailored for job hunting.
    *   🎓 **Academic**: Formatted with standard margins and academic indents.
    *   🚀 **Modern**: Beautiful title gradients and rounded-corner code blocks.
    *   💎 **Tiffany Minimal**: A premium look highlighted with Tiffany green and Morandi gray-blue.
    *   📝 **Plain Markdown**: A classic and minimal raw layout.
    *   📘 **Tech Blue**: A professional blue template, optimizing Mermaid diagrams and preventing page breaks inside sections.
*   **Native Save File Dialog**: Saving PDFs triggers a native file dialog, allowing you to choose the exact path and filename on your OS.
*   **Settings Drawer**:
    *   Supports global Dark/Light Mode switching.
    *   Supports multilingual selection (Traditional Chinese, English, etc.).
    *   Allows toggling of "Auto check updates on startup" (state persisted in `localStorage`).
*   **Online Auto-Updater**: Automatically checks for new versions in the background, showing a custom update progress dialog, and seamlessly restarting once the update is complete.

---

## 💻 Supported Platforms

*   **Windows**: Provides a standalone, portable executable (`.exe`).
*   **macOS**: Provides a Universal bundle (`_universal.dmg` supporting both Intel and Apple Silicon Macs).

---

## 🍎 macOS Installation & Security Workaround

Since the macOS bundle (`_universal.dmg`) is distributed unsigned, macOS Gatekeeper will block it upon first launch with a security warning. You can bypass this with one of the following methods:

### Method 1: Right-Click in Finder (Recommended)
1.  Open **Finder** and navigate to your **Applications** folder.
2.  Locate `md2pdf`, hold the **`Control` key and click** the app (or right-click) and select **Open**.
3.  In the popup dialog, click **Open** to authorize and launch the app. You won't need to do this again.

### Method 2: Terminal Unlock (Easiest)
Open your **Terminal** app and run the following command to strip the quarantine flag:
```bash
xattr -cr /Applications/md2pdf.app
```

---

## 🛠️ Prerequisites

### System Requirements
*   Node.js >= 18
*   Rust & Cargo Toolchain (for compiling the Rust backend)

---

## 🚀 Getting Started

### 1. Install Dependencies
Run the following command in the root directory:
```bash
npm install
```

### 2. Start Development
```bash
npm run dev
```
This will compile the Rust backend, run the Vite dev server, and launch the Tauri app window.

---

## 📦 Building for Production

Compile the project into a standalone executable for distribution:

### Windows Platform
```bash
# Build the NSIS portable release executable
npx @tauri-apps/cli build
```
Once completed, the installer will be located at:
`src-tauri/target/release/bundle/nsis/md2pdf_{version}_x64-setup.exe`

### macOS Platform
```bash
# Build the Universal macOS bundle
npx @tauri-apps/cli build --target universal-apple-darwin
```
Once completed, the DMG will be located at:
`src-tauri/target/universal-apple-darwin/release/bundle/dmg/md2pdf_{version}_universal.dmg`

---

## 📄 License

Distributed under the **[MIT License](LICENSE)**.
