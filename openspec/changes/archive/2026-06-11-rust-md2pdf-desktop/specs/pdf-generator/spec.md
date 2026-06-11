## MODIFIED Requirements

### Requirement: Local PDF Compilation
The system SHALL compile Markdown and CSS into a PDF binary within the local Rust desktop application.

#### Scenario: Application receives compile command
- **WHEN** the Rust backend receives a Tauri IPC invocation containing Markdown text and CSS rules
- **THEN** it SHALL parse Markdown to HTML, inject the CSS, and use a headless browser or WebView printing mechanism to render a PDF buffer locally
