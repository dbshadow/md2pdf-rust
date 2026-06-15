## Context

We are introducing Mermaid.js support to md2pdf, enabling flowcharts, diagrams, and other charts directly from Markdown. Since Mermaid renders dynamically using Client-side JavaScript, we need a unified solution that works in both Vite's HTML Live Preview and headless Edge/Chrome during PDF compilation.

## Goals / Non-Goals

**Goals:**
- Dynamically parse and render ````mermaid` code blocks as SVG graphics in the HTML preview.
- Support accurate Mermaid rendering inside exported PDF files.
- Use a robust promise-based event system to signal to `headless_chrome` that Mermaid rendering has completed, ensuring PDF generation only occurs after diagrams are fully visible.

**Non-Goals:**
- Local storage caching for rendered Mermaid SVGs.
- Complex Mermaid custom styling theme customization UI (use default theme matching system).

## Decisions

### Decision 1: Use CDN-loaded Mermaid.js inside the iframe sandbox
We will fetch `mermaid.min.js` via a CDN (e.g., `jsdelivr`) inside the preview iframe template.
- **Rationale**: Isolates Mermaid's heavy rendering bundle from the main React bundle, keeping the core desktop app startup fast.
- **Alternative**: bunding mermaid as an NPM package. Rejected because Mermaid is very large (over 1MB) and can cause bundle bloat, performance issues, and bundler dependency issues with Monaco.

### Decision 2: Convert code block classes client-side inside the iframe
`pulldown-cmark` generates code blocks as `<pre><code class="language-mermaid">...</code></pre>`.
- **Rationale**: We will write a small JavaScript hook inside the iframe to detect these nodes, replace them with `<div class="mermaid">`, and invoke `mermaid.run()`.
- **Alternative**: Modifying Rust Markdown parser to output `<div class="mermaid">` directly. Rejected because it complicates backend compiler parsing and breaks standard syntax highlighting templates.

### Decision 3: Promise-based PDF printing synchronization
In `lib.rs` (PDF rendering), we will poll `window.mermaidRendered` in `headless_chrome` before printing.
- **Rationale**: Mermaid renders asynchronously. In `App.tsx` (the iframe) and the temporary PDF HTML compilation template, we call `mermaid.run().then(() => { window.mermaidRendered = true; })`. The Rust backend polls this flag with a timeout of 2 seconds (40 attempts * 50ms).
- **Alternative**: Fixed sleep timeout in Rust. Rejected because it's either slow (sleeping too long) or flaky (sleeping too short).

## Risks / Trade-offs

- **[Risk] Off-line compilation**: CDN script will fail to load if there is no internet connection.
  - *Mitigation*: Fallback gracefully. If Mermaid.js fails to load, the diagram code block will display as plain text rather than breaking the application.
- **[Risk] Multiple code blocks rendering**: Multiple diagrams on one page might take longer to load.
  - *Mitigation*: `mermaid.run()` resolves after all queried selectors are rendered, so `window.mermaidRendered` will only be flagged when the entire page is complete.
