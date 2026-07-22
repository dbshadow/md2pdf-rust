# pdf-generator Specification

## Purpose
TBD - created by archiving change local-markdown-to-pdf-converter. Update Purpose after archive.
## Requirements
### Requirement: Local PDF Compilation
The system SHALL compile Markdown and CSS into a PDF binary within the local Rust desktop application, allowing optional base directory context for relative paths and awaiting dynamic rendering completion.

#### Scenario: Application receives compile command
- **WHEN** the Rust backend receives a Tauri IPC invocation containing Markdown text, CSS rules, and an optional base directory
- **THEN** it SHALL parse Markdown to HTML (resolving relative paths using the base directory if provided), inject the CSS, wait for dynamic frontend rendering elements to complete (such as Mermaid diagrams), and use a headless browser or WebView printing mechanism to render a PDF buffer locally

### Requirement: PDF Page and Margin Control
The system SHALL support CSS page size (`@page`), margins, and print-specific layout rules.

#### Scenario: CSS contains page margin definitions
- **WHEN** the user includes `@page { size: A4; margin: 20mm; }` in their CSS
- **THEN** the generated PDF SHALL respect these constraints in the output document

### Requirement: Page Breaks and Header/Footer Support
The system SHALL support explicit page breaks and custom headers/footers in the generated PDF.

#### Scenario: Explicit page break
- **WHEN** the Markdown contains HTML tags like `<div style="page-break-after: always;"></div>` or markdown HR elements mapped to page-breaks
- **THEN** the generated PDF SHALL start a new page after that element

### Requirement: Local Image Resolution and Embedding
The system SHALL automatically resolve local image paths referenced in Markdown (specifically relative paths), read their binary data locally from the host filesystem (resolving against the opened document directory if available, otherwise falling back to the application executable directory), and embed them as Base64 Data URLs inside the compiled HTML.

#### Scenario: Local relative image in Markdown
- **WHEN** the markdown text contains `![alt](./test.png)` and a valid image file named `test.png` exists in either the document's base directory or the application's executable directory
- **THEN** the system SHALL encode the image binary to a base64 string, replace the image source with a `data:image/png;base64,...` URL, and display the image correctly in both the preview and generated PDF
### Requirement: Extended PDF Generation Command Parameters
The system SHALL accept header and footer HTML templates or configuration objects when invoking the PDF generation IPC command.

#### Scenario: Rust backend receives header and footer config
- **WHEN** frontend calls `generate_pdf` IPC command with header and footer parameters
- **THEN** Rust headless browser SHALL apply the header and footer configuration into Chromium print settings or injected CSS Paged Media `@page` rules
