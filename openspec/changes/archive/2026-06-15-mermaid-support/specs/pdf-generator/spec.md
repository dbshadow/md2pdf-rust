## MODIFIED Requirements

### Requirement: Local PDF Compilation
The system SHALL compile Markdown and CSS into a PDF binary within the local Rust desktop application, allowing optional base directory context for relative paths and awaiting dynamic rendering completion.

#### Scenario: Application receives compile command
- **WHEN** the Rust backend receives a Tauri IPC invocation containing Markdown text, CSS rules, and an optional base directory
- **THEN** it SHALL parse Markdown to HTML (resolving relative paths using the base directory if provided), inject the CSS, wait for dynamic frontend rendering elements to complete (such as Mermaid diagrams), and use a headless browser or WebView printing mechanism to render a PDF buffer locally
