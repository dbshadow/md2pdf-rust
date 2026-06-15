## Why

Currently, md2pdf only compiles standard Markdown elements and local images. Adding Mermaid support enables users to dynamically generate complex diagrams (flowcharts, sequence diagrams, gantt charts, mindmaps, etc.) directly using code within their documents. This closes a critical feature gap for technical documentation and resume writing.

## What Changes

- **Markdown Parser Upgrade**: Support parsing ````mermaid` code blocks and rendering them inside the editor's HTML/PDF pipeline.
- **Client-Side Rendering in Preview**: Inject Mermaid.js into the preview iframe, dynamically initializing and rendering code blocks into SVG nodes without breaking scroll synchronization.
- **Wait-For-Render PDF Export (CRITICAL)**: Update the headless browser compile pipeline to poll and wait for client-side Mermaid rendering to finish before executing print actions. This prevents exporting blank or text-only code blocks in the output PDF.

## Capabilities

### New Capabilities
- `mermaid-preview`: Integrates client-side diagram rendering using Mermaid.js in the editor workspace preview.

### Modified Capabilities
- `pdf-generator`: Upgrade compile rules to ensure all dynamic JavaScript diagrams are fully rendered by the headless host before compiling the output PDF document.

## Impact

- **Frontend (`src/App.tsx`)**: Injects the Mermaid library into `iframeSrcDoc`, tracks and schedules re-evaluation on text change, and flags completion for the backend.
- **Backend (`src-tauri/src/lib.rs`)**: Refactors the Puppeteer/Chrome headless routine to await the client-side rendering complete flag.
