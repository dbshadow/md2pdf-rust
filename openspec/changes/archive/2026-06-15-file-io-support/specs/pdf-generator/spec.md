## MODIFIED Requirements

### Requirement: Local PDF Compilation
The system SHALL compile Markdown and CSS into a PDF binary within the local Rust desktop application, allowing an optional base directory context for relative paths.

#### Scenario: Application receives compile command
- **WHEN** the Rust backend receives a Tauri IPC invocation containing Markdown text, CSS rules, and an optional base directory
- **THEN** it SHALL parse Markdown to HTML (resolving relative paths using the base directory if provided), inject the CSS, and use a headless browser or WebView printing mechanism to render a PDF buffer locally

### Requirement: Local Image Resolution and Embedding
The system SHALL automatically resolve local image paths referenced in Markdown (specifically relative paths), read their binary data locally from the host filesystem (resolving against the opened document directory if available, otherwise falling back to the application executable directory), and embed them as Base64 Data URLs inside the compiled HTML.

#### Scenario: Local relative image in Markdown
- **WHEN** the markdown text contains `![alt](./test.png)` and a valid image file named `test.png` exists in either the document's base directory or the application's executable directory
- **THEN** the system SHALL encode the image binary to a base64 string, replace the image source with a `data:image/png;base64,...` URL, and display the image correctly in both the preview and generated PDF
