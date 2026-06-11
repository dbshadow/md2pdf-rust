# pdf-generator Specification

## Purpose
TBD - created by archiving change local-markdown-to-pdf-converter. Update Purpose after archive.
## Requirements
### Requirement: Local PDF Compilation
The system SHALL compile Markdown and CSS into a PDF binary within the local Rust desktop application.

#### Scenario: Application receives compile command
- **WHEN** the Rust backend receives a Tauri IPC invocation containing Markdown text and CSS rules
- **THEN** it SHALL parse Markdown to HTML, inject the CSS, and use a headless browser or WebView printing mechanism to render a PDF buffer locally

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

